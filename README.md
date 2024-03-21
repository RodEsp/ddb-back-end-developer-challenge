# DDB Back End Developer Challenge

An application and web server that exposes endpoints to heal and damage D&D characters.

## API Documentation

Documentation for the API can be accessed at <http://localhost:3000/docs> when running the dev server and at <http://localhost:80/docs> when running the production server.

## Setup

> Please ensure you have [node.js](https://nodejs.org/) version 20+ installed.

Install dependencies:

```sh
npm install
```

## Running with Development Server

Will be accessible at <http://localhost:3000> by default.

```sh
npm run dev
```

## Running with Production Server

Will be accessible at <http://localhost:80>.

```sh
npm run build:prod
npm start
```

## Dockerizing

The following commands will build and run as if for production.
Please ensure you have [docker](https://www.docker.com/products/docker-desktop/) installed and running to run these commands locally.

### Build

```sh
npm run build:docker

#or
docker build . --tag ddb-backend-dev-challenge
```

### Run

This will run the docker image in a container and expose the container's port `80` to your local environment, on the same port.

The server will be accessible at <http://localhost:80> but it will be running in a docker container.

```sh
npm run start:docker

#or
docker run --name ddb-backend-dev-challenge --rm -p 80:80 ddb-backend-dev-challenge
```

### Stop

> You will need to run this in a separate terminal session.

```sh
docker stop ddb-backend-dev-challenge
```

## Repository Overview

This repository is composed of four main files and two additional files (for types and Swagger documents).

### Main files

#### [server.ts](./src/server.ts)

The code that sets up the Express server. This adds request handlers for all the routes that are supported by this app. It also creates a handler for any non-supported routes and adds the [SwaggerUI](https://swagger.io/tools/swagger-ui/) middleware for our documentation.

#### [routes.ts](./src/routes.ts)

Defines the api endpoints available on our server and their corresponding request handlers.
This makes it easy to add more endpoints in the future.

#### [session.ts](./src/session.ts)

Contains the state of our application, notably the D&D characters, and exports functions to be used by the API's route handlers that can be used to modify the session state.

#### [character.ts](./src/character.ts)

A class that represents a D&D character that can be healed and damaged.

### Types

#### [types.ts](./src/types.ts)

A set of types and enums that define a lmited data model for D&D characters and sessions.

### Documentation

#### [swaggerDocs.ts](./src/docs/swagger.ts)

The specification for our server's API endpoints. These are exposed via an interactive user interface ([SwaggerUI](https://swagger.io/tools/swagger-ui/)) when the server is running at `/docs`. <br/>
For more information please checkout the [Swagger documentation](https://swagger.io/docs/specification/about/).
