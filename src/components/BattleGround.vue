<template>
  <div class="battleground">

    <PokemonRow :pokemon="wild" :player="false" />
    <PokemonRow :pokemon="player" :player="true" />

    <div class="menu-space">
      <MenuScreen @menuSelected="handleMenuSelected" v-show="menuState.menu" :menuItems="menuItems" />
      <MoveScreen v-show="menuState.fight" @attack="handleAttack" :moves="player.moveSet"/>
      <InventoryScreen v-show="menuState.item" @itemUsed="handleItem" :pokemon="player"/>
      <PokemonScreen v-show="menuState.pkmn" :pokemon="player"/>
      <MessageScreen v-show="menuState.msg && !turn.needsMove" :messageText="turn.message" @nextClicked="handleNext" />
      <MoveSelection :pokemon="player" v-if="turn.needsMove" @selectMove="deleteMove" />
      <div class="b" @click="setScreen('menu')" :class="{hide: (menuState.menu || menuState.msg)}">
        <span>b</span>
      </div>
    </div>

  </div>
</template>

<script>
import MenuScreen from "./MenuScreen";
import MoveScreen from "./MoveScreen";
import MoveSelection from "./MoveSelection";
import MessageScreen from "./MessageScreen";
import InventoryScreen from "./InventoryScreen";
import PokemonScreen from "./PokemonScreen";
import PokemonRow from "./PokemonRow";

import { randomBetween, weightedPick } from "../data/utilities";
import { itemDB } from "../data/Items.js";

export default {
    name: "BattleGround",
    components: {
        MenuScreen,
        MoveScreen,
        MoveSelection,
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
                pkmn: false,
                item: false,
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
                item: null,
                needsMove: false
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
        waitForMoves: function() {
            return new Promise(resolve => (this.turn.moveDefered = { resolve: resolve }));
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
            this.turn.item = item;
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
            this.turn.wildMove = this.wild.moveSet[randomBetween(0, this.wild.moveSet.length - 1)];

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
            const challenge = randomBetween(0, 100);
            if (challenge > move.accuracy || move.damageClass === "status") {
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
                    const challenge = randomBetween(0, 255);
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
            const item = this.turn.item;
            this.setScreen("msg");
            this.turn.message = `Used ${item.name.toUpperCase()} on ${this.player.name.toUpperCase()}`;
            await this.waitForClick();

            if (item.effect === "heal") {
                const recovered = this.player.heal(item.amount);
                if (recovered === 0) {
                    this.turn.message = this.turn.item.failText(this.player);
                } else {
                    this.turn.message = this.turn.item.successText(this.player, recovered);
                }
            }

            if (item.effect === "status") {
                if (this.player.status[item.status]) {
                    this.player.status[item.status] = false;
                    this.turn.message = this.turn.item.successText(this.player);
                } else {
                    this.turn.message = this.turn.item.failText(this.player);
                }
            }

            if (item.effect === "recover") {
                this.turn.message = "ill deal with this later";
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
                    const oldMoves = this.player.availableNaturalMoves();
                    this.player.levelUp();
                    this.turn.message = `${this.player.name.toUpperCase()} grew to level ${this.player.lvl}!`;
                    const newMoves = this.player.availableNaturalMoves();
                    await this.waitForClick();

                    if (oldMoves.length !== newMoves.length) {
                        const newMove = newMoves.pop();
                        this.turn.message = `${this.player.name.toUpperCase()} learned ${newMove.name}!`;
                        await this.waitForClick();
                        if (this.player.moveSet.length < 4) {
                            this.player.addMove(newMove);
                        } else {
                            this.turn.message = `But, ${this.player.name.toUpperCase()}, can't learn more than 4 moves!`;
                            await this.waitForClick();

                            this.turn.message = `Delete an older move to make room for ${newMove.name}?`;
                            await this.waitForClick();
                            this.player.moveSet = newMoves;
                            this.turn.needsMove = true;
                            await this.waitForMoves();
                        }
                    }
                }
                // generate drops
                await this.generateDrops();
            }

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

        async deleteMove(move) {
            this.turn.needsMove = false;

            this.setScreen("msg");
            this.turn.message = "1, 2 and...";
            await this.waitForClick();

            this.turn.message = `${this.player.name.toUpperCase()} forgot ${move.move.name}!`;
            await this.waitForClick();

            this.turn.message = `And Learned ${move.newMove}!`;
            await this.waitForClick();

            move.moveSet.splice(move.moveSet.indexOf(move.move), 1);
            this.player.moveSet = move.moveSet;

            let p = this.turn.moveDefered;
            p.resolve("resolving click!");
        },

        async generateDrops() {
            // generate loot drops
            const drop = weightedPick(itemDB);
            const num = randomBetween(1, 3);

            // add loot to inventory
            if (this.player.inventory[drop.name]) {
                this.player.inventory[drop.name].quantity += num;
            } else {
                this.player.inventory[drop.name] = {
                    item: drop,
                    quantity: num
                };
            }
            this.turn.message = `${this.player.name} found ${num} ${drop.name}${num > 1 ? "s" : ""} after the battle!`;
            await this.waitForClick();

            // generate gold drops
            const gold = randomBetween(
                this.player.lvl,
                this.wild.lvl * this.player.lvl / 10 + randomBetween(this.wild.lvl, this.player.lvl * 10)
            );

            // add gold to inventory
            this.player.wallet += gold;
            this.turn.message = `${this.player.name} also found p${gold}!`;

            await this.waitForClick();
        },

        async calcAttack(attacker, defender, move) {
            // if (move.damageClass === "status") {
            //     return { damage: 0, crit: 0, typeBonus: 1 };
            // }
            const level = attacker.lvl;
            const power = move.power;
            const attack = attacker.stats.currentStats.attack;
            const defense = defender.stats.currentStats.defense;

            const critChallenge = randomBetween(0, 255);
            const T = attacker.stats.baseStats.speed / 2;
            const crit = critChallenge < T ? (2 * level + 5) / (level + 5) : 1;

            const rand = (Math.floor(Math.random() * (255 - 217 + 1)) + 217) / 255;
            const STAB = move.type === attacker.type ? 1.5 : 1;
            const typeBonus = await this.calcTypeBonus(move.type, defender.type);

            const modifier = rand * STAB * typeBonus * crit;

            const damage = Math.round((2 * level / 5 * power * (attack / defense) / 50 + 2) * modifier);

            // console.log(level, power, attack, defense, critChallenge, T, crit, rand, STAB, typeBonus, modifier, damage);
            return { damage: damage, crit: typeBonus > 0 ? crit : 0, typeBonus: typeBonus };
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
