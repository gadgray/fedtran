const Express = require('express');
const router = Express.Router();
const mongoose =  require('mongoose');
const {ensureAuth} = require('../config/auth');

// models
const Order = require('../models/order');
const Contact =  require('../models/contact');
const Quote = require('../models/quote');
const NewsLetter = require('../models/newsletter');
const User = require('../models/user');


// dashboard
router.get('/', ensureAuth, (req,res)=>{

    Order.find({})
    .catch(err=>{
        throw err
    })
    .then(orders=>{
        res.render('dashboard', {orders});
    })
   ;
})


// get Lists

router.get('/list', ensureAuth, (req, res)=>{
    
    Contact.find({})
    .catch(err=>{throw err})
    .then(contacts=>{

        res.render('list', {contacts});
    })
});


// get Quotes
router.get('/quote', ensureAuth, (req, res)=>{
    
    Quote.find({})
    .catch(err=>{throw err})
    .then(quotes=>{

        res.render('quote', {quotes});
    });
});


// get NewsLetters
router.get('/newsletter', ensureAuth, (req, res)=>{
    
    NewsLetter.find({})
    .catch(err=>{throw err})
    .then(newsLetters=>{

        res.render('newsletter', {newsLetters});
    });
});

// get User
router.get('/user', ensureAuth, (req, res)=>{
    
    User.find({})
    .catch(err=>{throw err})
    .then(users=>{

        res.render('admins', {users});
    });
});



module. exports = router;