const {check,validationResult} = require('express-validator');

exports.runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }
    next();
};
 
 
exports.userSignupValidator = [
    check('name')
        .not().isEmpty()
        .withMessage('Name is required'),
    check('email')
        .isLength({ min: 6,max : 32 })
        .withMessage('Email must be between 3 and 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @'), 
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number')
];

exports.userSigninValidator = [
    check('email')
        .isLength({ min: 6,max : 32 })
        .withMessage('Email must be between 3 and 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @'), 
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number')
];