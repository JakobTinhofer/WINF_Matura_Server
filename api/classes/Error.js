class Error {
    constructor(title, message, status, errorCode){
        this.title = title;
        this.message = message;
        this.status = status;
        this.errorCode = errorCode;
    }
}

module.exports = Error;