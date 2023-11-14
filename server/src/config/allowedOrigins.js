

let allowedOrigins

if(process.env.NODE_ENV === "production"){

    allowedOrigins = [process.env.PROD_ALLOWED_ORIGIN]
}

else{
    allowedOrigins = [process.env.DEV_ALLOWED_ORIGIN]
}


module.exports = allowedOrigins