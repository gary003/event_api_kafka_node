# event API nodejs - typescript

## Skills

- **Clean architecture** (onion architecture)
- CI/CD pipeline with **github actions**
  - test, build docker image, deploy docker image to **docker hub**
- Testing using **sinon.js** and **mocha**
  - Mocks
  - Coverage
  - Unit tests
  - Integration tests with **testcontainers** and **supertest**
- Streams
  - Pipeline handling
  - Transformation
  - Async generators
- Documentation with **Swagger**
- **Docker**
  - Docker-compose
  - Dockerfile
- Logging with **Winston**
- Validation using **Zod**
- **Typescript**

## Description

This repository is a backend event api streaming crypto data from coin gecko.

## Prerequisites

- Having docker(v27+) & docker-compose(v2.20) installed

!! A docker group must be created, then your user(sudoer) is added to it.
Otherwise you'll have trouble launching the tests !!

Link to install and configure docker properly :

    https://medium.com/devops-technical-notes-and-manuals/how-to-run-docker-commands-without-sudo-28019814198f

Don't forgot to restart your computer or session for the changes to be available on all shells

## Git Installation

- Clone the project

  `git clone https://github.com/gary003/event_api_nodejs_typescript.git`

- Go into the project directory

  `cd event_api_nodejs_typescript`

- Install the dependences

  `npm install`

## Start API

- Launch the app & DB (mysql)

  `docker-compose up`

- OpenAPI (swagger)
  Copy this url in a browser (adapt the port if needed)

  `localhost:8080`

## Tests + Coverage

- Launch global tests

  `npm run test`

## Developer

- Gary Johnson
  - mail: gary.johnson.freelance@gmail.com
  - github: https://github.com/gary003

## License

    [MIT]
