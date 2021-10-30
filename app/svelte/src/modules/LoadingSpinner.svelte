<!-- 
THESE SPINNERS ARE NOT DONE BY ME, BUT RATHER TAKEN FROM https://loading.io/css/.




-->






<script>
    import {convertToBool, getColorAnimID, getNextColor} from "../../scripts/helpers"


    export let spinner_type = "yt_rotator";
    export let animateColors = false;
    export let color = "#fff";
    export let change_interval = 1000; 

    let colorAnimID;

    let interval_id;

    $: set_state(animateColors);

    function set_state(state){
        let bool = convertToBool(state);

        if(bool){
            colorAnimID = getColorAnimID();
            interval_id = setInterval(() => {
                updateColor();
            }, change_interval);
        } else {
            if(interval_id){
                clearInterval(interval_id);
                interval_id = undefined;
            }
        }

        

    }

    function updateColor() {
        color = getNextColor(colorAnimID);
    }

</script>


<style>
    .lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transition: border-color 1s;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>

{#if spinner_type === "yt_rotator"}
    <div class="lds-ring">
        <div style ="border-color: {color} transparent transparent transparent !important;"></div>
        <div style ="border-color: {color} transparent transparent transparent !important;"></div>
        <div style ="border-color: {color} transparent transparent transparent !important;"></div>
        <div style ="border-color: {color} transparent transparent transparent !important;"></div>
    </div>
{/if}
