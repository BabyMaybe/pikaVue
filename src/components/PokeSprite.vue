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
    width: 225px;
    height: 225px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.poke-sprite-img {
    min-width: 175%;
    height: 175%;
    image-rendering: pixelated;
    pointer-events: none;
    user-select: none;
    opacity: 0.85;
    filter: grayscale(0.25);
}
</style>
