# 888 Spectate Technical Test

## Introduction

Technical test for Senior Front-end role at 888 Spectate.

You can see it running online by clicking [here](https://roble.github.io/888-spectate).

All source files are inside the ***'[src](./src)'*** folder. 

#### Folder structure

* [src/](./src) - Source code
  * [assets/](./src/assets) - CSS and favicon
* [tests/](./tests) - tests files

If you open the index.html directly in your browser, you will get a CORS error, you will be able to see the page but it is not going to work properly. it will happen because the javascript files are separated and any modern browser will block them for security reasons. All needed information is on the link below: 

https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp#what_went_wrong

The error: 

![image](https://user-images.githubusercontent.com/3231587/183474257-55cbbde9-aa91-4302-a93f-ca7af71de434.png)

## Optional requirements

This project has ***no dependencies*** unless you want to run the ***unit tests*** or use an HTTP server (used for local tests or generating LightHouse test reports), you will need to install the following dependencies:

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command          | Description                                                                     |
| ---------------- | ------------------------------------------------------------------------------- |
| `npm install`    | Install project dependencies                                                    |
| `npm run start`  | Start the HTTP server on http://localhost:8080                                  |
| `npm run test`   | Run the unit tests                                                              |
