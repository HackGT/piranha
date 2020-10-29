# Build container
FROM node:12-alpine AS build

WORKDIR /usr/src/piranha/
COPY . /usr/src/piranha/

RUN yarn install && yarn setup

# Runtime container
FROM node:12-alpine

COPY --from=build /usr/src/piranha/server/ /usr/src/piranha/server/
COPY --from=build /usr/src/piranha/client/ /usr/src/piranha/client/

WORKDIR /usr/src/piranha/server/

EXPOSE 3000
CMD ["yarn", "migrate:up", "&&", "yarn", "start"]