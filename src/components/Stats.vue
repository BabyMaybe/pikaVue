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
    components: { HealthBar },
    props: {
        pokemon: Object
    }
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
