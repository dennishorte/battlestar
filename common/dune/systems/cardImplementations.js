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

  // ── More Imperium Agent Effects ──────────────────────────────

  'Esmar Tuek': {
    agentEffect(game, player) {
      // Pay 1 Spice -> +1 BG Influence and Draw 1 card
      if (player.spice >= 1) {
        const choices = ['Pass', 'Pay 1 Spice for +1 BG Influence and Draw 1 card']
        const [choice] = game.actions.choose(player, choices, { title: 'Esmar Tuek' })
        if (choice !== 'Pass') {
          player.decrementCounter('spice', 1, { silent: true })
          factions.gainInfluence(game, player, 'bene-gesserit')
          deckEngine.drawCards(game, player, 1)
        }
      }
    },
  },

  'Guild Spy': {
    agentEffect(game, player) {
      // Discard 1 card -> Draw 1 card. If you discarded a Spacing Guild card: +1 Intrigue card.
      const handZone = game.zones.byId(`${player.name}.hand`)
      const handCards = handZone.cardlist()
      if (handCards.length > 0) {
        const choices = handCards.map(c => c.name)
        const [choice] = game.actions.choose(player, choices, { title: 'Discard a card' })
        const card = handCards.find(c => c.name === choice)
        if (card) {
          const isGuild = card.factionAffiliation && card.factionAffiliation.toLowerCase().includes('spacing guild')
          deckEngine.discardCard(game, player, card)
          deckEngine.drawCards(game, player, 1)
          if (isGuild) {
            deckEngine.drawIntrigueCard(game, player, 1)
            game.log.add({ template: '{player}: Guild synergy — +1 Intrigue card', args: { player } })
          }
        }
      }
    },
  },

  'Space-Time Folding': {
    agentEffect(game, player) {
      // Discard a card -> Draw a card. If discarded Spacing Guild: Draw another card.
      const handZone = game.zones.byId(`${player.name}.hand`)
      const handCards = handZone.cardlist()
      if (handCards.length > 0) {
        const choices = handCards.map(c => c.name)
        const [choice] = game.actions.choose(player, choices, { title: 'Discard a card' })
        const card = handCards.find(c => c.name === choice)
        if (card) {
          const isGuild = card.factionAffiliation && card.factionAffiliation.toLowerCase().includes('spacing guild')
          deckEngine.discardCard(game, player, card)
          deckEngine.drawCards(game, player, 1)
          if (isGuild) {
            deckEngine.drawCards(game, player, 1)
            game.log.add({ template: '{player}: Guild synergy — draws another card', args: { player } })
          }
        }
      }
    },
  },

  'Guild Envoy': {
    agentEffect(game, player) {
      // Discard a card. If discarded Spacing Guild: Draw 2 cards.
      const handZone = game.zones.byId(`${player.name}.hand`)
      const handCards = handZone.cardlist()
      if (handCards.length > 0) {
        const choices = handCards.map(c => c.name)
        const [choice] = game.actions.choose(player, choices, { title: 'Discard a card' })
        const card = handCards.find(c => c.name === choice)
        if (card) {
          const isGuild = card.factionAffiliation && card.factionAffiliation.toLowerCase().includes('spacing guild')
          deckEngine.discardCard(game, player, card)
          if (isGuild) {
            deckEngine.drawCards(game, player, 2)
            game.log.add({ template: '{player}: Guild synergy — draws 2 cards', args: { player } })
          }
        }
      }
    },
  },

  'Arrakis Observer': {
    agentEffect(game, player) {
      // Discard a card -> +1 Spy with Deep Cover. If discarded Spacing Guild: +2 Spice.
      const handZone = game.zones.byId(`${player.name}.hand`)
      const handCards = handZone.cardlist()
      if (handCards.length > 0) {
        const choices = handCards.map(c => c.name)
        const [choice] = game.actions.choose(player, choices, { title: 'Discard a card' })
        const card = handCards.find(c => c.name === choice)
        if (card) {
          const isGuild = card.factionAffiliation && card.factionAffiliation.toLowerCase().includes('spacing guild')
          deckEngine.discardCard(game, player, card)
          spies.placeSpy(game, player)
          if (isGuild) {
            player.incrementCounter('spice', 2, { silent: true })
            game.log.add({ template: '{player}: Guild synergy — +2 Spice', args: { player } })
          }
        }
      }
    },
  },

  'Local Fence': {
    agentEffect(game, player) {
      // Pay 2 Spice -> +5 Solari OR Pay 5 Solari -> +4 Spice
      const choices = []
      if (player.spice >= 2) {
        choices.push('Pay 2 Spice for 5 Solari')
      }
      if (player.solari >= 5) {
        choices.push('Pay 5 Solari for 4 Spice')
      }
      choices.push('Pass')
      const [choice] = game.actions.choose(player, choices, { title: 'Local Fence' })
      if (choice.includes('2 Spice')) {
        player.decrementCounter('spice', 2, { silent: true })
        player.incrementCounter('solari', 5, { silent: true })
      }
      else if (choice.includes('5 Solari')) {
        player.decrementCounter('solari', 5, { silent: true })
        player.incrementCounter('spice', 4, { silent: true })
      }
    },
  },

  'Smuggler\'s Haven': {
    agentEffect(game, player) {
      // Pay 4 Spice -> +1 VP
      if (player.spice >= 4) {
        const choices = ['Pass', 'Pay 4 Spice for +1 Victory Point']
        const [choice] = game.actions.choose(player, choices, { title: 'Smuggler\'s Haven' })
        if (choice !== 'Pass') {
          player.decrementCounter('spice', 4, { silent: true })
          player.incrementCounter('vp', 1, { silent: true })
          game.log.add({ template: '{player} gains 1 Victory Point', args: { player } })
        }
      }
    },
  },

  'Corrinth City': {
    agentEffect(game, player) {
      // Discard two cards and pay 5 Solari -> +1 VP
      const handZone = game.zones.byId(`${player.name}.hand`)
      if (handZone.cardlist().length >= 2 && player.solari >= 5) {
        const choices = ['Pass', 'Discard 2 cards and pay 5 Solari for +1 VP']
        const [choice] = game.actions.choose(player, choices, { title: 'Corrinth City' })
        if (choice !== 'Pass') {
          for (let i = 0; i < 2; i++) {
            const cards = handZone.cardlist()
            if (cards.length > 0) {
              const [dc] = game.actions.choose(player, cards.map(c => c.name), { title: 'Discard a card' })
              const card = cards.find(c => c.name === dc)
              if (card) {
                deckEngine.discardCard(game, player, card)
              }
            }
          }
          player.decrementCounter('solari', 5, { silent: true })
          player.incrementCounter('vp', 1, { silent: true })
          game.log.add({ template: '{player} gains 1 Victory Point', args: { player } })
        }
      }
    },
  },

  'Dangerous Rhetoric': {
    agentEffect(game, player, card) {
      // +1 Influence with a Faction. Trash this card.
      const [faction] = game.actions.choose(player, constants.FACTIONS, {
        title: 'Choose faction for +1 Influence',
      })
      factions.gainInfluence(game, player, faction)
      deckEngine.trashCard(game, card)
    },
  },

  'Shifting Allegiances': {
    agentEffect(game, player) {
      // Pay 1 Influence and 2 Spice to gain +2 other Influence
      if (player.spice >= 2) {
        const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
        if (loseFactions.length > 0) {
          const choices = ['Pass', ...loseFactions.map(f => `Lose 1 ${f} Influence + 2 Spice`)]
          const [choice] = game.actions.choose(player, choices, { title: 'Shifting Allegiances' })
          if (choice !== 'Pass') {
            const loseFaction = loseFactions.find(f => choice.includes(f))
            factions.loseInfluence(game, player, loseFaction, 1)
            player.decrementCounter('spice', 2, { silent: true })
            // Gain +2 influence (choose faction twice)
            for (let i = 0; i < 2; i++) {
              const gainFactions = constants.FACTIONS.filter(f => f !== loseFaction)
              const [gf] = game.actions.choose(player, gainFactions, {
                title: `Gain Influence (${i + 1} of 2)`,
              })
              factions.gainInfluence(game, player, gf)
            }
          }
        }
      }
    },
  },

  'Elite Forces': {
    agentEffect(game, player) {
      // You may trash a card from hand. If Emperor card: +1 Intrigue, +1 Troop, Deploy troops.
      const handZone = game.zones.byId(`${player.name}.hand`)
      const handCards = handZone.cardlist()
      if (handCards.length > 0) {
        const choices = ['Pass', ...handCards.map(c => c.name)]
        const [choice] = game.actions.choose(player, choices, { title: 'Trash a card?' })
        if (choice !== 'Pass') {
          const card = handCards.find(c => c.name === choice)
          if (card) {
            const isEmperor = card.factionAffiliation && card.factionAffiliation.toLowerCase().includes('emperor')
            deckEngine.trashCard(game, card)
            if (isEmperor) {
              deckEngine.drawIntrigueCard(game, player, 1)
              const recruit = Math.min(1, player.troopsInSupply)
              if (recruit > 0) {
                player.decrementCounter('troopsInSupply', recruit, { silent: true })
                player.incrementCounter('troopsInGarrison', recruit, { silent: true })
              }
              game.log.add({ template: '{player}: Emperor synergy — +1 Intrigue, +1 Troop', args: { player } })
            }
          }
        }
      }
    },
  },

  'Leadership': {
    agentEffect(game, player) {
      // For each Sandworm you have in the conflict: Draw a card.
      const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
      if (sandworms > 0) {
        deckEngine.drawCards(game, player, sandworms)
        game.log.add({ template: '{player} draws {count} card(s) (Sandworm synergy)', args: { player, count: sandworms } })
      }
    },
  },

  'Sardaukar Coordination': {
    agentEffect(game) {
      // You may deploy any troops you recruit this turn to the conflict.
      if (game.state.turnTracking) {
        game.state.turnTracking.recruitToConflict = true
      }
    },
  },

  'Stillsuit Manufacturer': {
    agentEffect(game, player, card) {
      // +1 Water AND If you have the Fremen Alliance: Return this card from play to hand.
      player.incrementCounter('water', 1, { silent: true })
      game.log.add({ template: '{player} gains 1 Water', args: { player } })
      if (game.state.alliances.fremen === player.name) {
        const handZone = game.zones.byId(`${player.name}.hand`)
        card.moveTo(handZone)
        game.log.add({ template: '{player} returns {card} to hand (Fremen Alliance)', args: { player, card: card.name } })
      }
    },
  },

  'Maker Keeper': {
    agentEffect(game, player) {
      // With 2 BG Influence: +1 Water. With 2 Fremen Influence: +1 Spice.
      if (player.getInfluence('bene-gesserit') >= 2) {
        player.incrementCounter('water', 1, { silent: true })
        game.log.add({ template: '{player}: +1 Water (BG Influence)', args: { player } })
      }
      if (player.getInfluence('fremen') >= 2) {
        player.incrementCounter('spice', 1, { silent: true })
        game.log.add({ template: '{player}: +1 Spice (Fremen Influence)', args: { player } })
      }
    },
  },

  'High Priority Travel': {
    agentEffect(game, player) {
      // With 2 Guild Influence: Draw a card OR Turn space into Combat space
      if (player.getInfluence('guild') >= 2) {
        const choices = ['Draw a card', 'Turn space into a Combat space']
        const [choice] = game.actions.choose(player, choices, { title: 'High Priority Travel' })
        if (choice.includes('Draw')) {
          deckEngine.drawCards(game, player, 1)
        }
        else if (game.state.turnTracking) {
          game.state.turnTracking.spaceIsCombat = true
        }
      }
    },
  },

  'Delivery Logistics': {
    agentEffect(game, player) {
      // This card has the Agent icons shown on all your incomplete contracts — passive access modifier
      // The access is handled by the card's icon system; log it
      game.log.add({ template: '{player}: Delivery Logistics — Agent icons match incomplete contracts', args: { player }, event: 'memo' })
    },
  },

  'Assassination Mission': {
    agentEffect() {
      // "When trashed by another card or effect: +4 Solari" — passive trigger, handled when trashed
    },
  },

  'Gene Manipulation': {
    agentEffect(game, player) {
      // Trash a card and with another BG card in play: +2 Spice
      const handZone = game.zones.byId(`${player.name}.hand`)
      const handCards = handZone.cardlist()
      if (handCards.length > 0) {
        const choices = ['Pass', ...handCards.map(c => c.name)]
        const [choice] = game.actions.choose(player, choices, { title: 'Trash a card?' })
        if (choice !== 'Pass') {
          const card = handCards.find(c => c.name === choice)
          if (card) {
            deckEngine.trashCard(game, card)
          }
          const playedZone = game.zones.byId(`${player.name}.played`)
          const hasBG = playedZone.cardlist().some(c =>
            c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('bene gesserit')
          )
          if (hasBG) {
            player.incrementCounter('spice', 2, { silent: true })
            game.log.add({ template: '{player}: BG synergy — +2 Spice', args: { player } })
          }
        }
      }
    },
  },

  'Kwisatz Haderach': {
    agentEffect(game, player) {
      // Send one of your agents from anywhere to any board space and Draw 1 card
      // This is a very unique effect — the agent placement is the card's primary action
      deckEngine.drawCards(game, player, 1)
      game.log.add({ template: '{player}: Kwisatz Haderach — draws 1 card (agent send handled by game flow)', args: { player }, event: 'memo' })
    },
  },

  'The Voice': {
    agentEffect(game, player) {
      // Block 1 board space for Opponents this round
      const boardSpacesData = require('../res/boardSpaces.js')
      const spaceChoices = boardSpacesData.map(s => s.name)
      const [choice] = game.actions.choose(player, spaceChoices, { title: 'Block a board space' })
      const space = boardSpacesData.find(s => s.name === choice)
      if (space) {
        if (!game.state.blockedSpaces) {
          game.state.blockedSpaces = []
        }
        game.state.blockedSpaces.push(space.id)
        game.log.add({ template: '{player} blocks {space} for this round', args: { player, space: space.name } })
      }
    },
  },

  'Urgent Shigawire': {
    agentEffect(game) {
      // The next BG card you play this round has all Agent icons and added: Draw a card
      if (game.state.turnTracking) {
        game.state.turnTracking.nextBGCardAllIcons = true
      }
    },
  },

  'Interstellar Conspiracy': {
    agentEffect(game, player) {
      // +1 Spice (grafted conditional is expansion — skip)
      player.incrementCounter('spice', 1, { silent: true })
      game.log.add({ template: '{player} gains 1 Spice', args: { player } })
    },
  },

  'Long Reach': {
    agentEffect(game, player) {
      // If you have another BG card in play: this card gets all access. +1 Influence with 2 Factions.
      const playedZone = game.zones.byId(`${player.name}.played`)
      const hasBG = playedZone.cardlist().some(c =>
        c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('bene gesserit')
      )
      if (hasBG) {
        for (let i = 0; i < 2; i++) {
          const [faction] = game.actions.choose(player, constants.FACTIONS, {
            title: `+1 Influence (${i + 1} of 2)`,
          })
          factions.gainInfluence(game, player, faction)
        }
      }
    },
  },

  'Show of Strength': {
    agentEffect(game, player) {
      // If more deployed troops than each opponent: Draw 2 cards. (access handled elsewhere)
      const myTroops = game.state.conflict.deployedTroops[player.name] || 0
      const hasMore = game.players.all().every(p =>
        p.name === player.name || (game.state.conflict.deployedTroops[p.name] || 0) < myTroops
      )
      if (hasMore && myTroops > 0) {
        deckEngine.drawCards(game, player, 2)
      }
    },
  },

  'Arrakis Revolt': {
    agentEffect(game, player) {
      // Maker Hooks: 2 Spice -> Destroy Shield Wall & Deploy a Worm
      if (game.state.makerHooks?.[player.name] && player.spice >= 2) {
        const choices = ['Pass', 'Pay 2 Spice: Destroy Shield Wall & Deploy Sandworm']
        const [choice] = game.actions.choose(player, choices, { title: 'Arrakis Revolt' })
        if (choice !== 'Pass') {
          player.decrementCounter('spice', 2, { silent: true })
          game.state.shieldWall = false
          game.log.add({ template: '{player} destroys the Shield Wall!', args: { player } })
          game.state.conflict.deployedSandworms[player.name] =
            (game.state.conflict.deployedSandworms[player.name] || 0) + 1
          game.log.add({ template: '{player} deploys a Sandworm', args: { player } })
        }
      }
    },
  },

  'Boundless Ambition': {
    agentEffect(game, player) {
      // Signet Ring — this triggers the leader's signet ring ability
      const leaders = require('./leaders.js')
      const { resolveEffect: re } = require('../phases/playerTurns.js')
      leaders.resolveSignetRing(game, player, re)
    },
  },

  'Pivotal Gambit': {
    agentEffect(game, player, card) {
      // Trash this card -> +1 Troop AND add +1 Influence to 1st place conflict reward
      deckEngine.trashCard(game, card)
      const recruit = Math.min(1, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        player.incrementCounter('troopsInGarrison', recruit, { silent: true })
        game.log.add({ template: '{player} recruits 1 troop', args: { player } })
      }
      // Modify first place reward — store as state for combat resolution
      if (!game.state.conflict.bonusFirstPlaceInfluence) {
        game.state.conflict.bonusFirstPlaceInfluence = 0
      }
      game.state.conflict.bonusFirstPlaceInfluence++
      game.log.add({ template: '{player} adds +1 Influence to 1st place reward', args: { player } })
    },
  },

  'The Beast\'s Spoils': {
    agentEffect(game, player) {
      // Gain rewards for face-up Battle Icons: Green -> Trash, Yellow -> +1 Spice, Blue -> +1 Troop
      const wonCards = game.state.conflict.wonCards?.[player.name] || []
      for (const card of wonCards) {
        if (!card.battleIcon) {
          continue
        }
        switch (card.battleIcon) {
          case 'green':
            // Offer trash
            { const handZone = game.zones.byId(`${player.name}.hand`)
              const handCards = handZone.cardlist()
              if (handCards.length > 0) {
                const choices = ['Pass', ...handCards.map(c => c.name)]
                const [choice] = game.actions.choose(player, choices, { title: 'Green icon: Trash a card?' })
                if (choice !== 'Pass') {
                  const c = handCards.find(cc => cc.name === choice)
                  if (c) {
                    deckEngine.trashCard(game, c)
                  }
                }
              }
            }
            break
          case 'yellow':
            player.incrementCounter('spice', 1, { silent: true })
            game.log.add({ template: '{player}: Yellow icon — +1 Spice', args: { player } })
            break
          case 'blue':
            { const r = Math.min(1, player.troopsInSupply)
              if (r > 0) {
                player.decrementCounter('troopsInSupply', r, { silent: true })
                player.incrementCounter('troopsInGarrison', r, { silent: true })
                game.log.add({ template: '{player}: Blue icon — +1 Troop', args: { player } })
              }
            }
            break
        }
      }
    },
  },

  'Desert Ambush': {
    agentEffect(game) {
      // For each troop you deploy this turn, force an enemy unit to retreat
      if (game.state.turnTracking) {
        game.state.turnTracking.forceRetreatOnDeploy = true
      }
    },
  },

  'Guild Accord': {
    agentEffect(game) {
      // Heighliner costs 2 Spice less this turn — modifier
      if (game.state.turnTracking) {
        game.state.turnTracking.heighlinerDiscount = 2
      }
    },
  },

  'In the Shadows': {
    agentEffect(game, player) {
      // With 2 BG Infl.: Discard a card -> +1 Infl with Emperor OR Guild OR Fremen
      if (player.getInfluence('bene-gesserit') >= 2) {
        const handZone = game.zones.byId(`${player.name}.hand`)
        const handCards = handZone.cardlist()
        if (handCards.length > 0) {
          const choices = ['Pass', ...handCards.map(c => c.name)]
          const [choice] = game.actions.choose(player, choices, { title: 'Discard a card?' })
          if (choice !== 'Pass') {
            const card = handCards.find(c => c.name === choice)
            if (card) {
              deckEngine.discardCard(game, player, card)
              const factionChoices = ['emperor', 'guild', 'fremen']
              const [faction] = game.actions.choose(player, factionChoices, { title: '+1 Influence with:' })
              factions.gainInfluence(game, player, faction)
            }
          }
        }
      }
    },
  },

  'Weirding Way': {
    agentEffect(game) {
      // You may take another turn immediately after this one
      if (game.state.turnTracking) {
        game.state.turnTracking.extraTurn = true
      }
    },
  },

  'Branching Path': {
    agentEffect(game, player) {
      // With 2 BG Influence: Trash an intrigue card -> +1 Intrigue card, +2 Spice
      if (player.getInfluence('bene-gesserit') >= 2) {
        const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
        const cards = intrigueZone.cardlist()
        if (cards.length > 0) {
          const choices = ['Pass', ...cards.map(c => c.name)]
          const [choice] = game.actions.choose(player, choices, { title: 'Trash an Intrigue card?' })
          if (choice !== 'Pass') {
            const card = cards.find(c => c.name === choice)
            if (card) {
              deckEngine.trashCard(game, card)
              deckEngine.drawIntrigueCard(game, player, 1)
              player.incrementCounter('spice', 2, { silent: true })
              game.log.add({ template: '{player}: +1 Intrigue, +2 Spice', args: { player } })
            }
          }
        }
      }
    },
  },

  'Hidden Missive': {
    agentEffect(game, player) {
      // With 2 BG Influence: +1 Troop & Draw a card
      if (player.getInfluence('bene-gesserit') >= 2) {
        const recruit = Math.min(1, player.troopsInSupply)
        if (recruit > 0) {
          player.decrementCounter('troopsInSupply', recruit, { silent: true })
          player.incrementCounter('troopsInGarrison', recruit, { silent: true })
        }
        deckEngine.drawCards(game, player, 1)
        game.log.add({ template: '{player}: +1 Troop, Draw 1 card', args: { player } })
      }
    },
  },

  'Junction Headquarters': {
    agentEffect(game, player) {
      // With 2 Guild Influence: Trash intrigue + 2 Spice -> +1 VP
      if (player.getInfluence('guild') >= 2) {
        const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
        const cards = intrigueZone.cardlist()
        if (cards.length > 0 && player.spice >= 2) {
          const choices = ['Pass', ...cards.map(c => c.name)]
          const [choice] = game.actions.choose(player, choices, { title: 'Trash Intrigue + 2 Spice for +1 VP?' })
          if (choice !== 'Pass') {
            const card = cards.find(c => c.name === choice)
            if (card) {
              deckEngine.trashCard(game, card)
              player.decrementCounter('spice', 2, { silent: true })
              player.incrementCounter('vp', 1, { silent: true })
              game.log.add({ template: '{player} gains 1 Victory Point', args: { player } })
            }
          }
        }
      }
    },
  },

  'Long Live the Fighters': {
    agentEffect(game, player) {
      // If deck has 3+ cards: look at top 3, draw 1, discard 1, trash 1
      const deckZone = game.zones.byId(`${player.name}.deck`)
      const topCards = deckZone.cardlist().slice(0, 3)
      if (topCards.length >= 3) {
        const names = topCards.map(c => c.name)
        const [drawChoice] = game.actions.choose(player, names, { title: 'Draw which card?' })
        const drawCard = topCards.find(c => c.name === drawChoice)
        if (drawCard) {
          const handZone = game.zones.byId(`${player.name}.hand`)
          drawCard.moveTo(handZone)
        }
        const remaining1 = topCards.filter(c => c.name !== drawChoice)
        const [discardChoice] = game.actions.choose(player, remaining1.map(c => c.name), { title: 'Discard which card?' })
        const discardCard = remaining1.find(c => c.name === discardChoice)
        if (discardCard) {
          deckEngine.discardCard(game, player, discardCard)
        }
        const trashCard = remaining1.find(c => c.name !== discardChoice)
        if (trashCard) {
          deckEngine.trashCard(game, trashCard)
        }
        game.log.add({ template: '{player}: Looks at top 3 — draws 1, discards 1, trashes 1', args: { player } })
      }
    },
  },

  'Price is Not Object': {
    agentEffect(game) {
      // You may acquire a card using Solari instead of Persuasion this round
      if (game.state.turnTracking) {
        game.state.turnTracking.acquireWithSolari = true
      }
    },
  },

  'Reliable Informant': {
    agentEffect(game, player) {
      // Deploy a Spy on Emperor/BG/Fremen Observation Post
      spies.placeSpy(game, player)
    },
  },

  'Sardaukar Soldier': {
    agentEffect() {
      // "When this card is trashed: Get 1 Intrigue Card" — passive trigger, handled when trashed
    },
  },

  'Treacherous Maneuver': {
    agentEffect(game, player, card) {
      // Trash this card and an Emperor card from hand -> Gain 2 influence instead of 1
      const handZone = game.zones.byId(`${player.name}.hand`)
      const emperorCards = handZone.cardlist().filter(c =>
        c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('emperor')
      )
      if (emperorCards.length > 0) {
        const choices = ['Pass', ...emperorCards.map(c => c.name)]
        const [choice] = game.actions.choose(player, choices, { title: 'Trash an Emperor card for +2 Influence?' })
        if (choice !== 'Pass') {
          const empCard = emperorCards.find(c => c.name === choice)
          if (empCard) {
            deckEngine.trashCard(game, card)
            deckEngine.trashCard(game, empCard)
            if (game.state.turnTracking) {
              game.state.turnTracking.extraInfluence = true
            }
          }
        }
      }
    },
  },

  'Undercover Asset': {
    agentEffect(game) {
      // Ignore Influence requirements on board spaces this turn
      if (game.state.turnTracking) {
        game.state.turnTracking.ignoreInfluenceRequirements = true
      }
    },
  },

  'Wheels within Wheels': {
    agentEffect(game, player) {
      // With 2 Emperor Influence: +2 Solari. With 2 Guild Influence: +1 Spice.
      if (player.getInfluence('emperor') >= 2) {
        player.incrementCounter('solari', 2, { silent: true })
        game.log.add({ template: '{player}: +2 Solari (Emperor Influence)', args: { player } })
      }
      if (player.getInfluence('guild') >= 2) {
        player.incrementCounter('spice', 1, { silent: true })
        game.log.add({ template: '{player}: +1 Spice (Guild Influence)', args: { player } })
      }
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
