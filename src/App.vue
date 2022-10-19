<template>
  <button v-if = "!connected" class = "myButtonConnect" @click = "toggle">Connect</button>
  <button v-if = "connected" class = "myButtonDisconnect" @click = "toggle">Disconnect</button>
  <div v-if = "connected" class ="main">
    <Top></Top>
    <div style = "display: flex">
      <Left style = "width: 50%"></Left>
      <Right style = "width: 50%"></Right>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, inject } from 'vue';
import Top from './components/Top_AutopilotActions.vue';
import Left from './components/Left_CameraActions.vue';
import Right from './components/Right_LEDsActions.vue';
export default defineComponent({
  name: 'App',
  components: {
    Top,
    Left,
    Right
  },
  setup () {
    let connected = ref (false);

    function toggle () {
      connected.value = !connected.value;
    }

    return {
      toggle,
      connected
    }
  }
});
</script>

<style>
  .main {
    height: 1100px;
  }
  .myButtonConnect {
    width : 80%;
    background-color: brown;
    color : white;
    margin-left: 10%;
    margin-bottom: 1%;
  }
  .myButtonDisconnect {
    width : 80%;
    background-color: rgb(77, 42, 165);
    color : white;
    margin-left: 10%;
    margin-bottom: 1%;
  }
</style>