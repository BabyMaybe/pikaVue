<template>
    <div @click="selectPokemon(id)" @mouseover="updateName(name)" class="pokeball glow" :class="color">
        <div class="pokeball-dot"></div>
    </div>
</template>

<script>
export default {
    name: "Pokeball",
    props: {
        name: String,
        color: String,
        id: Number
    },
    methods: {
        selectPokemon(id) {
            this.$emit("pokemonSelected", id);
        },
        updateName(name) {
            this.$emit("nameChange", name);
        }
    }
};
</script>

<style scoped>
.pokeball {
    border: solid var(--main-black) 5px;
    height: 130px;
    width: 130px;
    border-radius: 50%;
    background-color: #e02b2b;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: 20px;
}

.pokeball::before {
    display: block;
    background: var(--green-white);
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 65px;
    border-top: solid var(--main-black) 5px;
}

.pokeball-dot {
    padding: 8px;
    background: var(--green-white);
    border: solid var(--main-black) 5px;
    border-radius: 50%;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pokeball-dot::before {
    border: solid var(--main-black) 3px;
    border-radius: 50%;
    background: var(--green-white);
    width: 25px;
    height: 25px;
    content: "?";
    display: block;
    text-align: center;
    text-indent: 4px;
    line-height: 28px;
    color: var(--green-white);
}

.red:hover {
    box-shadow: #e02b2b 0 0 150px;
}
.blue:hover {
    box-shadow: #1689de 0 0 150px;
}
.green:hover {
    box-shadow: #257f08 0 0 150px;
}
.yellow:hover {
    box-shadow: #ffd91a 0 0 150px;
}
.black:hover {
    box-shadow: var(--main-black) 0 0 150px;
}

.red:hover > .pokeball-dot::before {
    background: #e02b2b;
}
.blue:hover > .pokeball-dot::before {
    background: #1689de;
}
.green:hover > .pokeball-dot::before {
    background: #257f08;
}
.yellow:hover > .pokeball-dot::before {
    background: #ffd91a;
}
.black:hover > .pokeball-dot::before {
    background: var(--main-black);
}
</style>
