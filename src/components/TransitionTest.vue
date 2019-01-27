<template>
  <TextFrame class="transition-screen">
<div>

    <transition name="slide">
      <div class="box red" v-if="scroll"></div>
    </transition>
</div>

<div>

    <transition name="slide">
      <div class="box green" v-if="!scroll"></div>
    </transition>
</div>

    <div class="continue" @click="scroll = !scroll">></div>
  </TextFrame>
</template>

<script>
import TextFrame from "./TextFrame";

export default {
    name: "TransitionScreen",
    components: {
        TextFrame
    },
    data: function() {
        return {
            scroll: true,
            messageText: "first message text STARTS here",
            messageText2: "This is the SECOND message "
        };
    },
    props: {
        // messageText: String
    }
};
</script>

<style scoped>
.transition-screen {
    height: 200px;
    position: relative;
    overflow: hidden;
    margin: 10px auto;
}

.continue {
    position: absolute;
    bottom: 10px;
    right: 10px;
    animation: blink 1.5s ease-in-out infinite alternate;
    cursor: pointer;
    transform: rotate(90deg);
}

.continue:hover {
    animation: none;
}

.message {
    position: relative;
    top: 0;
    border: solid red 1px;
}

.box {
    border: solid black 5px;
    height: 50px;
    width: 50px;
    box-sizing: border-box;
    position: relative;
    top: 0px;
}

.red {
    background: red;
}

.green {
    background: lime;
}

.slide-leave,
.slide-enter-to {
    top: 0px;
}

.slide-enter {
    top: 220px;
}

.slide-leave-to {
    top: -150px;
}

.slide-leave-active {
    transition: all 0.5s;
}
.slide-enter-active {
    transition: all 0.5s;
    transition-delay: 0.5s;
}

.scroll-away-enter {
    top: 125%;
    opacity: 0;
}
.scroll-away-leave-to {
    top: -25%;
    opacity: 0;
}

.scroll-away-enter-to,
.scroll-away-leave {
    top: 0;
    opacity: 1;
}

.scroll-away-enter-active {
    transition: all 1.25s ease-out;
}
.scroll-away-leave-active {
    transition: all 1s ease-out;
}
</style>
