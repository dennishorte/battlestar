module.exports = {
  name: `Whataboutism`,
  color: `purple`,
  age: 11,
  expansion: `base`,
  biscuits: `shps`,
  dogmaBiscuit: `s`,
  dogma: [
    `I demand you transfer a top card with a demand effect of each color from your board to my board! If you transfer any cards, exchange all cards in your score pile with all cards in my score pile!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const topDemands = game
        .getTopCards(player)
        .filter(card => card.dogma.some(effect => {
          return effect.toLowerCase().startsWith('i demand') || effect.toLowerCase().startsWith('i compel')
        }))

      let transferred = false
      for (const card of topDemands) {
        const result = game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
        if (result) {
          transferred = true
        }
      }

      if (transferred) {
        game.aExchangeZones(player, game.getZoneByPlayer(player, 'score'), game.getZoneByPlayer(leader, 'score'))
      }
    }
  ],
}
