<template>
    <div class="pokeworld">
        <BattleGround v-if="worlds.battle" :player="pokemon" :wild="wild"></BattleGround>
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
            pokemon: new Pokemon({
                name: "Pikachu",
                type: "Electric",
                baseStats: {
                    hp: 35,
                    attack: 55,
                    defense: 40,
                    special: 50,
                    speed: 90
                },
                lvl: 100,
                moveSet: [
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
            }),
            wild: new Pokemon({
                name: "Charmander",
                type: "Fire",
                baseStats: {
                    hp: 39,
                    attack: 52,
                    defense: 43,
                    special: 50,
                    speed: 65
                },
                lvl: 10,
                moveSet: [
                    new Move({
                        move: {
                            name: "scratch",
                            power: 40,
                            type: { name: "normal" },
                            damage_class: { name: "physical" },
                            pp: 35,
                            accuracy: 100
                        }
                    }),
                    new Move({
                        move: {
                            name: "bite",
                            power: 60,
                            type: { name: "electric" },
                            damage_class: { name: "physical" },
                            pp: 25,
                            accuracy: 100
                        }
                    }),
                    new Move({
                        move: {
                            name: "ember",
                            power: 40,
                            type: { name: "fire" },
                            damage_class: { name: "special" },
                            pp: 25,
                            accuracy: 100
                        }
                    }),
                    new Move({
                        move: {
                            name: "rock-slide",
                            power: 75,
                            type: { name: "rock" },
                            damage_class: { name: "physical" },
                            pp: 25,
                            accuracy: 90
                        }
                    })
                ]
            }),
            nextPokemon: null
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
            const id = getRandom(1, 255);
            const pokemonRequest = `https://pokeapi.co/api/v2/pokemon/${id}/`;

            const pokemonResponse = await fetch(pokemonRequest);
            const pokemon = await pokemonResponse.json();

            const speciesRequest = pokemon.species.url;
            const speciesResponse = await fetch(speciesRequest);
            const species = await speciesResponse.json();

            this.nextPokemon = new Pokemon(pokemon, species, lvl);
        }
    }
};
</script>
<style>
.pokeworld {
    /* background: red; */
}
</style>
