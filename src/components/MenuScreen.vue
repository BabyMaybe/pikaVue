<template>
    <TextFrame class="menu-screen">
        <MenuItem text="FIGHT" />
        <MenuItem text="PKMN" />
        <MenuItem text="ITEM" />
        <MenuItem text="RUN" />
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
