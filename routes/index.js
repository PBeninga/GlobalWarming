const routes = require('express').Router();

routes.get('/', (req, res) => {
     res.status(200).send("Hello world!");
});

module.exports = routes;
