<template>
  <TextFrame class="menu-screen">
    <MenuItem
      v-for="itemText in menuItemsText"
      :text="itemText"
      :key="itemText"
      @click.native="selectMenu(itemText)"
    />
  </TextFrame>
</template>

<script>
import MenuItem from "./MenuItem";
import TextFrame from "./TextFrame";

export default {
  name: "MenuScreen",
  components: {
    MenuItem,
    TextFrame
  },
  data: function() {
    return {
      menuItemsText: ["FIGHT", "PKMN", "ITEM", "RUN"]
    };
  },
  methods: {
    selectMenu: function(menu) {
      this.$emit("menuSelected", menu);
    }
  },
  created: function() {}
};
</script>

<style>
.menu-screen {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
}
</style>
