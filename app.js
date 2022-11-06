const Express = require('express');
const Layouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

// db
const db = require('./config/key').MongoURI;


// passport Config
require('./config/passport')(passport);

async function MongoConnect(){
    await mongoose.connect(db)
    .catch((err)=>{
        throw err;
    })
    .then(()=>{
        console.log('mongoose connected');
    });
}



const app = Express();
const PORT = process.env.PORT;

// static
app.use(Express.static('public'));


// ejs
app.use(Layouts);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


// session storage
app.use(session({
    secret: 'word',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

//  passport middleware
app.use(passport.initialize());
app.use(passport.session());


// connect flash

app.use(flash())

// global var

app.use((req, res, next)=>{

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')
    next()
});


// routes
app.use('/', require('./routes/index'));
app.use('/dashboard', require('./routes/dashboard'));

app.listen(PORT, ()=>{
    MongoConnect();
    console.log(`server started on port ${PORT}`);
} );