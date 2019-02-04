<template>
  <div
    class="move-item"
    :class="{noHighlight : isDefault }"
    @mouseover="$emit('moveHover', {name: move.name, type: move.type, pp: move.pp, ppMax: move.ppMax})"
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
        move: Object
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
            if (this.move.pp > 0) {
                this.move.pp -= 1;
                this.$emit("useAttock", this.move);
            }
        }
    }
};
</script>

<style scoped>
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
    background: var(--main-black);
    color: var(--green-white);
}

.noHighlight:hover {
    background: inherit;
    color: inherit;
    cursor: default;
}
</style>
