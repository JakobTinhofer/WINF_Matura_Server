<script>
import {getSitesWithFilter, getOwnUser, deleteSite, setCustomPath} from "../../../scripts/auth";
import SiteCard from "../../modules/SiteCard.svelte";
import Navbar from "../../modules/Navbar.svelte";
import {displayModal, displayModalAsync, displayStatusMessage} from "../../modules/StatusMessagesAndModals/MessageAndModalDisplayer.svelte";
import * as validator from '../../../../../common/validators'
import BreadCrumbs from "../../modules/BreadCrumbs.svelte"; 
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


function ds(id){
    displayModal({
        text: "Clicking on DELETE will remove your page. This action cannot be undone, so I hope you won't change your mind!",
        heading: "Are you sure?",
        buttons: [{text: "Cancel", color: "blue", closesModal: true},
                    {text: "DELETE", color: "red", float: "right", closesModal: true, returnValue: "delete_confirmed"}]
        },
        async (rv) => {
            
            if(rv[0] === "delete_confirmed"){
                let r = await deleteSite(id);
                if(r[0]){
                    displayStatusMessage("Successfully deleted site.", "green");
                }else{
                    displayStatusMessage("Error: " + r[1], "tomato");
                }
                getSites();
            }
        }
    );
    
}
/*
const illegalPaths = ["login", "signup", "security", "admin", "createsite", "deletesite", "addsite", "recover"];
const pathUnsaveChars = /[^a-zöäü0-9-_]/i;
function validateCustomPath(path){   
    if(!path || path.length < 4 || path.length > 128){
        return [false, "The custom path must be between 4 and 128 characters in length!"];
    }
    if(pathUnsaveChars.test(path)){
        return [false, "Please do not use any special chars in your path!"];
    }
    if(illegalPaths.includes(path.toLocaleLowerCase())){
        return [false, "This path is reserved."];
    }
    return [true];
}*/

async function sCustomPath(id){
    let r = await displayModalAsync({
        text: "Choose a new path. Please do not use any special chars!",
        heading: "Set Custom Path",
        fields: [{name: "path", validate: validator.validateCustomPath, placeholder: "cool_path_goes_here"}],
        buttons: [{text: "Cancel", color: "blue", closesModal: true},
                    {text: "Change Path", color: "green", float: "right", closesModal: true, returnValue: "do_change", requireAllValid: true}]
    });

    if(r && r[0] === "do_change"){
        const p = r[1].path.value;
        if(validator.validateCustomPath(p)[0] === true){
            let r = await setCustomPath(id, p);
            if(r[0]){
                displayStatusMessage("Successfully updated path!", "green");
                await getSites();
            }else{
                displayStatusMessage("Error: " + r[1]);
            }
        }else{
            displayStatusMessage("Your path is invalid! Please try again", "red");
        }
    }
}
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
    <BreadCrumbs>
    </BreadCrumbs>
    <div id="menu_bar">
        <Navbar basic_bg_color="royalblue" sidebar_width="80%">
            <div class="pdng">
                <a href="/pages/create"><i class="fas fa-plus"></i> Create New Page</a>
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
                <SiteCard Site={s} deleteSite={ds} {sCustomPath}/>
            {/if}
            
        {/each}
    {:else}
        <p id="no_pages_found">No Sites Found.</p>
    {/if}
    </div>

