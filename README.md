# Development Overview

Piranha is an application to help HackGT manage our internal financial processes ("sinking our teeth in") so to speak.

## Architecture

##### Backend Architecture

- Language: TypeScript
- Framework: Node.js/Express
- Database: Postgres
- Authentication: [Ground Truth](https://github.com/hackgt/ground-truth)
- API: GraphQL ([Apollo Server](https://www.apollographql.com/docs/apollo-server))
- Dependency management: yarn
- Where: [/server](/frontend)

##### Frontend Architecture

- Language: TypeScript
- Framework: React
- UI Library: [Ant Design](https://ant.design)
- API Client: GraphQL ([Apollo Client](https://www.apollographql.com/docs/react/))
- Dependency management: yarn
- Where: [/client](/client)

## Setup

#### Server

1. `cd server` then `yarn install`
2. `yarn migrate:dev` to setup database
3. `yarn generate` to generate Prisma client and GraphQL types
4. `yarn dev`

#### Environment Variables

Once you have the backend dependencies installed,
configure the backend environment variables by copying [.env.example](.env.example) to a new file called `.env` and filling in the variables.

To setup google file upload, add your Google service account credentials to a file called `google-application-key.json` in the config directory.

#### Client

1. `cd client` then `yarn install`
2. `yarn start`

## Utilities

### Typings

First, this will generate TypeScript typings and a new Prisma client from your Prisma schema (`schema.prisma`). Then, it will also generate TypeScript typings based on your GraphQL schema (`api.graphql`) via GraphQL Code Generator.

1. `yarn generate`

Note, anytime either of these schemas are changed, you will need to rerun `yarn generate` to generate new typings.

### Migrations

After changing the Prisma schema (`schema.prisma`), run the following commands in the server folder to migrate the database and generate a new Prisma client.

1. `yarn migrate:dev`
2. `yarn generate`
