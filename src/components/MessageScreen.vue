<template>
  <TextFrame class="message-screen">
    <transition name="scroll-away">
      <span class="message" v-if="scroll">{{messageText}}</span>
    </transition>
    <div class="continue" @click="nextMessage">></div>
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
            scroll: true
        };
    },
    props: {
        messageText: String
    },
    methods: {
        nextMessage: function() {
            this.scroll = false;
            this.$emit("nextClicked");
        }
    },
    watch: {
        messageText: function() {
            setTimeout(() => {
                this.scroll = true;
            }, 500);
        }
    }
};
</script>

<style>
.message-screen {
    height: 260px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
}

.continue {
    position: absolute;
    bottom: -14px;
    right: 7px;
    animation: blink 3s ease-in-out infinite alternate;
    cursor: pointer;
    transform: rotate(90deg);
    user-select: none;
}

.p {
    bottom: 50px;
    transform: rotate(0);
    animation: none;
}
.continue:hover {
    animation: none;
}
.message {
    position: relative;
    top: 0;
}

.scroll-away-enter {
    top: 125%;
}
.scroll-away-leave-to {
    top: -25%;
}

.scroll-away-enter-to,
.scroll-away-leave {
    top: 0;
}

.scroll-away-leave-active,
.scroll-away-enter-active {
    transition: all 0.1s ease-out;
}
</style>
