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
    background-color: yellow;
    margin-left: 10%;
    margin-bottom: 1%;
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

  .myButtonConnect:active {
    box-shadow: 0px 0px 0px 0px;
    top: 5px;
    left: 5px;
  }

  @media (min-width: 768px) {
    .myButtonConnect {
      padding: 0.25em 0.75em;
    }
  }

  .myButtonDisconnect {
    width : 80%;
    background-color: blueviolet;
    margin-left: 10%;
    margin-bottom: 1%;
    font-family: "Open Sans", sans-serif;
    font-size: 16px;
    letter-spacing: 2px;
    text-decoration: none;
    text-transform: uppercase;
    color: black;
    cursor: pointer;
    border: 3px solid;
    padding: 0.25em 0.5em;
    box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  .myButtonDisconnect:active {
    box-shadow: 0px 0px 0px 0px;
    top: 5px;
    left: 5px;
  }

  @media (min-width: 768px) {
    .myButtonDisconnect {
      padding: 0.25em 0.75em;
    }
  }
</style>