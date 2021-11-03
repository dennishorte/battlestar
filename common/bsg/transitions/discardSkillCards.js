const util = require('../../lib/util.js')


module.exports = discardSkillCards


function discardSkillCards(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const playerSkillCards = game.getCardsKindByPlayer('skill', player)

  if (context.response) {
    const selected = context.response.option
    util.assert(Array.isArray(selected), "Discard choices should be in an array")

    const cards = playerSkillCards.filter(c => selected.includes(c.id))
    util.assert(cards.length === selected.length, "Couldn't find all the submitted cards")

    game.aDiscardSkillCards(player, cards)

    return context.done()
  }

  else {
    return context.wait({
      actor: player.name,
      actions: [{
        name: 'Discard Skill Cards',
        count: context.data.count,
        options: playerSkillCards.map(c => c.id),
      }],
    })
  }
}
