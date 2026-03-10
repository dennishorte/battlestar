module.exports = {
  id: "beneficiary-e097",
  name: "Beneficiary",
  deck: "occupationE",
  number: 97,
  type: "occupation",
  players: "1+",
  text: "If this is your 3rd occupation, you can immediately play another occupation for an occupation cost of 1 food and/or play 1 minor improvement by paying its cost.",
  onPlay(game, player) {
    if (player.getOccupationCount() === 3) {
      const hasOccInHand = player.hand.some(cardId => {
        const card = game.cards.byId(cardId)
        return card && card.type === 'occupation'
      })
      const hasMinorInHand = player.hand.some(cardId => {
        const card = game.cards.byId(cardId)
        return card && card.type === 'minor'
      })

      if (hasOccInHand && hasMinorInHand) {
        const selection = game.actions.choose(player, [
          'Play an occupation first',
          'Play a minor improvement first',
        ], {
          title: 'Beneficiary: Choose order',
          min: 1,
          max: 1,
        })

        if (selection[0] === 'Play a minor improvement first') {
          game.actions.buyMinorImprovement(player)
          game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
        }
        else {
          game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
          game.actions.buyMinorImprovement(player)
        }
      }
      else {
        game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
        game.actions.buyMinorImprovement(player)
      }
    }
  },
}
