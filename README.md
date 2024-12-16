# __Express Forster__ - Express JS boilerplate template for Node JS application

## Pre-requisites
- It's assumed that you have Node JS installed in your system. If not, please install it from [here](https://nodejs.org/en/download/).
    - Check the node version by running the following command in your terminal.
        ```sh
        $ node -v
        ```
- This templated has not checked with node version 14.0.0 or before. Expected to work with node version ^12.18.4.
## Start the application/server
It is assumed that you are familiar with the Express JS.

- Step 1: Environment File (required):
    - Create environment file in root of the project (e.g. ./)
    - File name must prefix with `.env`. and the follow by environment name (e.g. `.env.development`)
    - Copy the content of `.env.example` file and paste it in your environment file and change the value as per your requirement.

- Step 2: Start the application/server:
    ```sh
    $ cd nodejs-express-template # avoid this if you're in project directory
    $ npm install

    # For Environment, set variable with name given below and value as per your server environment (e.g. development, production, staging)
    ## Windows OS
    > set NODE_ENV=
    ## Linux OS
    $ export NODE_ENV=

    # Start the server
    $ npm start
    ```

## Services
There are some pre-configured services (`/src/services`) in this template. You can use them as per your requirement. You might need to set the environment variable and configuration for the services. For that, you can refer to the environment file (`.env.example`) and the `/src/config`.
