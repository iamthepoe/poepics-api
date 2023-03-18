
# PoePics

## Overview
<b>PoePics</b> is a Web API made for image sharing. Architected for educational purposes, it was made according to the <b>TDD</b> standard.

## Technologies
The main technologies of PoePics are:
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [MongoDB](https://mongodb.com)
- [Multer](https://github.com/expressjs/multer)
- [JWT-token](https://jwt.io/)
- [Jest](https://jestjs.io/)
- [SuperTest](https://github.com/visionmedia/supertest)

## Architecture

The project's architecture uses concepts such as schemas, models, repositories, services and routes. The schema is the primary layer, where the form of the collection is formed. The model represents the object in this way. The repository uses the model to perform operations with the database, sending data or error exceptions. The service is responsible for taking care of the business rules layer while using the repository to do such operations, while the routes communicate the input data to the service, returning the appropriate response. Here we have the diagram:

<img src="https://github.com/iamthepoe/poepics-api/blob/main/diagram.png">

##  How to run the project

###  Requirements

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://mongodb.com)
- [NPM](https://www.npmjs.com/) or [Yarn](https://classic.yarnpkg.com/)
> Particularly, I used npm for this project

###  Setup

*Clone the project and access the folder*

```bash

$ git clone https://github.com/iamthepoe/poepics-api && cd poepics-api

```

*Follow the steps below*
```bash

# Install the dependencies

$ npm install

# Make a copy of '.env.example' to '.env'

# then set with your environment variables.

$ cp .env.example .env

# Run the server in developer enviroment

$ npm run dev

# Done.

```

##  License

This project is licensed under the MIT - see the [LICENSE](LICENSE) file for details.
