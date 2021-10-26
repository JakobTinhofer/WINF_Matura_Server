<script>
    import Navbar from "../modules/Navbar.svelte";
    import NavbarElement from "../modules/NavbarElement.svelte";
    import {checkLoggedIn} from "../../scripts/auth";
    import Overlay from "../modules/Overlay.svelte";

    let loggedIn = false;
    checkLoggedIn().then((res) => {loggedIn = res;}, (err) => {console.debug(err);});
    function handleAccountButtonClicked(btn, src){
        if(loggedIn){
            alert("Account page coming soon!");
        }else{
            window.location.pathname = "login";
        }
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
        <NavbarElement>Home</NavbarElement><NavbarElement>Blog</NavbarElement><NavbarElement>About</NavbarElement><NavbarElement float="right" on:click="{handleAccountButtonClicked}"><i class="fas fa-user"></i>
            {#if loggedIn}
                <p>Account</p>
            {:else}
                <p>Log In</p>
            {/if}
        </NavbarElement>
    </Navbar>
    <h1>Hello, Traveler</h1>
</div>