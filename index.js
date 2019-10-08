//hospital management
var mongoose = require('mongoose');
var express = require('express'),app = express(), port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
var uniqueValidator = require('mongoose-unique-validator');
var axios = require('axios');
var path = require('path');

var Schema = mongoose.Schema;
//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose
  .connect(
    'mongodb+srv://admin:admin@cluster0-driyq.mongodb.net/plata?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
//starting the app
app.listen(
  port, () => console.log(
    'Plata RESTful API server started on: ' + port
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
  date:{
    default: Date.now(),
    type: Date
  }
})
mongoose.model("transictions", TransictionSchema);
var Transiction = mongoose.model("transictions");
listTransictions = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  Transiction.find({user: req.params.userId}, function(err, transictions) {
    if (err)
      res.send(err);
    res.json(transictions);
  });
}
searchTransictions = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  Transiction.findOne({_id: req.params.id}, function(err, transictions) {
    if (err)
      res.send(err);
    res.json(transictions);
  });
}
listAllTransictions = function(_req, res){
  res.header("Access-Control-Allow-Origin", "*");
  Transiction.find({}, function(err, transictions) {
    if (err)
      res.send(err);
    res.json(transictions);
  });
}
createTransiction= function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  var newTransiction = new Transiction(req.body);
  newTransiction.save(function(err, transiction) {
    if (err)
      res.send(err);
    res.json(transiction);
  });
};

updateTransiction = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  Transiction.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, transiction) {
    if (err)
      res.send(err);
    res.json(transiction);
  });
};

deleteTransiction = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  Post.remove({
    _id: req.params.id
  }, function(err, _task) {
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
app.route('/api/searchtransictions/:id')
  .get(searchTransictions)
app.route('/api/transictions')
  .post(createTransiction);
app.route('/api/transictions/:id')
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
  balance:{
    type: String,
    default: "0"
  },
  business:{
    type: Boolean,
    default: false
  },
  // address:{
  //   type: [{type: String}],
  //   required: false
  // },
  phone: {
    type: String,
    required: true
  }
});
UserSchema.plugin(uniqueValidator);
mongoose.model("users", UserSchema);
var User = mongoose.model("users");
login = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  User.findOne({email: req.body.email, password: req.body.password}, function(err, requests) {
    if (err)
      res.send(err);
    res.json(requests);
  });
};
balance = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  //console.log(req.body.balance);
  User.findByIdAndUpdate({_id: req.params.id}, {balance: req.params.balance}, function(err, raw){
    if (err)
      res.send(err);
    res.json(raw);
  });
};
account = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  User.findOne({email: req.params.email}, function(err, requests) {
    if (err)
      res.send(err);
    res.json(requests);
  });
};
accounts = function(_req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  User.find({}, function(err, requests) {
    if (err)
      res.send(err);
    res.json(requests);
  });
};
register = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  var newUser = new User(req.body);
  newUser.save(function(err, request) {
    if (err)
      res.send(err);
    res.json(request);
  });
};
app.route("/api/account/:email")
  .get(account)
app.route("/api/accounts/")
.get(accounts)
app.route("/api/login")
  .post(login)
app.route("/api/register")
  .post(register)
app.route("/api/balance/:id/:balance")
  .get(balance)

var PaymentSchema = new Schema({
  transiction:{
    type: String,
    required: true
  },
  user:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: false
  },
  name:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  amount:{
    type: String,
    required: true
  },
  withdraw:{
    type: Boolean, 
    default: false,
  },
  status:{
    type:String,
    default:"Waiting to Pay"
  }
});
mongoose.model("payments", PaymentSchema);
var Payment = mongoose.model("payments");

newPayment = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  var newPayment = new Payment(req.body);
  newPayment.save(function(err, payment) {
    if (err)
      res.send(err);
    res.json(payment);
  });
};

listAllPayments = function(_req, res){
  res.header("Access-Control-Allow-Origin", "*");
  Payment.find({}, function(err, payments) {
    if (err)
      res.send(err);
    res.json(payments);
  });
}

deletePayment = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  Payment.remove({
    _id: req.params.id
  }, function(err, _payment) {
    if (err)
      res.send(err);
    res.json({ message: 'Payment successfully deleted' });
  });
};

app.route("/api/payments")
  .post(newPayment);
app.route("/api/payments/:id")
  .delete(deletePayment); 
app.route("/api/allpayments")
  .get(listAllPayments);

  app.route("/")
    .get(function(_req, res){
      res.sendFile(path.join(__dirname , "index/index.html"));   
    });
app.use(express.static("pay"));
mongoose.set('useFindAndModify', false);

close = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  Payment.findById(req.params.id, function(err,re){
    if(err){
      res.send(err);
    }
    if(!re){
      res.json({"error":"unavailablePayment"})
      return;
    }
    if(re.transiction.indexOf("deposit")!=-1){
      var a = re.transiction.slice(8);
      User.findOne({email:a}, function(err,user){
        if(err){
          res.send(err);
        }
        var c = parseInt(user.balance) + parseInt(re.amount);
        User.findOneAndUpdate({email: a}, {balance: c.toString()}, function(_err,_doc,resa){
          res.json(resa);
        });
      });
    }
    if(re.transiction.indexOf("withdraw")!=-1){
      var b = re.transiction.slice(9);
      User.findOne({email:b}, function(err,user){
        if(err){
          res.send(err);
        }
        var d = parseInt(user.balance) - parseInt(re.amount);
        User.findOneAndUpdate({email: b}, {balance: d.toString()}, function(_err,_doc,resad){
          res.json(resad);
        });
      });
    } else {
      User.findOne({email:re.user}, function(err,user){
        if(err){
          res.send(err);
        }
        
        console.log(user);
        var c = (parseInt(user.balance) + parseInt(re.amount)) * 0.97;
        User.findOneAndUpdate({email: a}, {balance: c.toString()}, function(err,_doc,resa){
          if(err){
            res.send(err);
          }
          res.json(resa);
        });
      });
    }
    
  });
  Payment.deleteOne({_id: req.params.id}, function(err, _resd){
    if (err)
      res.send(err)
  });
}

app.route("/api/close/:id")
  .get(close)


qrcode = function (req, res){
  User.findOne({email:req.params.charged}, function(_err, dbresc){
    if(Number.parseInt(req.params.amount) > Number.parseInt(dbresc.balance)){
      res.json({"message":"amount is less than balance"});
    } else {
      User.findOneAndUpdate({email:req.params.charged}, {balance: (Number.parseInt(dbresc.balance) - Number.parseInt(req.params.amount)).toString()}, function(_err, _resa){})
      User.findOne({email: req.params.email}, function(_err, emaildbres){
        User.findOneAndUpdate({email:req.params.email}, {balance: (Number.parseInt(emaildbres.balance) + Number.parseInt(req.params.amount)).toString()}, function(_err, _resab){})
      })
      res.json({"message":"operation complete"})
    }
  });
}

app.route("/api/qrcode/:email/:charged/:amount")
  .get(qrcode)