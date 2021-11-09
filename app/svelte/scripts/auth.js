

const api_url = "";

exports.api_url = api_url;



exports.checkLoggedIn = async function (callback){
    let res = await sendPostRequest("/api/users/check");
    if(callback){
        callback(res[0].authenticated === true);
    }else{
        return res[0].authenticated === true;
    }
    
}

exports.tryLogIn = async function (uoe, password, rememberMe, callback){
    let res = await sendPostRequest(`/api/users/login?usernameOrEmail=${uoe}&password=${password}&rememberMe=${rememberMe}`); 
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
    let res = await sendPostRequest(`/api/users/register?username=${username}&email=${email}&password=${password}&password2=${password2}`);
    if(res[1].status === 200){
        return [String(res[0].message).toLocaleLowerCase() === "successfully registered user.", undefined, undefined];
    }
    else if(res[1].status === 400 || res[1].status === 403){
        return [false,  res[0].message, res[0].errorCode];
    }
    return [false, 'Unknown Error'];
}

exports.tryVerifyAccount = async function (secret, callback){
    let res = await sendPostRequest("/api/users/verify?secret=" + secret);
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
    let r = await sendPostRequest("/api/users/resend_verification?email=" + email);
}


exports.sendForgotPasswordRequest = async function (email){
    let r = await sendPostRequest("/api/users/forgotpassword?email=" + email);
    if(r[1].status === 200){
        return [true];
    }else{
        return [false, r[0].message];
    }
}

exports.changePassword = async function (secret, password, password2) {
    let r = await sendPostRequest(`/api/users/changepassword?secret=${secret}&password=${password}&password2=${password2}`);
    if(r[1].status === 200){
        return [true];
    }else{
        return [false, r[0].message, r[1].status];
    }
}

exports.createNewSite = async function (title, files, isPublic, startPage) {
    const f = new FormData();
    f.append("title", title);
    for(const file of files){
        f.append(file.name, file);
    }
    f.append("isPublic", isPublic);
    f.append("entryFile", startPage)
    let r = await sendPostRequest("/api/sites/create", f);
    if(r[1].status === 200){
        return [true, r[0].result];
    }else{
        return [false, r[0].message, r[0].errorCode];
    }
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