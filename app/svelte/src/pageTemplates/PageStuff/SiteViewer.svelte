<script>
import { getSiteByPath } from '../../../scripts/auth';


let path = "/api/sites" + location.pathname;

let siteTitle = "Loading...";

let site; 
async function getSite() 
{
    let res = await getSiteByPath(location.pathname.substr(1).split("/")[0]);
    if(res[0]){
        site = res[1];
        siteTitle = site.title;
    }
}
getSite();

</script>

<style>

div{
    height: 100%;
    overflow: hidden;
}

iframe{
    margin: 0px;
    width: 100%;
    height: 100%;
    padding: 0px;
    border-radius: 0px;
    border: none;
}

</style>


<svelte:head>
    <title>{siteTitle}</title>
</svelte:head>
<div>
    <iframe src="{path}" title="site"/>
</div>
