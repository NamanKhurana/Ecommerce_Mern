const User = require("../models/user");
const jwt = require("jsonwebtoken"); //to generate signed web tokens
const expressJwt = require("express-jwt"); //for authorisation check
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
    // console.log(req.body);
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is already taken. Please sign up with a different mail .'
            });
        }
 
        const { name, email, password } = req.body;
        let newUser = new User({ name, email, password});
        
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: 'Signup success! Please signin.'
            });
        });
    });
};

exports.signin = (req, res) => {
    //find user based on email
    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "User with the email doesn't exist . Please signup " })
        }

        //if user is found make sure the email and password match

        //create authenticate method in User model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password don't match"
            })
        }

        //generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        //persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 });

        //return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } })
    })
}

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signout Success" });
}

exports.requireSignin = expressJwt({
    secret:process.env.JWT_SECRET,
    userProperty:"auth" //this useProperty allows to use the credentials of the current logged in user by req.auth.credential_name
})

exports.isAuth = (req,res,next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id

  if(!user){
      return res.status(403).json({
         error:'Access denied .'
      })
  }

  next()

}

exports.isAdmin = (req,res,next) => {
    if(req.profile.role == 0){
        return res.status(403).json({
            error:"Admin resource . Access denied ."
        })
    }

    next()
}