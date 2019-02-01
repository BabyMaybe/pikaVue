<template>
    <div >
        <div class="move-stat-container" v-if="this.ready">
        <div class="left-col">
            <div class="move-name">{{name}}</div>
            <div class="move-stat">Type: {{type}}</div>
            <div class="move-stat">Category: {{category}}</div>
        </div>

        <div class="right-col">
            <div class="move-stat">PP: {{pp}}</div>
            <div class="move-stat">Power: {{power}}</div>
            <div class="move-stat">Accuracy: {{accuracy}}%</div>
        </div>
        </div>
    </div>

</template>

<script>
export default {
    name: "MoveStat",
    props: {
        name: String,
        url: String
    },
    data: function() {
        return {
            type: "",
            category: "",
            pp: "",
            power: "",
            accuracy: "",
            ready: false
        };
    },
    created: function() {
        fetch(this.url)
            .then(r => r.json())
            .then(move => {
                this.type = move.type.name;
                this.category = move.damage_class.name;
                this.pp = move.pp;
                this.power = move.power;
                this.accuracy = move.accuracy;
                this.ready = true;
            });
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
}

.move-stat {
    margin-bottom: 10px;
    text-transform: capitalize;
}
</style>
