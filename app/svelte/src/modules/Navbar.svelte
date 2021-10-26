<script> 
    import NavbarElement from "./NavbarElement.svelte";
    import Sidebar from "./Sidebar.svelte";

    let isBurgerMenu = false;
    let slotObject;

    let drawableElements = "";
    let burgerElements = "";


    window.addEventListener("resize", checkNavbar);
    window.addEventListener("load", checkNavbar);
    function checkNavbar (){


        drawableElements = "";
        burgerElements = "";
        let list = slotObject.children;
        let width = 0;
        Array.prototype.forEach.call(list, (child) => {
            width += child.getBoundingClientRect().width;
            if(child.style.float == "right"){
                drawableElements += child.outerHTML;
            }else{
                burgerElements += child.outerHTML;
            }
        });
        
        if((width + 50 > window.innerWidth)){
            if(!isBurgerMenu)
                isBurgerMenu = true;
        }else if(isBurgerMenu){
            isBurgerMenu = false;
        }
    }
    let isBurgerMenuOpen = false;
    function expandBurgerMenu() {
        console.log("Trying to expand burger menu..");
        if(isBurgerMenu && !isBurgerMenuOpen){
            isBurgerMenuOpen = true;
        }
    }

</script>



<style>
    div {
        padding: 10px;  
        width: 100%;
        padding: 0px;
        text-align: left;
        margin: 0px;
    }
    div :global(*){
        color: white;
        display: inline-block;
    }
    span{
        width: 100%;
    }

</style>


<head>
    
</head>

<div>
    {#if isBurgerMenu}
        <Sidebar bind:isOpened={isBurgerMenuOpen} transparentOverlay="{true}">{@html burgerElements}</Sidebar>
        <span bind:this="{slotObject}" style="visibility:hidden; position:absolute"><slot /></span>
        <NavbarElement on:click="{expandBurgerMenu}"><i class="fas fa-bars"></i></NavbarElement>
        {@html drawableElements}
    {:else}
        <span bind:this="{slotObject}"><slot /></span>
    {/if}
</div>
