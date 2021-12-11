<script>
    export let buttons = [];
    export let fields = [];
    export let heading = "Placeholder heading";
    export let text = "Placeholder Text";
    export let headerColor = "royalblue";
    export let onClose = () => {};


    let fieldValues = [];
    let fieldValid = [];

    let totalValid = false;
    function validChanged(){
        fieldValues = fieldValues;
        for(const v of fieldValid){
            if(v[0] !== true){
                totalValid = false;
                return;
            }
        }
        totalValid = true;
    }

    function getSubmissionValue(i, btn_ret){
        const btn_r = btn_ret !== undefined ? btn_ret : i;
        if(fields && fields.length > 0){
            var retObj = {};
            for(var i = 0; i < fields.length; i++){
                retObj[fields[i].name ? fields[i].name : "field_" + i] = {valid: fieldValid[i][0], value: fieldValues[i]};
            }
            return [btn_r, retObj];
        }
        return [btn_r];
    }
</script>

<style>
    .modal_main{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        z-index: 10;
    }
    i{
        float: right;
        color: white;
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transition: color 0.3s;
    }
    i:hover{
        color: red;
    }
    .head_bar{
        padding: 20px;
        position: relative;
        border-radius: 15px 15px 0px 0px;
    }
    .content_div{
        padding: 20px;
        background-color: white;
        border-radius:  0px 0px 15px 15px;
    }

    button{
        transition: background-color 0.4s;
        border-width: 0px;
        padding: 8px 15px;
        color: white;
        font-size: 20px;
        margin: 0px 5px;
    }

    button:disabled{
        background-color: grey;
    }

    

    .red_btn{
        background-color: red;
    }
    .red_btn:hover:not(:disabled){
        background-color: tomato;
    }

    .green_btn{
        background-color: green;
    }
    .green_btn:hover:not(:disabled){
        background-color: limegreen;
    }

    .blue_btn{
        background-color: royalblue;
    }
    .blue_btn:hover:not(:disabled){
        background-color: skyblue;
    }
    .invalid_msg{
        border-left: 3px solid red;
        padding: 5px;
    }
    input[type=text]{
        width: 100%;
        padding: 5px;
        border-radius: 3px;
        border: 1.5px solid grey;
    }
    .button_bar{
        margin-top: 15px;
    }
</style>



<div class="modal_main">
    <div class="head_bar" style="background-color: {headerColor}">
        <i class="far fa-times-circle" on:click="{() => {
            onClose();
        }}"></i>
    </div>
    <div class="content_div">
        <h2>{heading}</h2>
        <p>{text}</p>
        {#if fields && fields.length > 0}
            <div class="fields">
                {#each fields as f, i}
                    
                    <p class="invalid_msg" style="display: {fieldValid[i] && fieldValid[i][1] && fieldValid[i][1].length > 1 && !fieldValid[i][0] ? "block" : "none"}">{fieldValid[i] !== undefined ? fieldValid[i][1] : ' '}</p>
                    <input bind:value="{fieldValues[i]}" type="text" placeholder="{f.placeholder}" name="{f.name}" on:keyup="{() => {
                            var v = f.validate(fieldValues[i]);
                            if(v.length === 2)
                                fieldValid[i] = v; 
                            else
                                fieldValid[i] = [v[0], v[2]];
                            validChanged();
                        }}"/>
                {/each}
            </div>
        {/if}
        {#if buttons && buttons.length > 0}
            <div class="button_bar">
                {#each buttons as b, i}
                    {#if b.requireAllValid}
                    <button class="{b.color}_btn" disabled={totalValid ? '' : 'disabled'} style="float: {b.float ? b.float : ""}" on:click="{() => {
                            if(b.onClick !== undefined)
                                b.onClick(getSubmissionValue(i, b.returnValue)); 
                            if(b.closesModal === true)
                                onClose(getSubmissionValue(i, b.returnValue));
                        }}">
                        {b.text}
                    </button>
                    {:else}
                        <button class="{b.color}_btn" style="float: {b.float ? b.float : ""}" on:click="{() => {
                                if(b.onClick !== undefined)
                                    b.onClick(getSubmissionValue(i, b.returnValue));
                                if(b.closesModal === true)
                                    onClose(getSubmissionValue(i, b.returnValue));
                            }}">
                            {b.text}
                        </button>
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
    
</div>