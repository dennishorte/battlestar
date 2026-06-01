'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
module.exports = {
  id: "devious",
  name: "Devious",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: true,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "Trash a card from your hand OR Deploy up to 2 troops from your garrison to the Conflict",

  plotEffect(game, player) {
    const choices = []
    const handZone = game.zones.byId(`${player.name}.hand`)
    if (handZone.cardlist().length > 0) {
      choices.push(game.actions.option({ id: 'trash', title: 'Trash a card from hand' }))
    }
    if (player.troopsInGarrison > 0) {
      choices.push(game.actions.option({ id: 'deploy', title: 'Deploy up to 2 troops' }))
    }
    choices.push(game.actions.option({ id: 'pass', title: 'Pass' }))
    const [choice] = game.actions.choose(player, choices, { title: 'Devious' })
    const chId = typeof choice === 'object' ? choice.id : choice
    const isTrash = chId === 'trash' || (typeof choice === 'string' && choice.includes('Trash'))
    const isDeploy = chId === 'deploy' || (typeof choice === 'string' && choice.includes('Deploy'))
    if (isTrash) {
      const cards = handZone.cardlist()
      const card = game.actions.chooseCard(player, cards, { title: 'Trash which card?', kind: 'imperium-card' })
      if (card) {
        deckEngine.trashCard(game, card)
      }
    }
    else if (isDeploy) {
      const max = Math.min(2, player.troopsInGarrison)
      const deployChoices = []
      for (let i = 1; i <= max; i++) {
        deployChoices.push(game.actions.option({ id: `deploy-${i}`, title: `Deploy ${i}` }))
      }
      const [dc] = game.actions.choose(player, deployChoices, { title: 'How many?' })
      const dcId = typeof dc === 'object' ? dc.id : null
      const count = dcId
        ? parseInt(dcId.replace('deploy-', ''))
        : parseInt(String(dc).match(/\d+/)[0])
      player.decrementCounter('troopsInGarrison', count, { silent: true })
      require('../../../systems/deploy.js').deployToConflict(game, player, count)
    }
  },

}
