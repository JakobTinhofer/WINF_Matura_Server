<script>
    import anime from 'animejs'
    import { onMount } from 'svelte';
    import { getRandomID } from '../../../scripts/helpers';
    export let text;
    export let color;
    export let ttl;
    export let id;
    export let onClose;
    let progress_bar;
    let sm;

    onMount(init);
    //IDK, onMount?
    function init(){
        setTimeout(() => {
            onClose(id);
        }, ttl);
        anime({
            targets: progress_bar, 
            width: '0%',
            duration: ttl,
            easing: 'linear'
        });
        setTimeout(() => {
            anime({
                targets: sm,
                translateX: '-200%',
                easing: 'easeOutElastic(1, .6)',
                duration: 800
            });

        }, ttl - 800);
    }

    
</script>

<style>
    p {       
        margin: 0px;
        padding: 20px 0px 20px 40px;
        max-width: 90%;
    }
    i{
        right: 0%;
        padding-right: 20px;
        
        transition: color 0.4s;
        top: 50%;
        position: absolute;
        transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -o-transform: translateY(-50%);
    }

    i:hover{
        color: rgb(255, 77, 77);
    }

    i, p{
        font-size: 20px;
        display: inline-block;
        color: white;
        
    }
    div{
        position: relative;
        margin-top: 10px;
        border-radius: 10px;
        display: block;
        width: 80%;
        margin-left: auto;
        margin-right: auto;
        box-shadow:
            2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
            6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
            12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
            22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
            41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
            100px 100px 80px rgba(0, 0, 0, 0.07);
        pointer-events: all;
    }

    span {
        background-color: white;
        width: 100%;
        position: absolute;
        bottom: 0%;
        left: 0%;
        opacity: 80%;
        height: 5px;
        border-radius: 10px;
    }
</style>


<div style="background-color: {color}" bind:this={sm}>
    <p>{text}</p>
    <i class="far fa-times-circle" on:click="{() => {
        onClose(id);
    }}"></i>
    <span bind:this="{progress_bar}"></span>
</div>