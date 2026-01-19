export default {
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
        .cards.tops(player)
        .filter(card => card.dogma.some(effect => {
          return effect.toLowerCase().startsWith('i demand') || effect.toLowerCase().startsWith('i compel')
        }))

      let transferred = false
      for (const card of topDemands) {
        const result = game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
        if (result) {
          transferred = true
        }
      }

      if (transferred) {
        game.aExchangeZones(player, game.zones.byPlayer(player, 'score'), game.zones.byPlayer(leader, 'score'))
      }
    }
  ],
}
