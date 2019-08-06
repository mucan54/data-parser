// => /api url'si için router
var express = require('express');
var router = express.Router();


// Routeları Require etik
require("./data.routes")(router);




module.exports = router;