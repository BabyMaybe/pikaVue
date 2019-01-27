<template>
  <div class="battleground">

    <PokemonRow :pokemon="wild" :player="false" img='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' />
    <PokemonRow :pokemon="player" :player="true" img='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png' />

    <div class="menu-space">
      <MenuScreen @menuSelected="setScreen" v-show="menuState.menu"/>
      <MoveScreen v-show="menuState.fight" @attack="handleAttack"/>
      <MessageScreen v-show="menuState.run"/>
      <InventoryScreen v-show="menuState.item"/>
      <PokemonScreen v-show="menuState.pkmn" :pokemon="player"/>
      <MessageScreen v-show="menuState.msg" :messageText="turn.message" @nextClicked="handleNext" :prom="turn.prom"/>

      <div class="b" @click="setScreen('menu')" :class="{hide: (menuState.menu || menuState.msg)}">
        <span>b</span>
      </div>
    </div>

  </div>
</template>

<script>
// import Stats from "./Stats";
// import PokeSprite from "./PokeSprite";
import MenuScreen from "./MenuScreen";
import MoveScreen from "./MoveScreen";
import MessageScreen from "./MessageScreen";
import InventoryScreen from "./InventoryScreen";
import PokemonScreen from "./PokemonScreen";
import PokemonRow from "./PokemonRow";

import { Pokemon, Move, getRandom } from "../data/Pokemon.js";

export default {
    name: "BattleGround",
    components: {
        // Stats,
        // PokeSprite,
        MenuScreen,
        MoveScreen,
        MessageScreen,
        InventoryScreen,
        PokemonScreen,
        PokemonRow
    },

    data: function() {
        return {
            player: new Pokemon({
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
                lvl: 60,
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
            menuState: {
                menu: true,
                fight: false,
                item: false,
                run: false,
                pkmn: false,
                msg: false
            },
            turn: {
                playerMove: null,
                wildMove: null,
                message: "",
                messages: [],
                eventQueue: [],
                ps: []
            }
        };
    },
    methods: {
        waitForClick: function() {
            return new Promise(resolve => (this.turn.defered = { resolve: resolve }));
        },

        waitForMiliseconds: function(ms) {
            return new Promise(resolve => {
                setTimeout(function() {
                    resolve();
                }, ms);
            });
        },

        handleAttack(move) {
            this.turn.playerMove = move;
            this.processTurn();
        },
        calcAttack(attacker, defender, move) {
            const level = attacker.lvl;
            const power = move.power;
            const attack = attacker.stats.currentStats.attack;
            const defense = defender.stats.currentStats.defense;

            const rand = (Math.floor(Math.random() * (255 - 217 + 1)) + 217) / 255;
            const STAB = move.type === attacker.type ? 1.5 : 1;
            const typeBonus = this.calcTypeBonus(move.type, defender.type);

            const modifier = rand * STAB * typeBonus;

            const damage = Math.round((2 * level / 5 * power * (attack / defense) / 50 + 2) * modifier);
            // defender.damage(damage);
            return damage;
        },

        calcTypeBonus(moveType, pkmnType) {
            // return either .5, 1, 2, 4 based on type lookup
            if (moveType === "water") {
                return 2;
            }
            return 1;
        },

        setScreen(screen) {
            for (var menuItem in this.menuState) {
                this.menuState[menuItem] = false;
            }
            this.menuState[screen.toLowerCase()] = true;
        },

        handleNext() {
            let p = this.turn.defered;
            p.resolve("resolving click!");
        },

        async processTurn() {
            //generate wild move
            this.turn.wildMove = this.wild.moveSet[getRandom(0, 3)];

            //determine move order
            const moveOrder = [
                { pokemon: this.player, move: this.turn.playerMove },
                { pokemon: this.wild, move: this.turn.wildMove }
            ].sort((a, b) => {
                b.pokemon.stats.currentStats.speed - a.pokemon.stats.currentStats.speed;
            });

            // --- pokemon 1 ---
            //display attack text
            const firstPokemon = moveOrder[0].pokemon;
            const secondPokemon = moveOrder[1].pokemon;

            // this.turn.message = `${firstPokemon.name} used ${moveOrder[0].move.name}`;
            // this.setScreen("msg");
            // await this.waitForClick();

            // //calculate damage
            // let damage = this.calcAttack(firstPokemon, moveOrder[1].pokemon, moveOrder[0].move);

            // //apply damage
            // secondPokemon.damage(damage);

            // //display secondary text (status, crit, effictive)
            // this.turn.message = `${moveOrder[0].move.name} did ${damage} damage`;
            // await this.waitForClick();

            // //check for faint

            // if (secondPokemon.checkFaint()) {
            //     this.turn.message = `${secondPokemon.name} fainted!`;
            //     secondPokemon.faintTransition = true;
            //     await this.waitForClick();
            //     secondPokemon.applyStatus("fainted");
            //     this.endBattle();
            //     return;
            //     // skip everything else
            // }
            await this.battleTurn(firstPokemon, secondPokemon, moveOrder[0].move);
            //--- pokemon 2 --- //
            await this.battleTurn(secondPokemon, firstPokemon, moveOrder[1].move);
            // //display attack text
            // this.turn.message = `${secondPokemon.name} used ${moveOrder[1].move.name}`;
            // await this.waitForClick();

            // //calculate damage
            // damage = this.calcAttack(secondPokemon, firstPokemon, moveOrder[1].move);
            // //apply damage
            // firstPokemon.damage(damage);

            // //display secondary text (status, crit, effictive)
            // this.turn.message = `${moveOrder[1].move.name} did ${damage} damage`;
            // await this.waitForClick();

            // //check for faint

            // if (firstPokemon.checkFaint()) {
            //     this.turn.message = `${firstPokemon.name} fainted!`;
            //     firstPokemon.faintTransition = true;
            //     await this.waitForClick();
            //     firstPokemon.applyStatus("fainted");
            //     this.endBattle();
            //     return;
            // }
            //return to menu
            this.setScreen("menu");
        },

        async battleTurn(attacker, defender, move) {
            if (attacker.checkFaint()) {
                return;
            }

            this.turn.message = `${attacker.name.toUpperCase()} used ${move.name.toUpperCase()}`;
            this.setScreen("msg");
            await this.waitForClick();

            //calculate damage
            let damage = this.calcAttack(attacker, defender, move);

            //apply damage
            defender.damage(damage);

            //display secondary text (status, crit, effictive)
            this.turn.message = `${move.name} did ${damage} damage`;
            await this.waitForClick();

            //check for faint

            if (defender.checkFaint()) {
                this.turn.message = `${defender.name} fainted!`;
                defender.faintTransition = true;
                await this.waitForClick();
                defender.applyStatus("fainted");
                this.endBattle();
            } else {
                return;
            }
        },

        endBattle() {
            console.log("battle over");
            //victory/defeat text
            //pokemon out
            //back to menu
            this.setScreen("menu");
        }
    }
};
</script>

<style>
.hide {
    visibility: hidden;
}

.battleground {
    display: flex;
    flex-direction: column;
}

.menu-space {
    display: flex;
    justify-content: center;
    margin-left: 80px;
    margin-top: 10px;
}

.b {
    font-size: 32px;
    border: double black 10px;
    border-radius: 50px;
    padding: 10px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    margin-left: 10px;
}

.b:hover {
    background: black;
    color: white;
    /* border: none; */
    /* padding: 20px; */
}

.b:active {
    background: #333;
    border-color: #333;
    color: white;
}

.b > span {
    position: relative;
    left: 4px;
    top: 2px;
}

@keyframes blink {
    0% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>
