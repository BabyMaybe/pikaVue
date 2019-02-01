import { genOneStats } from "./genOneStats";

class Pokemon {
    constructor(pokemon, species, lvl) {
        this.sprites = {
            front: pokemon.sprites.front_default,
            back: pokemon.sprites.back_default
        };
        this.index = pokemon.id;
        this.name = pokemon.name.toUpperCase();
        this.type = pokemon.types.map(type => type.type.name);
        this.xp = {
            xp: 1,
            growthRate: species.growth_rate.name, //fast, medium fast, medium slow, slow
            nextLvl: 0,
            growthFormulas: {
                fast: function(lvl) {
                    return Math.floor((4 * Math.pow(lvl, 3)) / 5);
                },
                medium: function(lvl) {
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
                attack: pokemon.stats[4].base_stat,
                defense: pokemon.stats[3].base_stat,
                special: genOneStats[pokemon.name].special,
                speed: pokemon.stats[0].base_stat,
                hp: pokemon.stats[5].base_stat
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

        this.xp.xp = this.xp.growthFormulas[this.xp.growthRate](lvl);

        this.allMoves = pokemon.moves
            .reduce((acc, move) => {
                const redBlueDetails = move.version_group_details.find(vgd => vgd.version_group.name === "red-blue");
                if (redBlueDetails) {
                    const m = {
                        name: move.move.name.toUpperCase(),
                        url: move.move.url,
                        lvlLearned: redBlueDetails.level_learned_at,
                        learnMethod: redBlueDetails.move_learn_method.name
                    };
                    acc.push(m);
                }
                return acc;
            }, [])
            .sort((a, b) => a.lvlLearned - b.lvlLearned);

        this.moveSet = [];
        this.addRandomMoves();

        this.faintTransition = false;
    }

    availableMoves() {
        return this.allMoves.filter(m => m.lvlLearned <= this.lvl);
    }

    allNaturalMoves() {
        return this.allMoves.filter(move => move.learnMethod === "level-up");
    }

    availableNaturalMoves() {
        return this.availableMoves().filter(move => move.learnMethod === "level-up");
    }

    async addMove(move) {
        const request = move.url;
        let moveData;
        await fetch(request)
            .then(response => response.json())
            .then(data => (moveData = data));

        const newMove = new Move(moveData);
        if (this.moveSet.length < 4) {
            this.moveSet.push(newMove);
        } else {
            console.log("need to delete moves first");
        }
    }

    addRandomMoves() {
        let moves = this.availableNaturalMoves();
        let len = moves.length;
        console.log(moves);
        for (let i = 0; i < Math.min(4, len); i++) {
            const index = getRandom(0, moves.length - 1);
            const m = moves[index];
            if (m) {
                this.addMove(m);
                moves.splice(index, 1);
            }
        }
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

    updateStats() {
        this.stats.currentStats.attack = this.complicatedMath("attack");
        this.stats.currentStats.defense = this.complicatedMath("defense");
        this.stats.currentStats.speed = this.complicatedMath("speed");
        this.stats.currentStats.special = this.complicatedMath("special");
        this.stats.currentStats.hp = this.complicatedMath("hp") + this.lvl + 5;
        this.stats.hp = this.stats.currentStats.hp;
        this.xp.nextLvl = this.xp.growthFormulas[this.xp.growthRate](this.lvl + 1);
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
        console.log("needs level up!");
        return this.xp.xp >= this.xp.nextLvl;
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
    constructor(moveData) {
        this.name = moveData.names.find(n => n.language.name === "en").name;
        this.power = moveData.power;
        this.type = moveData.type.name;
        this.damageClass = moveData.damage_class.name;
        this.pp = moveData.pp;
        this.accuracy = moveData.accuracy;
    }

    toString() {
        return this.name;
    }
}

export { Pokemon, Move, getRandom };
