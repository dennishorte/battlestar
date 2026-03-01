module.exports = {
  name: `Legend`,
  color: `purple`,
  age: 4,
  expansion: `usee`,
  biscuits: `hlls`,
  dogmaBiscuit: `l`,
  dogma: [
    `Choose a non-purple color. Self-execute your top card of that color. Score your top card of that color. If you do, repeat this effect with the same color if you have scored fewer than nine points due to Legend during this action.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      if (!game.state.dogmaInfo.legend) {
        game.state.dogmaInfo.legend = {}
      }

      const totals = game.state.dogmaInfo.legend

      if (!totals[player.name]) {
        totals[player.name] = 0
      }

      let keepGoing = true

      const doEffect = (card) => {
        if (!card) {
          keepGoing = false
          game.log.add({ template: 'No top card remaining in ' + firstCard.color })
          return
        }
        game.actions.selfExecute(self, player, card)
        const topAfter = game.cards.top(player, firstCard.color)
        if (!topAfter) {
          keepGoing = false
          game.log.add({ template: 'No top card remaining in ' + firstCard.color })
          return
        }
        const scored = game.actions.score(player, topAfter)
        if (scored) {
          totals[player.name] += scored.getAge()
          keepGoing = totals[player.name] < 9

          if (!keepGoing) {
            game.log.add({ template: `Scored ${totals[player.name]} points due to Legend.` })
          }
        }
        else {
          keepGoing = false
          game.log.add({ template: 'Did not score the top card.' })
        }
      }

      const topNonPurple = game.cards.tops(player).filter(c => c.color !== 'purple')
      const firstCard = game.actions.chooseCard(player, topNonPurple)

      doEffect(firstCard)

      while (keepGoing) {
        const card = game.cards.top(player, firstCard.color)
        doEffect(card)
      }
    },
  ],
}
