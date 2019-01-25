<template>
  <TextFrame class="message-screen">
    <transition name="scroll-away">
      <span class="message" v-if="scroll">{{messsageText}}</span>
    </transition>
    <div class="continue" @click="scroll = !scroll">></div>
  </TextFrame>
</template>

<script>
import TextFrame from "./TextFrame";

export default {
  name: "MessageScreen",
  components: {
    TextFrame
  },
  data: function() {
    return {
      scroll: true,
      messsageText: "Wild CHARMANDER appeared!"
    };
  }
};
</script>

<style>
.message-screen {
  height: 200px;
  position: relative;
  overflow: hidden;
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
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
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
