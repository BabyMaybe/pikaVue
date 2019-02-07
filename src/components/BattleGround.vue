<template>
  <div class="battleground">

    <PokemonRow :pokemon="wild" :player="false" />
    <PokemonRow :pokemon="player" :player="true" />

    <div class="menu-space">
         <div class="b" @click="setScreen('menu')" :class="{pkmn: menuState.pkmn ,none: (menuState.menu || menuState.msg), inv: menuState.item}">
        <span>b</span>
      </div>
      <MenuScreen @menuSelected="handleMenuSelected" v-show="menuState.menu" :menuItems="menuItems" />
      <MoveScreen v-show="menuState.fight" @attack="handleAttack" :moves="player.moveSet"/>
      <InventoryScreen v-show="menuState.item" @itemUsed="handleItem" :pokemon="player" class="item-fix"/>
      <PokemonScreen v-show="menuState.pkmn" :pokemon="player" class="pkmn-fix"/>
      <MessageScreen v-show="menuState.msg && !turn.needsMove" :messageText="turn.message" @nextClicked="handleNext" />
      <MoveSelection :pokemon="player" v-if="turn.needsMove" @selectMove="deleteMove" />

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

        statusEffects() {
            // DAMAGE //
            // poison 1/16 maxHp end of turn
            // badly poisoned 1/16 damage at end of turn x N turns damaged
            // burn  1/16 maxHp end of turn .5 x physical damage
            // curse 25% of maxHP damage every turn
            // leech seed 1/16 maxHP damage heals attacker grass unafected
            // HALT //
            // freeze no move  Ice types connot freeze
            // paralysis 25% chance to not move .25 * speed same type cannot paralyze
            // sleep no move lasts 1-7 turns
            // bound no move lasts 2-5 turns 37.5% 1 or 2 12.5 % 4 or 5 only first attack can crit
            // confusion 50% chance to hurt self with 40 power typless physical attack no crit possible wears off after 1-4 turns
            // flinch 1 turn no move
        },

        async battleTurn(attacker, defender, move) {
            if (attacker.checkFaint() || this.turn.battleOver) {
                return;
            }
            this.setScreen("msg");

            ///// STATUS CHECKS /////
            // Cannot move if frozen
            if (attacker.status.frozen) {
                this.turn.message = attacker.statusText.frozen;
                await this.waitForClick();
                return;
            }

            // Cannot move if asleep. Sleep lasts 1 less turn
            if (attacker.status.asleep) {
                this.turn.message = attacker.statusText.asleep;
                // TODO deduct 1 sleep turn
                await this.waitForClick();
                return;
            }

            // Cannot move for 1 turn
            if (attacker.status.flinched) {
                this.turn.message = attacker.statusText.flinched;
                attacker.status.flinched = false;
                await this.waitForClick();
                return;
            }

            // Cannot move if bound, lasts 2-5 turns only first turn can crit
            if (attacker.status.bound) {
                this.turn.message = attacker.statusText.bound;
                //TODO deduct 1 from bound
                await this.waitForClick();
                return;
            }

            // 25% chance to not move speed is 25% of max on inflict
            if (attacker.status.paralyzed && randomBetween(1, 4) === 1) {
                this.turn.message = attacker.statusText.paralyzed;
                await this.waitForClick();
                return;
            }

            // 50% chance to hurt self lasts 1-4 turns. attack is 40 power physical with no crit
            if (attacker.status.confused) {
                this.turn.message = attacker.statusText.confused.start;
                await this.waitForClick();
                if (randomBetween(1, 2) === 1) {
                    this.turn.message = attacker.statusText.confused.fail;
                    //TODO damage self
                    await this.waitForClick();
                    //TODO deduct 1 from confusion
                    return;
                }
            }
            ///// END STATUS CHECKS /////

            this.turn.message = `${attacker.name} used ${move.name}!`;
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
                this.turn.message = `${move.name} did ${damage} damage!`;
                await this.waitForClick();

                //check for faint

            if (defender.checkFaint()) {
                    if (attacker === this.player) {
                        this.turn.playerWon = true;
                    }
                    this.turn.message = `${defender.name} fainted!`;
                    defender.faintTransition = true;
                    await this.waitForClick();
                    defender.applyStatus("fainted");
                    this.endBattle();
                }
            }

            // CHECK AILMENT IF STATUS INFLICTING MOVE //
            if (move.category.includes("ailment")) {
                const ailmentChallenge = randomBetween(1, 100);
                if (move.ailment.chance >= ailmentChallenge) {
                    const statusMsg = defender.applyStatus(move.ailment.name);
                    this.turn.message = statusMsg;
                    await this.waitForClick();
                }
            }

            // IF STAT AFFECTING MOVE APPLY STAT CHANGES //
            if (["damage+lower", "net-good-stats", "whole-field-effect", "field-effect"].includes(move.category)) {
            }

            ///// POST BATTLE DAMAGE STATUS CHECKS /////

            // Poison inflicts 1/16 max health per turn
            if (attacker.status.poisoned) {
                this.turn.message = this.player.statusText.poisoned;
                attacker.damage(Math.floor(attacker.stats.currentStats.hp / 16));
                await this.waitForClick();
            }

            // Burn inflicts 1/16 max health per turn alse halves physical damage
            if (attacker.status.burned) {
                this.turn.message = attacker.statusText.burned;
                attacker.damage(Math.floor(attacker.stats.currentStats.hp / 16));
                await this.waitForClick();
            }

            // Leech Seed inflicts 1/16 max health per turn alse halves physical damage
            if (attacker.status.leeched) {
                this.turn.message = attacker.statusText.leeched;
                const leech = Math.floor(attacker.stats.currentStats.hp / 16);
                attacker.damage(leech);
                defender.heal(leech);
                await this.waitForClick();
            }

            ///// END DAMAGE STATUS CHECKS /////
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
            this.turn.message = `Used ${item.name.toUpperCase()} on ${this.player.name}`;
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
                this.turn.message = `${this.player.name} gained ${xp} EXP. Points!`;
                await this.waitForClick();

                //check level up
                if (this.player.needsLevel()) {
                    const oldMoves = this.player.availableNaturalMoves();
                    this.player.levelUp();
                    this.turn.message = `${this.player.name} grew to level ${this.player.lvl}!`;
                    const newMoves = this.player.availableNaturalMoves();
                    await this.waitForClick();

                    if (oldMoves.length !== newMoves.length) {
                        const newMove = newMoves.pop();
                        this.turn.message = `${this.player.name} learned ${newMove.name}!`;
                        await this.waitForClick();
                        if (this.player.moveSet.length < 4) {
                            this.player.addMove(newMove);
                        } else {
                            this.turn.message = `But, ${this.player.name}, can't learn more than 4 moves!`;
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

            this.turn.message = `${this.player.name} forgot ${move.move.name}!`;
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
            const attack =
                move.damageClass === "physical"
                    ? attacker.stats.currentStats.attack
                    : attacker.stats.currentStats.special;
            const defense = defender.stats.currentStats.defense;

            const critChallenge = randomBetween(0, 255);
            const T = attacker.stats.baseStats.speed / 2;
            const crit = critChallenge < T ? (2 * level + 5) / (level + 5) : 1;

            const rand = (Math.floor(Math.random() * (255 - 217 + 1)) + 217) / 255;
            const STAB = move.type === attacker.type ? 1.5 : 1;
            const typeBonus = await this.calcTypeBonus(move.type, defender.type);
            const burn = attacker.status.burned && move.damageClass === "physical" ? 0.25 : 1;
            const modifier = rand * STAB * typeBonus * crit * burn;

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
        // copy current stats into a battle slot for manipulation only inside the battle
        Object.assign(this.player.stats.battleStats, this.player.stats.currentStats);
        Object.assign(this.wild.stats.battleStats, this.wild.stats.currentStats);

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

.none {
    display: none !important;
}

.battleground {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-around;
}

.menu-space {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    position: relative;
}

.item-fix {
    margin-top: -71px;
}

.pkmn-fix {
    margin-top: -107px;
}

.b {
    font-size: 32px;
    border: double var(--main-black) 10px;
    border-radius: 50px;
    padding: 10px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    background: var(--green-white);
}

.battleground .b {
    margin-bottom: 100px;
    position: absolute;
    top: -185px;
    left: 0;
}

.b:hover {
    background: var(--main-black);
    color: var(--green-white);
}

.b:active {
    opacity: 0.8;
    color: var(--green-white);
}

.b > span {
    position: relative;
    left: 4px;
    top: 2px;
}

.b.inv {
    top: -147px;
}

.b.pkmn {
    top: -183px;
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
