// Custome middleware created by us
//Middle ware for sending flash notifications
module.exports.setFlash = function(req, res,next){
    res.locals.flash = {
        'success':req.flash('success'),
        'error':req.flash('error')
    }
    next();
}