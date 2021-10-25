<script> 
    import NavbarElement from "./NavbarElement.svelte";

    let isBurgerMenu = false;
    let slotObject;

    let drawableElements = "";

    window.addEventListener("resize", checkNavbar);
    window.addEventListener("load", checkNavbar);
    function checkNavbar (){


        drawableElements = "";
        let list = slotObject.children;
        let width = 0;
        Array.prototype.forEach.call(list, (child) => {
            width += child.getBoundingClientRect().width;
            if(child.style.float == "right"){
                drawableElements += child.outerHTML;
            }
        });
        
        if((width > window.innerWidth) && !isBurgerMenu){
            isBurgerMenu = true;
        }else if(isBurgerMenu){
            isBurgerMenu = false;
        }
    }

    function expandBurgerMenu() {
        
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
        <span bind:this="{slotObject}" style="visibility:hidden; position:absolute"><slot /></span>
        <NavbarElement on:click="{expandBurgerMenu}"><i class="fas fa-bars"></i></NavbarElement>
        {@html drawableElements}
    {:else}
        <span bind:this="{slotObject}"><slot /></span>
    {/if}
</div>
