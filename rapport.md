# Mini Plateforme de Commandes Distribuée (NestJS)

Ce dépôt contient la solution complète au TP sur l'architecture microservices (REST, GraphQL, gRPC, Kafka) avec NestJS.

## Architecture

Le projet est composé des 5 services suivants :

- **catalog-service (REST, Port: 3000)** : CRUD des produits.
- **stock-service (gRPC, Port: 50051)** : Validation et réservation synchrone du stock.
- **order-service (REST/gRPC/Kafka, Port: 3001)** : Création de commandes, appel gRPC pour le stock, et publication Kafka de l'événement `order.created`.
- **notification-service (Kafka Consumer)** : Écoute le topic `order.created` et log la notification.
- **query-service (GraphQL, Port: 3002)** : API GraphQL lisant les données agrégées depuis `catalog-service` et `order-service`.

## Prérequis

- Node.js 20+
- npm
- Docker Desktop (nécessaire pour exécuter Kafka et Zookeeper)

## Démarrage Rapide

Pour démarrer l'infrastructure complète (Kafka, Zookeeper) en arrière-plan :

```powershell
docker-compose up -d
```

Ensuite, vous devez démarrer chaque microservice dans son propre terminal. Par exemple :
```powershell
cd catalog-service
npm run start:dev
```
*(Faites de même pour `stock-service`, `order-service`, `query-service` et `notification-service`).*

---

## Guide de Test Étape par Étape (Pour Windows / PowerShell)

Une fois que les services tournent, ouvrez un nouveau terminal PowerShell et exécutez ces requêtes pour tester les différentes briques de l'architecture.

### Étape 1 : Tester le `catalog-service` (REST API)

Ce service gère la base de données des produits.

**A. Créer un nouveau produit :**

```powershell
Invoke-RestMethod -Uri http://localhost:3000/products -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name": "Laptop Pro", "price": 1500, "stock": 10}'
```

![Capture POST Product](./captures/post_product.png)

**Résultat attendu :**
```text
id name       price stock
-- ----       ----- -----
 4 Laptop Pro  1500    10
```

**B. Lister les produits disponibles :**

```powershell
Invoke-RestMethod -Uri http://localhost:3000/products -Method GET
```

![Capture GET Products](./captures/get_products.png)

**Résultat attendu :**
```text
id name       price stock
-- ----       ----- -----
 1 Laptop      1200    10
 2 Mouse         25    50
 3 Keyboard     100   100
 4 Laptop Pro  1500    10
```

---

### Étape 2 : Tester le `order-service` et le gRPC / Kafka

**A. Passer une commande valide :**

```powershell
Invoke-RestMethod -Uri http://localhost:3001/orders -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"productId": 1, "quantity": 2, "customerEmail": "client@test.com"}'
```

![Capture POST Order](./captures/post_order.png)

**Résultat attendu :**
```text
id            : 1
productId     : 1
quantity      : 2
customerEmail : client@test.com
status        : CREATED
```
*Le `notification-service` affichera simultanément dans son terminal :*
`[Timestamp] confirmation envoyée à client@test.com pour la commande 1`

**B. Tester la validation de stock (gRPC) avec une commande invalide :**

Demander une quantité supérieure au stock disponible (ex: 200).
```powershell
Invoke-RestMethod -Uri http://localhost:3001/orders -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"productId": 3, "quantity": 200, "customerEmail": "erreur@test.com"}'
```

![Capture Order Error 409](./captures/post_order_error.png)

**Résultat attendu (Erreur HTTP 409) :**
```text
Invoke-RestMethod : {"statusCode":409,"message":"Insufficient stock"}
...
    + CategoryInfo          : InvalidOperation : (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-RestMethod], WebException
```

---

### Étape 3 : Tester le `query-service` (GraphQL API)

Ouvrez votre navigateur sur **http://localhost:3002/graphql** et exécutez la requête suivante pour agréger les commandes :

```graphql
query {
  orders {
    id
    productId
    quantity
    status
    customerEmail
  }
}
```
**Résultat attendu :**
Vous verrez la commande fraîchement créée remonter correctement en JSON via l'interface GraphQL Apollo !
