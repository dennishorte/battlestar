module.exports = {
  name: `Blackmail`,
  color: `green`,
  age: 4,
  expansion: `usee`,
  biscuits: `hffl`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you reveal your hand! Meld a revealed card of my choice! Reveal your score pile! Self-execute a card revealed due to this effect of my choice, replacing 'may' with 'must'!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      // Reveal opponent's hand
      const hand = game.cards.byPlayer(player, 'hand')
      game.aRevealMany(player, hand)
      const toMeld = game.actions.chooseCard(leader, hand, {
        title: 'Choose a card for your opponent to meld',
      })

      if (toMeld) {
        game.aMeld(player, toMeld)
      }

      // Reveal opponent's score pile
      const score = game.cards.byPlayer(player, 'score')
      game.aRevealMany(player, score)

      const choices = [...score, ...hand]
      const toExecute = game.actions.chooseCard(leader, choices, {
        title: 'Choose a card to force opponent to self-execute',
      })
      if (toExecute) {
        game.log.add({ template: `Replacing 'may' with 'must' is almost certainly buggy. Tell Dennis what goes wrong.` })
        game.state.dogmaInfo.mayIsMust = true
        game.aSelfExecute(player, toExecute)
        game.state.dogmaInfo.mayIsMust = false
      }
    },
  ],
}
