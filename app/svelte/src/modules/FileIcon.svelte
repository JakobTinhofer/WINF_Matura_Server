<script>

    export let fileName;

    export let onRemoveClicked;

    export let clss = "valid";

    export let thisIndex;

    function callOnRemoveClicked(){
        if(onRemoveClicked){
            if(thisIndex !== undefined){
                onRemoveClicked(thisIndex);
            }else{
                onRemoveClicked();
            }
        }
    }
</script>

<style>
    div{
        padding: 3px 14px;
        border-radius: 12px;
        color: white;
        margin: 4px 12px 4px 0px;
        transition: background-color 0.4s;
        box-shadow:
            2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
            6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
            12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
            22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
            41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
            100px 100px 80px rgba(0, 0, 0, 0.07);
    }   
    *{
        display: inline-block;
        transition: color 0.4s;
    }

    i:hover{
        color:red;
    }

    .valid{
        background-color: darkgreen;
    }

    .valid:hover{
        background-color: green;
    }

    .invalid{
        color:red;
    }

    .invalid:hover{
        color:darkred;
    }

    .already_uploaded{
        background-color: purple;
    }

    .already_uploaded:hover{
        background-color: rebeccapurple;
    }
</style>

<div class="{clss}">
    <p>{fileName}</p>
    <i class="far fa-times-circle" on:click="{callOnRemoveClicked}"></i>
</div>