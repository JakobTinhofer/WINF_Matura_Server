

const api_url = "";

exports.api_url = api_url;



exports.checkLoggedIn = async function (callback){
    let url = api_url + "/api/users/check";
    try {
        let res = await fetch(url, {method: 'POST'});
        let result = JSON.parse(await res.json()); 
        if(callback){
            callback(undefined, res.authenticated === true);
        }else{
            return result.authenticated === true;
        }
        
        
    } catch (error) {
        console.log(error);
        if(callback){
            callback(error, false);
        }else{
            throw error;
        }
        
    }
    
    
    
}

exports.tryLogIn = async function (uoe, password, rememberMe, callback){
    
    let url = api_url + "/api/users/login";
    const u = new URLSearchParams();
    u.append("usernameOrEmail", uoe);
    u.append("password", password);
    u.append("rememberMe", rememberMe);

    try {
        let res = await fetch(url, {
            method: 'POST',
            body: u
        });
        let result = JSON.parse(await res.json());
        console.debug(result);
        if(res.status === 200){
            cached = result.result;
            return [String(result.message).toLocaleLowerCase() === "login successfull.", undefined];
        }
        else if(res.status === 400 || res.status === 403){
            return [false,  result.message];
        }
        return [false, 'Unknown Error'];        
    } catch (error) {
        console.log(error);
        if(callback){
            callback(error, false);
        }else{
            throw error;
        }       
    }
}

exports.logOut = async function (callback){
    cached = undefined;
    let url = api_url + "/api/users/logout";
    try {
        let res = await fetch(url, {method: 'POST'});
        let result = await res.json();
        console.log(result);
    }catch (error){
        console.log(error);
        if(callback){
            callback(error, false);
        }else{
            throw error;
        }
    }
    
}

exports.trySignUp = async function (username, email, password, password2, callback){
    let url = api_url + "/api/users/register";
    const u = new URLSearchParams();
    u.append("email", email);
    u.append("username", username);
    u.append("password", password);
    u.append("password2", password2);
    try{
        let res = await fetch(url, {
            method: 'POST',
            body: u
        });
        let result = JSON.parse(await res.json());
        console.debug(result);
        if(res.status === 200){
            return [String(result.message).toLocaleLowerCase() === "successfully registered user.", undefined, undefined];
        }
        else if(res.status === 400 || res.status === 403){
            return [false,  result.message, result.errorCode];
        }
        return [false, 'Unknown Error'];
    }catch(error){
        console.log(error);
        if(callback){
            callback(error, false);
        }else{
            throw error;
        }
    }
}

exports.tryVerifyAccount = async function (secret, callback){
    let url = api_url + "/api/users/verify"
    const u = new URLSearchParams();
    console.log("Secret: " + secret);
    u.append("secret", secret);
    try{
        let res = await fetch(url, {
            method: 'POST',
            body: u
        });
        let result = JSON.parse(await res.json());
        if(res.status === 200){
            return [true, result.message];
        }
        return [false, result.message, result.errorCode];
    }catch(error){
        console.log(error);
        if(callback){
            callback(error, false);
        }else{
            throw error;
        }
    }
}

let cached;
exports.getOwnUser = async function(allow_cached, callback){
    console.log("Updating user...");
    if(allow_cached && cached)
        return cached;
    let url = api_url + "/api/users/userinfo"
    try{
        let res = await fetch(url, {method: 'POST'});
        let result = JSON.parse(await res.json());
        if(res.status === 200){
            cached = result;
            console.log("Successfully got user " + result.username + "..");
            return result;
        }
        console.log("Error: " + res.message);
        return undefined;
    }catch(error){
        console.log(error);
        if(callback){
            callback(error, false);
        }else{
            throw error;
        } 
    }
}