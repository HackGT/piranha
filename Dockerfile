# Build container
FROM node:12.18-alpine AS build

WORKDIR /usr/src/piranha/frontend

COPY ./frontend/ /usr/src/piranha/frontend/
RUN npm install && npm run build

# Runtime container
FROM python:3.7

WORKDIR /usr/src/piranha

COPY Pipfile Pipfile.lock /usr/src/piranha/
RUN pip install pipenv && pipenv install --system

COPY . /usr/src/piranha
COPY --from=build /usr/src/piranha/frontend/ /usr/src/piranha/frontend/

EXPOSE 8000
RUN ["chmod", "+x", "/usr/src/piranha/docker-entrypoint.sh"]
ENTRYPOINT ["/usr/src/piranha/docker-entrypoint.sh"]