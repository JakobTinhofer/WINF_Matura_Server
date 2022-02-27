<script>
    import Card from "./Card.svelte";
    import Dropdown from "./Dropdown.svelte";
    import NavbarElement from "./NavbarElement.svelte";
    import { getRandomColor } from "../../scripts/helpers";
    import { getOwnUser } from "../../scripts/auth";
    import { displayStatusMessage } from "./StatusMessagesAndModals/MessageAndModalDisplayer.svelte";

    export let Site;
    export let deleteSite = () => {};
    export let sCustomPath = () => {};
    export let do_random_bg = true;
    let menubar;
    let user;
    let ta_w = "100%";

    function updateTAW(){
        ta_w = (menubar == undefined ? "100%" : ((menubar.clientWidth - 55) + "px"));
    }

    updateTAW();
    window.addEventListener("resize", updateTAW);


    function updateUser(){
        getOwnUser(true).then((res) => {user = res;}, (err) => {displayStatusMessage("Error: " + err, "red");});
    }
    updateUser();
    </script>
<!-- https://neumorphism.io/#e0e0e0 -->
<style>

    
    .card{
        display: inline-block;
        margin: 20px;
        transition: 0.4s;
        background-color: white;
        border-radius: 15px;
        min-width: 20vw;
        font-family: "Roboto", sans-serif;
        box-shadow: 0 1px 2px rgba(0,0,0,0.07), 
                0 2px 4px rgba(0,0,0,0.07), 
                0 4px 8px rgba(0,0,0,0.07), 
                0 8px 16px rgba(0,0,0,0.07), 
                0 16px 32px rgba(0,0,0,0.07), 
                0 32px 64px rgba(0,0,0,0.07);
    }

    .img {
        border-radius: 15px 15px 0px 0px ;        
        height: 250px;
        background-color: lightsalmon;
    }

    div p{
        margin: 0px;
        color: black;
        display: inline-block;
    }

    .menu-bar{
        display: block;
        position: relative;
        font-size: 30px;
        padding: 20px 0px 10px 10px;
    }

    .menu-bar i{
        transition: color 0.4s;
        font-size: 40px;
        color: rgb(100, 98, 98);
    }

    .menu-bar i:hover{
        color: black;
    }
    

    .card:hover{
        box-shadow: 0 1px 1px rgba(0,0,0,0.25), 
              0 2px 2px rgba(0,0,0,0.20), 
              0 4px 4px rgba(0,0,0,0.15), 
              0 8px 8px rgba(0,0,0,0.10),
              0 16px 16px rgba(0,0,0,0.05);
        background-color: whitesmoke;
    }

    .title_author{
        display: inline;
        overflow-x: hidden;
        margin-right: 36px;
        max-width: 93%;
    }

    .title{
        overflow: hidden;
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 85%;
    }

    .author{
        font-family: 'Roboto', sans-serif;
        font-size: 15px;
        display: inline;
        margin-left: 3px;
    }


    .title, .publicOrNot{
        font-family: BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    .publicOrNot{
        font-size: 20px;
        display: inline;
    }
    span{
        position: absolute;
        bottom: 50%;
        right: 5%;
        transform: translate(0, 50%);
    }
</style>


<div class="box_shadow_light card">
    <div class="img" on:click="{() => { window.location = "/" + Site.dir_path_end + "/"}}" style="{do_random_bg ? 'background-color:' + getRandomColor() : ''}"></div>
    
    <div class="menu-bar" bind:this="{menubar}">
        <div class="title_author">
            <p class="title" title={Site.title}>{Site.title}</p>
            <p style="color: {Site.isPublic ? 'green' : 'red'}" class="publicOrNot">{Site.isPublic ? 'public' : 'private'}</p>
            <p class="author">by {Site.author.username}</p>
            <p class="author" style="color: rgb(40,40,40);">Path: {Site.dir_path_end}</p>
        </div>
        
        <span>
            {#if user && Site.author.username === user.username}
                <Dropdown dd_color_on_open="transparent">
                    <i class="fas fa-ellipsis-v"></i>
                    <svelte:fragment slot="dropdown-list-elems">
                        <NavbarElement on:click="{window.location= "/pages/edit?id=" + Site.hex_id}">Edit</NavbarElement>
                        <NavbarElement on:click="{deleteSite(Site.hex_id)}">Delete</NavbarElement>
                        <NavbarElement on:click="{() => {sCustomPath(Site.hex_id);}}">Change Path</NavbarElement>
                    </svelte:fragment>
                </Dropdown>
            {:else}
            <i class="fas fa-ellipsis-v" style="color: rgb(200, 200, 200)"></i>
            {/if}
        </span>
    </div>
    
</div>