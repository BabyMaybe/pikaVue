function randomBetween(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function weightedPick(arr) {
    let sum_of_weights = 0;
    for (let i = 0; i < arr.length; i++) {
        sum_of_weights += arr[i].dropChance;
    }
    let rand = randomBetween(0, sum_of_weights);
    for (let i = 0; i < arr.length; i++) {
        const dc = arr[i].dropChance;
        if (rand < dc) {
            return arr[i];
        }
        rand -= dc;
    }
}

export { randomBetween, weightedPick };
