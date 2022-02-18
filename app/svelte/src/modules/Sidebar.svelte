<script>
    import Overlay from "./Overlay.svelte";
    import { convertToBool } from "../../scripts/helpers";

    export let barWidth = "60vw";
    export let bg_color = "rgb(40,40,40)";

    export let transparentOverlay = true;

    export let isOpened = false;

    let bar;
    let overlay;


    $: set_state(isOpened);

    function set_state(open_or_not) {
        if(document.readyState !== "complete" || !bar){
            window.addEventListener("load", () => {
                set_state();
            });
            return;
        }
        let bool = convertToBool(open_or_not);
        if(bool){
            bar.style.width = barWidth;
        }else{
            bar.style.width = 0;
        }
    }

    function close() {
        if(isOpened)
            isOpened = false;
    }
</script>




<style>
    div{
        height: 100%; /* 100% Full-height */
        width: 0; /* 0 width - change this with JavaScript */
        position: fixed; /* Stay in place */
        z-index: 8; /* Stay on top */
        top: 0; /* Stay at the top */
        left: 0;
        background-color: #111; /* Black*/
        overflow-x: hidden; /* Disable horizontal scroll */
        transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
    }

    div :global(*) {
        display: block !important;
        width: 100% !important;
        padding-left: 0px !important;
        text-align: center;
        padding-right: 0px !important;
        overflow-x: hidden;
    }
    div i{
        padding: 20px 0px;
        font-size: 20px;
        transition: 0.3s;
        background-color: rgb(30, 30, 30);
        margin: 0px;
    }

    div i:hover{
        color: red !important;
        background-color: rgb(20, 15, 15);
    }
</style>

{#if {transparentOverlay}}
    <Overlay bind:this={overlay} isActive={isOpened} activeOpacity="50%" z_index="4"/>
{/if}
<div bind:this={bar} style="background-color: {bg_color}">
    <i class="fas fa-times-circle" style="color: {bg_color};" on:click="{close}"> </i>
    <slot></slot>
</div>