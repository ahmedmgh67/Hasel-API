//hospital management
var mongoose = require('mongoose');
var express = require('express'),app = express(), port = 5000;
var bodyParser = require('body-parser');
var Schema = mongoose.Schema;
//middleware 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose
  .connect(
    'mongodb://mongo:27017/hasel-api',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
//starting the app
app.listen(
  port, () => console.log(
    'Hasel RESTful API server started on: ' + port
  )
);
//schema
var TransictionSchema = new Schema({
  user:{
    type: String,
    required: true
  },
  desc:{
    type: String,
    required: false
  },
  amount:{
    type: String,
    required: true
  },
  payer:{
    type: String,
    required: true
  },
  status:{
    type: String,
    default: "Waiting to Open"
  },
})
mongoose.model("transictions", TransictionSchema);
var Transiction = mongoose.model("transictions");
listTransictions = function(req, res){
  Transiction.find({user: req.params.user}, function(err, transictions) {
    if (err)
      res.send(err);
    res.json(transictions);
  });
}
createTransiction= function(req, res) {
  var newTransiction = new Transiction(req.body);
  newTransiction.save(function(err, transiction) {
    if (err)
      res.send(err);
    res.json(transiction);
  });
};
updateTransiction = function(req, res) {
  Transiction.findOneAndUpdate({_id: req.params.transiction}, req.body, {new: true}, function(err, transiction) {
    if (err)
      res.send(err);
    res.json(transiction);
  });
};
deleteTransiction = function(req, res) {
  Post.remove({
    _id: req.params.transiction
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Transiction successfully deleted' });
  });
};
// handling the routes
app.route('/api/transitions/:user')
  .get(listTransictions);
app.route('/api/transictions')
  .post(createTransiction);
app.route('/api/transitions/:transiction')
.put(updateTransiction)
.delete(deleteTransiction);