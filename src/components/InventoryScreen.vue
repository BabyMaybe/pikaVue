<template>
  <TextFrame class="item-screen">
    <div class="scrollable-area" :style="{bottom:scrollOffset}">
      <InventoryItem
        v-for="item in filteredItems"
        :item="item.name"
        :quantity="item.quantity"
        :key="item.name"
        @click.native="selectItem(item)"
      />
    </div>
    <div class="controls">
      <div class="controls-button up" :class="{'hide':index === 0}" @click="handleClick(-1)">&gt;</div>
      <div
        class="controls-button down"
        :class="{'hide':index >= filteredItems.length - 4}"
        @click="handleClick(1)"
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
      itemList: [
        { name: "potion", quantity: 10 },
        { name: "antidote", quantity: 7 },
        { name: "ether", quantity: 3 },
        { name: "elixer", quantity: 13 },
        { name: "full heal", quantity: 10 },
        { name: "ice heal", quantity: 8 },
        { name: "paralyze heal", quantity: 6 },
        { name: "revive", quantity: 2 },
        { name: "super potion", quantity: 4 },
        { name: "awakening", quantity: 13 },
        { name: "burn heal", quantity: 5 }
      ],
      index: 0
    };
  },
  methods: {
    selectItem: function(item) {
      item.quantity--;
    },
    handleClick: function(t) {
      this.index = Math.min(
        Math.max(this.index + t, 0),
        this.itemList.length - 4
      );
    }
  },
  computed: {
    scrollOffset: function() {
      return (this.index * 64).toString() + "px";
    },
    filteredItems: function() {
      return this.itemList.filter(i => i.quantity > 0);
    }
  }
  //   created: function() {
  //     console.log("created");
  //   }
};
</script>

<style >
.item-screen {
  display: flex;
  overflow: hidden;
  height: 250px;
  padding-top: 5px;
  user-select: none;
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

@keyframes blink {
  0% {
    opacity: 1;
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
