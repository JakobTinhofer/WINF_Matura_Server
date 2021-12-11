<script>
    import { convertToBool } from "../../scripts/helpers";
    
    export let activeOpacity = "50%";
    export let secondsTransition = "1s";
    export let z_index = 1;


    let opacity = "0%";
    export let isActive = true;


    window.addEventListener("load", () => {
        set_state(isActive);
    });

    
    $: set_state(isActive);


    function set_state(state){
        var bool = convertToBool(state);
        if(document.readyState === "complete"){
            if(bool){
                opacity = activeOpacity; 
            }else{
                opacity = "0%";
            }

        }

    }
    

    
</script>

<style>
    div{
        opacity: 0%;
        position:fixed;
        width: 100%;
        pointer-events: none;
        height: 100%;
        background-color: black;
    }
</style>


<div style="transition: opacity {secondsTransition}; z-index: {z_index}; opacity: {opacity}"  />