<template>
  <TextFrame class="pokemon-screen">
    <div class="name">
      <span>{{pokemon.name.toUpperCase()}}</span>
      <span>Lvl {{pokemon.lvl}}</span>
    </div>
    <table class="stat-table">
      <thead>
        <tr>
          <th>Stat</th>
          <th>Value</th>
          <th>IV</th>
          <th>EV</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Attack</td>
          <td>{{pokemon.stats.currentStats.attack}}</td>
          <td>{{pokemon.stats.IVs.attack}}</td>
          <td>{{pokemon.stats.EVs.attack}}</td>
        </tr>
        <tr>
          <td>Defense</td>
          <td>{{pokemon.stats.currentStats.defense}}</td>
          <td>{{pokemon.stats.IVs.defense}}</td>
          <td>{{pokemon.stats.EVs.defense}}</td>
        </tr>
        <tr>
          <td>Special</td>
          <td>{{pokemon.stats.currentStats.special}}</td>
          <td>{{pokemon.stats.IVs.special}}</td>
          <td>{{pokemon.stats.EVs.special}}</td>
        </tr>
        <tr>
          <td>Speed</td>
          <td>{{pokemon.stats.currentStats.speed}}</td>
          <td>{{pokemon.stats.IVs.speed}}</td>
          <td>{{pokemon.stats.EVs.speed}}</td>
        </tr>
        <tr>
          <td>HP</td>
          <td>{{pokemon.stats.currentStats.hp}}</td>
          <td>{{pokemon.stats.IVs.hp}}</td>
          <td>{{pokemon.stats.EVs.hp}}</td>
        </tr>
      </tbody>
    </table>
  </TextFrame>
</template>

<script>
import TextFrame from "./TextFrame";

export default {
    name: "PokemonScreen",
    components: {
        TextFrame
    },
    data: function() {
        return {};
    },
    props: {
        pokemon: Object
    },
    methods: {},
    created: function() {}
};
</script>

<style>
.name {
    font-size: 32px;
    /* text-transform: uppercase; */
    border-bottom: solid black 5px;
    padding: 5px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
}

.stat {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    font-size: 24px;
}

.stat-table {
    font-size: 24px;
    width: 100%;
    border-spacing: 0px;
    border-collapse: collapse;
}

th {
    /* font-size: 32px; */
    font-weight: normal;
    border-bottom: solid black 3px;
    padding: 8px 0;
}

td {
    /* text-align: center; */
    padding: 8px 0;
    border-top: solid black 2px;
    /* border: solid black 3px; */
    padding-left: 20px;
}
</style>
