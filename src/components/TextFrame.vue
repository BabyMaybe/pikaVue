<template>
  <div class="TextFrame">
    <slot></slot>
    <!-- <div class="ball tl"></div>
    <div class="ball tr"></div>
    <div class="ball bl"></div>
    <div class="ball br"></div>-->
  </div>
</template>


<script>
export default {
    name: "TextFrame"
};
</script>

<style>
.TextFrame {
    border: double black 14px;
    padding: 10px;
    border-radius: 3px;
    font-size: 32px;
    text-align: left;
    position: relative;
    width: 1000px;
    background: white;
}

.ball {
    position: absolute;
    height: 30px;
    width: 30px;
    border: solid black 4px;
    border-radius: 3px;
    overflow: hidden;
    background: black;
    transform: rotate(-45deg);
}

.ball::after {
    display: block;
    height: 50px;
    width: 50px;
    position: relative;
    bottom: -20%;
    left: -80%;
    background: white;
    content: "";
    transform: rotate(135deg);
}

.tl {
    top: -27px;
    left: -27px;
}

.tr {
    top: -27px;
    right: -27px;
}

.bl {
    bottom: -27px;
    left: -27px;
}

.br {
    bottom: -27px;
    right: -27px;
}
</style>
