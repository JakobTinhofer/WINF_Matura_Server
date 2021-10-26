<script>
    import { convertToBool } from "../../scripts/helpers";
    
    export let activeOpacity = "50%";
    export let secondsTransition = "1s";
    export let z_index = 1;



    let overlay_div;
    export let isActive = true;


    window.addEventListener("load", () => {
        set_state();
    });

    
    $: set_state(isActive);


    function set_state(state){
        console.log("Overlay set state to " + state);
        var bool = convertToBool(state);
        if(document.readyState === "complete" && overlay_div){
            if(bool){
                overlay_div.style.opacity = activeOpacity; 
            }else{
                overlay_div.style.opacity = "0%";
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


<div bind:this={overlay_div} style="transition: opacity {secondsTransition}; z-index: {z_index}"  />