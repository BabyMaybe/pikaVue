<template>
    <div class="pokeworld">
        <Selection v-if="worlds.selection"></Selection>
        <BattleGround v-if="worlds.battle && wild" :player="pokemon" :wild="wild" @battleOver="setWorld"></BattleGround>
        <Overworld v-if="worlds.overworld" :pokemon="pokemon" @battleReady="newBattle"></Overworld>

    </div>
</template>
<script>
import BattleGround from "./BattleGround";
import Overworld from "./Overworld";
import Selection from "./Selection";
import { Pokemon, getRandom } from "../data/Pokemon.js";

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
            wild: null,
            all: {}
        };
    },
    methods: {
        setWorld(world) {
            for (var w in this.worlds) {
                this.worlds[w] = false;
            }
            this.worlds[world] = true;
        },

        async generatePokemon() {
            const lvl = 100;
            const id = getRandom(1, 151);

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

            const pokemonRequest = `https://pokeapi.co/api/v2/pokemon/${id}/`;

            const pokemonResponse = await fetch(pokemonRequest);
            const pokemon = await pokemonResponse.json();

            const speciesRequest = pokemon.species.url;
            const speciesResponse = await fetch(speciesRequest);
            const species = await speciesResponse.json();

            this.wild = new Pokemon(pokemon, species, lvl);
        },
        async newBattle() {
            await this.generateWild();
            this.setWorld("battle");
        }
        // waitForMiliseconds: function(ms) {
        //     return new Promise(resolve => {
        //         setTimeout(function() {
        //             resolve();
        //         }, ms);
        //     });
        // },
        // async generateAll() {
        //     const lvl = 100;

        //     for (let id = 1; id <= 151; id++) {
        //         const pokemonRequest = `https://pokeapi.co/api/v2/pokemon/${id}/`;

        //         const pokemonResponse = await fetch(pokemonRequest);
        //         const pokemon = await pokemonResponse.json();

        //         const speciesRequest = pokemon.species.url;
        //         const speciesResponse = await fetch(speciesRequest);
        //         const species = await speciesResponse.json();

        //         console.log("generating ", pokemon.name);
        //         this.all[pokemon.name] = new Pokemon(pokemon, species, lvl);
        //     }
        // }
    },
    created: function() {
        this.generatePokemon();
        this.generateWild();
        // this.generateAll();
    }
};
</script>
<style>
.pokeworld {
    /* background: red; */
}
</style>
