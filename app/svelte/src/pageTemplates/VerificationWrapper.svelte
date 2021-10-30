<script>
    import {convertToBool, getURLParameters, isEmail} from "../../scripts/helpers";
    import {tryVerifyAccount, resendVerificationEmail} from "../../scripts/auth";
    import Card from "../modules/Card.svelte";
    import LoadingSpinner from "../modules/LoadingSpinner.svelte";

    let urlParams = getURLParameters(window.location.search);

    window.addEventListener("load", async () => {
        if(!urlParams['secret'] || urlParams['secret'].length < 5){
            status = "failed";
            message = "The secret was not provided or is not valid. Have you clicked the right link?";
        }

        let res = await tryVerifyAccount(urlParams["secret"]);
        if(res[0] === true){
            message = res[1];
            status = "success";
            action = "go log in";
        }else{
            message = res[1];
            status = "failed";
            action = "resend";
        }
    });

    let status = "verifying";
    let action = "go home";
    let message;
    let button_message;
    let __btn_di_str;
    $: __btn_di_str = disableInput || !isValid ? "disabled" : "";

    $: updateButtonMSG(action);

    function updateButtonMSG(){
        if(action === "go home"){
            button_message = "Home"
        }else if(action === "go log in"){
            button_message = "Log In";
        }else if(action === "resend"){
            button_message = "Resend Verification";
        }
    }

    let disableInput = false;

    function doAction(){
        if(action === "go home"){
            window.location="/";
        }else if(action === "go log in"){
            window.location = "/login";
        }else if(action === "resend"){
            message = "";
            status = "resend";
            action = "submit";
        }else if(action === "submit"){
            disableInput = true;
            if(validateEmail('strict')){
                
                message = "If this email exists in our system, we will send an activation link.";
                action = "go home";
                status = "success";
                resendVerificationEmail(activation_input);
                return;
            }
            disableInput = false;
        }
    }

    let activation_input = "";

    let isValid = false;
    let input_class = "";



    function validateEmail(strict){

        
        
        if(!strict || strict !== 'none')
            activation_input = activation_input.trim();
        
        if(isEmail(activation_input)){
            isValid = true;
            message = "";
            input_class = "valid";
        }
        else{
            isValid = false;
            if(!strict || strict !== 'none'){
                input_class = "invalid";
                message = "Please enter a valid email.";
            }else{
                input_class = "";
            }
        }
        return isValid;
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

    input[type=text]{
        width: 80%;
        padding: 20px 20px;
        margin: 20px 10%;
        box-sizing: border-box;
        border-radius: 10px;
        transition: 0.6s;
        background-color: lightgray;
    }

    input[type=text]:hover{
        background-color: white;
    }

    input[type=text]:focus{
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
        {#if status === "verifying"}
            <Card>
                <h1>Verifying...</h1>
                <div style="height: 120px">
                    <span style="position: absolute; left: 50%; transform: translateX(-50%);">
                        <LoadingSpinner color="green"/>
                    </span>
                </div>
            </Card>
        {:else if status === "failed"}
            <Card>
                <h1>Failed to activate account.</h1>
                <h2>{message}</h2>
                <input type="submit"  on:click="{doAction}" value="{button_message}" />
            </Card>
        {:else if status === "success"}
            <Card>
                <h1>{message}</h1>
                <input type="submit"  on:click="{doAction}" value="{button_message}" />
            </Card>
        {:else if status === "resend"}
            <Card>
                <h1>Resend your activation email</h1>
                <label for="email">{message && message.length > 1 ? message: 'Enter your email'}</label>
                <input id="email" type="text" bind:value="{activation_input}" class="{input_class}" disabled = '{disableInput ? 'disabled' : ''}' on:keyup="{validateEmail}" on:change="{validateEmail}" on:keydown="{validateEmail}"/>
                <input type="submit" on:click={doAction} value="Resend Verification"/>
            </Card>
        {/if}
    </div>
</div>