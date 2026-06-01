const { DuneCard } = require('../DuneCard.js')

// Map contract names to board space IDs for board-space-visit triggers
const BOARD_SPACE_CONTRACTS = {
  'Arakeen': 'arrakeen',
  'Deliver Supplies': 'deliver-supplies',
  'Espionage': 'espionage',
  'Heighliner': 'heighliner',
  'High Council': 'high-council',
  'Research Station': 'research-station',
  'Sardaukar': 'sardaukar',
  'Secrets': 'secrets',
  'Spice Refinery': 'spice-refinery',
  'Interstellar Shipping': 'shipping',
  'Smuggling': 'shipping',
}

/**
 * Get the trigger type for a contract based on its name.
 */
function getContractTrigger(contractName) {
  if (BOARD_SPACE_CONTRACTS[contractName]) {
    return { type: 'board-space', spaceId: BOARD_SPACE_CONTRACTS[contractName] }
  }
  if (contractName === 'Immediate') {
    return { type: 'immediate' }
  }
  if (contractName === 'Acquire The Spice Must Flow') {
    return { type: 'acquire-tsmf' }
  }
  if (contractName === 'Earn Any Alliance') {
    return { type: 'earn-alliance' }
  }
  if (contractName.startsWith('Harvest')) {
    const thresholdMatch = contractName.match(/(\d+)\+/)
    return { type: 'harvest', threshold: thresholdMatch ? parseInt(thresholdMatch[1]) : 1 }
  }
  // Tech/Dreadnought — Rise of Ix specific, not implemented yet
  return null
}

/**
 * Initialize CHOAM contract system.
 * Shuffle contracts, place 2 face-up in the market.
 */
function initializeContracts(game) {
  const settings = game.settings

  // Filter out Rise of Ix-specific contracts if not using that expansion
  let contractDefs = require('../res/index.js').getContractCards(settings)
  if (!settings.useRiseOfIx) {
    contractDefs = contractDefs.filter(c => !c.riseOfIxSpecific)
  }

  const contractDeckZone = game.zones.byId('common.contractDeck')

  // Create card instances
  let cardIndex = 0
  for (const cardDef of contractDefs) {
    for (let i = 0; i < (cardDef.count || 1); i++) {
      const id = `contract-${cardIndex++}`
      const card = new DuneCard(game, { ...cardDef, defId: cardDef.id, id, type: 'contract' })
      game.cards.register(card)
      card.setHome(contractDeckZone)
      contractDeckZone.push(card)
    }
  }

  contractDeckZone.shuffle(game.random)

  // Deal 2 face-up to the market
  refillContractMarket(game, { silent: true })
}

/**
 * Refill contract market to 2 face-up cards.
 */
function refillContractMarket(game, { silent = false } = {}) {
  const market = game.zones.byId('common.contractMarket')
  const deck = game.zones.byId('common.contractDeck')

  while (market.cardlist().length < 2) {
    const cards = deck.cardlist()
    if (cards.length === 0) {
      break
    }
    const card = cards[0]
    card.moveTo(market)
    if (!silent) {
      game.log.add({
        template: '{card} is added to the Contract Market',
        args: { card },
      })
    }
  }
}

/**
 * Take a contract from the market.
 * Player chooses one of the face-up contracts.
 */
