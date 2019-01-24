<template>
    <div class="move-item"
    :class="{noHighlight : isDefault }"
    @mouseover="$emit('moveHover', {name: move, type: type, pp: ppLeft, ppMax: pp})"
    @mouseleave="$emit('mouseLeave')"
    @click="use">
        <span>{{move}}</span>
    </div>
</template>

<script>
export default {
    name: "MoveItem",
    props: {
        move: { type: String, default: "----" },
        type: { type: String, default: "----" },
        pp: { type: Number, default: 0 }
    },
    data: function() {
        return {
            used: 0
            // isDefault: this.move === this.move.default
        };
    },
    computed: {
        isDefault: function() {
            return this.move === "----";
        },
        ppLeft: function() {
            return this.pp - this.used;
        }
    },
    methods: {
        use: function() {
            this.used += 1;

            this.$emit("moveHover", { name: this.move, type: this.type, pp: this.ppLeft, ppMax: this.pp });
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
