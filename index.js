//hospital management
var mongoose = require('mongoose');
var express = require('express'),app = express(), port = 5000;
var bodyParser = require('body-parser');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Connect to MongoDB
mongoose.Promise = global.Promise;
// TODO:Change for container 
mongoose
  .connect(
    'mongodb://mongo:27017/hasel',
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
  status:{
    type: String,
    default: "Waiting to Open"
  },
})
mongoose.model("transictions", TransictionSchema);
var Transiction = mongoose.model("transictions");
listTransictions = function(req, res){
  Transiction.find({user: req.params.userId}, function(err, transictions) {
    if (err)
      res.send(err);
    res.json(transictions);
  });
}
listAllTransictions = function(req, res){
  Transiction.find({}, function(err, transictions) {
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
app.route('/api/transictions/:userId')
  .get(listTransictions)
app.route('/api/alltransictions')
  .get(listAllTransictions)
app.route('/api/transictions')
  .post(createTransiction);
app.route('/api/transitions/:transiction')
  .put(updateTransiction)
  .delete(deleteTransiction);


  
//the user
//schema
var UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  address:{
    type: [{type: String}],
    required: false
  },
});
UserSchema.plugin(uniqueValidator);
mongoose.model("users", UserSchema);
var User = mongoose.model("users");
login = function(req, res) {
  User.find({email: req.body.email, password: req.body.password}, function(err, requests) {
    if (err)
      res.send(err);
    res.json(requests);
  });
};
register = function(req, res) {
  var newUser = new User(req.body);
  newUser.save(function(err, request) {
    if (err)
      res.send(err);
    res.json(request);
  });
};
app.route("/api/login")
  .post(login)
app.route("/api/register")
  .post(register)