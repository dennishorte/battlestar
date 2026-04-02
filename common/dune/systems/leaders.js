const { parseAgentAbility } = require('./cardEffects.js')

/**
 * Leader system for Dune Imperium: Uprising.
 *
 * Each player selects a leader at game start. Leaders provide:
 * - leaderAbility: A passive or triggered effect during play
 * - signetRingAbility: Activated when the Signet Ring card is played
 * - startingEffect: Optional game-start modification
 */

/**
 * Initialize leaders: deal 2 to each player, all choose simultaneously.
 */
function selectLeaders(game) {
  // Skip if leaders already assigned (e.g. by test fixture)
  if (game.players.all().every(p => game.state.leaders[p.name])) {
    return
  }

  const leaderData = require('../res/leaders/index.js')
  const settings = game.settings

  // Filter leaders by compatibility
  let available = leaderData.filter(l => {
    if (l.compatibility === 'All') {
      return true
    }
    if (l.compatibility === 'Uprising') {
      return true
    }
    return false
  })

  // Shaddam Corrino IV requires CHOAM module
  if (!settings.useCHOAM) {
    available = available.filter(l => l.name !== 'Shaddam Corrino IV')
  }

  // Shuffle
  const shuffled = [...available]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(game.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  // Deal 2 leaders to each player
  const dealt = {}
  for (const player of game.players.all()) {
    dealt[player.name] = [shuffled.pop(), shuffled.pop()]
  }

  // All players choose simultaneously
  const selectors = game.players.all().map(player => ({
    actor: player.name,
    title: 'Choose a Leader',
    choices: dealt[player.name].map(l => l.name),
  }))

  const responses = game.requestInputMany(selectors)

  for (const response of responses) {
    const player = game.players.byName(response.actor)
    const chosenName = response.selection[0]
    const leader = dealt[player.name].find(l => l.name === chosenName)
    assignLeader(game, player, leader)
  }
}

/**
 * Assign a leader to a player and apply starting effects.
 */
function assignLeader(game, player, leader) {
  game.state.leaders[player.name] = leader

  game.log.add({
    template: '{player} is {leader}',
    args: { player, leader: leader.name },
  })

  // Apply starting effects for known leaders
  if (leader.name.includes('Rabban')) {
    player.incrementCounter('spice', 1, { silent: true })
    player.incrementCounter('solari', 1, { silent: true })
    game.log.add({
      template: '{player} gains 1 Spice and 1 Solari (Arrakis Fiefdom)',
      args: { player },
    })
  }

  if (leader.name === 'Staban Tuek') {
    // Remove Diplomacy from deck
    const deck = game.zones.byId(`${player.name}.deck`)
    const diplomacy = deck.cardlist().find(c => c.name === 'Diplomacy')
    if (diplomacy) {
      const trash = game.zones.byId('common.trash')
      diplomacy.moveTo(trash)
      game.log.add({
        template: '{player} starts without Diplomacy (Limited Allies)',
        args: { player },
      })
    }
  }

  if (leader.name === 'Princess Yuna Moritani') {
    // Start with no Water
    player.setCounter('water', 0, { silent: true })
    game.log.add({
      template: '{player} starts with no Water (Smuggling Operation)',
      args: { player },
    })
  }

  if (leader.name === 'Baron Vladimir Harkonnen') {
    if (!game.state.leaderBonusTriggered) {
      game.state.leaderBonusTriggered = {}
    }
  }

  if (leader.name === 'Shaddam Corrino IV') {
    // Set aside both Sardaukar contracts — only Shaddam can take them
    if (game.settings.useCHOAM) {
      const contractDeck = game.zones.byId('common.contractDeck')
      const contractMarket = game.zones.byId('common.contractMarket')
      const allContracts = [...contractDeck.cardlist(), ...contractMarket.cardlist()]
      const sardaukarContracts = allContracts.filter(c => c.name === 'Sardaukar')

      if (!game.state.shaddamReservedContracts) {
        game.state.shaddamReservedContracts = []
      }

      for (const contract of sardaukarContracts) {
        game.state.shaddamReservedContracts.push(contract.id)
      }

      if (sardaukarContracts.length > 0) {
        game.log.add({
          template: '{player}: Sardaukar Commander — {count} Sardaukar contract(s) reserved',
          args: { player, count: sardaukarContracts.length },
        })
      }
    }
  }

  if (leader.name === 'Feyd-Rautha Harkonnen') {
    if (!game.state.feydTrack) {
      game.state.feydTrack = {}
    }
    game.state.feydTrack[player.name] = 'start'
  }

  if (leader.name === 'Lady Jessica') {
    if (!game.state.jessicaMemories) {
      game.state.jessicaMemories = {}
    }
    if (!game.state.jessicaFlipped) {
      game.state.jessicaFlipped = {}
    }
    game.state.jessicaMemories[player.name] = 0
    game.state.jessicaFlipped[player.name] = false
  }
}

/**
 * Resolve Signet Ring ability for a player.
 * Called when the Signet Ring card is played as an agent.
 */
function resolveSignetRing(game, player, resolveEffectFn) {
  const leader = game.state.leaders[player.name]
  if (!leader) {
    return
  }

  const abilityText = leader.signetRingAbility
  if (!abilityText) {
    return
  }

  game.log.add({
    template: '{player} activates Signet Ring: {ability}',
    args: { player, ability: leader.name },
  })

  // Lady Jessica: front = Spice Agony, back = Water of Life
  if (leader.name === 'Lady Jessica') {
    const isFlipped = game.state.jessicaFlipped?.[player.name]
    if (!isFlipped) {
      // Spice Agony: Pay 1 spice → +1 intrigue card, move 1 troop from supply to memories
      if (player.spice >= 1 && player.troopsInSupply > 0) {
        const choices = ['Pass', 'Spice Agony (1 Spice → 1 Intrigue + 1 Memory)']
        const [choice] = game.actions.choose(player, choices, {
          title: 'Lady Jessica: Activate Spice Agony?',
        })
        if (choice !== 'Pass') {
          player.decrementCounter('spice', 1, { silent: true })
          const deckEngine = require('./deckEngine.js')
          deckEngine.drawIntrigueCard(game, player, 1)
          player.decrementCounter('troopsInSupply', 1, { silent: true })
          game.state.jessicaMemories[player.name]++
          game.log.add({
            template: '{player}: Spice Agony — pays 1 Spice, draws Intrigue, troop becomes a Memory ({count} total)',
            args: { player, count: game.state.jessicaMemories[player.name] },
          })
        }
      }
    }
    else {
      // Water of Life: Pay 1 spice → +1 water
      if (player.spice >= 1) {
        player.decrementCounter('spice', 1, { silent: true })
        player.incrementCounter('water', 1, { silent: true })
        game.log.add({
          template: '{player}: Water of Life — pays 1 Spice, gains 1 Water',
          args: { player },
        })
      }
    }
    return
  }

  // Feyd-Rautha: Training Track (special handling)
  if (leader.name === 'Feyd-Rautha Harkonnen') {
    const leaderAbilities = require('./leaderAbilities.js')
    leaderAbilities.resolveFeydTraining(game, player, resolveEffectFn)
    return
  }

  // Liet Kynes: Judge of the Change — reward based on space icon sent to this turn
  if (leader.name === 'Liet Kynes') {
    const icon = game.state.turnTracking?.spaceIcon
    game.log.indent()
    if (icon === 'green' && player.getInfluence('emperor') >= 2) {
      resolveEffectFn(game, player, { type: 'gain', resource: 'water', amount: 1 }, null)
    }
    if (icon === 'purple') {
      resolveEffectFn(game, player, { type: 'gain', resource: 'solari', amount: 1 }, null)
    }
    if (icon === 'yellow') {
      resolveEffectFn(game, player, { type: 'gain', resource: 'spice', amount: 1 }, null)
    }
    // Faction spaces (emperor, guild, bene-gesserit, fremen) don't match any color
    if (!['green', 'purple', 'yellow'].includes(icon)) {
      game.log.add({ template: 'No matching space color for Judge of the Change', event: 'memo' })
    }
    game.log.outdent()
    return
  }

  const effects = parseAgentAbility(abilityText)
  if (effects) {
    game.log.indent()
    for (const effect of effects) {
      resolveEffectFn(game, player, effect, null)
    }
    game.log.outdent()
  }
  else {
    game.log.indent()
    game.log.add({
      template: '{effect}',
      args: { effect: abilityText },
      event: 'memo',
    })
    game.log.outdent()
  }
}

/**
 * Get a player's leader data.
 */
function getLeader(game, player) {
  return game.state.leaders[player.name] || null
}

module.exports = {
  selectLeaders,
  assignLeader,
  resolveSignetRing,
  getLeader,
}
