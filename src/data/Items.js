// import { itemDB } from "./Items";
export const itemDB = [
    {
        name: "potion",
        effect: "heal",
        status: "",
        amount: 20,
        successText: (pokemon, hp) => `${pokemon.name} recovered by ${hp}!`,
        failText: pokemon => `${pokemon.name} was already at full health!!`,
        dropChance: 1000
    },
    {
        name: "super potion",
        effect: "heal",
        status: "",
        amount: 50,
        successText: (pokemon, hp) => `${pokemon.name} recovered by ${hp}!`,
        failText: pokemon => `${pokemon.name} was already at full health!!`,
        dropChance: 100
    },
    {
        name: "hyper potion",
        effect: "heal",
        status: "",
        amount: 200,
        successText: (pokemon, hp) => `${pokemon.name} recovered by ${hp}!`,
        failText: pokemon => `${pokemon.name} was already at full health!!`,
        dropChance: 50
    },
    {
        name: "max potion",
        effect: "heal",
        status: "",
        amount: 1000,
        successText: (pokemon, hp) => `${pokemon.name} recovered by ${hp}!`,
        failText: pokemon => `${pokemon.name} was already at full health!!`,
        dropChance: 10
    },
    {
        name: "antidote",
        effect: "status",
        status: "poisoned",
        amount: 1,
        successText: pokemon => `${pokemon.name} was cured of poison!`,
        failText: pokemon => `${pokemon.name} wasn't poisoned!`,
        dropChance: 100
    },
    {
        name: "ether",
        effect: "recover",
        status: "pp",
        amount: 10,
        successText: () => `PP was restored.`,
        failText: () => `No PP needed to be restored!`,
        dropChance: 25
    },
    {
        name: "max ether",
        effect: "recover",
        status: "pp",
        amount: 100,
        successText: () => `PP was restored.`,
        failText: () => `No PP needed to be restored!`,
        dropChance: 5
    },
    {
        name: "elixir",
        effect: "recover",
        status: "pp-all",
        amount: 10,
        successText: () => `PP was restored.`,
        failText: () => `No PP needed to be restored!`,
        dropChance: 25
    },
    {
        name: "full heal",
        effect: "status",
        status: "all",
        amount: 1,
        successText: () => `All STATUS changes are eliminated!`,
        failText: () => `All STATUS changes are eliminated!!`,
        dropChance: 5
    },
    {
        name: "ice heal",
        effect: "status",
        status: "frozen",
        amount: 1,
        successText: pokemon => `${pokemon.name} was defrosted!`,
        failText: pokemon => `${pokemon.name} wasn't frozen!`,
        dropChance: 50
    },
    {
        name: "paralyze heal",
        effect: "status",
        status: "paralyzed",
        amount: 1,
        successText: pokemon => `${pokemon.name}'s rid of paralysis!`,
        failText: pokemon => `${pokemon.name} wasn't poisoned!`,
        dropChance: 50
    },
    {
        name: "burn heal",
        effect: "status",
        status: "burned",
        amount: 1,
        successText: pokemon => `${pokemon.name} burn was healed!`,
        failText: pokemon => `${pokemon.name} wasn't burned!`,
        dropChance: 50
    },
    {
        name: "awakening",
        effect: "status",
        status: "asleep",
        amount: 1,
        successText: pokemon => `${pokemon.name} woke up!`,
        failText: pokemon => `${pokemon.name} wasn't asleep!`,
        dropChance: 50
    },
    {
        name: "revive",
        effect: "status",
        status: "fainted",
        amount: 1,
        successText: pokemon => `${pokemon.name} came back!`,
        failText: pokemon => `${pokemon.name} wasn't fainted!`,
        dropChance: 10
    }
];

// function test(arr) {
//     let results = {};
//     for (let i = 0; i < 10000000; i++) {
//         let item = weightedPick(arr);
//         if (results[item]) {
//             results[item] = results[item] + 1;
//         } else {
//             results[item] = 1;
//         }
//     }
//     console.table( results );
// }
