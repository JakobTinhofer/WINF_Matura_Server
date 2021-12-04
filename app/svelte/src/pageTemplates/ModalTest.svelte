<script>
    import MessageAndModalDisplayer, {displayStatusMessage, displayModal, displayModalAsync} from "../modules/StatusMessagesAndModals/MessageAndModalDisplayer.svelte";
    displayStatusMessage("Hello, world!", "royalblue");
    displayStatusMessage("Error!", "tomato");
    dTestModal();


    async function dTestModal(){
        let rv = await displayModalAsync({
            text: "This is the text property.",
            heading: "This is the heading property.",
            buttons: [{text: "Green", color: "green", closesModal: true, float: "right", onClick: () => {console.log("Green button clicked")}},
                        {text: "Red", color: "red", closesModal: true, onClick: () => {console.log("Red button clicked")}}]
        });
        displayStatusMessage("Return Value: " + rv, "pink");
    }
</script>


<MessageAndModalDisplayer></MessageAndModalDisplayer>
<button on:click="{() => {displayStatusMessage("ASDASd", "green")}}">Add Status message!</button>
<button on:click={dTestModal}>Open Modal!</button>