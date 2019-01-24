export default class Pokemon {
  constructor(params) {
    this.stats = {
      hp: params.hp,
      attack: params.attack,
      defense: params.defense
    };
  }

  updateHealth(num) {
    this.stats.hp -= num;
  }

  attack(pokemon) {
    const defense = pokemon.stats.defense;
    const attack = this.stats.attack;
    const damage = Math.max(attack - defense, 0);
    console.log("attacks for ", damage);
    pokemon.updateHealth(damage);
  }
}
