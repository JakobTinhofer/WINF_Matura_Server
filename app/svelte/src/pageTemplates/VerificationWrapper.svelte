<script>
    import {convertToBool, getURLParameters} from "../../scripts/helpers";
    import {tryVerifyAccount} from "../../scripts/auth";
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
    h2 {

    }
</style>

<div id="main">
    <div id="centred">
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
            </Card>
        {:else if status === "success"}
            <Card>
                <h1>{message}</h1>
            </Card>
        {/if}
    </div>
</div>