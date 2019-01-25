export default class Pokemon {
    constructor(params) {
        this.name = params.name;
        this.type = params.type;
        this.xp = 0;
        this.lvl = params.lvl;
        this.stats = {
            baseStats: {
                hp: params.baseStats.hp,
                attack: params.baseStats.attack,
                defense: params.baseStats.defense,
                special: params.baseStats.special,
                speed: params.baseStats.speed
            },
            IVs: {
                attack: getRandom(0, 15),
                defense: getRandom(0, 15),
                special: getRandom(0, 15),
                speed: getRandom(0, 15),
                hp: 0
            },
            EVs: {
                attack: 0,
                defense: 0,
                special: 0,
                speed: 0,
                hp: 0
            },
            currentStats: {
                attack: 0,
                defense: 0,
                special: 0,
                speed: 0,
                hp: 0
            }
        };
        this.calculateHealthIV(this.stats.IVs);
        this.updateStats();
    }

    calculateHealthIV(IVs) {
        let hp = 0;
        hp += IVs.attack % 2 !== 0 ? 8 : 0;
        hp += IVs.defense % 2 !== 0 ? 4 : 0;
        hp += IVs.speed % 2 !== 0 ? 2 : 0;
        hp += IVs.special % 2 !== 0 ? 1 : 0;
        IVs.hp = hp;
    }

    damage(num) {
        this.stats.hp -= num;
    }

    heal(num) {
        this.stats.hp += num;
    }

    updateHealth(num) {
        this.stats.hp -= num;
    }

    attack(pokemon) {
        // const defense = pokemon.stats.defense;
        // const attack = this.stats.attack;
        // const damage = Math.max(attack - defense, 0);
        // console.log("attacks for ", damage);
        // pokemon.updateHealth(damage);
        return pokemon;
    }

    updateStats() {
        this.stats.currentStats.attack = this.complicatedMath("attack");
        this.stats.currentStats.defense = this.complicatedMath("defense");
        this.stats.currentStats.speed = this.complicatedMath("speed");
        this.stats.currentStats.special = this.complicatedMath("special");
        this.stats.currentStats.hp = this.complicatedMath("hp") + this.lvl + 5;
        this.stats.hp = this.stats.currentStats.hp;
    }

    complicatedMath(stat) {
        return (
            Math.floor(
                (((this.stats.baseStats[stat] + this.stats.IVs[stat]) * 2 +
                    Math.floor(Math.ceil(Math.sqrt(this.stats.EVs[stat])) / 4)) *
                    this.lvl) /
                    100
            ) + 5
        );
    }
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
