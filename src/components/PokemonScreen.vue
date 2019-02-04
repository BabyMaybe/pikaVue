<template>
    <div class="spacer">
        <TextFrame class="pokemon-screen">
            <div class="name">
            <span>{{pokemon.name.toUpperCase()}}</span>
            <span>Lvl {{pokemon.lvl}}</span>
            <span>XP:{{pokemon.xp.xp}} Next:{{pokemon.xp.nextLvl}}</span>
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
    </div>
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
.spacer {
    height: 260px;
    width: 900px;
}

.pokemon-screen {
    width: 900px;
    box-sizing: border-box;
    position: absolute;
    top: -90px;
}
.name {
    font-size: 24px;
    border-bottom: solid var(--main-black) 5px;
    padding: 5px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-around;
}

.stat {
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
    font-size: 24px;
}

.stat-table {
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
    line-height: 1.25em;
}

th {
    font-size: 20px;
    font-weight: normal;
    border-bottom: solid var(--main-black) 3px;
    padding: 8px 0;
    padding-left: 20px;
    line-height: 1.5em;
}

td {
    padding: 8px 0;
    padding-left: 20px;
    border-right: solid var(--main-black) 2px;
    /* border-bottom: solid var(--main-black) 2px; */
}
td:first-child {
    padding-left: 10px;
}
tr {
    padding-left: 20px;
}
tr:nth-child(even) {
    background: #c2d5a4;
}
</style>
