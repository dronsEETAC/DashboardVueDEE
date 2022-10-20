<template>
    <div class="rightStyle">
        <div style = "width: 70%; height: 13%; margin: 5%; margin-top: 19%; margin-left: 17%; border: 3px solid #000; background: #1380A1">
            <div style = "padding-bottom: 1px; margin-bottom: 2px; font-weight: bold; font-size: 17px; margin-left: 17%;">
                <h1>LEDs actions</h1>
                <h5 style = "margin-left: 5%;">Section for controling the LEDs in the dron</h5>
            </div>
        </div>
        <div style = "display: flex; margin-left: 20%; margin-right: 20%">
            <button v-if = "connected" class = "button" style = "margin: 1%; width: 100%; margin-left: 10%; margin-right: 10%"
            @click = "startLedSequence">Start LEDs sequence</button>
            <button v-if = "!connected" class = "button" style = "margin: 1%; width: 100%; margin-left: 10%; margin-right: 10%; background-color: red;" 
            @click = "stopLedSequence">Stop LEDs sequence</button>
        </div>
        <div style = "display: flex; margin-left: 20%; margin-right: 20%">
            <button class = "button" style = "margin: 1%; width: 100%; margin-left: 10%" 
            @click = "startNsecondsLedSequence">Start N seconds LEDs secuence</button>
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

    .button{
        margin: 1%; 
        width: 20%;
        background-color: rgb(192, 191, 191);
        font-family: "Open Sans", sans-serif;
        font-size: 16px;
        letter-spacing: 2px;
        text-decoration: none;
        text-transform: uppercase;
        color: #000;
        cursor: pointer;
        border: 3px solid;
        padding: 0.25em 0.5em;
        box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px;
        position: relative;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
    }

    .button:active {
        box-shadow: 0px 0px 0px 0px;
        top: 5px;
        left: 5px;
    }

    @media (min-width: 768px) {
        .button {
            padding: 0.25em 0.75em;
        }
    }

</style>