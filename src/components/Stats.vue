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
h1,
h2 {
    font-weight: normal;
    margin: 5px 0;
}
.stats {
    display: flex;
    flex-direction: column;
    width: 450px;
    border-bottom: solid var(--main-black) 3px;
    padding: 10px 20px;
}
</style>
