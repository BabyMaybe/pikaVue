<template>
  <div
    class="move-item"
    :class="{noHighlight : isDefault }"
    @mouseover="$emit('moveHover', {name: move.name, type: move.type, pp: ppLeft, ppMax: move.pp})"
    @mouseleave="$emit('moveLeave')"
    @click="use"
  >
    <span>{{move.name}}</span>
  </div>
</template>

<script>
export default {
    name: "MoveItem",
    props: {
        move: { Object }
        // move: {
        //     name: { String, default: "----" },
        //     type: { String, default: "----" },
        //     power: { type: Number, default: 0 },
        //     type: { type: String, default: "----" },
        //     damageClass: { type: String, default: "----" },
        //     pp: { type: Number, default: 0 },
        //     accuracy: { type: Number, default: 0 }
        // }
    },
    data: function() {
        return {
            used: 0
        };
    },
    computed: {
        isDefault: function() {
            return this.move.name === "----";
        },
        ppLeft: function() {
            return this.move.pp - this.used;
        }
    },
    methods: {
        use: function() {
            this.used += 1;
            this.$emit("moveHover", {
                name: this.move.name,
                type: this.move.type,
                pp: this.ppLeft,
                ppMax: this.move.pp
            });
        }
    }
};
</script>

<style>
.move-item {
    flex: 1 1 100%;
    text-align: center;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
    padding: 8px;
    text-transform: uppercase;
}

.move-item:hover {
    background: black;
    color: white;
}

.noHighlight:hover {
    background: inherit;
    color: inherit;
    cursor: default;
}
</style>
