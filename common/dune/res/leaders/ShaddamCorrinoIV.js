'use strict'

module.exports = {
  name: 'Shaddam Corrino IV',
  source: 'Uprising',
  compatibility: 'Uprising',
  house: 'Corrino',
  startingEffect: null,
  leaderAbility: 'Sardaukar Commander\nSet aside both Sardaukar contracts. Only you can acquire them.',
  signetRingAbility: 'Emperor of the Known Universe\nUnits can\'t be deployed to the Conflict this turn.\n· +1 Solari and +1 Troop\n  OR\n· Pay 3 Solari → +1 Influence',
  complexity: 2,

  onAssign(game, player) {
    const contractDeck = game.zones.byId('common.contractDeck')
    const contractMarket = game.zones.byId('common.contractMarket')
    const contractReserved = game.zones.byId('common.contractReserved')
    const allContracts = [...contractDeck.cardlist(), ...contractMarket.cardlist()]
    const sardaukarContracts = allContracts.filter(c => c.name === 'Sardaukar')

    if (!game.state.shaddamReservedContracts) {
      game.state.shaddamReservedContracts = []
    }
    for (const contract of sardaukarContracts) {
      game.state.shaddamReservedContracts.push(contract.id)
      contract.moveTo(contractReserved)
    }
    if (sardaukarContracts.length > 0) {
      const choam = require('../../systems/choam.js')
      choam.refillContractMarket(game, { silent: true })
      game.log.add({
        template: '{player}: Sardaukar Commander — {count} Sardaukar contract(s) set aside',
        args: { player, count: sardaukarContracts.length },
      })
    }
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    if (!game.state.turnTracking) {
      game.state.turnTracking = {}
    }
    game.state.turnTracking.shaddamNoDeploy = true

    const constants = require('../constants.js')
    const factions = require('../../systems/factions.js')

    const choices = []
    choices.push(game.actions.option({ id: 'gain', title: '+1 Solari and +1 Troop' }))
    if (player.solari >= 3) {
      choices.push(game.actions.option({ id: 'pay-influence', title: 'Pay 3 Solari → +1 Influence' }))
    }
    const [choice] = game.actions.choose(player, choices, {
      title: 'Emperor of the Known Universe',
    })
    const chId = typeof choice === 'object' ? choice.id : choice
    const isGain = chId === 'gain' || (typeof choice === 'string' && choice.startsWith('+1 Solari'))
    if (isGain) {
      player.incrementCounter('solari', 1, { silent: true })
      player.incrementCounter('troopsInGarrison', 1, { silent: true })
      game.log.add({
        template: '{player}: Emperor — +1 Solari, +1 Troop (units cannot deploy this turn)',
        args: { player },
      })
    }
    else {
      player.decrementCounter('solari', 3, { silent: true })
      const factionChoices = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
      const [factionChoice] = game.actions.choose(player, factionChoices, {
        title: 'Emperor: Choose faction for +1 Influence',
      })
      const faction = typeof factionChoice === 'object' ? factionChoice.id : factionChoice
      factions.gainInfluence(game, player, faction)
      game.log.add({
        template: '{player}: Emperor — pays 3 Solari, +1 Influence with {faction} (units cannot deploy this turn)',
        args: { player, faction },
      })
    }
  },
}
