class AppError extends Error{
    constructor(message,statusCode,errors=null){
        super(message);
        this.isOperational = true;
        this.statusCode = statusCode;
        this.status=`${statusCode}`.startsWith("4")?"fail":"error";
        this.errors=errors;

        Error.captureStackTrace(this,this.constructur);
    }
}

module.exports=AppError;