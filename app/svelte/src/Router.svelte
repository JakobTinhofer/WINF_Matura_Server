<script>
	import Main from "./pageTemplates/Main.svelte";
	import UserPage from "./pageTemplates/UserPage.svelte";
	import LoginSignup from "./pageTemplates/LoginSignup.svelte";

	import anime from "animejs/lib/anime.es.js";

	let active_page;
	export let maxDots = 3;
	export let interval = 500;
	export let oneDotAtATime = true;
	let animId = -1;
	let title = "Loading Page";
	let subtitle = "Sorry if this takes a bit.";
	let msg_color = "orange";
	let show_home_link = false;
	let routed = true;
	

	function startRouting(location){
		console.log("Location " + location)
		switch (location) {
			case "/login":
			case "/signup":
				active_page = LoginSignup;
				break;
			case "/loading":
				break;
			case "/":
			case "":
				active_page = Main;
				break;
			default:
				window.addEventListener("load",  () => {
					console.log(animId);
					if(animId != -1){
						clearInterval(animId);
					}
					Array.prototype.forEach.call(document.getElementsByClassName("animated-point"), elem => {
						elem.style.visibility  = "hidden";
					});
					title = "404: Page not found!";
					msg_color = "lightblue";
					subtitle = "Could not locate Page '" + location + "'. Did you misspell the url?";
					show_home_link = true;
				});
				return;	
		}

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

{#if active_page}
	<svelte:component this={ active_page }/>
	<script>
		//clearInterval({animId});
	</script>
{:else}
		<head>
			<title>{title}</title>
		</head>
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