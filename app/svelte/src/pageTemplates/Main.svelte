<script>
    import Navbar from "../modules/Navbar.svelte";
    import NavbarElement from "../modules/NavbarElement.svelte";
    import Dropdown from "../modules/Dropdown.svelte";
    import {checkLoggedIn, logOut, getOwnUser} from "../../scripts/auth";
    import Overlay from "../modules/Overlay.svelte";

    let loggedIn;
    

    

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
</script>

<style>
    * {
        margin: 0px;
    }
    .header{
        background-color: royalblue;
        color: white;
        text-align: center;
        padding:  0px 0px 20vw 0px ;
    }
    .header h1{
        margin-top: 10vw;
        font-size: 6vw;
    }
    .fa-user{
        margin-right: 10px;
    }
</style>

<head>
    <title>WINF Matura 2021/2022</title>
</head>


<div class="header">
    <Navbar>
        <svelte:fragment>
            <NavbarElement>Home</NavbarElement>
            <NavbarElement>Blog</NavbarElement>
            <NavbarElement>About</NavbarElement>
            {#if loggedIn}
                <span style="float:right">
                    <Dropdown>
                        <NavbarElement>
                            <i class="fas fa-user"></i>
                            <p>{user !== undefined ? "Hello " + user.username : "Account"}</p>
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
    <h1>Hello, Traveler</h1>
</div>