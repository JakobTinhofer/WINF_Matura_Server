

const api_url = "";

exports.api_url = api_url;



exports.checkLoggedIn = async function (callback){
    let res = await sendPostRequest("/api/users/check");
    return res[0].authenticated === true;
}

exports.tryLogIn = async function (uoe, password, rememberMe, callback){
    const u = new URLSearchParams();
    u.append("usernameOrEmail", uoe);
    u.append("password", password);
    u.append("rememberMe", rememberMe);
    let res = await sendPostRequest("/api/users/login", u);
    if(res[1].status === 200){
        cached = res[0].result;
        return [String(res[0].message).toLocaleLowerCase() === "login successfull.", undefined];
    }
    else if(res[1].status === 400 || res[1].status === 403){
        return [false,  res[0].message];
    }
    return [false, 'Unknown Error'];
}

exports.logOut = async function (callback){
    cached = undefined;
    sendPostRequest("/api/users/logout");
}

exports.trySignUp = async function (username, email, password, password2, callback){
    const u = new URLSearchParams();
    u.append("email", email);
    u.append("username", username);
    u.append("password", password);
    u.append("password2", password2);
    let res = await sendPostRequest("/api/users/register", u);
    if(res[1].status === 200){
        return [String(res[0].message).toLocaleLowerCase() === "successfully registered user.", undefined, undefined];
    }
    else if(res[1].status === 400 || res[1].status === 403){
        return [false,  res[0].message, res[0].errorCode];
    }
    return [false, 'Unknown Error'];
}

exports.tryVerifyAccount = async function (secret, callback){
    const u = new URLSearchParams();
    u.append("secret", secret);
    let res = await sendPostRequest("/api/users/verify", u);
    if(res[1].status === 200){
        return [true, res[0].message];
    }
    return [false, res[0].message, res[0].errorCode];
}

let cached;
exports.getOwnUser = async function(allow_cached, callback){
    if(allow_cached && cached)
        return cached;
    let result = await sendPostRequest("/api/users/userinfo");

    if(result[1].status === 200){
        cached = result[0];
        return result[0];
    }
    return undefined;
}

exports.resendVerificationEmail = async function(email){
    const u = new URLSearchParams();
    u.append("email", email);
    let r = await sendPostRequest("/api/users/resend_verification", u);
}


exports.sendForgotPasswordRequest = async function (email){
    console.log("Email: " + email);
    const u = new URLSearchParams();
    u.append("email", email);
    let r = await sendPostRequest("/api/users/forgotpassword", u);
    if(r[1].status === 200){
        return [true];
    }else{
        return [false, r[0].message];
    }
}

exports.changePassword = async function (secret, password, password2) {
    
}


async function sendPostRequest(url, body, callback){
    let act_url = api_url + url;
    try{
        let requestParams = {method: 'POST'}
        if(body)
            requestParams.body = body;
        let res = await fetch(act_url, requestParams);
        return [JSON.parse(await res.json()), res];
    }catch(error){
        console.log(error);
        if(callback){
            callback(error, false);
        }else{
            throw error;
        }
    }
}