<template>
  <TextFrame class="menu-screen">
    <!-- <MenuItem ref="fight" @click.native="selectMenu($refs.fight.text)" text="FIGHT"/>
    <MenuItem ref="pkmn" @click.native="selectMenu($refs.pkmn.text)" text="PKMN"/>
    <MenuItem ref="item" @click.native="selectMenu($refs.item.text)" text="ITEM"/>
    <MenuItem ref="run" @click.native="selectMenu($refs.run.text)" text="RUN"/>-->
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
      console.log(menu);
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
