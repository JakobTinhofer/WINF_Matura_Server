import {displayStatusMessage} from '../src/modules/StatusMessagesAndModals/MessageAndModalDisplayer.svelte';

export const api_url = "/api/";


export const checkLoggedIn = async function (callback, redir = undefined){
    let res = await sendBasicJSONPostRequest('users/check', {}, redir);
    if(callback){
        callback(res[0]);
    }
    return res[0];
}

export const tryLogIn = async function (uoe, password, rememberMe, callback){
    let res =  await sendBasicJSONPostRequest('users/login', {usernameOrEmail: uoe, password: password, rememberMe: rememberMe});
    if(res[0] === true){
        cached = res[1];
    }
    return res;
}

export const logOut = async function (callback){
    cached = undefined;
    await sendBasicJSONPostRequest("users/logout");
}

export const trySignUp = async function (username, email, password, password2, callback){
    return await sendBasicJSONPostRequest('users/register', {username: username, email: email, password: password, password2: password2});
}

export const tryVerifyAccount = async function (secret, callback){
    return await sendBasicJSONPostRequest('users/verify', {secret: secret}, "");
}

let cached;
export const getOwnUser = async function(allow_cached, callback){
    if(allow_cached && cached)
        return cached;
    let result = await sendBasicJSONPostRequest("users/userinfo");
    if(result[0]){
        cached = result[1];
        return result[1];
    }
    return undefined;
}

export const resendVerificationEmail = async function(email){
    return await sendBasicJSONPostRequest('users/resend_verification', {email: email}, "");
}


export const sendForgotPasswordRequest = async function (email){
    return await sendBasicJSONPostRequest('users/forgotpassword', {email: email}, "");
}

export const changePassword = async function (secret, password, password2) {
    return await sendBasicJSONPostRequest('users/changepassword', {secret: secret, password: password, password2: password2}, "");
}

export const createNewSite = async function (title, files, isPublic, startPage) {
    const f = new FormData();
    f.append("title", title);
    for(const file of files){
        f.append(file.name, file);
    }
    f.append("isPublic", isPublic);
    f.append("entryFile", startPage)
    let r = await sendPostRequest("sites/create", f);
    if(r[1].status === 200){
        return [true, r[0].result];
    }else{
        return [false, r[0].message, r[0].errorCode];
    }
}

export const getSitesWithFilter = async function (filter) {
    return await sendBasicJSONPostRequest('sites/getvisible', {filter: filter}, "pages");
} 

export const checkSiteVisible = async function (pathname) {
    let r = await fetch(`sites/${pathname}`)
    if(r.status !== 200){
        return false;
    }
    return true;
}

export const getSiteByPath = async function (pathname) {
    return await sendBasicJSONPostRequest('sites/getbypath', {pathEnd: pathname}, "pages");
}

export const getEditFields = async function (id) {
    return await sendBasicJSONPostRequest('sites/geteditfields', {id: id}, "pages");
}

export const sendEditRequest = async function(id, title, additional_files, files_to_remove, start_page, isPublic){
    const f = new FormData();
    for(const file of additional_files){
        f.append(file.name, file);
    }
    let r = await sendPostRequest(`sites/editsite?id=${id}&title=${title}&files_to_remove=${files_to_remove}&entryFile=${start_page}&isPublic=${isPublic}`, f, "pages");
    if(r[1].status === 200){
        return [true, r[0].result];
    }else{
        return [false, r[0].message, r[0].errorCode];
    }
}

export const deleteSite = async function (id){
    return await sendBasicJSONPostRequest('sites/deletesite', {id: id}, "pages");
}

export const setCustomPath = async function (id, path){
    return await sendBasicJSONPostRequest('sites/setcustompath', {id: id, customPath: path}, "pages");
}

async function sendBasicJSONPostRequest(url, obj = {}, redirOnNotLoggedIn = undefined){
    let act_url = api_url + url;
    let res;
    try{
        res = await fetch(act_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        let resObj = JSON.parse(await res.json());
        if(res.status === 200){
            return [true, resObj.result];
        }else{
            if(redirOnNotLoggedIn && res.status === 401)
                window.location = "/login?redir=" + redirOnNotLoggedIn + "&sms=0";
            return [false, resObj.message, resObj.errorCode, res.status];
        }
    }catch(error){
        showStatusMessage("Error while handling response: " + error);
        displayStatusMessage(res, "red");
        throw error;
    }
}

async function sendPostRequest(url, body, redirOnNotLoggedIn){
    let act_url = api_url + url;
    let res;
    try{
        let requestParams = {method: 'POST'}
        if(body)
            requestParams.body = body;
        res = await fetch(act_url, requestParams);
        let resObj = JSON.parse(await res.json()); 
        if(res.status === 401 && resObj.errorCode === 666 && redirOnNotLoggedIn !== undefined){
            window.location = "/login?redir=" + redirOnNotLoggedIn + "&sms=0"; 
        }

        return [resObj, res];
    }catch(error){
        console.log("Error while handling response: " + error);
        displayStatusMessage(res, "red");
        throw error;
    }
}