module.exports = {
  id: "beer-keg-a062",
  name: "Beer Keg",
  deck: "minorA",
  number: 62,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { grain: 2 },
  category: "Food Provider",
  text: "In the feeding phase of each harvest, you can use this card to exchange 1/2/3 grain for 0/1/2 bonus points and exactly 3 food.",
  onFeedingPhase(game, player) {
    if (player.grain < 1) {
      return
    }

    const card = this
    const selection = game.actions.choose(player, () => {
      const choices = []
      if (player.grain >= 1) {
        choices.push('Exchange 1 grain for 3 food')
      }
      if (player.grain >= 2) {
        choices.push('Exchange 2 grain for 3 food and 1 bonus point')
      }
      if (player.grain >= 3) {
        choices.push('Exchange 3 grain for 3 food and 2 bonus points')
      }
      choices.push('Skip')
      return choices
    }, {
      title: `${card.name}: Exchange grain for food?`,
      min: 1,
      max: 1,
    })

    if (selection[0] !== 'Skip') {
      const match = selection[0].match(/Exchange (\d+) grain/)
      if (match) {
        const grainCount = parseInt(match[1])
        const bonusPoints = Math.max(0, grainCount - 1)
        player.payCost({ grain: grainCount })
        player.addResource('food', 3)
        if (bonusPoints > 0) {
          player.addBonusPoints(bonusPoints)
        }
        game.log.add({
          template: '{player} exchanges {grain} grain for 3 food and {bp} bonus points using {card}',
          args: { player, grain: grainCount, bp: bonusPoints, card },
        })
      }
    }
  },
}
