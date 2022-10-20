<template>
    <div class="topStyle">
        <div style = "width: 33.3%; height: 18%; margin: 10px; margin-left: 33.3%; border: 3px solid #000; background: #1380A1; border-radius: 25px;">
            <div style = "padding-bottom: 1px; margin-bottom: 2px; font-weight: bold; font-size: 17px; margin-left: 15%;">
                <h1>Autopilot actions</h1>
                <h5 style = "margin-left: -9%;">Section for connecting to the drone and get different information</h5>
            </div>
        </div>
        <div style = "display: flex; margin-left: 43.5%;">
            <button v-if = "!connected" class = "armDisarmDroneButton" @click = "armDrone">ARM DRONE</button>
            <button v-if = "connected" class = "armDisarmDroneButton"  @click = "disarmDrone">DISARM DRONE</button>
        </div>
        <div v-if = "connected" style = "display: flex; margin-left: 16%">
            <button class = "averageButton" @click="takeOff">Take off to</button>
            <b-input-group style = "width: 15%; height: 15%; margin-top: 1%" 
            v-model="altitude" size = "md" append = "m">
                <b-form-input style = "width: 5%; height: 15%; margin-top: 1%" 
                placeholder = "Target altitude" v-model = "altitude" size = "md"></b-form-input>
            </b-input-group>
            <button class = "averageButton" @click = "getActualPosition">Get actual position</button>
            <b-input-group style = "width: 15%; height: 15%; margin-top: 1%" size = "md">
                <b-form-input disabled = "True" style = "width: 5%; height: 15%; margin-top: 1%" 
                v-model = "current_lat" size = "md"></b-form-input>
                <b-form-input disabled = "True" style = "width: 5%; height: 15%; margin-top: 1%" 
                v-model = "current_lng" size = "md"></b-form-input>
            </b-input-group>
        </div>
        <div v-if = "connected" style = "display: flex; margin-left: 16%">
            <button class = "averageButton" @click = "getHeading">Get drone heading</button>
            <b-input-group style = "width: 15%; height: 15%; margin-top: 1%" 
            disabled = "True" size = "md" append = "º">
                <b-form-input style = "width: 5%; height: 15%; margin-top: 1%" 
                disabled = "True" v-model = "heading" size = "md"></b-form-input>
            </b-input-group>
            <button class = "averageButton" @click = "goToPosition">Go to position</button>
            <b-input-group style = "width: 15%; height: 15%; margin-top: 1%" size = "md">
                <b-form-input style = "width: 5%; height: 15%; margin-top: 1%" 
                v-model = "goToLat" size = "md"></b-form-input>
                <b-form-input style = "width: 5%; height: 15%; margin-top: 1%" 
                v-model = "goToLng" size = "md"></b-form-input>
            </b-input-group>
        </div>
        <div v-if = "connected" style = "display: flex; margin-left: 16%">
            <button class = "averageButton" @click = "getGroundSpeed">Get drone ground speed</button>
            <b-input-group style = "width: 15%; height: 15%; margin-top: 1%" 
            disabled = "True" size = "md" append = "m/s">
                <b-form-input style = "width: 5%; height: 15%; margin-top: 1%" 
                disabled = "True" v-model = "groundSpeed" size = "md"></b-form-input>
            </b-input-group>
            <button class = "averageButton"  @click = "returnToLaunch">Return to launch</button>
        </div>
        <div v-if = "connected" style = "display: flex; margin-left: 16%">
            <button class = "averageButton" @click = "getCurrentAltitude">Get drone altitude</button>
            <b-input-group style = "width: 15%; height: 15%; margin-top: 1%" 
            disabled = "True" v-model = "currentAltitude" size = "md" append = "m">
                <b-form-input style = "width: 5%; height: 15%; margin-top: 1%" 
                disabled = "True" v-model = "currentAltitude" size = "md"></b-form-input>
            </b-input-group>
        </div>
    </div>
</template>

<script>
import { onMounted, defineComponent, ref, inject } from 'vue'
import Swal from 'sweetalert2'

