<script>
import {getSitesWithFilter} from "../../../scripts/auth";
import SiteCard from "../../modules/SiteCard.svelte";


let sites = new Array();

async function getSites(){
    sites = (await getSitesWithFilter())[1];
}

getSites();

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

#menu_bar{
    padding: 20px;
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
</style>


    <h1 id="header">
        Sites
    </h1>
    <div id="menu_bar">
        <a href="create"><i class="fas fa-plus"></i> Create New Page</a>
    </div>
    <div id="pages_list">
    {#if sites && sites.length > 0}
        {#each sites as s, i}
            <SiteCard Site={s} />
        {/each}
    {:else}
        <p id="no_pages_found">No Sites Found.</p>
    {/if}
    </div>

