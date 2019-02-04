<template>
<div>
    <div class="selection-screen">
        <transition-group name="poke-ball-slide" tag="div" :class="{basicFlex: true, leftFlex: loaded}">
            <Pokeball v-for="pkmn in pokemonList" :key="pkmn.id" @pokemonSelected="selectPokemon" @nameChange="updateName"  :id="pkmn.id" :name="pkmn.name" :color="pkmn.color" class="test"/>
        </transition-group>

         <h1 :class="{shift: loaded}">{{pokemon ? pokemon.name + " lvl " + pokemon.lvl: pokemonName}} </h1>

        <MoveSelection :pokemon="pokemon" @letsGo="letsGo" v-if="pokemon" />
        <div class="lets-go" @click="letsGo" v-if="pokemon">Lets Go!</div>

    </div>
</div>
</template>

<script>
import Pokeball from "./Pokeball";
import MoveSelection from "./MoveSelection";

export default {
    name: "Selection",
    components: {
        Pokeball,
        MoveSelection
    },
    props: {
        pokemon: Object
    },
    data: function() {
        return {
            pokemonName: "Choose your Pokemon!",
            pokemonList: [
                { id: 4, name: "Charmander", color: "red" },
                { id: 7, name: "Squirtle", color: "blue" },
                { id: 1, name: "Bulbasaur", color: "green" },
                { id: 25, name: "Pikachu", color: "yellow" },
                { id: 0, name: "Mystery", color: "black" }
            ],
            loaded: false
        };
    },
    methods: {
        updateName(name) {
            this.pokemonName = name;
        },
        selectPokemon: function(id) {
            this.$emit("requestPokemon", id);
            this.pokemonList = this.pokemonList.filter(p => p.id === id);
            this.pokemonName = this.pokemonList[0].name;
            this.loaded = true;
        },
        letsGo() {
            this.$emit("battleReady", "overworld");
        }
    }
};
</script>

<style scoped>
h1 {
    width: 300px;
    flex: 1;
    transition: all 1s;
}
.selection-screen {
    border: double var(--main-black) 25px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    padding: 50px;
    border-width: 25px 0 25px 0;
    margin-top: 25px;
    overflow: hidden;
}

.poke-ball-slide-enter,
.poke-ball-slide-leave-to {
    opacity: 0;
    transform: translateY(-250px);
    width: 0px;
    height: 0px;
    justify-self: flex-start;
}

.poke-ball-slide-leave-active {
    position: absolute;
}

.lets-go {
    font-size: 24px;
    border: solid var(--main-black) 3px;
    padding: 20px;
    width: 200px;
    margin: 0 auto;
    border-radius: 3px;
    cursor: pointer;
}

.lets-go:hover {
    color: var(--green-white);
    background: var(--main-black);
}

.test {
    transition: all 1s, box-shadow 0.5s;
}

.basicFlex {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex: 1;
    transition: all 1s;
}

.leftFlex {
    justify-content: flex-start;
    flex: 0;
    pointer-events: none;
}

.shift {
    margin-right: 140px;
    transition: all 1s;
}
</style>
