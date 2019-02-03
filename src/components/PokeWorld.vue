<template>
    <div class="pokeworld">
        <Selection v-if="worlds.selection" @requestPokemon="generatePlayer" @battleReady="setWorld" :pokemon="pokemon"></Selection>
        <BattleGround v-if="worlds.battle && wild" :player="pokemon" :wild="wild" @battleOver="setWorld"></BattleGround>
        <Overworld v-if="worlds.overworld" :pokemon="pokemon" @battleReady="newBattle"></Overworld>

    </div>
</template>
<script>
import BattleGround from "./BattleGround";
import Overworld from "./Overworld";
import Selection from "./Selection";
import { Pokemon } from "../data/Pokemon.js";
import { randomBetween } from "../data/utilities";

export default {
    name: "PokeWorld",
    components: {
        BattleGround,
        Overworld,
        Selection
    },
    data: function() {
        return {
            worlds: {
                battle: false,
                overworld: false,
                pokemart: false,
                pokecenter: false,
                selection: true
            },
            pokemon: null,
            wild: null
            // all: {}
        };
    },
    methods: {
        setWorld(world) {
            for (var w in this.worlds) {
                this.worlds[w] = false;
            }
            this.worlds[world] = true;
        },

        async generatePokemon(id, level) {
            const lvl = level || 5;
            const i = id || randomBetween(1, 151);
            // console.log("id, i", id, i);
            const pokemonRequest = `https://pokeapi.co/api/v2/pokemon/${i}/`;

            const pokemonResponse = await fetch(pokemonRequest);
            const pokemon = await pokemonResponse.json();

            const speciesRequest = pokemon.species.url;
            const speciesResponse = await fetch(speciesRequest);
            const species = await speciesResponse.json();

            return new Pokemon(pokemon, species, lvl);
        },
        async generatePlayer(pkmn) {
            this.pokemon = await this.generatePokemon(pkmn, 25);
        },
        async newBattle() {
            const wildLvlMin = Math.max(5, Math.floor(this.pokemon.lvl * 0.8));
            const wildLvlMax = Math.min(this.pokemon.lvl * 1.5, this.pokemon.lvl + 10);
            const wildLvl = randomBetween(wildLvlMin, wildLvlMax);
            // const wild = await this.generatePokemon(0, wildLvl);
            const wild = await this.generatePokemon(0, 5);
            this.wild = wild;
            this.setWorld("battle");
        }
    }
};
</script>
<style>
.pokeworld {
    /* background: red; */
}
</style>
