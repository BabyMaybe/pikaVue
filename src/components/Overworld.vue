<template>
<div class="overworld">
<div class="poke-sprite-container">

        <PokeSprite :class="{bounce:!resting}" :url="pokemon.sprites.front"/>

</div>

    <div class="menu-container">

        <div class="b" @click="setScreen('menu')" :class="{hide: (menuState.menu || menuState.msg)}">
            <span>b</span>
        </div>

        <MenuScreen @menuSelected="handleMenuSelected" v-show="menuState.menu" :menuItems="menuItems" />
        <InventoryScreen v-show="menuState.items" @itemUsed="handleItems" :pokemon="pokemon" />
        <PokemonScreen v-show="menuState.pkmn" :pokemon="pokemon"/>
        <MessageScreen v-show="menuState.msg" :messageText="messageText" @nextClicked="handleNext" />

    </div>

</div>
</template>

<script>
import PokeSprite from "./PokeSprite";
import MenuScreen from "./MenuScreen";
import MessageScreen from "./MessageScreen";
import InventoryScreen from "./InventoryScreen";
import PokemonScreen from "./PokemonScreen";

export default {
    name: "Overworld",
    components: {
        PokeSprite,
        MenuScreen,
        MessageScreen,
        InventoryScreen,
        PokemonScreen
    },
    data: function() {
        return {
            menuItems: [{ text: "battle!" }, { text: "pkmn" }, { text: "items" }, { text: "rest" }],
            menuState: {
                menu: true,
                item: false,
                pkmn: false,
                rest: false,
                msg: false
            },
            messageText: "",
            defered: null,
            resting: false
        };
    },
    props: {
        pokemon: Object
    },
    methods: {
        waitForClick: function() {
            return new Promise(resolve => (this.defered = { resolve: resolve }));
        },

        handleNext() {
            let p = this.defered;
            p.resolve("resolving click!");
        },

        async handleMenuSelected(menuItem) {
            if (["pkmn", "items"].includes(menuItem.text)) {
                this.setScreen(menuItem.text);
            }

            if (menuItem.text === "rest") {
                this.rest();
            }

            if (menuItem.text === "battle!") {
                this.$emit("battleReady");
            }
        },

        async rest() {
            this.resting = true;
            this.setScreen("msg");
            let sleepStart = new Date();

            this.messageText = `${this.pokemon.name.toUpperCase()} is sleeping!`;
            await this.waitForClick();

            this.messageText = `Click next when you're ready to wake ${this.pokemon.name.toUpperCase()} up...`;
            await this.waitForClick();

            this.resting = false;
            this.messageText = `${this.pokemon.name.toUpperCase()} woke up!`;
            await this.waitForClick();

            let sleepEnd = new Date();
            let sleepTime = Math.floor((sleepEnd - sleepStart) / 1000);
            this.messageText = `${this.pokemon.name.toUpperCase()} recovered ${sleepTime} hp!`;
            await this.waitForClick();
            this.pokemon.heal(sleepTime);

            this.setScreen("menu");
        },
        setScreen(screen) {
            for (var menuItem in this.menuState) {
                this.menuState[menuItem] = false;
            }
            this.menuState[screen.toLowerCase()] = true;
        },
        handleItems() {
            console.log("you need to implement this still");
        }
    }
};
</script>

<style scoped>
.poke-sprite-container {
    display: flex;
    flex: 1;
    align-items: center;
}

.menu-container {
    flex: 1;
}

.overworld {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    height: 100%;
    justify-content: space-around;
    /* justify-content: flex-end; */
}

.b {
    /* top: 145px;
    left: 20px; */
    position: static;
    margin: 0;
    align-self: flex-start;
    margin-bottom: 10px;
}

.bounce {
    position: relative;
    transition: all 1s;
    left: 0;
    animation: bounce 3s ease-in-out alternate infinite;
}

@keyframes bounce {
    0% {
        left: 0;
    }
    25% {
        left: -25px;
    }
    50% {
        left: 25px;
    }
    100% {
        left: 0;
    }
}
</style>
