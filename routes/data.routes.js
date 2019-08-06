
module.exports = (app) => {

  var data = require('../controllers/data.controller.js');

  
app.post('/data/new', function (req, res) {
  console.log("data new");
      
  return data.dataAdd(req,res);

});
}
