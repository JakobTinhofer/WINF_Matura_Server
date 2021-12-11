<script>
    import Card from "./Card.svelte";
    import Dropdown from "./Dropdown.svelte";
    import NavbarElement from "./NavbarElement.svelte";
    import { getRandomColor } from "../../scripts/helpers";
    import { getOwnUser } from "../../scripts/auth";

    export let Site;
    export let deleteSite = () => {};
    export let sCustomPath = () => {};
    export let do_random_bg = true;

    let user;

    function updateUser(){
        getOwnUser(true).then((res) => {user = res;}, (err) => {console.debug(err);});
    }
    updateUser();
    </script>
<!-- https://neumorphism.io/#e0e0e0 -->
<style>

    
    .card{
        display: inline-block;
        margin: 20px;
        transition: 0.4s;
        width: 80vw;
        background-color: white;
        position: relative;
        border-radius: 15px;
        max-width: 400px;
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
        
        font-size: 30px;
        padding: 20px 0px 10px 10px;
    }

    .menu-bar i{
        transition: color 0.4s;
        font-size: 40px;

        padding: 10px 20px 10px 40px;
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
        display: inline-block;
        max-width: 60vw;
        overflow-x: hidden;
    }

    .title{
        display: inline-block;
        max-width: 15vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
</style>


<div class="box_shadow_light card">
    <div class="img" on:click="{() => { window.location = "/" + Site.dir_path_end + "/"}}" style="{do_random_bg ? 'background-color:' + getRandomColor() : ''}"></div>
    
    <div class="menu-bar">
        <div class="title_author">
            <p class="title" title={Site.title}>{Site.title}</p>
            
            <br>
            <p style="color: {Site.isPublic ? 'green' : 'red'}" class="publicOrNot">{Site.isPublic ? 'public' : 'private'}</p>
            <p class="author">by {Site.author.username}</p>
            <p class="author" style="color: rgb(40,40,40);">Path: {Site.dir_path_end}</p>
        </div>
        
        <span style="float:right;">
            
            {#if user && Site.author.username === user.username}
                <Dropdown dd_color_on_open="transparent">
                    <i class="fas fa-ellipsis-v"></i>
                    <svelte:fragment slot="dropdown-list-elems">
                        <NavbarElement on:click="{window.location= "edit?id=" + Site.hex_id}">Edit</NavbarElement>
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