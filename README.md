# DevLink API

## Purpose

<p> This repo is part of Careerdevs MERN lesson plan. This is the api used for the react lessons and to learn about the MEN api stack.</p>

### Usage

<p> to use this app you will need to create a .env file in the root directory with the following items</p>

| key           | use                                                     |
| ------------- | ------------------------------------------------------- |
| PORT          | port for the server to listen on will default to 4000   |
| MONGO         | uri for the mongo database (required)                   |
| SECRET_OR_KEY | used for jwt encoding                                   |
| TOKEN_HEADER  | header used for jwt token. Tutorial uses "x-auth-token" |

### To Run

<p>Once you have the .env file configured be sure to run the following command:</p>
```
npm install
npm install -D
```
<p>Once installed to run the server normally use</p>
```
npm start
```
<p>to utilize nodemon:</p>
```
npm run server
```

### API Endpoints

| Verb   | Route              | Description             | IsPrivate? |
| ------ | ------------------ | ----------------------- | ---------- |
|        | USERS              |                         |            |
| ------ | ------------------ | ----------------------- | ---------- |
| POST   | /api/users         | Create a new user       | false      |
| PUT    | /api/users         | Login user              | false      |
|        | PROFILES           |                         |            |
| ------ | ------------------ | ----------------------- | ---------- |
| POST   | /api/profiles      | Create new profile      | true       |
| PUT    | /api/profiles      | update existing profile | true       |
| GET    | /api/profiles      | get a list of profiles  | true       |
| GET    | /api/profiles/self | get users profile       | true       |
|        | POSTS              |                         |            |
| ------ | ------------------ | ----------------------- | ---------- |
| POST   | /api/posts/        | create new post         | true       |
| GET    | /api/posts/        | Get posts               | true       |
|        | LIKES              |                         |            |
| ------ | ------------------ | ----------------------- | ---------- |
| POST   | /api/likes/:id     | like a post             | true       |
| DELETE | /api/likes/:id     | remove like from a post | true       |