export default defineComponent({

    setup () {
        const emitter = inject('emitter');
        let client = inject('mqttClient');
        let connected = ref(false);
        let altitude = ref(undefined);
        let current_lat = ref(undefined);
        let current_lng = ref(undefined);
        let heading = ref(undefined);
        let groundSpeed = ref(undefined);
        let currentAltitude = ref(undefined);
        let goToLat = ref(undefined);
        let goToLng = ref(undefined);
        let position = ref(undefined);

        onMounted(() => {
            client.on("message", function(topic, message){
                if (topic == "autopilotService/dashBoard/droneHeading") {
                    heading.value = message
                }

                if (topic == "autopilotService/dashBoard/dronePosition") {
                    position.value = message
                }

                if (topic == "autopilotService/dashBoard/droneAltitude") {
                    currentAltitude.value = message
                }
                
                if (topic == "autopilotService/dashBoard/droneGroundSpeed") {
                    groundSpeed.value = message
                }
            })
        })

        function armDrone(){
            connected.value = true
            client.publish("dashBoard/autopilotService/armDrone", "")
        }

        function disarmDrone(){
            connected.value = false
            client.publish("dashBoard/autopilotService/disarmDrone", "")
        }

        function takeOff(){
            Swal.fire('Heading to target altitude!')
            client.publish("dashBoard/autopilotService/takeOff", altitude.value)
        }

        function getActualPosition(){
            client.publish("dashBoard/autopilotService/getDronePosition")
            client.subscribe("autopilotService/dashBoard/dronePosition")
            let fromBytesToString = ref(undefined)
            fromBytesToString.value = new TextDecoder("utf-8").decode(position.value)
            let positionSplitted = fromBytesToString.value.split("*")
            current_lat.value = positionSplitted[0]
            current_lng.value = positionSplitted[1]   
        }

        function getHeading(){
            client.publish("dashBoard/autopilotService/getDroneHeading", "")
            client.subscribe("autopilotService/dashBoard/droneHeading")
        }

        function getGroundSpeed(){
            client.publish("dashBoard/autopilotService/getDroneGroundSpeed", "")
            client.subscribe("autopilotService/dashBoard/droneGroundSpeed")
        }

        function getCurrentAltitude(){
            client.publish("dashBoard/autopilotService/getDroneAltitude", "")
            client.subscribe("autopilotService/dashBoard/droneAltitude")
        }

        function goToPosition(){
            let positionStr = goToLat.value + "*" + goToLng.value
            client.publish("dashBoard/autopilotService/goToPosition", positionStr)
        }
        function returnToLaunch(){
            client.publish("dashBoard/autopilotService/returnToLaunch", "")
            Swal.fire('Returning to launch!')
        }

        function toggle () {
            connected.value = !connected.value;
        }

        return {
            toggle,
            takeOff,
            altitude,
            getActualPosition,
            current_lat,
            current_lng,
            getHeading,
            heading,
            getGroundSpeed,
            groundSpeed,
            getCurrentAltitude,
            currentAltitude,
            goToLat,
            goToLng,
            goToPosition,
            returnToLaunch,
            connected,
            armDrone,
            disarmDrone,
            emitter,
            client
        }
    }
})
</script>

<style>
    .topStyle {
        border: 5px solid black;
        height: 50%;
        background-color: #fafcaf;
    }

    .armDisarmDroneButton{
        margin: 1%; 
        width: 20%;
        background-color: white;
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

    .armDisarmDroneButton:active {
        box-shadow: 0px 0px 0px 0px;
        top: 5px;
        left: 5px;
    }

    @media (min-width: 768px) {
        .armDisarmDroneButton {
            padding: 0.25em 0.75em;
        }
    }

    .averageButton {
        margin: 1.2%;
        width: 22%;
        padding: 10px 40px;
        border-radius: 50px;
        border: 0;
        background-color: cyan;
        box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-size: 15px;
        transition: all .5s ease;
        color: bold black;
        font-weight: bold;
    }

    .averageButton:hover {
        letter-spacing: 3px;
        background-color: rgb(25, 0, 255);
        color: hsl(0, 0%, 100%);
        box-shadow: blue 0px 7px 29px 0px;
    }

    .averageButton:active {
        letter-spacing: 3px;
        background-color: hsl(261deg 80% 48%);
        color: hsl(0, 0%, 100%);
        box-shadow: rgb(93 24 220) 0px 0px 0px 0px;
        transform: translateY(10px);
        transition: 100ms;
    }

    h1 {
        margin-left: 17.5%;
    }


</style>