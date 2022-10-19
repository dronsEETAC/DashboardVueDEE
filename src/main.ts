import { createApp } from 'vue'
import App from './App.vue'

import BootstrapVue3  from 'bootstrap-vue-3'
import  BootstrapVueIcons  from 'bootstrap-vue-3'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import mitt from 'mitt';
const emitter = mitt();

import * as mqtt from "mqtt"

const app = createApp(App)
app.provide('emitter', emitter); 
let client : mqtt.MqttClient;
try {
    client = mqtt.connect('mqtt://localhost:8083')
    client.on('connect', () => {
        console.log('Connection succeeded!');
        client.publish("dashBoard/gate/connectPlatform", "")
        app.provide('mqttClient', client);
    })
} catch (error) {
    console.log('mqtt.connect error', error)
}

app.use(BootstrapVue3)
app.use(BootstrapVueIcons)
app.mount('#app')