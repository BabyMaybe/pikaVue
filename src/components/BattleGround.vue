<template>
  <div class="battleground">

    <PokemonRow :pokemon="wild" :player="false" img='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' />
    <PokemonRow :pokemon="player" :player="true" img='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png' />

    <div class="menu-space">
      <MenuScreen @menuSelected="handleMenuSelected" v-show="menuState.menu" :menuItems="menuItems" />
      <MoveScreen v-show="menuState.fight" @attack="handleAttack"/>
      <!-- <MessageScreen v-show="menuState.run"/> -->
      <InventoryScreen v-show="menuState.item" @itemUsed="handleItem"/>
      <PokemonScreen v-show="menuState.pkmn" :pokemon="player"/>
      <MessageScreen v-show="menuState.msg" :messageText="turn.message" @nextClicked="handleNext" />

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
import { itemDB } from "../data/Items.js";

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
                lvl: 100,
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
                playerAction: function() {},
                playerMove: null,
                wildMove: null,
                message: "",
                runAttempts: 0,
                battleOver: false,
                item: null
            },
            menuItems: [
                { text: "fight", event: "fightSelected" },
                { text: "pkmn", event: "pkmnSelected" },
                { text: "item", event: "itemSelected" },
                { text: "run", event: "runSelected" }
            ]
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
            this.turn.playerAction = this.battleTurn;
            this.processTurn();
        },

        handleMenuSelected(menuItem) {
            if (["fight", "pkmn", "item"].includes(menuItem.text)) {
                this.setScreen(menuItem.text);
            }

            if (["run"].includes(menuItem.text)) {
                this.turn.playerAction = this.runTurn;
                this.processTurn();
            }
        },

        handleNext() {
            let p = this.turn.defered;
            p.resolve("resolving click!");
        },

        handleItem(item) {
            const selected = itemDB[item];
            console.log(selected);
            this.turn.item = selected;
            this.turn.playerAction = this.itemTurn;
            this.processTurn();
        },

        setScreen(screen) {
            for (var menuItem in this.menuState) {
                this.menuState[menuItem] = false;
            }
            this.menuState[screen.toLowerCase()] = true;
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
            const firstPokemon = moveOrder[0].pokemon;
            const secondPokemon = moveOrder[1].pokemon;
            const firstMove = moveOrder[0].move;
            const secondMove = moveOrder[1].move;

            await this.turn.playerAction(firstPokemon, secondPokemon, firstMove);
            // await this.battleTurn(firstPokemon, secondPokemon, firstMove);
            //--- pokemon 2 --- //
            await this.battleTurn(secondPokemon, firstPokemon, secondMove);

            this.setScreen("menu");
        },

        async battleTurn(attacker, defender, move) {
            if (attacker.checkFaint() || this.turn.battleOver) {
                return;
            }

            this.turn.message = `${attacker.name.toUpperCase()} used ${move.name.toUpperCase()}!`;
            this.setScreen("msg");
            await this.waitForClick();

            //calculate damage
            let damage = this.calcAttack(attacker, defender, move);

            //apply damage
            defender.damage(damage);

            //display secondary text (status, crit, effictive)
            this.turn.message = `${move.name.toUpperCase()} did ${damage} damage!`;
            await this.waitForClick();

            //check for faint

            if (defender.checkFaint()) {
                this.turn.message = `${defender.name} fainted!`;
                defender.faintTransition = true;
                await this.waitForClick();
                defender.applyStatus("fainted");
                this.endBattle();
            }
        },

        async runTurn() {
            this.turn.runAttempts++;
            const a = this.player.stats.currentStats.speed;
            const b = (this.wild.stats.currentStats.speed / 4) % 256;
            const c = this.turn.runAttempts;
            let success = false;
            if (b === 0) {
                console.log("0 mod success");

                success = true;
            } else {
                const f = (a * 32 / b + 30) * c;

                if (f > 255) {
                    console.log("high f success");
                    success = true;
                } else {
                    const challenge = getRandom(0, 255);
                    if (f > challenge) {
                        console.log("challenge success");
                        success = true;
                    }
                }
            }
            const msg = success ? "Got away safely!" : "Can't escape!";
            this.setScreen("msg");
            this.turn.message = msg;

            await this.waitForClick();
            if (success) {
                this.endBattle();
            }
        },

        async itemTurn() {
            console.log("using item");
            this.setScreen("msg");
            this.turn.message = `Used ${this.turn.item.name.toUpperCase()} on ${this.player.name.toUpperCase()}`;
            await this.waitForClick();
            const recovered = this.player.heal(this.turn.item.amount);

            if (recovered === 0) {
                this.turn.message = this.turn.item.failText(this.player);
            } else {
                this.turn.message = this.turn.item.successText(this.player, recovered);
            }
            await this.waitForClick();
        },

        endBattle() {
            console.log("battle over");
            this.turn.battleOver = true;
            //victory/defeat text [ ]
            //pokemon out [x]
            //reset turn values?
            //gain evs
            //gain experience
            //check level up
            //back to menu [ ] - need new menu
            //generate new pokemon
            this.setScreen("menu");
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
