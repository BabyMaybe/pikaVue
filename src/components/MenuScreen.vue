<template>
  <TextFrame class="menu-screen">
    <MenuItem
      v-for="item in menuItems"
      :text="item.text"
      :key="item.text"
      @click.native="selectMenu(item)"
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
    props: {
        menuItems: Array
    },
    methods: {
        selectMenu: function(item) {
            // console.log("selecting item", item.text);
            this.$emit("menuSelected", item);
        }
    }
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
