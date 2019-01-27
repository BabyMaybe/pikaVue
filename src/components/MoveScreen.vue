<template>
  <div>
    <TextFrame class="move-screen">
        <MoveItem v-for="move in moves" :key="move.name" :move="move" @moveHover="moveHover"
        @moveLeave="resetDisplay" @click.native="sendAttack(move)"></MoveItem>
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

class Move {
    constructor(params) {
        if (params) {
            this.name = params.move.name ? params.move.name : "----";
            this.power = params.move.power ? params.move.power : 0;
            this.type = params.move.type.name ? params.move.type.name : "----";
            this.damageClass = params.move.damage_class.name ? params.move.damage_class.name : "----";
            this.pp = params.move.pp ? params.move.pp : 0;
            this.accuracy = params.move.accuracy ? params.move.accuracy : 0;
        } else {
            this.name = "----";
            this.power = 0;
            this.type = "----";
            this.damageClass = "----";
            this.pp = 0;
            this.accuracy = 0;
        }
    }
}

export default {
    name: "MoveScreen",
    components: {
        MoveItem,
        TextFrame
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
            },
            moves: [
                new Move({
                    move: {
                        name: "tackle",
                        power: 40,
                        type: { name: "normal" },
                        damage_class: { name: "physical" },
                        pp: 35,
                        accuracy: 100
                    }
                }),
                new Move({
                    move: {
                        name: "thunder shock",
                        power: 40,
                        type: { name: "electric" },
                        damage_class: { name: "special" },
                        pp: 30,
                        accuracy: 100
                    }
                }),
                new Move({
                    move: {
                        name: "water gun",
                        power: 40,
                        type: { name: "water" },
                        damage_class: { name: "special" },
                        pp: 25,
                        accuracy: 100
                    }
                }),
                new Move()
            ]
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
    width: 100%;
    box-sizing: border-box;
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
    /* width: 100%;
    box-sizing: border-box; */
}
</style>
