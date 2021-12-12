<script>
	import Main from "./pageTemplates/Main.svelte";
	import LoginSignup from "./pageTemplates/LoginSignup.svelte";
	import VerificationWrapper from "./pageTemplates/VerificationWrapper.svelte";
	import ForgotPassword from "./pageTemplates/ForgotPassword.svelte";
	import CreateOrEditPage from "./pageTemplates/PageStuff/CreateOrEditPage.svelte";
	import ViewPages from "./pageTemplates/PageStuff/ViewPages.svelte";
	import SiteViewer from "./pageTemplates/PageStuff/SiteViewer.svelte";
	import { checkSiteVisible } from "../scripts/auth";
	import { getURLParameters, displayPredefinedSMs } from "../scripts/helpers";
	import MessageAndModalDisplayer, {displayStatusMessage} from "./modules/StatusMessagesAndModals/MessageAndModalDisplayer.svelte";
	import anime from "animejs/lib/anime.es.js";
	import ModalTest from "./pageTemplates/ModalTest.svelte";

	let active_page;
	export let maxDots = 3;
	export let interval = 500;
	export let oneDotAtATime = true;
	let animId = -1;
	let title = "Loading Page";
	let subtitle = "Sorry if this takes a bit.";
	let msg_color = "orange";
	let show_home_link = false;
	let routed = false;
	
	let CustomPaths = [];

	window.addEventListener("load", () => {
		let params = getURLParameters(window.location.search);
		if(params["sms"]){
			displayPredefinedSMs(params["sms"], displayStatusMessage);
		}
	});
	

	export function addCustomPath (path, page){
		CustomPaths[path] = page;
	}
	export function removeCustomPath(path, page) {
		CustomPaths[path] = null;
	}

	function startRouting(location){
		switch (String(location).toLocaleLowerCase()) {
			case "/login":
			case "/signup":
				active_page = LoginSignup;
				break;
			case "/verify":
				active_page = VerificationWrapper;
				break;
			case "/loading":
				return;
			case "/":
			case "":
				active_page = Main;
				break;
			case "/edit":
			case "/create":
				active_page = CreateOrEditPage;
				break;
			case "/forgotpassword":
			case "/changepassword":
				active_page = ForgotPassword;
				break;
			case "/pages":
				active_page = ViewPages;
				break;
			case "/smtest":
				active_page = ModalTest;
				break;
			default:
				handleUnknown(location);
				break;	
		}
		routed = true;
		if(animId != -1){
			clearInterval(animId);
			animId = -1;
		}
		window.addEventListener("load", () => {
			if(animId != -1){
				clearInterval(animId);
				animId = -1;
			}
		});
	}


	async function handleUnknown(location){
		if(CustomPaths[location] !== undefined){
			active_page = CustomPaths[location];
			return;
		}
		if(await checkSiteVisible(location) === true){
			active_page = SiteViewer;
			return;
		}

		Array.prototype.forEach.call(document.getElementsByClassName("animated-point"), elem => {
			elem.style.visibility  = "hidden";
		});
		title = "404: Page not found!";
		msg_color = "lightblue";
		subtitle = "Could not locate Page '" + location + "'. Did you misspell the url?";
		show_home_link = true;
	}

	window.addEventListener("load", startAnimation);
	startRouting(window.location.pathname);

	
	let pointsHTML = "";
	for(let i = 0; i < maxDots; i++){
		pointsHTML += '<span id="point-' + i + '" class="animated-point" style="opacity:100%; transition: opacity 1s;">.</span>'
	}

	function startAnimation(event, elsem) {
		if(routed) return;
		var elems = [];
		var dots =  maxDots - 1;
		for(let i = 0; i < maxDots; i++){
			elems[i] = document.getElementById("point-" + i); 
		}
		function animateDots(){
			if(routed) {
				clearInterval(animId);
				return;
			}
			if((dots == maxDots - 1 &&  oneDotAtATime) || (dots == maxDots && !oneDotAtATime))
				dots = 0;
			else
				dots += 1;
			for(let i = 0; i < maxDots; i++){
				if(i < dots && !oneDotAtATime){
					elems[i].style.opacity = "100%";
				}else{
					elems[i].style.opacity = "0%";
				}
			}
			if(oneDotAtATime)
				elems[dots].style.opacity = "100%";
		}
		animId = setInterval(animateDots, interval);
	}
	
</script>

<style>
	*{
		text-align: center;
	}
	h1{
		font-size: 80px;
	}
	h2{
		font-size: 40px;
	}
	div{
		position: absolute;
  		top: 40%;
		width:100%;
  		-ms-transform: translateY(-50%);
  		transform: translateY(-50%);
	}

	a{
		position: relative;
		text-decoration: none;
		font-weight: 600;
		color: orange;
		margin: 50px;
		font-size: 40px;
	}

</style>
<svelte:head>
	{#if active_page}
		<title>{title}</title>
	{/if}
</svelte:head>
<MessageAndModalDisplayer/>
{#if active_page}
	<svelte:component this={ active_page }/>
	{#if animId != -1}
		<script>
			clearInterval({animId});
		</script>
	{/if}
{:else}
		
		<body>
			<div>
				<h1 style="color: {msg_color}">{title} {@html pointsHTML}</h1>
				<h2>{subtitle}</h2>
				{#if show_home_link}
					<a href="/">Go home</a>
				{/if}
			</div>
			
			
		</body>
{/if}