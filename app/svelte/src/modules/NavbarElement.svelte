<script>
    let fs = "20px";
    export let float = "";

    export let bg_color = "rgba(0, 0, 0, 0)";

</script>



<style>
    div{
        padding: 30px;
        transition: background-color 1s;
        font-size: 2.5vw;
        margin: 0px;
        font-family: 'Roboto', sans-serif;
    }

    div:hover{
        background-color: rgba(0, 0, 0, 0.2);
    }
    
</style>



<div style="font-size: {fs}; {bg_color !== "rgba(0, 0, 0, 0)" ? "background-color: " + bg_color : ''}; float: {float}" on:click>
    <slot/>
</div>
