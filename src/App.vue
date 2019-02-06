<template>
  <div id="app" class="hardware">
      <h1 class="title">Pika<img src="./assets/logo.png" class="logo" alt="V">ue</h1>

      <div class="inset">
        <PokeWorld class="screen"></PokeWorld>
      </div>

      <h1 class="title">Pika<img src="./assets/logo.png" class="logo" alt="V">ue</h1>
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
    align-items: center;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    box-sizing: border-box;
    justify-content: center;
}

.title {
    margin: 0;
    user-select: none;
    border: double var(--main-black) 7px;
    padding: 15px 5px;
    border-radius: 100px;
    font-size: 16px;
    margin: 0 auto;
    flex: 0;
    writing-mode: vertical-lr;
    text-orientation: upright;
    letter-spacing: 8px;
    filter: drop-shadow(-1px 1px rgba(255, 255, 255, 0.4));
}

.logo {
    width: 30px;
    margin: 0;
    padding: 0;
    filter: brightness(0.75) grayscale(0.75);
}

.inset {
    border: inset #7c797c 15px;
    border-radius: 50px;
    background-color: #a1c567;
    overflow: hidden;
    height: 900px;
    width: 1000px;
}

.screen {
    border-radius: 15px;
    height: 100%;
    flex: 1;
}

#app {
    font-family: "Press Start 2P", monospace;
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}
</style>
