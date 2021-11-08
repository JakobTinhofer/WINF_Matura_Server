<script>
import FileIcon from "../../modules/FileIcon.svelte";
import { createNewSite } from "../../../scripts/auth";


let allowedFileTypes = [".jpg", ".jpeg", ".png", ".svg", ".html", ".css"]

let isEdit = window.location.pathname == "/edit"

let title;
let title_message;


let files; 
let fileList = new Array();
let isPublic = false;
let startPage;
let file_upload_message;

let isValid = false; 


let upload_msg = "Add Files";

let file_list_valid = false;
function validateFiles() {
    file_upload_message = "";
    for (const e of files.files){
        let ext = "." + e.name.toLocaleLowerCase().split('.').pop();
        if(!allowedFileTypes.includes(ext)){
            if(!file_upload_message.includes("types"))
                file_upload_message = "Only these file types are allowed: " + allowedFileTypes.join(', ') + " File extention: " + ext;
        }else if(fileList.find(e2 => { return e2.fileName === e.fileName && e2.size === e.size && e.lastModified === e.lastModified; }) === undefined){
            fileList.push(e);
            file_list_valid = true;
        }else if(!file_upload_message.includes("selected"))
            file_upload_message += "You already selected this file!";
    }
    
    fileList = fileList;
    
}


function removeFile(index){
    if(disableInput)
        return;

    fileList.splice(index, 1);
    fileList = fileList;
    if(fileList.length > 1)
        file_list_valid = true;
    else
        file_list_valid = false;
}

const invalidChars = /[*|\",\/:<>?[\]{}`\\()';@&$]/;

let title_valid = false;
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

let startPage_message;

let startPage_valid = false;

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

$: validateSelect(file_list_valid);

let disableInput = false;

let displaySuccessPage = false;
let redirect;
let submit_message;


async function onSubmit(e){
    if (e.preventDefault) e.preventDefault();

    if(validateTitle()){
        disableInput = true;

        if(fileList.length < 0){
            upload_msg = "Please attach at least one file.";
        }else if(startPage.value === "none"){
            startPage_message = "Please select a valid html file. If there are none, upload some!";
        }else{
            let r = await createNewSite(title.value, fileList, isPublic, fileList[Number(startPage.value)].name);
            console.log(r[1]);
            if(r[0]){ 
                redirect = "/api/sites/" + r[1] + "/";
                displaySuccessPage = true;
            }else{ 
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
            }
        }
    }
    disableInput = false;
    return false;
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

label:not(.custom-file-upload, .checkbox_label), .bad_label{
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

.custom-file-upload {
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

input[type=submit]{
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

.custom-file-upload:disabled{
    background-color: grey !important;
}

.custom-file-upload:disabled:hover{
    background-color: grey !important;
}

.custom-file-upload:hover{
    background-color: lightskyblue;
}

#file_list{
    margin-bottom: 40px;
}
</style>


<head>
    <title>{isEdit ? "Edit a page" : "Create a new page"}</title>
</head>




{#if displaySuccessPage}
    <div id="header">
        <h1>{isEdit ? "Successfully edited page." : "Successfully created page."}</h1>
        <a href="{redirect}">Go To {redirect}</a>
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
        <div id="button_row">
            <label for="files" class="custom-file-upload box_shadow_light">{upload_msg}</label>
            <button style="background-color: indigo;" on:click="{(event) => {event.preventDefault(); fileList = new Array(); file_list_valid = false;}}" class="custom-file-upload box_shadow_light" disabled={fileList.length > 0 && !disableInput ? '' : 'disabled'}>Clear All</button>
        </div>
        
        <input type="file" disabled={disableInput ? 'disabled' : ''} id="files" accept="{allowedFileTypes.join(", ")}" placeholder="Enter Page Title" on:change="{validateFiles}" multiple bind:this="{files}"/>

        <div id="file_list">
            {#each fileList as f, i}
                <svelte:component this={FileIcon} fileName="{f.name}" onRemoveClicked="{removeFile}" thisIndex="{i}"/>
            {/each}
        </div>

        <label for="isPublic" class="checkbox_label">Make this page public</label>
        <input type="checkbox" on:change="{() => {isPublic = !isPublic; console.log(isPublic)}}" disabled={disableInput ? 'disabled' : ''} id="isPublic" bind:value="{isPublic}"/>
        <br>

        <label for="start_file" style="margin-top: 50px">Select your start page</label>
        <p class="message" style="border-color: {startPage_message && startPage_message.length > 2 ? "red" : "transparent"};">{startPage_message && startPage_message.length > 2 ? startPage_message : "Select the page you want visitors to visit first!"}</p>
        <select class="box_shadow_light"  disabled={disableInput ? 'disabled' : ''} bind:this="{startPage}" id="start_file" on:change="{validateSelect}">
            <option value="none">None Selected</option>

            {#each fileList as f, i}
                {#if f.name.toLocaleLowerCase().split('.').pop() === "html"}
                <option value = "{i}">{f.name}</option>
                {/if} 
            {/each}
        </select>

        <p class="message" style="border-color: {submit_message && submit_message.length > 2 ? "red" : "transparent"};">{submit_message && submit_message.length > 2 ? submit_message : ""}</p>
        <input type="submit" class="box_shadow_light" style="display:block" value = "{isEdit ? "Save Changes" : "Create Page"}" disabled={title_valid && file_list_valid && startPage_valid && !disableInput ? '' : 'disabled'}/>
    </form>

{/if}