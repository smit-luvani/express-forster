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
You can configure app and set secrets for service in config.json and secrets.json in src/config directory.

For development environments

```sh
$ cd nodejs-express-template #avoid this if you're in project directory
$ export NODE_ENV=development # For Windows OS: set NODE_ENV=development
$ export PORT=80 # For Windows OS: set PORT=80
$ npm install
$ node start
```

For production environments

```sh
$ export NODE_ENV=production # set NODE_ENV=production
```
