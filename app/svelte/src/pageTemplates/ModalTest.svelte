<script>
    import MessageAndModalDisplayer, {displayStatusMessage, displayModal, displayModalAsync} from "../modules/StatusMessagesAndModals/MessageAndModalDisplayer.svelte";


    async function dTestModal(){
        let rv = await displayModalAsync({
            text: "This is the text property.",
            heading: "This is the heading property.",
            fields: [{name: "value1", validate: (val) => {return [val.length > 5 && val.length < 12, "Your input needs to be between 5 and 12 chars in length"]}, placeholder: "Placeholder"}],
            buttons: [{text: "Green", requireAllValid: true, color: "green", closesModal: true, float: "right", onClick: () => {console.log("Green button clicked")}},
                        {text: "Red", color: "red", closesModal: true, onClick: () => {console.log("Red button clicked")}}]
        });
        console.debug(rv);
        displayStatusMessage("Return Value: " + rv, "pink");
    }
</script>


<MessageAndModalDisplayer></MessageAndModalDisplayer>
<button on:click="{() => {displayStatusMessage("ASDASd", "green")}}">Add Status message!</button>
<button on:click={dTestModal}>Open Modal!</button>