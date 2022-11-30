# Node JS Express - Ready to use Template

## Ready Made Services

- JWT (JSON Web token)
- Bcryptjs
- Firebase Admin
- winston
- mongoose
- Razorpay
- AWS SDK
- Multer
- Multer S3
- Nodemailer
- Gitlab CI/CD for AWS Beanstalk

### You can also:

- Contribute New Service
- Fix bug or improve in current service

Please follow coding indentation and directory structure if you do pull request. Add Your Self as an author in top if you create new service or as contributor if you fix up bug.

### Installation

Install the dependencies and devDependencies and start the server.

Environment File (required):
- Create environment file in root of the project (i.g. ./)
- File name must prefix with .env. and the follow by environment name (i.g. .env.development)
- Copy the content of .env.example file and paste it in your environment file and change the value as per your requirement.

Start the application/server:
```sh
$ cd nodejs-express-template #avoid this if you're in project directory
$ npm install

# For Environment, set variable with name given below and value as per your server environment (e.g. development, production, staging)
## Windows OS
> set NODE_ENV=
## Linux OS
$ export NODE_ENV=

# Start the server
$ npm start
```
