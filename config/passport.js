const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt= require('bcrypt');

const User = require('../models/user');

module.exports = async function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'email'},
        (email, password, done)=>{

            // usermatch
            User.findOne({email: email})
            .catch(err=>{throw err})
            .then(user =>{
                if(!user){
                    return done(null, false, {message:'the email not registered'})
                }

                // match pasword
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err) throw err

                    if(isMatch){
                        return done(null, user);
                    }else{
                        return done(null, false, {message:'password does not match'})
                    }
                })
            })
        } )
    )
    passport.serializeUser((user, done)=>{

        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{

        User.findById(id, (err, user)=>{
            done(err, user);
        })
    })
}