# TP Microservices NestJS

Mini plateforme de commandes distribuée illustrant le rôle complémentaire de REST, GraphQL, gRPC et Kafka dans une architecture microservices avec NestJS.

## Architecture

Le projet est composé de 5 services autonomes :

- **catalog-service** (REST API) - Port `3000` : Gère le CRUD des produits.
- **order-service** (REST API) - Port `3001` : Gère la création des commandes et publie des événements Kafka.
- **query-service** (GraphQL API) - Port `3002` : Expose une API unifiée de lecture (agrégation des données).
- **stock-service** (gRPC) - Port `50051` : Gère la validation et réservation synchrone du stock.
- **notification-service** (Kafka Consumer) - Port N/A : Écoute les événements de commande pour simuler l'envoi d'emails.

## Prérequis
- Docker & Docker Compose
- Node.js 20+

## Démarrage

1. **Démarrer l'infrastructure (Kafka & Zookeeper)**
   ```bash
   docker-compose up -d
   ```

2. **Démarrer les services**
   Pour chaque service (catalog-service, order-service, query-service, stock-service, notification-service), installez les dépendances et lancez le mode développement :
   ```bash
   npm install
   npm run start:dev
   ```

## Tester le Flux

1. Créer une commande via REST (Port 3001) :
   ```bash
   curl -X POST http://localhost:3001/orders -H "Content-Type: application/json" -d "{\"productId\": 1, \"quantity\": 2, \"customerEmail\": \"client@test.com\"}"
   ```
2. Vérifier les logs du `notification-service` pour confirmer la consommation de l'événement Kafka.
3. Interroger les données via GraphQL Playground : `http://localhost:3002/graphql`
