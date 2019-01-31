<template>
  <div class="battleground">

    <PokemonRow :pokemon="wild" :player="false" />
    <PokemonRow :pokemon="player" :player="true" />

    <div class="menu-space">
      <MenuScreen @menuSelected="handleMenuSelected" v-show="menuState.menu" :menuItems="menuItems" />
      <MoveScreen v-show="menuState.fight" @attack="handleAttack"  :moves="player.moveSet"/>
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
import MenuScreen from "./MenuScreen";
import MoveScreen from "./MoveScreen";
import MessageScreen from "./MessageScreen";
import InventoryScreen from "./InventoryScreen";
import PokemonScreen from "./PokemonScreen";
import PokemonRow from "./PokemonRow";

import { getRandom } from "../data/Pokemon.js";
import { itemDB } from "../data/Items.js";

export default {
    name: "BattleGround",
    components: {
        MenuScreen,
        MoveScreen,
        MessageScreen,
        InventoryScreen,
        PokemonScreen,
        PokemonRow
    },
    props: {
        player: Object,
        wild: Object
    },

    data: function() {
        return {
            menuState: {
                menu: false,
                fight: false,
                item: false,
                pkmn: false,
                msg: true
            },
            turn: {
                playerAction: function() {},
                playerMove: null,
                wildMove: null,
                message: " ",
                runAttempts: 0,
                battleOver: false,
                playerWon: false,
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
            this.turn.wildMove = this.wild.moveSet[getRandom(0, this.wild.moveSet.length - 1)];

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

            if (!this.turn.battleOver) {
                this.setScreen("menu");
            }
        },

        async battleTurn(attacker, defender, move) {
            if (attacker.checkFaint() || this.turn.battleOver) {
                return;
            }

            this.turn.message = `${attacker.name.toUpperCase()} used ${move.name.toUpperCase()}!`;
            this.setScreen("msg");
            await this.waitForClick();

            //accuracy check
            const challenge = getRandom(0, 100);
            if (challenge > move.accuracy) {
                this.turn.message = `${attacker.name.toUpperCase()}'s attack missed!`;
                await this.waitForClick();
                return;
            }
            //calculate damage
            let { damage, crit, typeBonus } = await this.calcAttack(attacker, defender, move);

            //apply damage
            defender.damage(damage);

            if (crit > 1) {
                this.turn.message = "Critical hit!";
                await this.waitForClick();
            }

            if (typeBonus > 1) {
                this.turn.message = "It's super effective!";
                await this.waitForClick();
            }

            if (typeBonus < 1 && typeBonus > 0) {
                this.turn.message = "It's not very effective...";
                await this.waitForClick();
            }

            if (typeBonus === 0) {
                this.turn.message = "No effect!";
                await this.waitForClick();
            }
            //display secondary text (status, crit, effictive)
            this.turn.message = `${move.name.toUpperCase()} did ${damage} damage!`;
            await this.waitForClick();

            //check for faint

            if (defender.checkFaint()) {
                if (attacker === this.player) {
                    this.turn.playerWon = true;
                }
                this.turn.message = `${defender.name.toUpperCase()} fainted!`;
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
                success = true;
            } else {
                const f = (a * 32 / b + 30) * c;

                if (f > 255) {
                    success = true;
                } else {
                    const challenge = getRandom(0, 255);
                    if (f > challenge) {
                        success = true;
                    }
                }
            }

            if (success) {
                this.setScreen("msg");
                this.turn.message = "Got away safely!";
                await this.waitForClick();
                this.endBattle();
            } else {
                this.setScreen("msg");
                this.turn.message = "Can't escape!";
                await this.waitForClick();
            }
        },

        async itemTurn() {
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

        async endBattle() {
            this.turn.battleOver = true;

            //gain evs
            if (this.turn.playerWon) {
                this.player.digest(this.wild);

                //gain experience
                const xp = this.player.gainXp(this.wild);

                this.setScreen("msg");
                this.turn.message = `${this.player.name.toUpperCase()} gained ${xp} EXP. Points!`;
                await this.waitForClick();

                //check level up
                if (this.player.needsLevel()) {
                    this.turn.msg = `${this.player.name.toUpperCase()} grew to level ${this.player.lvl}!`;
                    await this.waitForClick();
                }
            }

            // generate drops
            this.generateDrops();
            //back to menu [ ] - need new menu

            //reset turn values?
            //this might be unneccesary if BattleGround is destroyed and recreated every time
            this.turn = {
                playerAction: function() {},
                playerMove: null,
                wildMove: null,
                message: "",
                runAttempts: 0,
                battleOver: false,
                item: null
            };

            this.$emit("battleOver", "overworld");

            //generate new pokemon
        },

        generateDrops() {
            return { potion: 1 };
        },

        async calcAttack(attacker, defender, move) {
            const level = attacker.lvl;
            const power = move.power;
            const attack = attacker.stats.currentStats.attack;
            const defense = defender.stats.currentStats.defense;

            const critChallenge = getRandom(0, 255);
            const T = attacker.stats.baseStats.speed / 2;
            const crit = critChallenge < T ? (2 * level + 5) / (level + 5) : 1;

            const rand = (Math.floor(Math.random() * (255 - 217 + 1)) + 217) / 255;
            const STAB = move.type === attacker.type ? 1.5 : 1;
            const typeBonus = await this.calcTypeBonus(move.type, defender.type);

            const modifier = rand * STAB * typeBonus * crit;

            const damage = Math.round((2 * level / 5 * power * (attack / defense) / 50 + 2) * modifier);

            console.log(level, power, attack, defense, critChallenge, T, crit, rand, STAB, typeBonus, modifier, damage);
            return { damage: damage, crit: typeBonus > 0 ? crit : 0, typeBonus, typeBonus };
        },

        async calcTypeBonus(moveType, pkmnType) {
            const request = `https://pokeapi.co/api/v2/type/${moveType}/`;

            const response = await fetch(request);
            const typeData = await response.json();
            const damageChart = typeData.damage_relations;

            let modifier = 1;
            for (let type in pkmnType) {
                if (damageChart.double_damage_to.find(t => pkmnType[type] === t.name)) {
                    modifier = modifier * 2;
                } else if (damageChart.half_damage_to.find(t => pkmnType[type] === t.name)) {
                    modifier = modifier * 0.5;
                } else if (damageChart.no_damage_to.find(t => pkmnType[type] === t.name)) {
                    modifier = 0;
                    return modifier;
                }
            }
            return modifier;
        }
    },
    created: async function() {
        this.turn.message = `Wild ${this.wild.name} appeared!`;
        await this.waitForClick();

        this.setScreen("menu");
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
