<script>
import FileIcon from "../../modules/FileIcon.svelte";
import { createNewSite, getEditFields, checkLoggedIn, sendEditRequest, deleteSite } from "../../../scripts/auth";
import { getURLParameters } from "../../../scripts/helpers";
import MessageAndModalDisplayer, {displayModal, displayModalAsync, displayStatusMessage} from "../../modules/StatusMessagesAndModals/MessageAndModalDisplayer.svelte";
import { afterUpdate } from "svelte";

checkLoggedIn(null, "/pages");

const invalidChars = /[*|\",\/:<>?[\]{}`\\()';@&$]/;
let allowedFileTypes = [".jpg", ".jpeg", ".png", ".svg", ".html", ".css"]

let urlParams = getURLParameters(window.location.search);



let isEdit = window.location.pathname === "/edit";
let isValid = false; 
let disableInput = false;
let displaySuccessPage = false;


let files; 
let filesToRemove = new Array();



let title;
let title_valid = false;
let title_message;

$: if(displaySuccessPage) { displayStatusMessage("Success!", "green")}

let upload_msg = "Add Files";
let fileList = new Array();
let file_list_valid = false;
let alreadyUploadedFiles = new Array();
let file_upload_message;



let isPublic = false;



let startPage;
let startPage_message;
let startPage_valid = false;


let submit_message;





function setupEdit(){
    window.addEventListener("load", async () => {
        let r = await getEditFields(urlParams["id"]);
        if(r[0]){
            alreadyUploadedFiles = r[1]["files"];
            file_list_valid = true;
            
            title.value = r[1]["title"];
            title_valid = true;

            selectSetter = r[1]["start_file"];

            isPublic = r[1]["isPublic"];


            isValid = true;
        }

    });
    
}
let selectSetter;

afterUpdate(() => {
    if(selectSetter){
        startPage.value = selectSetter;
        selectSetter = undefined;
        validateSelect();
    }

});

if (isEdit) setupEdit();

function removeFile(index){
    if(disableInput)
        return;

    fileList.splice(index, 1);
    fileList = fileList;


    validateFiles();
    validateSelect();
}

function removeAlreadyUploadedFile(index) {
    if(disableInput)
        return;
    
    filesToRemove = filesToRemove.concat(alreadyUploadedFiles[index]);

    alreadyUploadedFiles.splice(index, 1);
    alreadyUploadedFiles = alreadyUploadedFiles;

    displayStatusMessage("Watch out! Removed files cannot be brought back! If you need this one, you might want to click Discard Changes.", "#ffa200")

    validateFiles();
    validateSelect();
}

//#region Validation

function onFilesAdded() {
    for (const e of files.files){
        let ext = "." + e.name.toLocaleLowerCase().split('.').pop();
        if(!allowedFileTypes.includes(ext)){
            if(!file_upload_message.includes("types"))
                file_upload_message = "Only these file types are allowed: " + allowedFileTypes.join(', ') + " File extention: " + ext;
        }else if(fileList.find(e2 => { return e2.name === e.name }) === undefined && !alreadyUploadedFiles.includes(e.fileName)){
            fileList.push(e);
            validateFiles();
            continue;
        }else if(!file_upload_message.includes("selected")){
            file_upload_message += "You already selected this file!";
            console.log(fileList.find(e2 => { return e2.name === e.name }) + " " + alreadyUploadedFiles.includes(e.fileName))
        }
                
        validateFiles(true);
    }
    
    fileList = fileList;
    
}


function validateFiles(silent){
    if(fileList.length + alreadyUploadedFiles.length > 0){
        if(!silent)
            file_upload_message = "";
        file_list_valid = true;
        return true;
    }else{
        if(!silent)
            file_upload_message = "You need to add some files!";
        file_list_valid = false;
        return false;
    }
}

function validateTitle(){
    title_message = ""
    if(title.value.length < 4){
        title_message = "Your title needs to be at least 4 characters long";
        title_valid = false;
        return false;
    }
    if(invalidChars.test(title.value.length)){
        title_message = "The title cannot contain any special characters.";
        title_valid = false;
        return false;
    }
    title_valid = true;
    return true;
}






function validateSelect(){
    
    if(!startPage)
        return;
    if(startPage.value !== "none"){
        startPage_valid = true;
        return true;
    }
    startPage_valid = false;
    return false;
}


function validateAll() {
    return validateFiles() && validateSelect() && validateTitle() && validateSelect();

}

//#endregion





let redirect;
async function onSubmit(e){
    if (e.preventDefault) e.preventDefault();

    if(validateAll()){
        disableInput = true;
        if(isEdit)
            submitEdit();
        else
            submitCreate();
        
    }
    disableInput = false;
    return false;
}

async function submitCreate(){

    let r = await createNewSite(title.value, fileList, isPublic, startPage.value);
    console.log(r[1]);
    if(r[0]){ 
        redirect = r[1];
        displaySuccessPage = true;
    }else{ 
        errorPrinting(r);
    }
}

function errorPrinting(r){
    switch(r[2]){
            case 0:
                title_valid = false;
                title_message = r[1];
                break;
            case 1:
                file_list_valid = false;
                file_upload_message = r[1];
                break;
            case 2:
                startPage_valid = false;
                startPage_message = r[1];
                break;
            default:
                submit_message = r[1];
                break;
    }
    displayStatusMessage(r[1], "red")
}

async function submitEdit(){
    let r = await sendEditRequest(urlParams["id"], title.value, fileList, filesToRemove, startPage.value, isPublic);
    if(r[0]){
        window.location = "pages";
    }else{
        errorPrinting(r);
    }
}

</script>

<style>

* {
    margin: 0px;
}

#header{
    text-align: center;
    padding: 80px;
    background-color: tomato;
}

