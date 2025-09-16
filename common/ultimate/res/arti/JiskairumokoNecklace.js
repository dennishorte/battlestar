module.exports = {
  name: `Jiskairumoko Necklace`,
  color: `green`,
  age: 1,
  expansion: `arti`,
  biscuits: `hckk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I compel you to return a card from your score pile! if you do, transfer an achievement of the same value from your achievements to mine!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const cards = game.aChooseAndReturn(player, game.getCardsByZone(player, 'score'))
      if (cards && cards.length > 0) {
        const card = cards[0]
        const choices = game
          .getCardsByZone(player, 'achievements')
          .filter(ach => ach.age === card.age)
        game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'achievements'))
      }
    }
  ],
}
