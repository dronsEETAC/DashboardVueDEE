<template>
    <div class="rightStyle">
        <!-- <b-card-group>
                <b-card border-variant = "dark" header-border-variant = "dark" header = "LEDs actions"
                        header-bg-variant = "success" align = "center" 
                        style = "margin-left: 30%; margin-right: 30%; margin-top: 22%; margin-bottom: 2%; border: 3px solid black">
                <b-card-text>Section for controling the LEDs in the drone</b-card-text>
            </b-card>
        </b-card-group> -->
        <div style = "width: 70%; height: 15%; margin: 5%; margin-top: 19%; margin-left: 15%; border: 3px solid #000; background: #1380A1">
            <div style = "padding-bottom: 1px; margin-bottom: 2px; font-weight: bold; font-size: 17px; margin-left: 17%;">
                <h1>LEDs actions</h1>
                <h5 style = "margin-left: -8%;">Section for controling the LEDs in the dron</h5>
            </div>
        </div>
        <div style = "display: flex; margin-left: 25%; margin-right: 25%">
            <b-button v-if = "connected" pill style = "margin: 1%; width: 100%; margin-left: 10%; margin-right: 10%"
            variant = "info" @click = "startLedSequence">Start LEDs sequence</b-button>
            <b-button v-if = "!connected" pill style = "margin: 1%; width: 100%; margin-left: 10%; margin-right: 10%" 
            variant = "danger" @click = "stopLedSequence">Stop LEDs sequence</b-button>
        </div>
        <div style = "display: flex; margin-left: 25%; margin-right: 25%">
            <b-button pill style = "margin: 1%; width: 100%; margin-left: 10%" variant = "info" 
            @click = "startNsecondsLedSequence">Start N seconds LEDs secuence</b-button>
            <b-input-group style = "width: 30%; height: 15%; margin-top: 1%; margin-right: 10%" size = "md">
                <b-form-input style = "width: 5%; height: 15%; margin-top: 1%" v-model = "seconds" size = "md"></b-form-input>
            </b-input-group>
        </div>
    </div>
</template>

<script>
import { inject, ref } from 'vue'

export default {
  setup() {
    let client = inject('mqttClient');
    let userList = ref([]);
    const emitter = inject('emitter');
    let seconds = ref(undefined);
    let connected = ref(true);

    function startLedSequence(){
        connected.value = false
        client.publish("dashBoard/LEDsService/startLEDsSequence", "")
    }

    function startNsecondsLedSequence(){
        client.publish("dashBoard/LEDsService/LEDsSequenceForNSeconds", seconds.value)
    }

    function stopLedSequence(){
        connected.value = true
        client.publish("dashBoard/LEDsService/stopLEDsSequence", "")
    }

    return {
        startLedSequence,
        startNsecondsLedSequence,
        stopLedSequence,
        connected,
        seconds,
        client
    };
  },
}
</script>

<style>
    .rightStyle {
        border-style: solid;
        border-color: black;
        background-color: #ffe1ae;
    }

</style>