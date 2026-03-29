const { DuneCard } = require('../DuneCard.js')
const { parseAgentAbility } = require('./cardEffects.js')

/**
 * Initialize CHOAM contract system.
 * Shuffle 20 contracts, place 2 face-up in the market.
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
      const card = new DuneCard(game, { ...cardDef, id, type: 'contract' })
      game.cards.register(card)
      card.setHome(contractDeckZone)
      contractDeckZone.push(card)
    }
  }

  contractDeckZone.shuffle(game.random)

  // Deal 2 face-up to the market
  refillContractMarket(game)
}

/**
 * Refill contract market to 2 face-up cards.
 */
function refillContractMarket(game) {
  const market = game.zones.byId('common.contractMarket')
  const deck = game.zones.byId('common.contractDeck')

  while (market.cardlist().length < 2) {
    const cards = deck.cardlist()
    if (cards.length === 0) {
      break
    }
    cards[0].moveTo(market)
  }
}

/**
 * Take a contract from the market.
 * Player chooses one of the face-up contracts.
 */
function takeContract(game, player) {
  const market = game.zones.byId('common.contractMarket')
  const contracts = market.cardlist()

  if (contracts.length === 0) {
    game.log.add({ template: 'No contracts available', event: 'memo' })
    return
  }

  const playerContracts = game.zones.byId(`${player.name}.contracts`)
  const choices = contracts.map(c => `${c.name} (${c.definition.reward})`)
  const [choice] = game.actions.choose(player, choices, {
    title: 'Choose a Contract to take',
  })

  const index = choices.indexOf(choice)
  const card = contracts[index]
  card.moveTo(playerContracts)

  game.log.add({
    template: '{player} takes contract: {contract}',
    args: { player, contract: card.name },
  })

  refillContractMarket(game)
}

/**
 * Complete a contract and gain its reward.
 * Called when a contract's completion condition is met.
 */
function completeContract(game, player, card, resolveEffectFn) {
  const completedZone = game.zones.byId(`${player.name}.contractsCompleted`)
  card.moveTo(completedZone)

  game.log.add({
    template: '{player} completes contract: {contract}',
    args: { player, contract: card.name },
  })

  // Parse and resolve the reward
  const rewardText = card.definition.reward
  const effects = parseAgentAbility(rewardText)
  if (effects) {
    game.log.indent()
    for (const effect of effects) {
      if (effect.type === 'contract') {
        // "+1 Contract" means take another contract
        takeContract(game, player)
      }
      else {
        resolveEffectFn(game, player, effect, null)
      }
    }
    game.log.outdent()
  }
  else {
    game.log.indent()
    game.log.add({
      template: 'Reward: {reward}',
      args: { reward: rewardText },
      event: 'memo',
    })
    game.log.outdent()
  }
}

module.exports = {
  initializeContracts,
  refillContractMarket,
  takeContract,
  completeContract,
}
