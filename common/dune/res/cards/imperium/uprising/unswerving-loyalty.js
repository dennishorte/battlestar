'use strict'

const constants = require('../../../constants.js')

module.exports = {
  id: "unswerving-loyalty",
  name: "Unswerving Loyalty",
  source: "Uprising",
  compatibility: "All",
  count: 2,
  persuasionCost: 1,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [],
  spyAccess: false,
  agentAbility: null,
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "· +1 Troop\nFremen Bond:\n· You may deploy or retreat one of your troops",
  factionAffiliation: "fremen",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  revealEffect(game, player, card, allRevealedCards) {
    const recruit = Math.min(1, player.troopsInSupply)
    if (recruit > 0) {
      player.decrementCounter('troopsInSupply', recruit, { silent: true })
      player.incrementCounter('troopsInGarrison', recruit, { silent: true })
    }
    const hasFremen = allRevealedCards.some(c =>
      c !== card && constants.getFactionAffiliations(c).includes('fremen')
    )
    if (hasFremen) {
      const choices = [game.actions.option({ id: 'pass', title: 'Pass' })]
      if (player.troopsInGarrison > 0) {
        choices.push(game.actions.option({ id: 'deploy', title: 'Deploy 1 troop' }))
      }
      const deployed = game.state.conflict.deployedTroops[player.name] || 0
      if (deployed > 0) {
        choices.push(game.actions.option({ id: 'retreat', title: 'Retreat 1 troop' }))
      }
      if (choices.length > 1) {
        const [choice] = game.actions.choose(player, choices, { title: 'Fremen Bond' })
        const chId = typeof choice === 'object' ? choice.id : choice
        const isDeploy = chId === 'deploy' || (typeof choice === 'string' && choice.includes('Deploy'))
        const isRetreat = chId === 'retreat' || (typeof choice === 'string' && choice.includes('Retreat'))
        if (isDeploy) {
          player.decrementCounter('troopsInGarrison', 1, { silent: true })
          require('../../../../systems/deploy.js').deployToConflict(game, player, 1)
        }
        else if (isRetreat) {
          game.state.conflict.deployedTroops[player.name]--
          player.incrementCounter('troopsInSupply', 1, { silent: true })
        }
      }
    }
  },

  previewReveal(game, player, handCards) {
    const self = handCards.find(c => (c.definition || c).id === 'unswerving-loyalty')
    const others = handCards.filter(c => c !== self)
    const playedCards = game.zones.byId(`${player.name}.played`).cardlist()
    const hasFremen = [...others, ...playedCards].some(c =>
      constants.getFactionAffiliations(c).includes('fremen')
    )
    return {
      troops: Math.min(1, player.troopsInSupply),
      pending: hasFremen ? 'Fremen Bond — may deploy or retreat 1 troop' : null,
    }
  },

}
