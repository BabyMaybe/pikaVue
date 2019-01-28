<template>
  <div id="app">
    <PokeWorld></PokeWorld>
  </div>
</template>

<script>
import PokeWorld from "./components/PokeWorld";

export default {
    name: "app",
    components: {
        PokeWorld
    }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Press+Start+2P");

body {
    margin: 0;
    padding: 0;
}

#app {
    font-family: "Press Start 2P", monospace;
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}
</style>
