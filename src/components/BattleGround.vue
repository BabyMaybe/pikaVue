<template>
  <div class="battleground">
    <div class="wild-pokemon poke-row">
      <Stats :level="95" pokemon="Charmander" :hp="wild.stats.hp"/>
      <PokeSprite
        :url="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'"
      />
    </div>

    <div class="player poke-row">
      <PokeSprite
        :url="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png'"
      />
      <Stats :level="100" pokemon="Pikachu" :hp="player.stats.hp"/>
    </div>
    <button @click="handleAttack(player,wild)">Attack!</button>

    <TextFrame>
      <TextFrame>Text</TextFrame>
    </TextFrame>
  </div>
</template>

<script>
import Stats from "./Stats";
import TextFrame from "./TextFrame";
import PokeSprite from "./PokeSprite";
import Pokemon from "../data/Pokemon.js";

export default {
  name: "BattleGround",
  components: {
    Stats,
    TextFrame,
    PokeSprite
  },
  data: function() {
    return {
      player: new Pokemon({ hp: 100, attack: 15, defense: 20 }),
      wild: new Pokemon({ hp: 100, attack: 25, defense: 10 })
    };
  },
  methods: {
    handleAttack(attacker, defender) {
      console.log("defender health: ", defender.stats.hp);
      attacker.attack(defender);
      console.log("defender health: ", defender.stats.hp);
    }
  }
};
</script>

<style>
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
</style>
