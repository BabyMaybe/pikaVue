<template>
<div>
    <h1>Choose your Pokemon!</h1>
    <div class="selection-screen">
        <div @mouseover="updateName('Charmander')" @mouseleave="updateName('')" class="pokeball glow glow-red">
            <div class="pokeball-dot"></div>
        </div>
        <div @mouseover="updateName('Squirtle')" @mouseleave="updateName('')" class="pokeball glow glow-blue">
            <div class="pokeball-dot"></div>
        </div>
        <div @mouseover="updateName('Bulbasaur')" @mouseleave="updateName('')" class="pokeball glow glow-green">
            <div class="pokeball-dot"></div>
        </div>
        <div @mouseover="updateName('Pikachu')" @mouseleave="updateName('')" class="pokeball glow glow-yellow">
            <div class="pokeball-dot"></div>
        </div>
        <div @mouseover="updateName('Mystery')" @mouseleave="updateName('')" class="pokeball glow glow-black">
            <div class="pokeball-dot"></div>
        </div>
    </div>
    <h2>{{pokemonName}}</h2>


</div>

</template>

<script>
export default {
    name: "Selection",
    components: {},
    props: {
        text: String
    },
    data: function() {
        return {
            pokemonName: ""
        };
    },
    methods: {
        updateName(name) {
            this.pokemonName = name;
        }
    },
    created: function() {
        console.log("component created");
    }
};
</script>

<style scoped>
.selection-screen {
    border: double black 25px;
    display: flex;
    justify-content: space-evenly;
    padding: 50px;
    border-width: 25px 0 25px 0;
}

.pokeball {
    border: solid black 5px;
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
}

.pokeball::before {
    display: block;
    background: white;
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 65px;
    border-top: solid black 5px;
}

.pokeball-dot {
    padding: 8px;
    background: white;
    border: solid black 5px;
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
    border: solid black 3px;
    border-radius: 50%;
    background: white;
    width: 25px;
    height: 25px;
    content: "?";
    display: block;
    text-align: center;
    text-indent: 4px;
    line-height: 28px;
    color: white;
}

.glow-red:hover {
    box-shadow: #e02b2b 0 0 35px;
}
.glow-blue:hover {
    box-shadow: #1689de 0 0 35px;
}
.glow-green:hover {
    box-shadow: #47a047 0 0 35px;
}
.glow-yellow:hover {
    box-shadow: #ffd91a 0 0 35px;
}
.glow-black:hover {
    box-shadow: black 0 0 35px;
}

.glow-red:hover > .pokeball-dot::before {
    background: #e02b2b;
}
.glow-blue:hover > .pokeball-dot::before {
    background: #1689de;
}
.glow-green:hover > .pokeball-dot::before {
    background: #47a047;
}
.glow-yellow:hover > .pokeball-dot::before {
    background: #ffd91a;
}
.glow-black:hover > .pokeball-dot::before {
    background: black;
}
</style>
