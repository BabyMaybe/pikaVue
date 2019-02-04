<template>
  <div class="menu-item">
    <span>{{text}}</span>
  </div>
</template>

<script>
export default {
    name: "MenuItem",
    props: {
        text: String
    }
};
</script>

<style scoped>
.menu-item {
    flex: 1 1 50%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    padding: 25px;
    text-transform: uppercase;
}

.menu-item:hover {
    background: var(--main-black);
    color: var(--green-white);
}
</style>
