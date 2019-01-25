<template>
  <div class="battleground">
    <div class="wild-pokemon poke-row">
      <Stats :level="wild.lvl" :pokemon="wild.name" :hp="wild.stats.currentStats.hp"/>
      <PokeSprite
        :url="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'"
      />
    </div>

    <div class="player poke-row">
      <PokeSprite
        :url="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png'"
      />
      <Stats :level="player.lvl" :pokemon="player.name" :hp="player.stats.currentStats.hp"/>
    </div>
    <button @click="handleAttack(player,wild)">Attack!</button>

    <MenuScreen @menuSelected="setScreen" v-if="menuState.menu"></MenuScreen>
    <MoveScreen class="space" v-if="menuState.fight"></MoveScreen>
    <MessageScreen v-if="menuState.run"></MessageScreen>
  </div>
</template>

<script>
import Stats from "./Stats";
import PokeSprite from "./PokeSprite";
import MenuScreen from "./MenuScreen";
import MoveScreen from "./MoveScreen";
import MessageScreen from "./MessageScreen";

import Pokemon from "../data/Pokemon.js";

export default {
    name: "BattleGround",
    components: {
        Stats,
        PokeSprite,
        MenuScreen,
        MoveScreen,
        MessageScreen
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
                }
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
                }
            }),
            menuState: { menu: true, fight: false, item: false, run: false, pkmn: false }
        };
    },
    methods: {
        handleAttack(attacker, defender) {
            // attacker.attack(defender);

            console.log("attacking");
        },
        setScreen(screen) {
            for (var menuItem in this.menuState) {
                this.menuState[menuItem] = false;
            }
            this.menuState[screen.toLowerCase()] = true;
        }
    }
};
</script>

<style>
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
</style>
