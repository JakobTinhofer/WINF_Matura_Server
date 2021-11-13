<script>
import {getSitesWithFilter, getOwnUser} from "../../../scripts/auth";
import SiteCard from "../../modules/SiteCard.svelte";
import Navbar from "../../modules/Navbar.svelte";

let sites = new Array();

async function getSites(){
    sites = (await getSitesWithFilter())[1];
}

getSites();

let user;
let onlyMyPages = true;

function updateUser(){
    getOwnUser(true).then((res) => {user = res;}, (err) => {console.debug(err);});
}
updateUser();
</script>

<style>

*{
    margin: 0px;
}

#no_pages_found{
    margin: 50px;
    font-size: 40px;
}

#pages_list{
    display: block;
}

#header{
    text-align: center;
    padding: 50px;
    background-color: teal;
    color: white;
    font-size: 8vw;
}


#menu_bar input[type=checkbox]{
    display: inline !important;
    max-width: 20px;
}

#menu_bar label{
    display:inline !important;
    font-size: 20px;
    color: white;
}

#menu_bar a{
    border: 0px solid transparent;
    padding: 14px;
    font-size: 20px;
    border-radius: 4px;
    background-color: green;
    transition: background-color 0.4s;
    color: white;
    display: inline-block;
}

#menu_bar a:hover{
    background-color: darkgreen;
}

.pdng{
    padding: 20px;
}

#chck_bx{
    border: 0px solid transparent;
    padding: 14px;
    font-size: 20px;
    border-radius: 4px;
    background-color: royalblue;
    transition: background-color 0.4s;
    color: white;
    display: inline-block;
}
</style>


    <h1 id="header">
        Sites
    </h1>
    <div id="menu_bar">
        <Navbar basic_bg_color="royalblue" sidebar_width="80%">
            <div class="pdng">
                <a href="create"><i class="fas fa-plus"></i> Create New Page</a>
            </div>
            <div class="pdng" id="chck_bx">
                <label for="onlyMyPages">Only my pages:</label>
                <input type="checkbox" id="onlyMyPages" style="margin-left: 10px;" on:click="{() => {onlyMyPages = !onlyMyPages}}" checked/>   
            </div>
            
            
        </Navbar>
        
    </div>
    <div id="pages_list">
    {#if sites && sites.length > 0}
        {#each sites as s, i}
            {#if !onlyMyPages || !(user && s.author.username !== user.username)}
                <SiteCard Site={s} />
            {/if}
            
        {/each}
    {:else}
        <p id="no_pages_found">No Sites Found.</p>
    {/if}
    </div>

