<template>
    <div class = "leftStyle">
        <div style = "width: 70%; height: 13%; margin: 10px; margin-top: 1%; margin-left: 15%; border: 3px solid #000; background: #1380A1">
            <div style = "padding-bottom: 1px; margin-bottom: 2px; font-weight: bold; font-size: 17px; margin-left: 17%;">
                <h1>Camera actions</h1>
                <h5 style = "margin-left: -8%;">Section for getting an image or a video stream from the drone</h5>
            </div>
        </div>
        <div>
            <button class = "startStreamButton" style = "width: 30%; margin: 2%; margin-left: 18%" 
            @click = "startVideoStream">Start video stream</button>
            <button class = "stopStreamButton" style = "width: 30%; margin: 2%"
            @click = "stopVideoStream">Stop video stream</button>
        </div>
        <div style = "margin-left: 35%">
            <button class = "pictureButton" @click = "takePicture">Take a picture</button>
        </div>
        <div style = "display: flex">
            <div class = "buttonColumn">
                <button class = "button" style = "margin: 1%; background-color: cyan; width: 95%;" @click = "mode = 'gray'">Gray</button>
                <button class = "button" style = "margin: 1%; background-color: greenyellow; width: 95%;" @click = "mode = 'canny'">Canny</button>
                <button class = "button" style = "margin: 1%; background-color: yellow; width: 95%;" @click = "mode = 'normal'">Normal</button>
            </div>
            <div style ="width:70%">
                <canvas style = "margin-left: 10%; margin-top: 3%; margin-bottom: 3%; width: 500px; height: 400px; border-style: solid"
                id = "output"></canvas>
            </div> 
        </div>
    </div>
</template>

<script>
import { onMounted,defineComponent, inject, ref } from 'vue'
import * as cv from 'opencv.js'
export default defineComponent({
    setup () {
        let client = inject('mqttClient');
        let mode = ref ('normal');

        onMounted(() => {
            client.on('message', (topic, message) => {
                if ((topic == "cameraService/dashBoard/videoFrame") || (topic == "cameraService/dashBoard/picture")) {
                    const img = new Image();
                    img.src = "data:image/jpg;base64,"+message;
                    img.onload = () => {  
                        let dst;
                        if (mode.value == 'normal') {
                            dst = cv.imread(img);
                        }

                        if (mode.value == 'gray') {
                            let mat = cv.imread(img);
                            dst = new cv.Mat();
                            cv.cvtColor(mat, dst, cv.COLOR_RGB2GRAY,0);
                            mat.delete()
                        }

                        if (mode.value == 'canny') {
                            let mat = cv.imread(img);
                            dst = new cv.Mat();
                            cv.cvtColor(mat, dst, cv.COLOR_RGB2GRAY,0);
                            cv.Canny(mat, dst, 50, 100, 3, false);
                            mat.delete()
                        }
                        cv.imshow("output",dst);
                    };
                }
            })
        })
        
        function startVideoStream () {
            client.publish("dashBoard/cameraService/startVideoStream", "")
            client.subscribe("cameraService/dashBoard/videoFrame");
        }

         function stopVideoStream () {
            client.publish("dashBoard/cameraService/stopVideoStream", "")
        }

        function takePicture () {
            client.publish("dashBoard/cameraService/takePicture", "")
            client.subscribe("cameraService/dashBoard/picture")
        }
        
        return {
            startVideoStream,
            stopVideoStream,
            takePicture,
            client,
            mode
        }
    }
})
</script>
<style>
    
    .leftStyle {
        border: 5px solid black;
        background-color: #54d6c1;
    }
    
    .buttonColumn {
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding-top: 20px;
        height: 200px;
        width: 15%;
        border: 3px solid black;
        padding: 10px;
        border-radius: 25px;
        margin-top: 9%;
        margin-left: 5%;
    }

    .pictureButton{
        margin: 1.2%;
        width: 42%;
        padding: 10px 40px;
        border-radius: 50px;
        border: 0;
        background-color: yellow;
        box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-size: 15px;
        transition: all .5s ease;
        color: bold black;
        font-weight: bold;
    }

    .startStreamButton{
        margin: 1.2%;
        width: 42%;
        padding: 10px 40px;
        border-radius: 50px;
        border: 0;
        background-color: greenyellow;
        box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-size: 15px;
        transition: all .5s ease;
        color: bold black;
        font-weight: bold;
    }

    .stopStreamButton{
        margin: 1.2%;
        width: 42%;
        padding: 10px 40px;
        border-radius: 50px;
        border: 0;
        background-color: red;
        box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-size: 15px;
        transition: all .5s ease;
        color: bold black;
        font-weight: bold;
    }

    .pictureButton:hover {
        letter-spacing: 3px;
        background-color: rgb(25, 0, 255);
        color: hsl(0, 0%, 100%);
        box-shadow: blue 0px 7px 29px 0px;
    }

    .pictureButton:active {
        letter-spacing: 3px;
        background-color: hsl(261deg 80% 48%);
        color: hsl(0, 0%, 100%);
        box-shadow: rgb(93 24 220) 0px 0px 0px 0px;
        transform: translateY(10px);
        transition: 100ms;
    }

    .startStreamButton:hover {
        letter-spacing: 3px;
        background-color: blue;
        color: hsl(0, 0%, 100%);
        box-shadow: blue 0px 7px 29px 0px;
    }

    .startStreamButton:active {
        letter-spacing: 3px;
        background-color: hsl(261deg 80% 48%);
        color: hsl(0, 0%, 100%);
        box-shadow: rgb(93 24 220) 0px 0px 0px 0px;
        transform: translateY(10px);
        transition: 100ms;
    }

    .stopStreamButton:hover {
        letter-spacing: 3px;
        background-color: rgb(25, 0, 255);
        color: hsl(0, 0%, 100%);
        box-shadow: blue 0px 7px 29px 0px;
    }

    .stopStreamButton:active {
        letter-spacing: 3px;
        background-color: hsl(261deg 80% 48%);
        color: hsl(0, 0%, 100%);
        box-shadow: rgb(93 24 220) 0px 0px 0px 0px;
        transform: translateY(10px);
        transition: 100ms;
    }

    .button{
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
