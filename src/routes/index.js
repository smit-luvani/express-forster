// Import Controller and Allocate Route
const Router = require('express').Router();

Router.post('/file-upload', require('../controllers/file-upload/index.controller')) // Remove comment to enable route

module.exports = Router;