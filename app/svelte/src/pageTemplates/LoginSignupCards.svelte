
<script>
    import CardViewer from "../modules/CardViewer.svelte";
    import Card from "../modules/Card.svelte";
    
    function nextCard(){

    }
</script>


<style>
    #main {
        background-color: lightblue;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }


</style>


<div id="main"on:click="{nextCard}">
    <div id="centred" >
        <CardViewer>
            <Card>
                <h1>Card number 1</h1>
                <p>This is the first card</p>
            </Card>
            <Card>
                <h1>Card number 2</h1>
                <p>This is the second card</p>
            </Card>
        </CardViewer>
    </div>
</div>