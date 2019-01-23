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
    width: 400px;
    height: 400px;
}
.poke-sprite-img {
    width: 200%;
    height: 200%;
    image-rendering: pixelated;
    position: relative;
    right: 50%;
    bottom: 50%;
    pointer-events: none;
}
</style>
