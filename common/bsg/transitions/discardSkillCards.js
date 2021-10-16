const util = require('../../lib/util.js')


module.exports = discardSkillCards


function discardSkillCards(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const playerSkillCards = game.getCardsKindByPlayer('skill', player)

  if (context.response) {
    util.assert(Array.isArray(context.response), "Discard choices should be in an array")

    const cards = playerSkillCards.filter(c => context.response.includes(c.id))
    util.assert(cards.length === context.response.length, "Couldn't find all the submitted cards")

    game.aDiscardSkillCards(player, cards)

    return context.done()
  }

  else {
    return context.wait({
      name: player.name,
      actions: [{
        name: 'Discard Skill Card',
        count: context.data.count,
        options: playerSkillCards.map(c => c.id),
      }],
    })
  }
}
