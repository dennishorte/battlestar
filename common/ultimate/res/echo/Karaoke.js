module.exports = {
  name: `Karaoke`,
  color: `purple`,
  age: 9,
  expansion: `echo`,
  biscuits: `hl9&`,
  dogmaBiscuit: `l`,
  echo: `Draw and meld a card of value less than {0}.`,
  dogma: [
    `Execute all of the non-demand dogma effects of the card you melded due to Karaoke's echo effect. Do not share them.`,
    `You may take a bottom card from your board into your hand.`
  ],
  dogmaImpl: [
    (game, player) => {
      if (!game.state.dogmaInfo.karaoke) {
        game.mLogNoEffect()
        return
      }
      const card = game.state.dogmaInfo.karaoke[player.name]
      if (card) {
        game.aCardEffects(player, card, 'dogma')
      }
    },

    (game, player) => {
      const cards = game
        .util.colors()
        .map(color => game.getBottomCard(player, color))
        .filter(card => card !== undefined)

      game.aChooseAndTransfer(player, cards, game.zones.byPlayer(player, 'hand'), { min: 0, max: 1 })
    }
  ],
  echoImpl: (game, player) => {
    if (!game.state.dogmaInfo.karaoke) {
      game.state.dogmaInfo.karaoke = {}
    }

    const effectAge = game.getEffectAge(this, 9)
    const ages = []
    for (let i = 1; i <= effectAge; i++) {
      ages.push(i)
    }

    const age = game.aChooseAge(player, ages)
    const card = game.actions.drawAndMeld(player, age)
    if (card) {
      game.state.dogmaInfo.karaoke[player.name] = card
    }
  },
}
