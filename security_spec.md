# Spécification de Sécurité Firestore (Phase 0 — Payload-First Security TDD)

## 1. Invariants de Données (Data Invariants)
1. **Isolation stricte des données personnelles (PII — Pilier 6)** :
   - Les collections publiques partagées entre tous les visiteurs (`/millReviews/{reviewId}`, `/contestEntries/{entryId}`, `/adhesionMembers/{memberId}`) ne contiennent **aucune donnée personnelle sensible** (ni adresse e-mail, ni numéro de téléphone, ni adresse postale privée).
   - Les coordonnées personnelles (`email`, `phone`, `phoneNumber`, `address`, `message`) sont isolées dans `/contestRegistrationsPrivate/{entryId}` et `/adhesionRequestsPrivate/{memberId}` où la lecture (`get`, `list`) est strictement réservée aux administrateurs vérifiés (`isAdmin()`).
2. **Garantie d'atomicité relationnelle (Pilier 7 — `existsAfter`)** :
   - Toute création d'une inscription publique `/contestEntries/{entryId}` doit s'accompagner dans le même lot transactionnel (`writeBatch`) de sa fiche privée `/contestRegistrationsPrivate/{entryId}` (`existsAfter`), et réciproquement.
   - Toute création d'une affiliation publique `/adhesionMembers/{memberId}` doit s'accompagner dans le même lot (`writeBatch`) de son dossier privé `/adhesionRequestsPrivate/{memberId}` (`existsAfter`), et réciproquement.
3. **Intégrité temporelle & immutabilité (Piliers 12 & 13)** :
   - Tout document créé doit avoir `incoming().createdAt == request.time`.
   - Sur `/millReviews/{reviewId}`, seule l'action de vote utile (`likesCount` incrémenté ou décrémenté de `1` exactement, avec `incoming().updatedAt == request.time`) est autorisée en mise à jour (`affectedKeys().hasOnly(['likesCount', 'updatedAt'])`), tandis que tous les autres champs (`id`, `millId`, `authorName`, `comment`, `rating`, `createdAt`) demeurent immuables.

## 2. Les « Dirty Dozen » Payloads (12 Payloads d'Attaque Testés)
1. **Payload 1 (Shadow Field sur `millReviews`)** : Ajout d'un champ non autorisé `isAdminVerified: true` lors de `create` sur `/millReviews/rev-1` $\rightarrow$ `PERMISSION_DENIED` (`hasOnly`).
2. **Payload 2 (ID Poisoning)** : Création d'un document avec un ID contenant des caractères spéciaux ou $> 128$ octets $\rightarrow$ `PERMISSION_DENIED` (`isValidId`).
3. **Payload 3 (Timestamp Spoofing)** : Création sur `/millReviews/rev-1` avec un `createdAt` forgé par le client différent de `request.time` $\rightarrow$ `PERMISSION_DENIED`.
4. **Payload 4 (Commentaire trop court ou surdimensionné)** : `comment` de moins de 15 caractères ou de plus de 1 200 caractères sur `/millReviews/rev-1` $\rightarrow$ `PERMISSION_DENIED`.
5. **Payload 5 (Note hors bornes)** : `rating: 99` ou `rating: 0` sur `/millReviews/rev-1` $\rightarrow$ `PERMISSION_DENIED`.
6. **Payload 6 (Vote Manipulation / Likes Jump)** : Mise à jour de `/millReviews/rev-1` faisant passer `likesCount` de `5` à `500` d'un seul coup $\rightarrow$ `PERMISSION_DENIED` (delta limité à $+1$ ou $-1$).
7. **Payload 7 (Update Gap sur `millReviews`)** : Tentative de modifier `comment` ou `rating` lors d'un `update` sur `/millReviews/rev-1` $\rightarrow$ `PERMISSION_DENIED` (`affectedKeys().hasOnly(['likesCount', 'updatedAt'])`).
8. **Payload 8 (Orphaned Write sur `contestEntries`)** : Création de `/contestEntries/entry-1` sans écrire simultanément `/contestRegistrationsPrivate/entry-1` dans le même batch $\rightarrow$ `PERMISSION_DENIED` (`existsAfter`).
9. **Payload 9 (Catégorie invalide sur `contestEntries`)** : Création avec `category: "Catégorie Pirate"` hors de l'énumération officielle COI/ADOIO $\rightarrow$ `PERMISSION_DENIED`.
10. **Payload 10 (PII Leak sur `contestRegistrationsPrivate`)** : Lecture (`get` ou `list`) de `/contestRegistrationsPrivate/entry-1` par un visiteur non-admin $\rightarrow$ `PERMISSION_DENIED`.
11. **Payload 11 (PII Leak sur `adhesionRequestsPrivate`)** : Lecture (`get` ou `list`) de `/adhesionRequestsPrivate/mem-1` par un visiteur ou un utilisateur non-admin $\rightarrow$ `PERMISSION_DENIED`.
12. **Payload 12 (Email Spoofing Admin)** : Tentative de lecture de `/adhesionRequestsPrivate/mem-1` avec `email == 'khodja.co@gmail.com'` mais `email_verified == false` $\rightarrow$ `PERMISSION_DENIED`.

## 3. Rapport d'Audit Red Team (Phase 5)
- **Shadow Update Test** : Bloqué par `data.keys().hasAll(...) && data.keys().hasOnly(...)` dans chaque fonction `isValid[Entity]`.
- **Email Spoofing Test** : Bloqué par `request.auth.token.email_verified == true` dans `isAdmin()`.
- **PII Blanket Test** : Toutes les données PII (`email`, `phone`, `address`, `message`) sont isolées dans `/contestRegistrationsPrivate` et `/adhesionRequestsPrivate`, où `allow get, list: if isAdmin();`.
- **Value Poisoning Test** : Le bloc `allow update` sur `/millReviews/{reviewId}` appelle `isValidMillReview(incoming())` en premier avant de vérifier `affectedKeys().hasOnly(['likesCount', 'updatedAt'])`.
