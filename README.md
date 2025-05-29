# event API nodejs - typescript - Kafka

## Description

This repository is a backend event api streaming data.

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

- Launch the data generation api

  `docker-compose up data_generator`

## Developer

- Gary Johnson
  - mail: gary.johnson.top@gmail.com
  - github: https://github.com/gary003

## License

    [MIT]
