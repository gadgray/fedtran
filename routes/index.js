const Express = require('express');
const router = Express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {ensureAuth} = require('../config/auth');

// models
const User = require('../models/user');
const Order = require('../models/order');



// authentication
const passport = require('passport');

// generate tracking id
const genTrackingId = require('../config/gen');

// home
router.get('/', (req,res)=>{


    res.render('index');
})


// track id generator
router.post('/trackid', (req,res)=>{

    const{trackID} = req.body;
    Order.findOne({Trackid: trackID})
    .catch(err=> {
        throw err
    })
    .then(order=>{
        if (!order){
            req.flash('error_msg', 'Tracking ID doesn\'t exist');
            res.redirect('/');
        }

        res.render('track', {order});
    })
})


//  ItemNo generator
router.post('/itemno', (req,res)=>{

    const {itemNo} = req.body;
    const trackId = genTrackingId();

    Order.findOne({OrderId : itemNo})
    .catch(err=>{
        throw err
    })
    .then((orders=>{
        if(!orders){
            req.flash('error_msg','Order does not exist');
            res.redirect('/')
        }else{
            const order = new Order({
                OrderId: itemNo,
                Trackid: trackId
        
            })
            order.save()
            .catch(err=>{
                throw err
            })
            .then(()=>{
                req.flash('success_msg','registration comeback in a few minutes to get your order datails');
                    res.render('gen', {orders})
                
            })
        }
        
        
    }))

})




// track page



//contact 
router.get('/contact', (req,res)=>{

    res.render('contact');
})


//Pricing 
router.get('/price', (req,res)=>{

    res.render('price');
})


// services
router.get('/service', (req,res)=>{

    res.render('service');
})

// ABout
router.get('/about', (req,res)=>{

    res.render('about');
})

// register
router.get('/register', (req,res)=>{
    

    res.render('register')
})



// register POst
router.post('/register', (req,res)=>{

    const {name, email, password, password2} = req.body;

    console.log(name, email, password, password2)
    const errors =[];
    const success = [];
    
    if(password != password2){
        errors.push({msg:'passwords do not match'});
        res.render('register', {errors, name, email, password, password2});
    }
    else{

        const user = new User({
            name: name,
            email: email,
            password: password
        });

        bcrypt.genSalt(9, (err, salt)=>{

            if(err){
                throw err
            }else{
                console.log(salt);
                bcrypt.hash(password, salt, (err, hash)=>{
                    
                        user.password = hash;
                        console.log(hash);
                        user.save()
                        .catch(err=> {throw err})
                        .then(()=>{
                            req.flash('success_msg','registration successful you can now logging')
                            res.redirect('/login')
                        })
                    
                })
            }
        })
        
    }
})

// login
router.get('/login', (req,res)=>{

    res.render('login');
});

router.post('/login', (req,res, next)=>{

    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// dashboard
router.get('/dashboard', ensureAuth, (req,res)=>{

    Order.find({})
    .catch(err=>{
        throw err
    })
    .then(orders=>{
        res.render('dashboard', {orders});
    })
   ;
})

// update

router.post('/update', (req,res)=>{
    const {orderId, trackId, dispatchLocation, dispatchDate, arrivalLocation, arrivalDate }= req.body;

    const update = {
        OrderId: orderId,
    Trackid: trackId,
    DispatchDate:dispatchDate,
    DispatchLocation: dispatchLocation,
    ArivalDate: arrivalDate,
    ArrivalLocation: arrivalLocation,
    }

    Order.findOneAndUpdate({Trackid: trackId}, update,(err, done)=>{

        if(err){
            req.flash('error_msg: "error updateing');
            res.redirect('/dashboard')
        }
        if(done){
            req.flash('success_msg: "Updated');
            res.redirect('/dashboard')
        }
    })

;})

// order Delete
router.post('/delete', (req,res)=>{

    Order.findByIdAndDelete(req.body.id)
    .catch(err=> {
        throw err
    })
    .then(()=>{
        req.flash('success_msg', 'order deleted')
        res.redirect('/dashboard')
    })
})
// logout

router.get('/logout', (req,res)=>{

    req.logOut(err => {if(err){
        console.log(err)
    }}
    )
    res.redirect('/login');
    req.flash('success_msg', 'you are logged out');
})



module.exports= router;