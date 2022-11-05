const Express = require('express');
const router = Express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {ensureAuth} = require('../config/auth');

// models
const User = require('../models/user');
const Order = require('../models/order');
const NewsLetter = require('../models/newsletter');
const Quote = require('../models/quote');
const Contact = require('../models/contact');




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
        }else{  
            res.render('track', {order});
        }

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




//contact 
router.get('/contact', (req,res)=>{

    res.render('contact');
});

//contact 
router.post('/contact', (req,res)=>{
    const {name, email, message} = req.body;
    const contact = new Contact({
        name: name,
        email: email,
        message: message
    });

    contact.save()
    .catch(err=>{throw err})
    .then(()=>{
        req.flash('success_msg', 'message sent we will be getting back to you');
        res.redirect('/contact');
    });

});


//Pricing 
router.get('/price', (req,res)=>{

    res.render('price');
})


// newly added...
// terms 
router.get('/terms', (req,res)=>{

    res.render('terms');
});

// sea 
router.get('/sea', (req,res)=>{

    res.render('sea');
});

// Air 
router.get('/air', (req,res)=>{

    res.render('Air');
});

// land 
router.get('/land', (req,res)=>{

    res.render('land');
});

// privacy 
router.get('/privacy', (req,res)=>{

    res.render('privacy');
});

// warehouse 
router.get('/warehouse', (req,res)=>{

    res.render('warehouse');
});

// end.....


// services
router.get('/service', (req,res)=>{

    res.render('service');
})

// ABout
router.get('/about', (req,res)=>{

    res.render('about');
})


// dashboards pages
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
});

// contact Delete
router.post('/deletecontact', (req,res)=>{

    Contact.findByIdAndDelete(req.body.id)
    .catch(err=> {
        throw err
    })
    .then(()=>{
        req.flash('success_msg', 'order deleted')
        res.redirect('/dashboard/list')
    });
});

// Admin Delete
router.post('/deleteuser', (req,res)=>{

    User.findByIdAndDelete(req.body.id)
    .catch(err=> {
        throw err
    })
    .then(()=>{
        req.flash('success_msg', 'order deleted')
        res.redirect('/dashboard/user')
    });
});



// newsletter
router.post('/newsletter', (req,res)=>{

    const {email} = req.body;
    NewsLetter.findOne({email: email})
    .catch(err=>{throw err})
    .then(emails=>{

        if(emails){
            res.redirect('/');
        }
        const newsLetter = new NewsLetter({
            email: email
        })
        newsLetter.save()
        .catch(err=>{throw err})
        .then(()=>{
            req.flash('success_msg', 'you have successfully registered for our newsletter');
            res.redirect('/')
        })
    })
    
    


})

// newsletter Delete
router.post('/deletenewsletter', (req,res)=>{

    NewsLetter.findByIdAndDelete(req.body.id)
    .catch(err=> {
        throw err
    })
    .then(()=>{
        req.flash('success_msg', 'order deleted')
        res.redirect('/dashboard/newsletter')
    });
});

// geting quotes
router.post('/getquote', (req,res)=>{
    const {name, email, service} = req.body;
    console.log(req.body);
    const quote = new Quote({
        name: name,
        email: email,
        services: service
    })

    quote.save()
    .catch(err=>{
        throw err
    })
    .then(()=>{
        req.flash('success_msg', 'Thank you for your request you will recieve an email soon');
        res.render('service');
    });

});

// Quote Delete
router.post('/deletequote', (req,res)=>{

    Quote.findByIdAndDelete(req.body.id)
    .catch(err=> {
        throw err
    })
    .then(()=>{
        req.flash('success_msg', 'order deleted')
        res.redirect('/dashboard/quote')
    });
});


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