#!/bin/bash

cd server
yarn prisma migrate up --experimental # Apply database migrations
yarn run start