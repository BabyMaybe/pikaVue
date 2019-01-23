<template>
    <div class="stats">
        <h1>{{pokemon}}</h1>
        <h2>:L{{level}}</h2>
        <HealthBar></HealthBar>
    </div>
</template>

<script>
import HealthBar from "./HealthBar";
export default {
    name: "Stats",
    props: {
        pokemon: String,
        level: Number
    },
    components: { HealthBar }
};
</script>

<style>
.stats {
    display: flex;
    flex-direction: column;
    width: 500px;
    border-bottom: solid black 5px;
    padding: 5px 20px;
}
</style>
