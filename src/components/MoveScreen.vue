<template>
    <div>
        <TextFrame class="info-screen">
            <span>{{display.move}}</span>
            <span > TYPE/{{display.type}}</span>
            <span>PP {{display.pp}}/{{display.ppMax}}</span>
        </TextFrame>
    <TextFrame class="move-screen" >
        <MoveItem @moveHover="moveHover" @mouseLeave="resetDisplay" move="Tackle" type="Normal" :pp=35 />
        <MoveItem @moveHover="moveHover" @mouseLeave="resetDisplay" move="Thundershock" type="Electric" :pp=25 />
        <MoveItem @moveHover="moveHover" @mouseLeave="resetDisplay" move="Water Gun" type="Water" :pp=10 />
        <MoveItem @moveHover="moveHover" @mouseLeave="resetDisplay"  />
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
            test: 123
        };
    }
};
</script>

<style>
.info-screen {
    height: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 20px;
    text-transform: uppercase;
}
.move-screen {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: space-around;
}
</style>
