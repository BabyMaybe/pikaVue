<template>
  <div class="stats">
    <h1>{{pokemon.name}}</h1>
    <h2>:L{{pokemon.lvl}}</h2>
    <HealthBar :maxHealth="pokemon.stats.currentStats.hp" :curHealth="pokemon.stats.hp"></HealthBar>
  </div>
</template>

<script>
import HealthBar from "./HealthBar";
export default {
  name: "Stats",
  props: {
    pokemon: Object
    // hp: Number
  },
  // data: function() {
  //     return {
  //         name: "----",
  //         lvl: 0
  //         // hp: 0
  //     };
  // },
  components: { HealthBar }
  // created: function() {
  //     console.log(this.pokemon);
  //     // this.name = this.pokemon.name;
  //     // this.lvl = this.pokemon.lvl;
  //     // this.hp = this.pokemon.stats.hp;
  // }
};
</script>

<style>
h1 {
  font-weight: normal;
}
.stats {
  display: flex;
  flex-direction: column;
  width: 500px;
  border-bottom: solid black 5px;
  padding: 5px 20px;
}
</style>
