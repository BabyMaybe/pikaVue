<template>
    <transition-group name="grow-up" tag="div" class="move-selection">
        <MoveStat v-for="move in moveSet" :key="move.name" :move="move" @click.native="handleClick(move)" class="grow-item"/>
    </transition-group>
</template>

<script>
import MoveStat from "./MoveStat";
import { Move } from "../data/Pokemon.js";

export default {
    name: "MoveSelection",
    components: {
        MoveStat
    },
    props: {
        pokemon: Object
    },
    data: function() {
        return {
            moveSet: []
        };
    },
    methods: {
        handleClick(move) {
            if (this.moveSet.length > 4) {
                this.$emit("selectMove", { moveSet: this.moveSet, move: move, newMove: this.moveSet[4].name });
            }
        }
    },
    created: async function() {
        let requests = this.pokemon.availableNaturalMoves().map(m => fetch(m.url));
        let moveData = [];
        await Promise.all(requests)
            .then(responses => Promise.all(responses.map(data => data.json())))
            .then(dataSet => {
                dataSet.map(m => {
                    const newMove = new Move(m);
                    moveData.push(newMove);
                });
            });

        this.moveSet = moveData;
    }
};
</script>

<style >
.move-selection {
    flex-basis: 100%;
    transition: all 1s;
}

.grow-item {
    transition: all 1s ease;
}

.grow-up-enter,
.grow-up-leave-to {
    height: 0px;
    font-size: 0;
    opacity: 0;
    transform: translateX(100vh);
    margin: 0;
    padding: 0;
    z-index: -1;
}

.grow-up-leave,
.grow-up-enter-to {
    height: 112px;
    opacity: 1;
    font-size: inherit;
}
.grow-up-leave-active .grow-up-enter-active {
    position: absolute;
    pointer-events: none;
}

.grow-up-move {
    transition: all 1s;
}
</style>
