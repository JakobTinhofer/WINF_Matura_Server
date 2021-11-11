
<script>
    import { createEventDispatcher } from 'svelte';
    export let opened = false;
    
    export let openOnClick = true;

    export let openOnHover = false;

    export let dd_color_on_open = "rgba(0, 0, 0, 0.7)";

    export let display = "block";

    const dispatch = createEventDispatcher();

    function clicked(event){
        updateddcheight();
        if(openOnClick){
            opened = !opened;
        }
        
        dispatch(event);
    }

    function mouseenter(event){
        updateddcheight();
        if(openOnHover && !opened){
            opened = true;
        }
        dispatch(event);
    }

    function mouseleave(event){
        if(openOnHover && opened){
            opened = false;
        }
        dispatch(event)
    }

    let ddc_visibility = "hidden";
    $: ddc_visibility = opened ? "visible" : "hidden";


    let expanded_ddc_height;

    let ddch;

    let dd_slot_content;

    $: ddch = opened ? String(expanded_ddc_height) + "px" : "0px";

    function updateddcheight(){
        
        let sc = dd_slot_content.children;
        let h = 0;

        Array.prototype.forEach.call(sc, (element) => {
            h += element.getBoundingClientRect().height;
        });

        expanded_ddc_height = h;
    }

</script>

<style>
    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content{
        position: absolute;
        background-color: #303030;
        color: white;
        min-width: 160px;
        overflow: hidden;
        height: 0px;
        transition: height 0.5s;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
        right: 0px !important;
        width: 150%;
        top: 100%;
    }

    .dropdown-content :global(*){
        width: 100% !important;
        display: block !important;
        padding-left: 0px !important;
        text-align: center;
        padding-right: 0px !important;
    }

    
 
</style>


<div class="dropdown" on:click="{clicked}" on:mouseenter="{mouseenter}" on:mouseleave="{mouseleave}">

    <span style="background-color: {opened ? dd_color_on_open : "transparent"}; transition: background-color 0.5s">
        <slot />
    </span>
    
    <div bind:this={dd_slot_content} class="dropdown-content" style="display: {display}; visibility: {ddc_visibility}; height: {ddch}">
        <slot name="dropdown-list-elems"/>
    </div>
    
</div>