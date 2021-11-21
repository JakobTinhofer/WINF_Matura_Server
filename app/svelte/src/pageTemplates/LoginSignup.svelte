
<script>
    // I swear, I can write clean code.... this is terrible, and I know that. 
    // Maybe, one day, I will find the motivation to write this more elegantly. But for now, it works.
    // Can I just kindly ask that you judge my coding skills by something else?? :)
    // (Also, I feel like some quirks of this framework + js make writing terrible code like this so easy.... not trying to shift blame but... )

    import {isEmail, isValidUsername, invalidCharacterMessage, convertToBool, getURLParameters} from "../../scripts/helpers";

    import {checkLoggedIn, tryLogIn, logOut, trySignUp} from "../../scripts/auth";

    import LoadingSpinner from "../modules/LoadingSpinner.svelte";

    import anime from 'animejs';

    export let isLogin = true;


    //#region Animations


    window.addEventListener("load", () => {
        var cardInBottom = anime({
            targets: '.card',
            translateY: '-100%',
            duration: 1000,
            easing: 'easeOutElastic(1, .6)'
        });
    });
    //#endregion






    let isAlreadySignedIn = false;
    checkLoggedIn().then((res) => {isAlreadySignedIn = res;}, (err) => {console.debug(err);});

    let message = "";

    let messageColor;

    let disableInput = false;
    let __di_str;
    let __btn_di_str;

    let password = "";
    let uoe;
    let rmbMe;
    
    $: __di_str = disableInput ? "disabled" : "";
    $: __btn_di_str = disableInput || !isValid ? "disabled" : "";
    let heading;

    let isValid = false;

    let displaySpinner = false;
    let clearPasswordOnNextLoad = false;

    $: set_state(isLogin);

    if(window.location.pathname === "/signup")
        isLogin = false;

    function set_state(state){
        let bool = convertToBool(state);
        if(bool){
            heading="Log In";
        }else{
            heading="Sign up";
        }
    }

    let urlParams = getURLParameters(window.location.search);

    function submitLoginForm(e) {
        if (e.preventDefault) e.preventDefault();

        disableInput = true;

        if(validateLoginForm("very")){
            displaySpinner = true;
            heading = "Trying to log you in...";

            tryLogIn(uoe,
                    password,
                    rmbMe)
                    .then((res) => {
                        console.debug(res);
                        if(res[0]){
                            console.debug(anime({
                                targets: '.card',
                                translateY: '200%',
                                duration: 1000,
                                easing: 'easeOutElastic(1, .6)'
                            }));
                            setTimeout(() => {
                                if(urlParams["redir"])
                                    window.location=urlParams["redir"];
                                else
                                    window.location.pathname="";
                            }, 100);
                        }else{
                            displaySpinner = false;
                            heading = "Log In";                            
                            password = "";
                            rmbMe = "";
                            message = res[1];
                            messageColor = "red";
                            disableInput = false;
                            
                            
                        }
                    }, (err) => {console.log("Error: ");console.debug(err);});
        }else{
            disableInput = false;
        }

        return false;
    }

    function signOut(){
        logOut()
        .then((res) => {
            isAlreadySignedIn = false;                
        }, (err) => {console.debug(err);});
    }

    //#region Login - Validation

    function validateLoginFormNotStrict(){
        validateLoginForm("none");  
    }

    // I swear, I can write clean code.... this is terrible, and I know that. 
    // Maybe, one day, I will find the motivation to write this more elegantly. But for now, it works.
    // Can I just kindly ask that you judge my coding skills by something else?? :)
    // (Also, I feel like some quirks of this framework + js make writing terrible code like this so easy.... not trying to shift blame but... )


    //TODO: Write the inputs into a new module (ValidatableInput.svelte) -> handle validation there
    function validateInput(input, strict){
        switch (input.type) {
            case "password":
                input.value = input.value.trim();
                if(input.value == ""){
                    input.classList.remove("validated-eup");
                    if(strict){
                        input.classList.add("invalid-eup");
                        return [false, "Password must not be empty!"];
                    }else{
                        input.classList.remove("invalid-eup");
                        return [false, ""];
                    }
                        
                }

                if(input.value.length > 256 || input.value.length < 6){
                    input.classList.remove("validated-eup");
                    input.classList.add("invalid-eup");
                    return [false, "The password needs to be between 6 and 256 characters long."];
                }
                else{
                    input.classList.remove("invalid-eup");
                    input.classList.add("validated-eup");
                }
                break;   
            case "text":
                input.value = input.value.trim();
                if(input.name == "emailOrUsername"){
                    if(input.value == ""){
                        input.classList.remove("validated-eup");
                        if(strict){
                            input.classList.add("invalid-eup");
                            return [false, "Email/Username must not be empty!"];
                        }else{
                            input.classList.remove("invalid-eup");
                            return [false, ""];
                        }
                        
                    }
                        
                    if(!isEmail(input.value) && input.value.length > 40 || input.value.length < 4){
                        input.classList.remove("validated-eup");
                        input.classList.add("invalid-eup");
                        return [false, "The username must be between 4 and 40 characters long."];
                    }
                    if(!isEmail(input.value) && !isValidUsername(input.value)){
                        input.classList.remove("validated-eup");
                        input.classList.add("invalid-eup");
                        return [false, invalidCharacterMessage];
                    }
                    input.classList.remove("invalid-eup");
                    input.classList.add("validated-eup");
                }
                break;
            case undefined:
                break;
            case "submit":
                break;
            default:
                throw "Cannot validate unknown input type: " + input.type;
        }
        return [true, ""];
    }

    function validateLoginForm(strict){
        let inputs = document.getElementsByTagName("form")[0].children;
        let allGood = true;
        message = "";
        messageColor = "";
        Array.prototype.forEach.call(inputs, (child) => {
            let res;
            if(!((res = validateInput(child, strict))[0])){
                allGood = false;
                if(res[1] && res[1] !== "" && strict !== "none"){
                    if(messageColor != "red"){
                        messageColor = "red";
                    }
                    message += res[1] + "\n";
                }
                if(strict === "none"){
                    child.classList.remove("invalid-eup");
                }
            }
                
        });
        if(message != ""){
            message = message.replace(/\n+$/, "");
        }
        isValid = allGood;
        return allGood;
    }


    

    //#endregion

    let display_successfull_signup = false;

    //#region Signup - Validation


    function goHome() {
        window.location = "/";
    }

    

    let signup_classes = {
        'email' : '',
        'username' : '',
        'password' : '',
        'password2' : '',
        'submit' : ''
    }

    let email = "", password2 = "", username = "";

    function validateSignup(strict){
        let allGood = true;
        message = "";
        messageColor = "";

        signup_classes['email'] = '';
        if(isEmail(email)){
            signup_classes['email'] = 'validated-eup';
        }else{
            allGood = false;
            signup_classes['email'] = 'invalid-eup';
            message += 'Invalid email.\n';
        }

        if(strict && strict !== 'none'){
            username = username.trim();
            email = email.trim();
        }
        
        signup_classes['username'] = '';
        
        if(username.length <= 40 && username.length >= 4){
            if(isValidUsername(username)){
                signup_classes['username'] = 'validated-eup';
            }else{
                allGood = false;
                signup_classes['username'] = 'invalid-eup';
                message += invalidCharacterMessage + "\n";
            }
        }else{
            allGood = false;
            signup_classes['username'] = 'invalid-eup';
            message += "Username must be between 4 and 40 characters long.\n";
        }

        signup_classes['password'] = '';
        if(password === ''){
            allGood = false;
            if(strict && strict !== 'none'){
                signup_classes['password'] = 'invalid-eup';
                message += "Password must not be empty!\n";
            }
        }else if(password.length < 6 || password.length > 256){
            allGood = false;
            signup_classes['password'] = 'invalid-eup';
            message += "Password must be between 6 and 256 characters in length!\n";
        }else{
            signup_classes['password'] = "validated-eup"
        }

        signup_classes['password2'] = '';
        if(password2 === ''){
            allGood = false;
            if(strict && strict !== 'none'){
                signup_classes['password2'] = 'invalid-eup';
                message += "Repeat password must not be empty!\n";
            }
        }else if(password2.length < 6 || password2.length > 256){
            allGood = false;
            signup_classes['password2'] = 'invalid-eup';
            message += "Repeat password must be between 6 and 256 characters in length!\n";
        }else{
            signup_classes['password2'] = "validated-eup"
        }

        if(password !== password2){
            allGood = false;
            signup_classes['password'] = 'invalid-eup';
            signup_classes['password2'] = 'invalid-eup';
            message += "Passwords do not match!\n";
        }
        if(message.length > 0){
            message = message.replace(/\n+$/, "");
            messageColor = "red";
        }
        isValid = allGood;
        return allGood;
    }


    function validateSignupNotStrict(){
        validateSignup('none');
    }
    //#endregion

    function submitSignup(e){
        if (e.preventDefault) e.preventDefault();

        disableInput = true;
        if(validateSignup("strict")){
            displaySpinner = true;
            heading = "Trying to create your account...";
            trySignUp(username, email, password, password2).then((res) => {
                if(res[0]){
                    heading = "Sign Up Successfull";
                    displaySpinner = false;
                    disableInput = false;
                    display_successfull_signup = true;
                }else{
                    displaySpinner = false;
                    heading = "Sign Up";
                    message = res[1];
                    messageColor = "red";
                    if(res[2] !== undefined){
                        if(res[2] === -1){
                            validateSignup("strict");
                        }else if(res[2] === 0){
                            signup_classes['email'] = "invalid-eup";
                        }else if(res[2] === 1){
                            signup_classes['username'] = 'invalid-eup';
                        }else if(res[2] == 2){
                            signup_classes['password'] = 'invalid-eup';
                            signup_classes['password2'] = 'invalid-eup';
                            
                        }
                    }
                    isValid = false;
                    disableInput = false;
                }
            }, (err) => {console.debug(err);});
        }else{
            disableInput = false;
        }
        
        return false;
    }

    function logIn(){
        window.location.pathname = "login";
    }