#header h1{
    color: white;
    font-size: 6vw;
}

form {
    width: 80%;
    margin: 20px 10%;
}

input[type=text]{
        width: 100%;
        padding: 20px 20px;
        box-sizing: border-box;
        border-radius: 10px;
        transition: 0.6s;
        margin-bottom: 40px;
        margin-top: 10px;
        background-color: lightgray;
    }

input[type=text]:hover{
    background-color: white;
}

input[type=text]:focus{
    border-color: grey;
}

label:not(.custom_button, .checkbox_label), .bad_label{
    font-size: 30px;
    margin: 10px 0px;
}

.checkbox_label{
    display: inline;
    margin-right: 30px;
}

input[type=file]{
    display: none;
}

.custom_button {
    border: 0px solid transparent;
    padding: 14px;
    font-size: 20px;
    margin: 10px 0px;
    border-radius: 4px;
    background-color: royalblue;
    transition: background-color 0.4s;
    color: white;
    display: inline-block;
}

input[type=submit], a{
    border: 0px solid transparent;
    padding: 14px;
    font-size: 20px;
    margin: 60px 0px;
    border-radius: 4px;
    background-color: green;
    transition: background-color 0.4s;
    color: white;
    display: inline-block;
}

select{
    width: 100%;
    padding: 20px 20px;
    box-sizing: border-box;
    border-radius: 10px;
    transition: 0.6s;
    margin-bottom: 40px;
    margin-top: 10px;
    background-color: lightgray;
}

input[type=submit]:hover{
    background-color: rgb(20, 200, 20);
}

input[type=submit]:disabled{
    background-color: grey;
}

input[type=submit]:disabled:hover{
    background-color: grey;
}
.box_shadow_light{
        box-shadow:
            2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
            6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
            12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
            22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
            41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
            100px 100px 80px rgba(0, 0, 0, 0.07);
    }

.message{
    border-left: 3px solid transparent;
    transition: border-color 0.3s;
    padding: 4px;
}

.custom_button:disabled{
    background-color: grey !important;
}

.custom_button:disabled:hover{
    background-color: grey !important;
}

.custom_button:hover{
    background-color: lightskyblue;
}

#discard{
    margin-left: 10px;
    background-color: orangered !important;
    display: inline-block;
}

#discard:hover{
    background-color: orange !important;
}

#delete{
    margin-left: 10px;
    background-color: darkred !important;
}

#delete:hover{
    background-color: red !important;
}

#file_list{
    margin-bottom: 40px;
}
</style>


<svelte:head>
    <title>{isEdit ? "Edit a page" : "Create a new page"}</title>
</svelte:head>


