module.exports = {
  name: `Plush Beweglich Rod Bear`,
  color: `yellow`,
  age: 8,
  expansion: `arti`,
  biscuits: `lllh`,
  dogmaBiscuit: `l`,
  dogma: [
    `Choose a value. Splay up each color on your board with a top card of the chosen value. Return all cards of the chosen value from all score piles.`
  ],
  dogmaImpl: [
    (game, player) => {
      const age = game.actions.chooseAge(player)

      game
        .util
        .colors()
        .map(color => game.zones.byPlayer(player, color))
        .filter(zone => zone.cardlist().length >= 2 && zone.cardlist()[0].getAge() === age)
        .forEach(zone => game.actions.splay(player, zone.color, 'up'))

      const toReturn = game
        .players.all()
        .flatMap(player => game.cards.byPlayer(player, 'score'))
        .filter(card => card.getAge() === age)

      game.actions.returnMany(player, toReturn)
    }
  ],
}