</script>


<style>
    #main {
        background-color: lightblue;
        width: 100%;
        height: 100%;
        overflow: hidden;
        
    }
    #centred {
        position:absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        transform: translate(-50%, +50%);
        -ms-transform: translate(-50%, -50%);
    }

    .card{
        width: 60%;
        padding:    30px;
        background-color: white;
        transition: width 0.3s;
        margin: auto;
        position: relative;
        border-radius: 15px;
        max-width: 400px;
        font-family: "Roboto", sans-serif;
        
    }

    .card h1{
        text-align: center;
        color: black;
        
    }
    .card p{
        padding: 8px;
        width: 80%;
        color: black;
        display: block;
        margin: 20px 10%;
    }

    .box_shadow_light{
        box-shadow:
            2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
            6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
            12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
            22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
            41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
            100px 100px 80px rgba(0, 0, 0, 0.07);
    }

    .emailUsernamePassword{
        width: 80%;
        padding: 20px 20px;
        margin: 20px 10%;
        box-sizing: border-box;
        border-radius: 10px;
        transition: 0.6s;
        background-color: lightgray;
    }

    .emailUsernamePassword:hover{
        background-color: white;
    }

    .emailUsernamePassword:focus{
        border-color: grey;
    }

    .validated-eup{
        border: 3px solid green;
    }

    .validated-eup:hover{
        border-color: lightgreen;
    }

    input[type=submit]{
        width: 80%;
        margin: 20px 10%;
        background-color: grey;
        color: white;
        border-color: transparent;
        border-radius: 10px;
        font-size: 30px;
        transition: background-color 1s;
    }


    
    

    .invalid-eup{
        border: 3px solid red;
    }
    .invalid-eup:hover{
        border-color: darkred !important;
    }
    .invalid-eup:focus{
        border-color: tomato !important;
    }


    label {
        color: black;
        display: inline;
        width: 80% !important;
        margin: 20px 10%; 
    }

    .width-80 input[type=checkbox]{
        float: right;
    }

    .width-80{
        width: 80% !important;
        margin: 20px 10%;
    }
    .width-80 p{
        display: inline;
        margin: 0px;
        text-align: left;
    }
    .width-80 label{
        width: 100% !important;
        margin: 0px !important;
    }

    input[type="submit"]:disabled {
        background-color: grey !important;
    }

    .sign_out{
        background-color: slateblue !important;
    }
    .sign_out:hover{
        background-color:  royalblue !important;
    }
