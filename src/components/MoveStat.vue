<template>
    <div>
        <div class="move-stat-container" >
        <div class="left-col">
            <div class="move-name">{{move.name}}</div>
            <div class="move-stat">Type: {{move.name}}</div>
            <div class="move-stat">Category: {{move.damage_class}}</div>
        </div>

        <div class="right-col">
            <div class="move-stat">PP: {{move.pp}}</div>
            <div class="move-stat">Power: {{move.power}}</div>
            <div class="move-stat">Accuracy: {{move.accuracy}}%</div>
        </div>
        </div>
    </div>

</template>

<script>
export default {
    name: "MoveStat",
    props: {
        move: Object
    }
};
</script>

<style>
.move-stat-container {
    display: flex;
    justify-content: space-between;
    margin: 10px auto;
    border: solid black 3px;
    padding: 10px;
    width: 600px;
    box-sizing: border-box;
    cursor: default;
}

.move-stat-container:hover {
    background: black;
    color: white;
}

.left-col {
    text-align: left;
    margin-left: 30px;
}

.right-col {
    text-align: right;
    margin-top: 8px;
}

.move-name {
    font-size: 24px;
    margin-left: -30px;
    margin-bottom: 10px;
    cursor: default;
}

.move-stat {
    margin-bottom: 10px;
    text-transform: capitalize;
    cursor: default;
}
</style>
