/**
 * Card-specific implementation functions for effects that can't be parsed from text.
 *
 * Each entry maps a card name to an object with optional functions:
 *   agentEffect(game, player, card) — executed during agent turn
 *   revealEffect(game, player, card, allRevealedCards) — executed during reveal turn
 *
 * For intrigue cards:
 *   plotEffect(game, player, card) — executed when played as plot
 *   combatEffect(game, player, card) — executed when played in combat
 *   endgameEffect(game, player, card) — executed at endgame
 *
 * These functions have full access to game state and can use game.actions.choose()
 * for player input. They are only called when the text parser returns null.
 */
const deckEngine = require('./deckEngine.js')
const factions = require('./factions.js')
const spies = require('./spies.js')
const constants = require('../res/constants.js')

const implementations = {
  // ── Imperium Card Agent Effects ────────────────────────────────

  'Occupation': {
    agentEffect(game, player) {
      // Draw a card AND Turn space into a Combat space
      deckEngine.drawCards(game, player, 1)
      // Mark current space as combat for this turn
      if (game.state.turnTracking) {
        game.state.turnTracking.spaceIsCombat = true
      }
    },
  },

  'Other Memory': {
    agentEffect(game, player) {
      // Draw 1 card or Draw 1 Bene Gesserit card from your discard pile
      const discardZone = game.zones.byId(`${player.name}.discard`)
      const bgCards = discardZone.cardlist().filter(c =>
        c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('bene gesserit')
      )
      const choices = ['Draw 1 card from deck']
      if (bgCards.length > 0) {
        choices.push('Draw 1 Bene Gesserit card from discard')
      }
      const [choice] = game.actions.choose(player, choices, {
        title: 'Other Memory: Choose draw source',
      })
      if (choice.includes('deck')) {
        deckEngine.drawCards(game, player, 1)
      }
      else {
        const bgChoices = bgCards.map(c => c.name)
        const [bgChoice] = game.actions.choose(player, bgChoices, {
          title: 'Choose a Bene Gesserit card from discard',
        })
        const card = bgCards.find(c => c.name === bgChoice)
        if (card) {
          const handZone = game.zones.byId(`${player.name}.hand`)
          card.moveTo(handZone)
          game.log.add({
            template: '{player} takes {card} from discard to hand',
            args: { player, card: card.name },
          })
        }
      }
    },
  },

  'Power Play': {
    agentEffect(game, player, card) {
      // +2 Influence instead of +1 Influence and Trash this card
      // The "instead of +1" modifies the faction space influence gain
      if (game.state.turnTracking) {
        game.state.turnTracking.extraInfluence = true
      }
      deckEngine.trashCard(game, card)
    },
  },

  'Court Intrigue': {
    agentEffect(game, player) {
      // Put one of your Intrigue cards on the bottom of the Intrigue deck -> Draw 1 Intrigue card
      const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
      const cards = intrigueZone.cardlist()
      if (cards.length > 0) {
        const choices = cards.map(c => c.name)
        const [choice] = game.actions.choose(player, choices, {
          title: 'Choose an Intrigue card to put on bottom of deck',
        })
        const card = cards.find(c => c.name === choice)
        if (card) {
          const intrigueDeck = game.zones.byId('common.intrigueDeck')
          card.moveTo(intrigueDeck)
          deckEngine.drawIntrigueCard(game, player, 1)
        }
      }
    },
  },

  'Thumper': {
    agentEffect(game) {
      // Double the bonus spice you harvest with this Agent
      if (game.state.turnTracking) {
        game.state.turnTracking.doubleBonusHarvest = true
      }
    },
  },

  'Imperium Ceremony': {
    agentEffect(game, player) {
      // Look at the top two cards of the Intrigue deck. Keep one and put the other back on top.
      const intrigueDeck = game.zones.byId('common.intrigueDeck')
      const topCards = intrigueDeck.cardlist().slice(0, 2)
      if (topCards.length >= 2) {
        const choices = topCards.map(c => c.name)
        const [choice] = game.actions.choose(player, choices, {
          title: 'Keep which Intrigue card?',
        })
        const kept = topCards.find(c => c.name === choice)
        const returned = topCards.find(c => c.name !== choice)
        if (kept) {
          const playerIntrigue = game.zones.byId(`${player.name}.intrigue`)
          kept.moveTo(playerIntrigue)
        }
        if (returned) {
          // Already on top of deck, no need to move
        }
        game.log.add({
          template: '{player} looks at top 2 Intrigue cards, keeps 1',
          args: { player },
        })
      }
      else if (topCards.length === 1) {
        const playerIntrigue = game.zones.byId(`${player.name}.intrigue`)
        topCards[0].moveTo(playerIntrigue)
      }
    },
  },

  'Firm Grip': {
    agentEffect(game, player) {
      // Pay 2 Solari: +1 Influence with: Spacing Guild OR Bene Gesserit OR Fremen
      if (player.solari >= 2) {
        const factionChoices = ['Pass', 'Spacing Guild', 'Bene Gesserit', 'Fremen']
        const [choice] = game.actions.choose(player, factionChoices, {
          title: 'Firm Grip: Pay 2 Solari for +1 Influence? (choose faction)',
        })
        if (choice !== 'Pass') {
          player.decrementCounter('solari', 2, { silent: true })
          const { normalizeFaction } = require('./cardEffects.js')
          factions.gainInfluence(game, player, normalizeFaction(choice))
        }
      }
    },
  },

  'Possible Futures': {
    agentEffect(game, player) {
      // +1 Influence with any Faction OR +2 Troops. If you have another BG card in play, get both.
      const playedZone = game.zones.byId(`${player.name}.played`)
      const hasBG = playedZone.cardlist().some(c =>
        c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('bene gesserit')
      )
      if (hasBG) {
        // Get both
        const [faction] = game.actions.choose(player, constants.FACTIONS, {
          title: 'Choose faction for +1 Influence',
        })
        factions.gainInfluence(game, player, faction)
        const recruit = Math.min(2, player.troopsInSupply)
        if (recruit > 0) {
          player.decrementCounter('troopsInSupply', recruit, { silent: true })
          player.incrementCounter('troopsInGarrison', recruit, { silent: true })
          game.log.add({ template: '{player} recruits {count} troop(s)', args: { player, count: recruit } })
        }
      }
      else {
        const choices = ['+1 Influence with any Faction', '+2 Troops']
        const [choice] = game.actions.choose(player, choices, { title: 'Choose one' })
        if (choice.includes('Influence')) {
          const [faction] = game.actions.choose(player, constants.FACTIONS, {
            title: 'Choose faction for +1 Influence',
          })
          factions.gainInfluence(game, player, faction)
        }
        else {
          const recruit = Math.min(2, player.troopsInSupply)
          if (recruit > 0) {
            player.decrementCounter('troopsInSupply', recruit, { silent: true })
            player.incrementCounter('troopsInGarrison', recruit, { silent: true })
            game.log.add({ template: '{player} recruits {count} troop(s)', args: { player, count: recruit } })
          }
        }
      }
    },
  },

  'Weirding Woman': {
    agentEffect(game, player, card) {
      // If you have another BG card in play, return this card from play to your hand
      const playedZone = game.zones.byId(`${player.name}.played`)
      const hasBG = playedZone.cardlist().some(c =>
        c !== card && c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('bene gesserit')
      )
      if (hasBG) {
        const handZone = game.zones.byId(`${player.name}.hand`)
        card.moveTo(handZone)
        game.log.add({
          template: '{player} returns {card} to hand (Bene Gesserit synergy)',
          args: { player, card: card.name },
        })
      }
    },
  },

  'Double Agent': {
    agentEffect(game, player) {
      // +1 Spy on the board space you sent an Agent to this turn
      spies.placeSpy(game, player)
    },
  },

  'Reverend Mother Mohiam': {
    agentEffect(game, player) {
      // With another BG card in play: each opponent discards 2 cards
      const playedZone = game.zones.byId(`${player.name}.played`)
      const hasBG = playedZone.cardlist().some(c =>
        c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('bene gesserit')
      )
      if (hasBG) {
        for (const opponent of game.players.all()) {
          if (opponent.name === player.name) {
            continue
          }
          for (let i = 0; i < 2; i++) {
            const oppHand = game.zones.byId(`${opponent.name}.hand`)
            const oppCards = oppHand.cardlist()
            if (oppCards.length > 0) {
              const [choice] = game.actions.choose(opponent, oppCards.map(c => c.name), {
                title: 'Discard a card',
              })
              const card = oppCards.find(c => c.name === choice)
              if (card) {
                deckEngine.discardCard(game, opponent, card)
              }
            }
          }
        }
        game.log.add({
          template: '{player}: Each opponent discards 2 cards',
          args: { player },
        })
      }
    },
  },
}

/**
 * Get the implementation for a card by name, if one exists.
 */
function getImplementation(cardName) {
  return implementations[cardName] || null
}

module.exports = { getImplementation, implementations }
