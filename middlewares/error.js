const AppError = require("./../util/appError");
const ParamError = require("./../util/paramError");


// handle intentionally thrown errors
// handle mongoose castError (object id)
// handle mongoose validation error
// handle mongoDB duplicate error


function handleCastErrorDB(error) {
    const message = `Invalid ${error.path}: ${error.value}.`
    const castError = new AppError(message, 400, true)
    return castError;
}

function handleValidationErrorDB(error) {
    const message = "Invalid list identifier"
    const ValError = new AppError(message, 400, error, true)
    return ValError;    
}

function handleDuplicateFieldsDB(error) {
    const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `${value} already exists. Please use another value`
    const DupError = new AppError(message, 400, error, true)
    return DupError;    
}

function handleErrorDev (err, req, res) {
    console.log(err);
    res.render("error", { error: {
        message: err,
    }});
}

function handleErrorProd(err, req, res) {
    let error = Object.create(err);

    error.statusCode ? error.statusCode : 500;

    //Major non-handled Application errors
    if(error.name === "CastError") error = handleCastErrorDB(error);
    if(error.name === "ValidationError") error = handleValidationErrorDB(error);
    if(error.code === 11000 ) error = handleDuplicateFieldsDB(error);
    
    // Log all errors
    console.log(error);

    if(error.isOperational) {
        res.app.locals.error = {
            message: error.message,
        }
        res.status(error.statusCode);

        //Handle Application errors caused by mistyped URLs

        if (error instanceof ParamError) {
            res.render("error", {error: {message: error.message}});
            return;
        }

        /* Ignore, 
            res.redirect("back") solves problem of redirecting client to the last non-errored page
            Redirects to the homepage if no such page 
        */
        // const url = req.originalUrl.replace(/\/\w*$/i, "");

        res.redirect("back");
        return;
    }
    else {
        // Critical Error: Log and Notify
        console.log(error)
        res.status(500).send("An error occured");
        return
    }
    
}

async function centralErrorHandler (err, req, res, next) {
    if (process.env.NODE_ENV === "development") {
        handleErrorDev(err, req, res);
        return;
    }
    else if (process.env.NODE_ENV === "production") {
        handleErrorProd(err, req, res);
        return;
    }    
}


async function error404Handler (req, res, next) {
    res.status(404);
    res.render("404");
    return;
}


module.exports = {
    centralErrorHandler,
    error404Handler
}