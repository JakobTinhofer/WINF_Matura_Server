<script>
    let fs = "20px";
    export let float = "";

    

    
</script>



<style>
    div{
        padding: 30px;
        transition: background-color 1s;
        background-color: rgba(0, 0, 0, 0);
        font-size: 2.5vw;
        margin: 0px;
        font-family: 'Roboto', sans-serif;
    }

    div:hover{
        background-color: rgba(0, 0, 0, 0.2);
    }
</style>


<div style="font-size: {fs}; float: {float}" on:click>
    <slot/>
</div>
