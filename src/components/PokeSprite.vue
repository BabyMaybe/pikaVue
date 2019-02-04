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
    pointer-events: none;
    user-select: none;
    opacity: 0.85;
    filter: grayscale(0.25);
}
</style>
