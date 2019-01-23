<template>
    <div class="battleground">

    <div class="wild-pokemon poke-row">
        <Stats :level=95 pokemon="Charmander" />
        <PokeSprite :url="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'" />
    </div>

    <div class="player poke-row">
        <PokeSprite :url="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png'"/>
        <Stats :level=100 pokemon="Pikachu" />
    </div>

    <TextFrame></TextFrame>

    </div>
</template>

<script>
import Stats from "./Stats";
import TextFrame from "./TextFrame";
import PokeSprite from "./PokeSprite";

export default {
    name: "BattleGround",
    components: {
        Stats,
        TextFrame,
        PokeSprite
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
