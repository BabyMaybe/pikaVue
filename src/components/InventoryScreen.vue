<template>
  <TextFrame class="item-screen">
    <div class="scrollable-area" :style="{bottom:scrollOffset}">
      <InventoryItem
        v-for="item in filteredItems"
        :item="item.item.name"
        :quantity="item.quantity"
        :key="item.name"
        @click.native="selectItem(item)"
      />
      <InventoryItem v-if="itemList.length === 0" item="-" :quantity=0 />
      <InventoryItem v-if="itemList.length === 0" item="-" :quantity=0 />
      <InventoryItem v-if="itemList.length === 0" item="-" :quantity=0 />
      <InventoryItem v-if="itemList.length === 0" item="-" :quantity=0 />
    </div>
    <div class="controls">
      <div class="controls-button up" :class="{'hide':index === 0}" @click="handleNav(-1)">&gt;</div>
      <div
        class="controls-button down"
        :class="{'hide':index >= filteredItems.length - 4}"
        @click="handleNav(1)"
      >&gt;</div>
    </div>
  </TextFrame>
</template>

<script>
import TextFrame from "./TextFrame";
import InventoryItem from "./InventoryItem";

export default {
    name: "InventoryScreen",
    components: {
        TextFrame,
        InventoryItem
    },
    data: function() {
        return {
            itemList: [],
            index: 0
        };
    },
    props: {
        pokemon: Object
    },
    methods: {
        selectItem: function(item) {
            if (item.quantity >= 1) {
                this.$emit("itemUsed", item.item);
                item.quantity = Math.max(0, item.quantity - 1);
            } else {
                const index = this.itemList.indexOf(item);
                this.itemList.splice(index, 1);
            }
        },
        handleNav: function(t) {
            this.index = Math.min(Math.max(this.index + t, 0), this.itemList.length - 4);
        }
    },
    computed: {
        scrollOffset: function() {
            return (this.index * 64).toString() + "px";
        },
        filteredItems: function() {
            return this.itemList.filter(i => i.quantity > 0);
        }
    },
    created: function() {
        let newInv = [];

        if (this.pokemon) {
            for (let i in this.pokemon.inventory) {
                const item = this.pokemon.inventory[i];
                newInv.push({ item: item.item, quantity: item.quantity });
            }
        }
        this.itemList = newInv;
    }
    // use this for testing
    // created: function() {
    //     this.itemList = itemDB.map(i => {
    //         return { item: i, quantity: 10 };
    //     });
    // }
};
</script>

<style >
.wallet {
    border: solid var(--main-black) 5px;
    border-bottom: none;
}

.item-screen {
    display: flex;
    overflow: hidden;
    width: 900px;
    padding-top: 5px;
    user-select: none;
    box-sizing: border-box;
    line-height: 1em;
    /* margin-top: -71px; */
}

.scrollable-area {
    flex: 1;
    position: relative;
    transition: all 0.25s cubic-bezier(0.9, 0.01, 0.65, 1.12);
}

.controls {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 5px;
    margin-left: 10px;
    user-select: none;
    width: 30px;
}

.controls-button {
    cursor: pointer;
    font-size: 24px;
    text-align: center;
}

.controls-button:hover {
    font-size: 26px;
}

.controls-button:active {
    font-size: 24px;
}

.up {
    transform: rotate(-90deg);
    margin-top: 5px;
}

.hide {
    visibility: hidden;
}

.blink {
    animation: blink 1.5s ease-in-out infinite alternate;
}
.blink:hover {
    animation: none;
}

.down {
    transform: rotate(90deg);
}
</style>
