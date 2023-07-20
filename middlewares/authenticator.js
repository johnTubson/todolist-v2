

function authenticate (req, res, next) {
    if(!req.isAuthenticated() || !req.isAuthenticated) {
        if (req.session) {
            req.session.returnTo = req.originalUrl || req.url;
        }
        return res.redirect("/login");
    }
    next();

}



module.exports = {authenticate};