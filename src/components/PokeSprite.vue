<template>
    <div class="poke-sprite">
        <img :src="url" alt="pokemon" class="poke-sprite-img">
    </div>
</template>

<script>
export default {
    name: "PokeSprite",
    props: {
        url: String
    }
};
</script>

<style>
.poke-sprite {
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.poke-sprite-img {
    min-width: 150%;
    height: 150%;
    image-rendering: pixelated;
    /* position: relative;
    right: 50%;
    bottom: 50%; */
    pointer-events: none;
}
</style>
