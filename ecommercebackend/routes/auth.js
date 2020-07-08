const express = require("express");
const router = express.Router();

const {signup,signin,signout,requireSignin} = require('../controllers/auth');

const {userSignupValidator,userSigninValidator,runValidation} = require('../validator');

router.post('/signup',userSignupValidator,runValidation,signup);
router.post('/signin',userSigninValidator,runValidation,signin);
router.get('/signout',signout);



module.exports = router;