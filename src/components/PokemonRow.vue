<template>
<div class="poke-row-container">

<transition name="poke-slide">
    <div class="poke-row" :class="{player: player, wild: !player, grey: pokemon.faintTransition}" v-if="!fainted">
        <Stats :pokemon="pokemon" :hp="pokemon.stats.hp" />
        <PokeSprite :url="player ? pokemon.sprites.back : pokemon.sprites.front" v-if="!fainted" />
    </div>
</transition>

<transition name="placeholder">
    <div class="poke-row placeholder" v-if="fainted"> </div>
</transition>

</div>
</template>

<script>
import Stats from "./Stats";
import PokeSprite from "./PokeSprite";

export default {
    name: "PokemonRow",
    components: {
        Stats,
        PokeSprite
    },
    props: {
        pokemon: Object,
        player: Boolean,
        img: String
    },
    computed: {
        fainted: function() {
            return this.pokemon.status.fainted;
        }
    }
};
</script>

<style scoped>
.poke-row {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    height: 220px;
    filter: grayscale(0);
    transition: all 1s;
}

.wild > .stats {
    border-left: solid var(--main-black) 5px;
}
.player {
    align-items: flex-end;
}
.player > .stats {
    border-right: solid var(--main-black) 5px;
    order: 1;
}

.grey {
    filter: grayscale(100%);
}

.poke-slide-enter {
    right: 0%;
}
.poke-slide-leave-to {
    right: -100vw;
}

.poke-slide-enter-to,
.poke-slide-leave {
    right: 0;
}

.poke-slide-leave-active,
.poke-slide-enter-active {
    transition: all 2s ease-out;
}

.placeholder {
    transition: 0ms;
}

.placeholder-leave-to,
.placeholder-enter {
    height: 0;
    right: 100vw;
}

.placeholder-enter-to,
.placeholder-leave {
    height: 0;
    right: 0vw;
}

.placeholder-leave-active,
.placeholder-enter-active {
    transition: all 2s;
}
</style>
