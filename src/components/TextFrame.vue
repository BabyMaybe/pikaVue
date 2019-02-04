<template>
  <div class="TextFrame">
    <slot></slot>
  </div>
</template>


<script>
export default {
    name: "TextFrame"
};
</script>

<style>
.TextFrame {
    border: double var(--main-black) 14px;
    padding: 10px;
    border-radius: 3px;
    font-size: 32px;
    text-align: left;
    position: relative;
    width: 900px;
    background: var(--green-white);
    line-height: 1.75em;
}
</style>
