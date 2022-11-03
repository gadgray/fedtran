module.exports = {
    ensureAuth :
        function(req, res, next){

            if(req.isAuthentcated()){
                return next();
            }
            req.falsh('error_msg', 'error login');
            res.redirect('/login');
        }
    
}