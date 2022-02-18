<script>
    let path = window.location.pathname.substring(1);
    if(path[path.length - 1] == "/") path = path.substring(0, path.length - 1);
    let crmbs = path.split("/");

    let actPaths = [...crmbs];
    for(let i = 0; i < crmbs.length; i++){
        crmbs[i] = crmbs[i].toLocaleUpperCase()[0] + crmbs[i].toLocaleLowerCase().substring(1); 
    }
    
    console.log(crmbs);
    crmbs.pop();

    function getFullPath(index) {
        let path = "/";
        console.log(index);
        for(let i = 0; i <= index; i++){
            path += actPaths[i] + (i == index ? "" : "/");
        }
        return path;
    }
</script>

<style>
    a{
        text-decoration: none;
        color: white;
        transition: 0.5s;
    }
    div{
        padding: 12px 22px;
        position: absolute;
        top: 20px;
        right: 20px;
        border-radius: 12px;
        background-color: #333;
        margin: 4px 12px 4px 0px;
        transition: background-color 0.4s;
        box-shadow:
            2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
            6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
            12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
            22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
            41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
            100px 100px 80px rgba(0, 0, 0, 0.07);
    }   
    *{
        display: inline-block;
        transition: color 0.4s;
    }
    p{
        color: grey;
        font-style: bold;
        margin: 0px 4px;
    }
    a:hover{
        color: grey;
    }
</style>



<div><a href="/">Home</a>{#if crmbs.length > 0}{#each crmbs as c, i}<p>/</p><a href="{getFullPath(i)}">{c}</a>{/each}{/if}</div>

