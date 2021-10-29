<script>
import anime from "animejs";

import { escape_object } from "svelte/internal";


    let slot_div;
    let active_div;

    let outest_div;
    let innerZIndex;
    $: innerZIndex = outest_div ? outest_div.style.zIndex : '1';
    export let cardIndex = 0;
    let prev_index = cardIndex;
    export let default_transition = "fly:out:bot|fly:in:top";


    $: updateView(cardIndex, $$slots)

    let locked = false;
    let rerunsOnUnlocked = 0;

    async function updateView() {

        if(locked){
            rerunsOnUnlocked += 1;
            return;
        }
        locked = true;
        do {
            if(document.readyState !== "complete" || !slot_div){
                window.addEventListener("load", updateView);
                document.addEventListener("readystatechange", updateView);
                locked = false;
                return;
            }
            let slots = slot_div.children;
            let anims = default_transition.split("|");
            let active_chld = active_div.children[0];
            if(active_chld){
                await playAnimPromise(anims[0]);
                active_div.removeChild(active_chld);
                if(prev_index >= slots.length){
                    console.log("---> Appending child. Prev_index: " + prev_index + ", slots.length: " + slots.length);
                    slot_div.appendChild(active_chld);
                }else{
                    slot_div.insertBefore(active_chld, slots[prev_index]);
                }
                
            }
            
            let chldToMove;
            for(let i = 0; i < slots.length; i++){
                if(i === cardIndex){
                    chldToMove = slots[i];
                    break;
                }
            }
            slot_div.removeChild(chldToMove);
            active_div.appendChild(chldToMove);
            await playAnimPromise(anims[1]);
            prev_index = cardIndex;
        }while(rerunsOnUnlocked > 0 && (rerunsOnUnlocked -= 1))
        locked = false;
    }

    function playAnimPromise(animation){
        return new Promise(resolve => {
            play_anim(animation, (res) => {resolve(res)});
        });
    }

    function play_anim(animation, on_finished){

        let args = String(animation).toLocaleLowerCase().split(":");
        let params = {
            target: ".active_div",
            completed: on_finished,
        }
        switch(args[0]){
            case "fly":{
                params.duration = 1000;
                params.easing = 'easeOutElastic(1, .6)';
                if(args[1] === "in"){
                    if(args[1] === "bottom"){
                        active_div.style.transform = 'translate(-50%, +50%)';
                        params.translateY = "-100%";
                    }else if(args[1] === "top"){
                        active_div.style.transform = 'translate(-50%, -150%)';
                        params.translateY = "100%";
                    }else if(args[1] === "right"){
                        active_div.style.transform = 'translate(+50%, -50%)';
                        params.translateX = "-100%";
                    }else if(args[1] === "top"){
                        active_div.style.transform = 'translate(-150%, -50%)';
                        params.translateX = "100%";
                    }
                }else{

                }
                break;
            }
                
        }
        anime(params);
        console.log("Anim starting");
    }
</script>

<style>
    .outer {
        z-index: -100;
        width: 100%;
        height: 100%;
    }

    .slot_div{
        display: none;
    }
    .active_div{
        display: block !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
    }
</style>
<div bind:this={active_div} class="active_div">

</div>
<div bind:this="{outest_div}">
    <div class="outer">
        
    
       
    </div>
</div>
<div class="slot_div" bind:this={slot_div}>
    <slot/>
</div>

