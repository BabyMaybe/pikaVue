export const itemDB = {
    potion: {
        name: "potion",
        status: "heal",
        amount: 20,
        successText: (pokemon, hp) => `${pokemon.name.toUpperCase()} recovered by ${hp}!`,
        failText: pokemon => `${pokemon.name.toUpperCase()} was already at full health!!`
    },
    "super potion": {
        name: "super potion",
        status: "heal",
        amount: 50,
        successText: (pokemon, hp) => `${pokemon.name.toUpperCase()} recovered by ${hp}!`,
        failText: pokemon => `${pokemon.name.toUpperCase()} was already at full health!!`
    },
    "hyper potion": {
        name: "hyper potion",
        status: "heal",
        amount: 200,
        successText: (pokemon, hp) => `${pokemon.name.toUpperCase()} recovered by ${hp}!`,
        failText: pokemon => `${pokemon.name.toUpperCase()} was already at full health!!`
    },
    "max potion": {
        name: "max potion",
        status: "heal",
        amount: 1000000,
        successText: (pokemon, hp) => `${pokemon.name.toUpperCase()} recovered by ${hp}!`,
        failText: pokemon => `${pokemon.name.toUpperCase()} was already at full health!!`
    },
    antidote: {
        name: "antidote",
        status: "poisoned",
        successText: pokemon => `${pokemon.name.toUpperCase()} was cured of poison!`,
        failText: pokemon => `${pokemon.name.toUpperCase()} wasn't poisoned!`
    },
    ether: {
        name: "ether",
        status: "heal",
        amount: 10,
        successText: () => `PP was restored.`,
        failText: () => `No PP needed to be restored!`
    },
    elixir: {
        name: "elixir",
        status: "heal",
        successText: () => `PP was restored.`,
        failText: () => `No PP needed to be restored!`
    },
    "full heal": {
        name: "full heal",
        status: "all",
        successText: () => `All STATUS changes are eliminated!`,
        failText: () => `All STATUS changes are eliminated!!`
    },
    "ice heal": {
        name: "ice heal",
        status: "frozen",
        successText: pokemon => `${pokemon.name.toUpperCase()} was defrosted!`,
        failText: pokemon => `${pokemon.name.toUpperCase()} wasn't frozen!`
    },
    "paralyze heal": {
        name: "paralyze heal",
        status: "paralyzed",
        successText: pokemon => `${pokemon.name.toUpperCase()}'s rid of paralysis!`,
        failText: pokemon => `${pokemon.name.toUpperCase()} wasn't poisoned!`
    },
    "burn heal": {
        name: "burn heal",
        status: "burned",
        successText: pokemon => `${pokemon.name.toUpperCase()} burn was healed!`,
        failText: pokemon => `${pokemon.name.toUpperCase()} wasn't burned!`
    },
    awakening: {
        name: "awakening",
        status: "asleep",
        successText: pokemon => `${pokemon.name.toUpperCase()} woke up!`,
        failText: pokemon => `${pokemon.name.toUpperCase()} wasn't asleep!`
    },
    revive: {
        name: "revive",
        status: "fainted",
        successText: pokemon => `${pokemon.name.toUpperCase()} came back!`,
        failText: pokemon => `${pokemon.name.toUpperCase()} wasn't fainted!`
    }
};
