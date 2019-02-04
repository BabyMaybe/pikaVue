<template>
  <div class="menu-item">
    <span class="item">{{item}}</span>
    <span class="x">x</span>
    <span class="quantity">{{quantity}}</span>
  </div>
</template>

<script>
export default {
    name: "InventoryItem",
    props: {
        item: String,
        quantity: Number
    }
};
</script>

<style scoped>
.menu-item {
    display: flex;
    box-sizing: border-box;
    cursor: pointer;
    padding: 20px;
    font-size: 24px;
}

.menu-item:hover {
    background: var(--main-black);
    color: var(--green-white);
}

.item {
    flex: 1;
}

.quantity {
    width: 65px;
    text-align: right;
    margin-left: 20px;
}
</style>
