<template>
    <div class="topStyle">
        <b-card-group>
                <b-card border-variant = "dark" header-border-variant = "dark" header = "Autopilot actions"
                        header-bg-variant = "success" align = "center" 
                        style = "margin-left: 35%; margin-right: 35%; margin-top: 1%;">
                <b-card-text>Section for connecting to the drone and get different information</b-card-text>
            </b-card>
        </b-card-group>
        <div style = "display: flex; margin-left: 45.5%">
            <b-button v-if = "!connected" style = "margin: 1%; width: 15%" variant = "dark" 
            @click = "armDrone">ARM DRONE</b-button>
            <b-button v-if = "connected" style = "margin: 1%; width: 15%" variant = "dark" 
            @click = "disarmDrone">DISARM DRONE</b-button>
        </div>
        <div v-if = "connected" style = "display: flex; margin-left: 25%">
            <b-button pill style = "margin: 1%; width: 15%" variant = "info" 
            @click="takeOff">Take off to</b-button>
            <b-input-group style = "width: 15%; height: 15%; margin-top: 1%" 
            v-model="altitude" size = "md" append = "m">
                <b-form-input style = "width: 5%; height: 15%; margin-top: 1%" 
                placeholder = "Target altitude" v-model = "altitude" size = "md"></b-form-input>
            </b-input-group>
            <b-button pill style = "margin: 1%; width: 15%" variant = "info"
             @click = "getActualPosition">Get actual position</b-button>
            <b-input-group style = "width: 15%; height: 15%; margin-top: 1%" size = "md">
                <b-form-input disabled = "True" style = "width: 5%; height: 15%; margin-top: 1%" 
                v-model = "current_lat" size = "md"></b-form-input>
                <b-form-input disabled = "True" style = "width: 5%; height: 15%; margin-top: 1%" 
                v-model = "current_lng" size = "md"></b-form-input>
            </b-input-group>
        </div>
        <div v-if = "connected" style = "display: flex; margin-left: 25%">
            <b-button pill style = "margin: 1%; width: 15%" variant = "info" 
            @click = "getHeading">Get drone heading</b-button>
            <b-input-group style = "width: 15%; height: 15%; margin-top: 1%" 
            disabled = "True" size = "md" append = "º">
                <b-form-input style = "width: 5%; height: 15%; margin-top: 1%" 
                disabled = "True" v-model = "heading" size = "md"></b-form-input>
            </b-input-group>
            <b-button pill style = "margin: 1%; width: 15%" variant = "info" 
            @click = "goToPosition">Go to position</b-button>
            <b-input-group style = "width: 15%; height: 15%; margin-top: 1%" size = "md">
                <b-form-input style = "width: 5%; height: 15%; margin-top: 1%" 
                v-model = "goToLat" size = "md"></b-form-input>
                <b-form-input style = "width: 5%; height: 15%; margin-top: 1%" 
                v-model = "goToLng" size = "md"></b-form-input>
            </b-input-group>
        </div>
        <div v-if = "connected" style = "display: flex; margin-left: 25%">
            <b-button pill style = "margin: 1%; width: 15%" variant = "info" 
            @click = "getGroundSpeed">Get drone ground speed</b-button>
            <b-input-group style = "width: 15%; height: 15%; margin-top: 1%" 
            disabled = "True" size = "md" append = "m/s">
                <b-form-input style = "width: 5%; height: 15%; margin-top: 1%" 
                disabled = "True" v-model = "groundSpeed" size = "md"></b-form-input>
            </b-input-group>
            <b-button pill style = "margin: 1%; width: 30%; margin-top: 1%;" variant = "info" 
            @click = "returnToLaunch">Return to launch</b-button>
        </div>
        <div v-if = "connected" style = "display: flex; margin-left: 25%">
            <b-button pill style = "margin: 1%; width: 15%" variant = "info" 
            @click = "getCurrentAltitude">Get drone altitude</b-button>
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
        border: 5px solid red;
        height: 50%;
    }
</style>