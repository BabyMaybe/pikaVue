<template>

</template>

<script>
import PokeSprite from "./PokeSprite";
import MenuScreen from "./MenuScreen";
import MessageScreen from "./MessageScreen";

export default {
    name: "Overworld",
    components: {
        PokeSprite,
        MenuScreen,
        MessageScreen
    },
    data: function() {
        return {
            pokemon: {}
        };
    },
    props: {
        pokemon: Object
    },
    methods: {
        generatePokemon() {
            console.log("hi i need to do this still");
        }
    }
};
</script>
