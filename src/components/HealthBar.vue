<template>
  <div class="health-bar-container">
    <h2 clss="hp">HP:</h2>
    <div class="health-bar">
      <div class="health" :style="{width:health}"></div>
    </div>
    <h3>{{health}}</h3>
    <div class="health-count">{{curHealth}}/{{maxHealth}}</div>
  </div>
</template>


<script>
export default {
    name: "HealthBar",
    props: {
        maxHealth: Number,
        curHealth: Number
    },
    computed: {
        health: function() {
            return Math.round(100 * this.curHealth / this.maxHealth).toString() + "%";
        }
    },
    methods: {
        updateHealth: function(change) {
            this.curHealth += change;
        }
    }
};
</script>

<style>
.hp {
    font-size: 16px;
}

.health-bar-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.health-bar {
    background: #ec2a0b;
    height: 16px;
    flex: 1;
    margin: 10px;
    border: solid var(--main-black) 4px;
    border-radius: 10px;
    overflow: hidden;
}

.health {
    background: #45cd2e;
    height: 100%;
    transition: 0.5s all;
    border-right: solid var(--main-black) 4px;
}

.health-count {
    flex: 1 1 100%;
}
</style>