</style>

<head>
    <style>
        body{
            overflow-y: hidden;
        }
    </style>
</head>


{#if isValid || isAlreadySignedIn}
<head>
    <style>
        input[type=submit]{
            background-color: green !important;
        }

        input[type=submit]:hover{
            background-color: rgb(0, 200, 0) !important;
        }
    </style>
</head>

{/if}

<svelte:head>
    <title>{heading}</title>
</svelte:head>

<div id="main">
    <div id="centred">
        <div class="card box_shadow_light">
            <span style="display: none" class="validated-eup invalid-eup"></span>
            <h1>{heading}</h1>
            <p style="border-left: 3px solid {message && message.length > 0 ? "red" : "transparent"}"> {message}</p>
            {#if isAlreadySignedIn}
                <p>You are already signed in.</p>
                <input type="submit" value="Sign Out" class="sign_out" on:click="{signOut}" />
                <input type="submit" value="Go Home" on:click="{goHome}" />
            {:else if displaySpinner}
                <div style="height: 120px">
                    <span style="position: absolute; left: 50%; transform: translateX(-50%);">
                        <LoadingSpinner color="royalblue"/>
                    </span>
                </div>
            {:else if display_successfull_signup}
                <p>Congratulations! You signed up successfully. Please check your inbox (especially your spamfolder) for an activation email.</p>
                <input type="submit" value="Log In" on:click="{logIn}" />
            {:else if isLogin}
                <form on:change="{validateLoginForm}" on:keyup="{validateLoginFormNotStrict}" on:submit="{submitLoginForm}">
            
                    <input type="text" placeholder="Email or Username" class="emailUsernamePassword box_shadow_light" bind:value="{uoe}" name="emailOrUsername" disabled={__di_str}/>
                    
                    <input type="password" placeholder="Password" bind:value="{password}" class="emailUsernamePassword box_shadow_light" name="password" disabled={__di_str}/>
                    <div class="width-80">
                        <label for="rememberMe">Stay Signed In for 60 days</label>
                        <input type="checkbox" bind:value="{rmbMe}" id="rememberMe" name="rememberMe" disabled={__di_str}/>
                    </div>
                    <div class="width-80">
                        <a href="signup">Sign up</a>
                        <a href="forgotpassword" style="float: right">Forgot password?</a>
                    </div>
                    <input type="submit" class="box_shadow_light" value="Log In" disabled={__btn_di_str}/>
                </form>
            {:else}
            <form on:change="{validateSignup}"  on:submit="{submitSignup}">
                <label for="email">Email (you will need to activate your account): </label>
                <input type="text" on:keyup="{validateSignupNotStrict}" placeholder="Email" id="email" class="emailUsernamePassword box_shadow_light {signup_classes['email']}" bind:value="{email}" name="email" disabled={__di_str}/>
                <label for="username">Username: </label>
                <input type="text" on:keyup="{validateSignupNotStrict}" placeholder="Username" id="username" class="emailUsernamePassword box_shadow_light {signup_classes['username']}" bind:value="{username}" name="username" disabled={__di_str}/>
                <label for="password">Password: </label>
                <input type="password" on:keyup="{validateSignupNotStrict}" placeholder="Password" id="password" bind:value="{password}" class="emailUsernamePassword box_shadow_light {signup_classes['password']}" name="password" disabled={__di_str}/>
                <label for="repeat_password">Repeat Password: </label>
                <input type="password" on:keyup="{validateSignupNotStrict}" placeholder="Repeat Password" id="repeat_password" bind:value="{password2}" class="emailUsernamePassword box_shadow_light {signup_classes['password2']}" name="password2" disabled={__di_str}/>
                <div class="width-80">
                    <p>Already have an account?</p>
                    <a href="login" style="float: right">Sign in instead</a>
                </div>
                <input type="submit" class="box_shadow_light {signup_classes['submit']}" value="Sign Up" disabled={__btn_di_str}/>
            </form>
            {/if}
        </div>
    </div>
</div>