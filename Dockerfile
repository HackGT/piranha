# Build container
FROM node:12-alpine AS build

WORKDIR /usr/src/piranha/client
COPY ./client/ /usr/src/piranha/client/
RUN yarn install && yarn run build

# Runtime container
FROM node:12-alpine

WORKDIR /usr/src/piranha
COPY ./server/ /usr/src/piranha/server/
COPY --from=build /usr/src/piranha/client/ /usr/src/piranha/client

WORKDIR /usr/src/piranha/server
RUN yarn install

EXPOSE 3000
RUN ["chmod", "+x", "/usr/src/piranha/docker-entrypoint.sh"]
ENTRYPOINT ["/usr/src/piranha/docker-entrypoint.sh"]