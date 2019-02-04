<template>
  <div id="app" class="hardware">
      <h1 class="title">Pika<img src="./assets/logo.png" class="logo" alt="v">ue</h1>

      <div class="inset">
        <PokeWorld class="screen"></PokeWorld>
      </div>
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

:root {
    --main-black: #1b240f;
    --green-white: #d2e5b3;
}

body {
    margin: 0;
    padding: 0;
    color: var(--main-black);
}

.hardware {
    background-color: #aeab9d;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    box-sizing: border-box;
}

.title {
    margin: 0;
    padding: 0;
    position: absolute;
    top: 15px;
    user-select: none;
    border: double var(--main-black) 11px;
    padding: 15px 50px;
    border-radius: 100px;
    line-height: 1.5;
}

.logo {
    width: 50px;
    margin: 0;
    padding: 0;
}

.inset {
    border: inset #7c797c 25px;
    border-radius: 50px;
    background-color: #a1c567;
    overflow: hidden;
    height: 1000px;
    width: 1000px;
    max-width: 1000px;
    max-height: 1000px;
}

.screen {
    border-radius: 15px;
    height: 100%;
}

#app {
    font-family: "Press Start 2P", monospace;
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}
</style>
