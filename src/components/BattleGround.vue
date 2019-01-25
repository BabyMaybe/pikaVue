<template>
  <div class="battleground">
    <div class="wild-pokemon poke-row">
      <Stats :pokemon="wild" :hp="wild.stats.hp"/>
      <PokeSprite
        :url="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'"
      />
    </div>

    <div class="player poke-row">
      <PokeSprite
        :url="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png'"
      />
      <Stats :pokemon="player"/>
    </div>

    <div class="menu-space">
      <MenuScreen @menuSelected="setScreen" v-show="menuState.menu"/>
      <MoveScreen class="space" v-show="menuState.fight" @attack="handleAttack"/>
      <MessageScreen v-show="menuState.run"/>
      <InventoryScreen v-show="menuState.item"/>
      <PokemonScreen v-show="menuState.pkmn" :pokemon="player"/>

      <div class="b" @click="setScreen('menu')" :class="{hide: menuState.menu}">
        <span>b</span>
      </div>
    </div>
  </div>
</template>

<script>
import Stats from "./Stats";
import PokeSprite from "./PokeSprite";
import MenuScreen from "./MenuScreen";
import MoveScreen from "./MoveScreen";
import MessageScreen from "./MessageScreen";
import InventoryScreen from "./InventoryScreen";
import PokemonScreen from "./PokemonScreen";

import { Pokemon, Move } from "../data/Pokemon.js";

export default {
  name: "BattleGround",
  components: {
    Stats,
    PokeSprite,
    MenuScreen,
    MoveScreen,
    MessageScreen,
    InventoryScreen,
    PokemonScreen
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
        playerMove: null,
        wildMove: null,
        message: ""
      }
    };
  },
  methods: {
    handleAttack(move) {
      //   this.calcAttack(this.player, this.wild, move);
      this.turn.playerMove = move;
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

      const damage = Math.round(
        ((((2 * level) / 5) * power * (attack / defense)) / 50 + 2) * modifier
      );
      console.log("attacking for ", damage, " damage");
      defender.damage(damage);
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

    processTurn() {}
  }
};
</script>

<style>
.hide {
  visibility: hidden;
}
.space {
  margin: 20px 0;
}
.battleground {
  display: flex;
  flex-direction: column;
}
.poke-row {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.wild-pokemon > .stats {
  border-left: solid black 5px;
}
.player {
  align-items: flex-end;
}
.player > .stats {
  border-right: solid black 5px;
}

button {
  width: 200px;
  margin: 30px auto;
  padding: 20px;
  font-size: 20px;
  font-family: "Press Start 2P", monospace;
  border: solid black 4px;
  cursor: pointer;
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
</style>
