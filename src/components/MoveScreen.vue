<template>
  <div class="move-screen-container">
    <TextFrame class="move-screen">
        <MoveItem v-for="move in moves" :key="move.name" :move="move" @moveHover="moveHover"
        @moveLeave="resetDisplay" @useAttock="sendAttack"></MoveItem>
    </TextFrame>

    <TextFrame class="info-screen">
      <span class="info-stat">{{display.move}}</span>
      <span class="info-stat">TYPE/{{display.type}}</span>
      <span class="info-stat">PP {{display.pp}}/{{display.ppMax}}</span>
    </TextFrame>
  </div>
</template>

<script>
import MoveItem from "./MoveItem";
import TextFrame from "./TextFrame";

export default {
    name: "MoveScreen",
    components: {
        MoveItem,
        TextFrame
    },
    props: {
        moves: Array
    },
    methods: {
        moveHover: function(move) {
            this.display.move = move.name;
            this.display.type = move.type;
            this.display.pp = move.pp || "--";
            this.display.ppMax = move.ppMax || "--";
        },
        resetDisplay: function() {
            this.display.move = "----";
            this.display.type = "----";
            this.display.pp = "--";
            this.display.ppMax = "--";
        },
        sendAttack: function(move) {
            this.$emit("attack", move);
        }
    },
    data: function() {
        return {
            display: {
                type: "----",
                ppMax: "--",
                pp: "--",
                move: "----"
            }
        };
    }
};
</script>

<style>
.info-screen {
    height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 20px;
    text-transform: uppercase;
    width: 900px;
    box-sizing: border-box;
    position: absolute;
    top: -110px;
    opacity: 0.9;
    z-index: 1;
}
.info-stat {
    flex: 1;
    text-align: center;
}
.move-screen {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: space-around;
    width: 900px;
    height: 260px;
    box-sizing: border-box;
}
.move-screen-container {
    position: relative;
}
</style>