{#if displaySuccessPage}
    <div id="header">
        <h1>{isEdit ? "Successfully edited page." : "Successfully created page."}</h1>
        <a href="{redirect}">Go To Site</a>
    </div>
{:else }
    <div id="header">
        <h1>{isEdit ? "Edit a page" : "Create a new page"}</h1>
    </div>

    <form on:submit="{onSubmit}">

        <label for="title">Title: </label>
        <p class="message" style="border-color: {title_message && title_message.length > 2 ? "red" : "transparent"};">{title_message && title_message.length > 2 ? title_message : "Enter a nice title for your page!"}</p>
        <input type="text" disabled={disableInput ? 'disabled' : ''} on:keyup="{validateTitle}" id="title" class="box_shadow_light" placeholder="Enter Page Title" bind:this="{title}"/>


        <p class="bad_label">Files: </p>
        <p class="message" style="border-color: {file_upload_message && file_upload_message.length > 2 ? "red" : "transparent"};">{file_upload_message && file_upload_message.length > 2 ? file_upload_message : "To add files to upload, click below."}</p>
        <div class="button_row">
            <label for="files" class="custom_button box_shadow_light">{upload_msg}</label>
            <button style="background-color: indigo;" on:click="{(event) => {event.preventDefault(); fileList = new Array(); file_list_valid = false; filesToRemove.concat(alreadyUploadedFiles); alreadyUploadedFiles = new Array();}}" class="custom_button box_shadow_light" disabled={(fileList.length + alreadyUploadedFiles.length) > 0 && !disableInput ? '' : 'disabled'}>Clear All</button>
        </div>
        
        <input type="file" disabled={disableInput ? 'disabled' : ''} id="files" accept="{allowedFileTypes.join(", ")}" placeholder="Enter Page Title" on:change="{onFilesAdded}" multiple bind:this="{files}"/>

        <div id="file_list">
            {#each fileList as f, i}
                <svelte:component this={FileIcon} fileName="{f.name}" onRemoveClicked="{removeFile}" thisIndex="{i}"/>
            {/each}
            {#if isEdit}
                {#each alreadyUploadedFiles as f, i}
                    <svelte:component this={FileIcon} fileName="{f}" clss="already_uploaded" onRemoveClicked={removeAlreadyUploadedFile} thisIndex={i}/>
                {/each}
            {/if}
        </div>

        <label for="isPublic" class="checkbox_label">Make this page public</label>
        <input type="checkbox" on:change="{() => {isPublic = !isPublic;}}" disabled={disableInput ? 'disabled' : ''} id="isPublic" value="{true}" checked={isPublic ? 'checked' : ''}/>
        <br>

        <label for="start_file" style="margin-top: 50px">Select your start page</label> 
        <p class="message" style="border-color: {startPage_message && startPage_message.length > 2 ? "red" : "transparent"};">{startPage_message && startPage_message.length > 2 ? startPage_message : "Select the page you want visitors to visit first!"}</p>
        <select class="box_shadow_light"  disabled={disableInput ? 'disabled' : ''} bind:this="{startPage}" id="start_file" on:change="{validateSelect}">
            <option value="none">None Selected</option>

            {#each fileList as f, i}
                {#if f.name.toLocaleLowerCase().split('.').pop() === "html"}
                    <option value = "{f.name}">{f.name}</option>
                {/if}
            {/each}
            {#each alreadyUploadedFiles as f, i}
                {#if f.toLocaleLowerCase().split('.').pop() === "html"}
                    <option value = "{f}">{f}</option>
                {/if}
            {/each}
        </select>

        <p class="message" style="border-color: {submit_message && submit_message.length > 2 ? "red" : "transparent"};">{submit_message && submit_message.length > 2 ? submit_message : ""}</p>
        
        <div class="button_row">
            <input type="submit" class="box_shadow_light" style="display:inline-block" value = "{isEdit ? "Save Changes" : "Create Page"}" disabled={title_valid && file_list_valid && startPage_valid && !disableInput ? '' : 'disabled'}/>
            {#if isEdit}
                <button class="box_shadow_light custom_button"
                    id="discard"
                    style="display:inline-block"
                    on:click="{(event) => {event.preventDefault();window.location = "pages";}}">Discard Changes</button>
                <button class="box_shadow_light custom_button"
                    id="delete"
                    style="display:inline-block"
                    on:click="{(event) => {
                        event.preventDefault();
                        displayModal({
                            text: "Clicking on DELETE will remove your page. This action cannot be undone, so I hope you won't change your mind!",
                            heading: "Are you sure?",
                            buttons: [{text: "Cancel", color: "blue", closesModal: true},
                                        {text: "DELETE", color: "red", float: "right", closesModal: true, returnValue: "delete_confirmed"}]},
                            async (rv) => {
                                if(rv[0] === "delete_confirmed"){
                                    let r = await deleteSite(urlParams["id"]);
                                    if(r[0]){
                                        window.location = "pages?sms=1";
                                    }else{
                                        displayStatusMessage("Error: " + r[1], "tomato");
                                    }
                                }
                            })
                        return false;
                        }}">Delete Page</button>
            {/if}
        </div>
    </form>

{/if}