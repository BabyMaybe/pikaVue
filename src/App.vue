<template>
  <div id="app">
      <BattleGround></BattleGround>
  </div>
</template>

<script>
import BattleGround from "./components/BattleGround";

export default {
    name: "app",
    components: {
        BattleGround
    }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Press+Start+2P");

#app {
    font-family: "Press Start 2P", cursive;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /* color: #2c3e50; */
    margin-top: 60px;
}
</style>
