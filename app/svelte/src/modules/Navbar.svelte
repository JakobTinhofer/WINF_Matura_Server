<script> 
    import NavbarElement from "./NavbarElement.svelte";
    import {convertToBool} from "../../scripts/helpers.js";
    import Sidebar from "./Sidebar.svelte";

    let isBurgerMenu = false;

    export let collapsed = false;
    export let collapse_on_overflow = true;
    export let minimum_distance = 50;

    export let basic_bg_color = "transparent";

    export let sidebar_width = "60vw";

    let navbar;
    let hidden_elems;
    let slotObject;

    let hidden_elem_display = "hidden";
    let hidden_elem_position = "absolute";


    if(collapse_on_overflow){
        window.addEventListener("resize", checkNavbar);
        window.addEventListener("load", checkNavbar);
    }

    $: setCollapsed(collapsed);
    

    let savedWidth = 0;

    function checkNavbar (){
        let list = slotObject.children;
        let width = 0;
        Array.prototype.forEach.call(list, (child) => {
            width += child.getBoundingClientRect().width;
        });
        if(!collapsed && (width + minimum_distance > window.innerWidth)){    
            collapsed = true;
            savedWidth = width;
        }else if(window.innerWidth > savedWidth + minimum_distance && collapsed){
            collapsed = false;
        }
    }

    function setCollapsed(col) {
        let bool = convertToBool(col);
        if(!slotObject){
            window.addEventListener("load", () => {
                checkNavbar();
            });
            return;
        }
        
        if(bool)
            collapseNavbar();
        else
            expandNavbar();
    }

    function collapseNavbar(){
        let list = slotObject.children;
        let childrenToMove = new Array();
        let w = 0;
        //Starting from 1 in order to skip the hidden elements span
        for(let i = 1; i < list.length; i++){
            if(list[i].style.float != "right"){
                childrenToMove.push(list[i]);
            }
            else{
                w += list[i].getBoundingClientRect().width;
            }
        }
        Array.prototype.forEach.call(childrenToMove, element => {
            slotObject.removeChild(element);
            document.getElementById("sidebar_content").appendChild(element);
        });

        hidden_elem_display = "visible";
        hidden_elem_position = "relative";
    }

    function expandNavbar(){
        let sidebar = document.getElementById("sidebar_content");
        //If this is the case, the state has not been changed yet.
        if(!sidebar.children || sidebar.children.length == 0)
            return;
        //remove exit button
        
        let list = sidebar.children;
        let childrenToAddBack = new Array();
        Array.prototype.forEach.call(list, (child) => {
            childrenToAddBack.push(child);
        });
        Array.prototype.forEach.call(childrenToAddBack, element => {
            sidebar.removeChild(element);
            slotObject.appendChild(element);
        });
        hidden_elem_display = "hidden";
        hidden_elem_position = "absolute";
    }

    let isBurgerMenuOpen = false;
    function expandBurgerMenu() {
        if(collapsed && !isBurgerMenuOpen){
            isBurgerMenuOpen = true;
        }
        
    }

</script>



<style>
    #navbar {
        padding: 10px;  
        width: 100%;
        padding: 0px;
        text-align: left;
        margin: 0px;
        font-size: 0px;
    }
    #navbar :global(*){
        color: white;
        display: inline-block;
    }
    #container{
        width: 100%;
    }

    #slotObject{
        width: 100%;
    }
</style>

 
<div bind:this="{navbar}" id="navbar">
    <div id="container">
        
        <span bind:this="{slotObject}" id="slotObject">
            <span bind:this={hidden_elems}  id="hidden_elems" style="visibility: {hidden_elem_display}; position: {hidden_elem_position}; width: auto; display: inline-block;">
                <Sidebar barWidth={sidebar_width} bind:isOpened={isBurgerMenuOpen} transparentOverlay="{true}"><span id="sidebar_content"/></Sidebar>
                <NavbarElement bg_color="{basic_bg_color}" on:click="{expandBurgerMenu}"><i class="fas fa-bars"></i></NavbarElement>
            </span>
            <slot />
        </span>
    </div>
    
    
</div>

