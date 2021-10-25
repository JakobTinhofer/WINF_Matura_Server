const api_url = "";

exports.api_url = api_url;



exports.checkLoggedIn = async function (){
    let url = api_url + "/api/users/check";
    try {
        let res = await fetch(url, {method: 'POST'});
        let result = await res.json();
        return result.authenticated;
        
    } catch (error) {
        console.log(error);
    }
    
    
    
}