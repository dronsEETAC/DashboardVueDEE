<template>
  <button v-if = "!connected" class = "myButtonConnect" @click = "toggle">Connect</button>
  <button v-if = "connected" class = "myButtonDisconnect" @click = "toggle">Disconnect</button>
  <div v-if = "connected" class ="main">
    <Top></Top>
    <Left></Left>
    <Right></Right>
  </div>
</template>

<script>
import { defineComponent, ref, inject } from 'vue';
import Top from './components/Top.vue';
import Left from './components/Left.vue';
import Right from './components/Right.vue';
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