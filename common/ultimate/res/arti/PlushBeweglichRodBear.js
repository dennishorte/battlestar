module.exports = {
  name: `Plush Beweglich Rod Bear`,
  color: `yellow`,
  age: 8,
  expansion: `arti`,
  biscuits: `lllh`,
  dogmaBiscuit: `l`,
  dogma: [
    `Choose a value. Splay up each color with a top card of the chosen value. Return all cards of the chosen value from all score piles.`
  ],
  dogmaImpl: [
    (game, player) => {
      const age = game.actions.chooseAge(player)

      game
        .utilColors()
        .map(color => game.getZoneByPlayer(player, color))
        .filter(zone => zone.cards().length >= 2 && zone.cards()[0].getAge() === age)
        .forEach(zone => game.aSplay(player, zone.color, 'up'))

      const toReturn = game
        .getPlayerAll()
        .flatMap(player => game.getCardsByZone(player, 'score'))
        .filter(card => card.getAge() === age)

      game.aReturnMany(player, toReturn)
    }
  ],
}
