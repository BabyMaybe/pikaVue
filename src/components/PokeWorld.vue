<template>
    <div class="pokeworld">
        <BattleGround v-if="worlds.battle && wild" :player="pokemon" :wild="wild"></BattleGround>
        <!-- <BattleGround v-if="worlds.battle" ></BattleGround> -->
        <Overworld v-if="worlds.overworld"></Overworld>
    </div>
</template>
<script>
import BattleGround from "./BattleGround";
import Overworld from "./Overworld";
import { Pokemon, Move, getRandom } from "../data/Pokemon.js";

export default {
    name: "PokeWorld",
    components: {
        BattleGround,
        Overworld
    },
    data: function() {
        return {
            worlds: {
                battle: true,
                overworld: false,
                pokemart: false,
                pokecenter: false,
                selection: false
            },
            pokemon: null,
            wild: null
        };
    },
    methods: {
        setWorld(world) {
            for (var world in this.worlds) {
                this.worlds[world] = false;
            }
            this.worlds[world] = true;
        },

        async generatePokemon() {
            const lvl = 100;
            const id = getRandom(1, 151);

            console.log("generating random pokemon:", id);
            const pokemonRequest = `https://pokeapi.co/api/v2/pokemon/${id}/`;

            const pokemonResponse = await fetch(pokemonRequest);
            const pokemon = await pokemonResponse.json();

            const speciesRequest = pokemon.species.url;
            const speciesResponse = await fetch(speciesRequest);
            const species = await speciesResponse.json();

            this.pokemon = new Pokemon(pokemon, species, lvl);
        },
        async generateWild() {
            const lvl = 100;
            const id = getRandom(1, 151);

            console.log("generating random pokemon:", id);
            const pokemonRequest = `https://pokeapi.co/api/v2/pokemon/${id}/`;

            const pokemonResponse = await fetch(pokemonRequest);
            const pokemon = await pokemonResponse.json();

            const speciesRequest = pokemon.species.url;
            const speciesResponse = await fetch(speciesRequest);
            const species = await speciesResponse.json();

            this.wild = new Pokemon(pokemon, species, lvl);
        }
    },
    created: function() {
        this.generatePokemon();
        this.generateWild();
    }
};
</script>
<style>
.pokeworld {
    /* background: red; */
}
</style>
