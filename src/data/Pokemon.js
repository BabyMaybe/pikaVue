import { genOneStats } from "./genOneStats";

class Pokemon {
    constructor(pokemon, species, lvl) {
        // const index = pokemon.id;
        this.name = pokemon.name;
        this.type = pokemon.types.map(type => type.name);
        this.xp = {
            xp: 0,
            growthRate: species.growth_rate.name, //fast, medium fast, medium slow, slow
            nextLvl: 0,
            growthFormulas: {
                fast: function(lvl) {
                    return Math.floor((4 * Math.pow(lvl, 3)) / 5);
                },
                "medium-fast": function(lvl) {
                    return Math.pow(lvl, 3);
                },
                "medium-slow": function(lvl) {
                    return Math.max(
                        Math.floor((6 / 5) * Math.pow(lvl, 3) - 15 * Math.pow(lvl, 2) + 100 * lvl - 140),
                        0
                    );
                },
                slow: function(lvl) {
                    return Math.floor((5 * Math.pow(lvl, 3)) / 4);
                }
            }
        };
        this.lvl = lvl;
        this.stats = {
            baseStats: {
                attack: pokemon.stats[4].baseStat,
                defense: pokemon.stats[3].baseStat,
                special: genOneStats[pokemon.name].special,
                speed: pokemon.stats[0].baseStat,
                hp: pokemon.stats[5].baseStat
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

        // this.moveSet = params.moveSet;

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
        const startHealth = this.stats.hp;
        this.stats.hp = Math.min(this.stats.hp + num, this.stats.currentStats.hp);
        const recovered = this.stats.hp - startHealth;
        return recovered;
    }

    initXP() {
        this.xp.xp = 1;
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

    //handle defeating another pokemon
    digest(pkmn) {
        // Add defeated pokemon's base stats to EVs
        for (let stat in pkmn.stats.baseStats) {
            this.stats.EVs[stat] += pkmn.stats.baseStats[stat];
        }
        // Add experience
    }

    gainXp(pkmn) {
        const a = 1; //wild: 1, trainer: 1.5
        const t = 1; //caught: 1, trade: 1.5
        const b = genOneStats[pkmn.name.toLowerCase()].baseExperience; //lookup table base xp
        const e = 1; //luck egg: 1.5, no egg: 1
        const L = pkmn.lvl; //defeated level
        const p = 1; //xp point power
        const f = 1; //affection 2+ <3: 1.2, no: 1
        const v = 1; //unevolved: 1.2, else: 1
        const s = 1; //num pokemon participated in battle who did not faint

        const xpGained = Math.floor((a * t * b * e * L * p * f * v) / (7 * s));

        this.xp.xp += xpGained;
        return xpGained;
    }

    needsLevel() {
        return this.xp >= this.nextLvl;
    }

    levelUp() {
        this.lvl = Math.min(this.lvl + 1, 100);
        this.xp.nextLvl = this.xp.growthFormulas[this.xp.growthRate](this.lvl);
        this.updateStats();
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
