<template>
    <div class = "leftStyle">
        <b-card-group>
            <b-card border-variant = "dark" header-border-variant = "dark" header = "Camera actions"
                    header-bg-variant = "success" align = "center" style = "margin-left: 35%; margin-right: 35%; margin-top: 1%;">
                <b-card-text>Section for getting an image of video stream from the drone</b-card-text>
            </b-card>
        </b-card-group>
        <div>
            <b-button style = "width: 20%; margin: 2%; margin-left: 29%" 
            @click = "startVideoStream" variant = "success">Start video stream</b-button>
            <b-button style = "width: 20%; margin: 2%" @click = "stopVideoStream" 
            variant = "warning">Stop video stream</b-button>
        </div>
        <div>
            <b-button style = "width: 20%; margin-left: 40%" @click = "takePicture" variant = "danger">Take a picture</b-button>
        </div>
        <div style = "display: flex;">
            <div class = "buttonColumn">
                <b-button style = "margin: 1%" @click = "mode = 'gray'" variant = "info">Gray</b-button>
                <b-button style = "margin: 1%" @click = "mode = 'canny'" variant = "success">Canny</b-button>
                <b-button style = "margin: 1%" @click = "mode = 'normal'" variant = "warning">Normal</b-button>
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
}
.buttonColumn {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-top: 20px;
  height: 200px;
  width: 15%;
  border: 3px solid purple;
  padding: 10px;
  border-radius: 25px;
  margin-top: 9%;
  margin-left: 5%;
}
</style>
