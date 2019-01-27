class Pokemon {
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
            },
            hp: 0
        };
        this.status = {
            fainted: false,
            poisoned: false,
            paralyzed: false,
            confused: false,
            frozen: false,
            burned: false,
            asleep: false,
            leeched: false,
            bound: false,
            flinched: false
        };
        this.calculateHealthIV(this.stats.IVs);
        this.updateStats();

        this.moveSet = params.moveSet;

        this.faintTransition = false;
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
        this.stats.hp = Math.max(this.stats.hp - num, 0);
    }

    checkFaint() {
        return this.stats.hp === 0;
    }

    applyStatus(status) {
        this.status[status] = true;
    }

    heal(num) {
        this.stats.hp = Math.min(this.stats.hp + num, this.stats.currentStats.hp);
    }

    // attack(pokemon) {
    //     // const defense = pokemon.stats.defense;
    //     // const attack = this.stats.attack;
    //     // const damage = Math.max(attack - defense, 0);
    //     // console.log("attacks for ", damage);
    //     // pokemon.updateHealth(damage);
    //     return pokemon;
    // }

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

    toString() {
        return this.name;
    }
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

class Move {
    constructor(params) {
        if (params) {
            this.name = params.move.name ? params.move.name : "----";
            this.power = params.move.power ? params.move.power : 0;
            this.type = params.move.type.name ? params.move.type.name : "----";
            this.damageClass = params.move.damage_class.name ? params.move.damage_class.name : "----";
            this.pp = params.move.pp ? params.move.pp : 0;
            this.accuracy = params.move.accuracy ? params.move.accuracy : 0;
        } else {
            this.name = "----";
            this.power = 0;
            this.type = "----";
            this.damageClass = "----";
            this.pp = 0;
            this.accuracy = 0;
        }
    }

    toString() {
        return this.name;
    }
}

export { Pokemon, Move, getRandom };
