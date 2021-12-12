<script>
    import Navbar from "../modules/Navbar.svelte";
    import NavbarElement from "../modules/NavbarElement.svelte";
    import Dropdown from "../modules/Dropdown.svelte";
    import {checkLoggedIn, logOut, getOwnUser} from "../../scripts/auth";
    import Overlay from "../modules/Overlay.svelte";

    let loggedIn;
    
    let sections = [];
    

    updateLoggedIn();
    updateUser();
    

    function setUser(val) { user = val}

    function handleAccountButtonClicked(btn, src){
        if(loggedIn){
            alert("Account page coming soon!");
        }else{
            window.location.pathname = "login";
        }
    }

    let user;

    function updateUser(){
        getOwnUser(true).then((res) => {user = res;}, (err) => {console.debug(err);});
    }

    function updateLoggedIn(){
        checkLoggedIn().then((res) => {loggedIn = res; updateUser();}, (err) => {console.debug(err);});       
    }

    function logOutClicked(){
        console.log("Clicked.");
        logOut().then((res) => {updateLoggedIn()}, ex => {console.debug(ex);})
    }

    function nav(elem){
        
    }

</script>

<style>
    * {
        margin: 0px;
    }
    .header{
        height: 100vh;
        background-color: royalblue;
        color: white;
        text-align: center;
        position: relative;
    }
    .header h1{
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 70px;
        transform: translate(-50%, -50%);
    }
    .fa-user{
        margin-right: 10px;
    }

    #generelle-infos{
        width: 60%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    #generelle-infos h1{
        font-family: 'Roboto', sans-serif;
        font-size: 30px;
        color: white;
        background-color: black;
        display: inline-block;
        padding: 5px;
        margin-bottom: 10px;
    }

    #generelle-infos p{
        font-size: 25px;
    }

    section{
        height: 100vh;
        scroll-snap-align: center;
        position: relative;
    }
    .nav{
        position: absolute;
        left: 50%;
        font-size: 40px;
        transition: 0.6s opacity;
        opacity: 30%;
    }

    .nav:hover{
        opacity: 100%;
    }

    .next{
        bottom: 0%;
        transform: translate(-50%, -105%);
    }

    .prev{
        top: 0%;
        transform: translate(-50%, +105%);
    }

    .parent{
        overflow: auto;
        width: 100vw;
        height: 100vh;
        scroll-snap-type: y mandatory;
        padding-right: 20px;
        
    }
    .parent section{
        width: 100vw;
    }
</style>

<svelte:head>
    <title>WINF Matura 2021/2022</title>
    <style>
        body{
            overflow: hidden;
        }
    </style>
</svelte:head>

<div class="parent">
    <section class="header">
        <Navbar>
            <svelte:fragment>
                <NavbarElement>About the Matura</NavbarElement>
                <NavbarElement>Topics</NavbarElement>
                <NavbarElement>More</NavbarElement>
                <NavbarElement on:click="{() => {window.location = "pages"}}">Pages</NavbarElement>
                {#if loggedIn}
                    <span style="float:right">
                        <Dropdown>
                            <NavbarElement>
                                <i class="fas fa-user"></i>
                                <p>{user !== undefined ? "Hallo " + user.username : "Account"}</p>
                            </NavbarElement>
                            <svelte:fragment slot="dropdown-list-elems">
                                <NavbarElement on:click="{logOutClicked}">Log Out</NavbarElement>
        
                                <NavbarElement>Account info</NavbarElement>
                            </svelte:fragment>
                        </Dropdown>
                    </span>   
                {:else}
                    <NavbarElement on:click={handleAccountButtonClicked} float="right"><i class="fas fa-user"></i><p>Log In</p></NavbarElement>
                {/if}
                
            </svelte:fragment>
        </Navbar>
        <h1>Matura in Informatics 2021/2022</h1>
        <i class="fas fa-chevron-down nav next" on:click={() => {nav(-1);}}></i>
    </section>
    <section>
        <i class="fas fa-chevron-up nav prev" style="color: black" on:click={() => {nav(1)}}></i>
        <div id="generelle-infos">
            <h1>A brief Overview of the Matura in Informatics 2021/2022</h1>
            <p>The Matura, also called Zentralmatura or SRDP, allows absolvents to attend universities and colleges.
             Normally taken by students after high school, the exam tests knowledge in 6 different subjects.
             While German, Mathematics and a living second language are required, the other 3 subjects can be chosen by the student.
             All questions from the exam are always from a few distinct topics.
             If you wanted to choose Informatics as one of your subjects, you might want to look at some preparation material first.
             This is what we hope to provide here.
            </p>
        </div>
        <i class="fas fa-chevron-down nav next" style="color: black" on:click="{() => {nav(-1)}}"></i>
    </section>
</div>