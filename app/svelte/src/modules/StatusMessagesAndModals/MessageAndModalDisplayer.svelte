

<script context="module">
    import { getRandomID } from "../../../scripts/helpers"; 
    let nonReactiveSM;
    let callOnSMChanged;

    export function displayStatusMessage (text, color, ttl = 10000) {
        if(!nonReactiveSM)
            nonReactiveSM = [];
        let id = getRandomID();
        nonReactiveSM[id] = {text: text, color: color, ttl: ttl, id: id};
        onSMUpdated();
    }

    let modal;
    let onModalChanged;
    let callback;

    export function displayModal (params, cb){
        if(modal !== undefined){
            closeModal();
        }

        modal = params;
        callback = cb;
        if(onModalChanged)
            onModalChanged();
    }


    export function displayModalAsync(params){
        return new Promise(resolve => {
            displayModal(params, rv  => resolve(rv));
        })
    }

    export function closeModal(rv){
        modal = undefined;
        onModalChanged();
        if(callback)
            callback(rv);
    }

    function onStatusMessageClose(id){
        nonReactiveSM[id] = undefined;
        onSMUpdated();
    }
    
    function onSMUpdated(){
        if(callOnSMChanged)
            callOnSMChanged();
    }

</script>

<script>
    import { onMount, setContext } from 'svelte';
    import { text } from "svelte/internal";
    import StatusMessage from './StatusMessage.svelte';
    import Modal from './Modal.svelte';
    import Overlay from '../Overlay.svelte';
    let statusMessages = nonReactiveSM;
    let rModal = modal;

    callOnSMChanged = function () {
        statusMessages = nonReactiveSM;
    };
    onModalChanged = function () {
        rModal = modal;
    };
</script>

<style>
    .statusMsgs{
        padding: 5px;
        position: fixed;
        top: 0%;
        width: 95%;
        pointer-events: none;
    }
</style>
{#if rModal !== undefined}
    <Overlay/>
    <Modal text="{rModal.text}" heading="{rModal.heading}" fields={rModal.fields} buttons="{rModal.buttons}" headerColor="{rModal.headerColor}" onClose="{closeModal}"/>
{/if}

    
<div class="statusMsgs">
    {#if statusMessages && statusMessages.length > 0}
        {#each Object.entries(statusMessages) as m, i}
            {#if m[1]}
                <StatusMessage text="{m[1].text}" color={m[1].color} ttl={m[1].ttl} id="{m[0]}" onClose={onStatusMessageClose}/>
            {/if}
        {/each}
    {/if}
</div>

