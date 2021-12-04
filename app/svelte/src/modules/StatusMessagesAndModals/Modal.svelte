<script>
    export let buttons = [];
    export let heading = "Placeholder heading";
    export let text = "Placeholder Text";
    export let headerColor = "royalblue";
    export let onClose = () => {};
</script>

<style>
    .modal_main{
        position: absolute;
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
        right: 5%;
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
        
        font-size: 20px;
        margin: 0px 5px;
    }

    .red_btn{
        background-color: red;
        color: white;
    }
    .red_btn:hover{
        background-color: tomato;
    }

    .green_btn{
        background-color: green;
        color: white;
    }
    .green_btn:hover{
        background-color: limegreen;
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
        {#if buttons && buttons.length > 0}
            <div class="button_bar">
                {#each buttons as b, i}
                    <button class="{b.color}_btn" style="float: {b.float ? b.float : ""}" on:click="{() => {
                            if(b.onClick !== undefined)
                                b.onClick(b.returnValue ? b.returnValue : i);
                            if(b.closesModal === true)
                                onClose(b.returnValue !== undefined ? b.returnValue : i);
                        }}">
                        {b.text}
                    </button>
                {/each}
            </div>
        {/if}
    </div>
    
</div>