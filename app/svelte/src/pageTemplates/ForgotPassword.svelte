<script>
    import Card from '../modules/Card.svelte';
    import LoadingSpinner from '../modules/LoadingSpinner.svelte';
    import { getURLParameters, isEmail } from '../../scripts/helpers';
    import {sendForgotPasswordRequest} from '../../scripts/auth';

    let action = "submitEmail";

    let urlParams = getURLParameters(window.location.search);

    let isValid = false;
    let disableStr = "";
    let email;
    let button_message = "Send Email"
    let input_class = "";
    let message = "Please enter your email to reset your password.";
    let page = "enterEmail";

    if(window.location.pathname === "/changepassword"){
        page = "setPassword";
        action = "submitPasswords";
    }


    function validateEmail(){
        if(isEmail(email.trim())){
            isValid = true;
            input_class = "valid";
        }else{
            isValid = false;
            input_class = "invalid";
        }
        console.log("Is Valid: " + isValid);
        return isValid;
    }

    function goEnterEmail() {
        page = "enterEmail";
    }

    async function doAction(){
        switch (action) {
            case "submitEmail":
                disableStr = "disabled";
                if(validateEmail()){
                    let res = await sendForgotPasswordRequest(email);
                    if(res[0]){
                        page = "emailBeenSent";
                        disableStr = "";
                    }else{
                        disableStr = "";
                        message = res[1];
                    }
                }
                break;
            case "submitPasswords":
                disableStr = "disabled";
                if(validatePasswords()){
                    
                }
                break;
            default:
                break;
        }
    }



    let password = "";
    let password2 = "";

    

    function validatePasswords(strict){
        message = "Set a new password";

        if(password.length < 4  || password.length > 256){
            isValid = false;
            message = "Your password needs to be between 4 and 256 characters in length.";
            return false;
        }

        if(password !== password2){
            isValid = false;
            message = "Your passwords do not match!";
            return false;
        }
        isValid = true;
        return true;
    }

    function validatePasswordsNonStrict(){
        validatePasswords("none");
    }

</script>

<style>


    #main {
        background-color: lightcoral;
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-align: center;
    }
    #centred {
        position:absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
    }
    h1 {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    input[type=submit]{
        width: 80%;
        margin: 20px 10%;
        background-color: grey  ;
        color: white;
        border-color: transparent;
        border-radius: 10px;
        font-size: 30px;
        transition: background-color 1s;
    }


    label {
        color: black;
        display: inline;
        width: 80% !important;
        margin: 20px 10%; 
    }

    .eup{
        width: 80%;
        padding: 20px 20px;
        margin: 20px 10%;
        box-sizing: border-box;
        border-radius: 10px;
        transition: 0.6s;
        background-color: lightgray;
    }


    .eup:hover{
        background-color: white;
    }

    .eup:focus{
        border-color: grey;
    }

    .valid{
        border: 3px solid green;
    }

    .valid:hover{
        border-color: lightgreen;
    }
        

    .invalid{
        border: 3px solid red;
    }
    .invalid:hover{
        border-color: darkred !important;
    }
    .invalid:focus{
        border-color: tomato !important;
    }

    .goBack{
        color: royalblue;
        font-size: 35px;
    }
</style>

{#if isValid || action !== 'submit'}
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


<div id="main">
    <div id="centred">
        <span style="display:none" class="valid invalid"><input id="hidden"/><label for="hidden"/></span>
        {#if page === "enterEmail"}
        <Card>
            <h1>{message}</h1>
            <input type="text" class="eup" placeholder="Email" bind:value="{email}" disabled={disableStr} on:keyup="{validateEmail}"/>
            <input type="submit" value={button_message} on:click="{doAction}" disabled={isValid ? disableStr : 'disabled'}/>
        </Card>
        {:else if page === "emailBeenSent"}
        <Card>
            <h1>If we have an account with that address, we will send you a link</h1>
            <p>The sent email is valid for 5 minutes. Please also check your spam folder.</p>
            <p on:click="{goEnterEmail}" class="goBack">Go back</p>
        </Card>
        {:else if page === "setPassword"}
            <Card>
                <h1>{message}</h1>
                <input type="password" class="eup" placeholder="Password" bind:value="{password}" disabled={disableStr} on:keyup="{validatePasswordsNonStrict}" on:change="{validatePasswords}"/>
                <input type="password" class="eup" placeholder="Confirm Password" bind:value="{password2}" disabled={disableStr} on:keyup="{validatePasswords}" on:change="{validatePasswords}"/>
                <input type="submit" value={button_message} on:click="{doAction}" disabled={isValid ? disableStr : 'disabled'}/>
            </Card>
        {:else if page === "checkingLink"}
            <h1>Trying to verify your link...</h1>
            <LoadingSpinner color="royalblue"/>
        {/if}
    </div>
</div>