function takeContract(game, player) {
  const market = game.zones.byId('common.contractMarket')
  const isShaddam = game.state.leaders?.[player.name]?.name === 'Shaddam Corrino IV'
  const availableContracts = [...market.cardlist()]
  if (isShaddam) {
    const reservedZone = game.zones.byId('common.contractReserved')
    if (reservedZone) {
      availableContracts.push(...reservedZone.cardlist())
    }
  }

  if (availableContracts.length === 0) {
    game.log.add({ template: 'No contracts available', event: 'memo' })
    return
  }

  const playerContracts = game.zones.byId(`${player.name}.contracts`)
  const choices = availableContracts.map(c => game.actions.option({
    id: c.id,
    title: `${c.name} (${c.definition.reward})`,
    defId: c.defId,
    kind: 'contract',
  }))
  const [choice] = game.actions.choose(player, choices, {
    title: 'Choose a Contract to take',
  })

  const choiceId = typeof choice === 'object' ? choice.id : null
  const choiceTitle = typeof choice === 'object' ? choice.title : choice
  const card = choiceId
    ? availableContracts.find(c => c.id === choiceId)
    : availableContracts.find(c => `${c.name} (${c.definition.reward})` === choiceTitle)
  card.moveTo(playerContracts)

  game.log.add({
    template: '{player} takes contract: {contract}',
    args: { player, contract: card.name },
  })

  refillContractMarket(game)

  // Check if this is an Immediate contract — complete it right away
  const trigger = getContractTrigger(card.name)
  if (trigger && trigger.type === 'immediate') {
    completeContract(game, player, card)
  }
}

/**
 * Complete a contract and gain its reward.
 */
function completeContract(game, player, card) {
  const { resolveEffect } = require('../phases/playerTurns.js')
  const completedZone = game.zones.byId(`${player.name}.contractsCompleted`)
  card.moveTo(completedZone)

  game.log.add({
    template: '{player} completes contract: {contract}',
    args: { player, contract: card.name },
  })

  if (game.state.turnTracking) {
    game.state.turnTracking.completedContract = true
  }

  if (typeof card.definition.rewardEffect === 'function') {
    game.log.indent()
    card.definition.rewardEffect(game, player, card, { resolveEffect, takeContract: () => takeContract(game, player) })
    game.log.outdent()
    return
  }

  const effects = card.definition.rewardEffects
  game.log.indent()
  if (effects) {
    for (const effect of effects) {
      if (effect.type === 'contract') {
        takeContract(game, player)
      }
      else {
        resolveEffect(game, player, effect, null)
      }
    }
  }
  else {
    game.log.add({
      template: 'Reward: {reward}',
      args: { reward: card.definition.reward },
      event: 'memo',
    })
  }
  game.log.outdent()
}

/**
 * Check and auto-complete contracts for a player when a trigger event occurs.
 * @param {string} triggerType - 'board-space', 'harvest', 'acquire-tsmf', 'earn-alliance'
 * @param {object} triggerData - Additional data (e.g., { spaceId } or { spiceAmount })
 */
function checkContractCompletion(game, player, triggerType, triggerData) {
  const playerContracts = game.zones.byId(`${player.name}.contracts`)
  const contracts = playerContracts.cardlist()

  for (const card of contracts) {
    const trigger = getContractTrigger(card.name)
    if (!trigger) {
      continue
    }

    let shouldComplete = false

    switch (trigger.type) {
      case 'board-space':
        if (triggerType === 'board-space' && triggerData.spaceId === trigger.spaceId) {
          shouldComplete = true
        }
        break
      case 'harvest':
        if (triggerType === 'harvest' && triggerData.spiceAmount >= trigger.threshold) {
          shouldComplete = true
        }
        break
      case 'acquire-tsmf':
        if (triggerType === 'acquire-tsmf') {
          shouldComplete = true
        }
        break
      case 'earn-alliance':
        if (triggerType === 'earn-alliance') {
          shouldComplete = true
        }
        break
    }

    if (shouldComplete) {
      completeContract(game, player, card)
      return // Complete one at a time (re-check needed since zone changed)
    }
  }
}

/**
 * Get the number of contracts a player has completed.
 */
function getCompletedContractCount(game, player) {
  const completedZone = game.zones.byId(`${player.name}.contractsCompleted`)
  return completedZone.cardlist().length
}

module.exports = {
  initializeContracts,
  refillContractMarket,
  takeContract,
  completeContract,
  checkContractCompletion,
  getCompletedContractCount,
  getContractTrigger,
}
