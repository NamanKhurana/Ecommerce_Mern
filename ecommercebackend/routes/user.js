const express = require("express");
const router = express.Router();

const { userById,read,update,purchaseHistory } = require('../controllers/user');
const { requireSignin,isAuth,isAdmin } = require('../controllers/auth');

router.get('/secret/:userId', requireSignin, isAuth , isAdmin, (req, res) => {

    //this if condition can be added in a middleware as well for clean code  
    //if(req.profile._id != req.auth._id) return res.status(403).json({err : "Access denied",proid:req.profile._id,authid:req.auth._id})


    res.json({
        user: req.profile
    })
})
 
router.get('/user/:userId',requireSignin,isAuth,read)
router.put('/user/:userId',requireSignin,isAuth,update)
router.get('/orders/by/user/:userId',requireSignin,isAuth,purchaseHistory);

router.param('userId', userById);

module.exports = router; 