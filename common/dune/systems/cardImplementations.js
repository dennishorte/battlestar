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
  // ── Imperium Reveal Effects ─────────────────────────────────

  'CHOAM Demands': {
    revealEffect(game, player, card) {
      const choam = require('./choam.js')
      if (choam.getCompletedContractCount(game, player) >= 4) {
        const choices = ['Pass', 'Trash this card for +1 Influence with every Faction']
        const [choice] = game.actions.choose(player, choices, { title: 'CHOAM Demands' })
        if (choice !== 'Pass') {
          deckEngine.trashCard(game, card)
          for (const faction of constants.FACTIONS) {
            factions.gainInfluence(game, player, faction)
          }
        }
      }
    },
  },

  'Interstellar Trade': {
    revealEffect(game, player) {
      const choam = require('./choam.js')
      const count = choam.getCompletedContractCount(game, player)
      if (count > 0) {
        player.incrementCounter('persuasion', count, { silent: true })
        game.log.add({ template: '{player}: +{count} Persuasion ({count} contracts)', args: { player, count } })
      }
    },
  },

  'Guild Bankers': {
    revealEffect(game) {
      if (!game.state.tsmfDiscount) {
        game.state.tsmfDiscount = 0
      }
      game.state.tsmfDiscount += 3
    },
  },

  'Worm Riders': {
    revealEffect(game, player) {
      if (player.getInfluence('fremen') >= 2) {
        player.incrementCounter('strength', 4 * constants.SWORD_STRENGTH, { silent: true })
        game.log.add({ template: '{player}: +4 Swords (Fremen Influence)', args: { player } })
      }
      if (game.state.alliances.fremen === player.name) {
        player.incrementCounter('strength', 2 * constants.SWORD_STRENGTH, { silent: true })
        game.log.add({ template: '{player}: +2 Swords (Fremen Alliance)', args: { player } })
      }
    },
  },

  'Engineered Miracle': {
    revealEffect(game, player, card) {
      if (player.getCounter('persuasion') >= 6) {
        const choices = ['Pass', 'Trash this card to acquire from Imperium Row']
        const [choice] = game.actions.choose(player, choices, { title: 'Engineered Miracle' })
        if (choice !== 'Pass') {
          deckEngine.trashCard(game, card)
          game.log.add({ template: '{player}: Acquires from Imperium Row (special)', args: { player }, event: 'memo' })
        }
      }
    },
  },

  'Holy War': {
    revealEffect(game, player, card, allRevealedCards) {
      const recruit = Math.min(1, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        player.incrementCounter('troopsInGarrison', recruit, { silent: true })
      }
      const hasFremen = allRevealedCards.some(c =>
        c !== card && c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('fremen')
      )
      if (hasFremen) {
        game.log.add({ template: '{player}: Fremen Bond — may deploy troops', args: { player }, event: 'memo' })
      }
    },
  },

  'For Humanity': {
    revealEffect(game, player) {
      if (game.state.alliances['bene-gesserit'] === player.name) {
        const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) >= 2)
        if (loseFactions.length > 0) {
          const choices = ['Pass', ...loseFactions]
          const [choice] = game.actions.choose(player, choices, { title: 'Lose 2 Influence for +1 VP?' })
          if (choice !== 'Pass') {
            factions.loseInfluence(game, player, choice, 2)
            player.incrementCounter('vp', 1, { silent: true })
            game.log.add({ template: '{player}: +1 VP', args: { player } })
          }
        }
      }
    },
  },

  'Shadout Mapes': {
    revealEffect(game, player) {
      const choices = ['Pass']
      if (player.troopsInGarrison > 0) {
        choices.push('Deploy 1 troop to Conflict')
      }
      const deployed = game.state.conflict.deployedTroops[player.name] || 0
      if (deployed > 0) {
        choices.push('Retreat 1 troop')
      }
      if (choices.length > 1) {
        const [choice] = game.actions.choose(player, choices, { title: 'Shadout Mapes' })
        if (choice.includes('Deploy')) {
          player.decrementCounter('troopsInGarrison', 1, { silent: true })
          game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + 1
        }
        else if (choice.includes('Retreat')) {
          game.state.conflict.deployedTroops[player.name]--
          player.incrementCounter('troopsInSupply', 1, { silent: true })
        }
      }
    },
  },

  'Negotiated Withdrawal': {
    revealEffect(game, player) {
      const deployed = game.state.conflict.deployedTroops[player.name] || 0
      if (deployed >= 3) {
        const choices = ['Pass', 'Retreat 3 troops for +1 Influence']
        const [choice] = game.actions.choose(player, choices, { title: 'Negotiated Withdrawal' })
        if (choice !== 'Pass') {
          game.state.conflict.deployedTroops[player.name] -= 3
          player.incrementCounter('troopsInSupply', 3, { silent: true })
          const [faction] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence with:' })
          factions.gainInfluence(game, player, faction)
        }
      }
    },
  },

  'Treachery': {
    revealEffect(game, player) {
      const recruit = Math.min(2, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + recruit
        game.log.add({ template: '{player}: +{count} troops to Conflict', args: { player, count: recruit } })
      }
    },
  },

  'Calculus of Power': {
    revealEffect(game, player) {
      const playedZone = game.zones.byId(`${player.name}.played`)
      const emperorCards = playedZone.cardlist().filter(c =>
        c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('emperor')
      )
      if (emperorCards.length > 0) {
        const choices = ['Pass', ...emperorCards.map(c => c.name)]
        const [choice] = game.actions.choose(player, choices, { title: 'Trash Emperor card for +3 Swords?' })
        if (choice !== 'Pass') {
          const card = emperorCards.find(c => c.name === choice)
          if (card) {
            deckEngine.trashCard(game, card)
            player.incrementCounter('strength', 3 * constants.SWORD_STRENGTH, { silent: true })
          }
        }
      }
    },
  },

  'Captured Mentat': {
    revealEffect(game, player) {
      const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
      if (loseFactions.length > 0) {
        const choices = ['Pass', ...loseFactions.map(f => `Lose 1 ${f}`)]
        const [choice] = game.actions.choose(player, choices, { title: 'Swap influence?' })
        if (choice !== 'Pass') {
          const loseFaction = loseFactions.find(f => choice.includes(f))
          factions.loseInfluence(game, player, loseFaction, 1)
          const gainFactions = constants.FACTIONS.filter(f => f !== loseFaction)
          const [gf] = game.actions.choose(player, gainFactions, { title: '+1 Influence with:' })
          factions.gainInfluence(game, player, gf)
        }
      }
    },
  },

  'Chani, Clever Tactician': {
    revealEffect(game, player, card, allRevealedCards) {
      const deployed = game.state.conflict.deployedTroops[player.name] || 0
      if (deployed >= 2) {
        const choices = ['Pass', 'Retreat 2 troops for +4 Swords']
        const [choice] = game.actions.choose(player, choices, { title: 'Chani' })
        if (choice !== 'Pass') {
          game.state.conflict.deployedTroops[player.name] -= 2
          player.incrementCounter('troopsInSupply', 2, { silent: true })
          player.incrementCounter('strength', 4 * constants.SWORD_STRENGTH, { silent: true })
        }
      }
      const hasFremen = allRevealedCards.some(c =>
        c !== card && c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('fremen')
      )
      if (hasFremen) {
        player.incrementCounter('persuasion', 2, { silent: true })
        game.log.add({ template: '{player}: Fremen Bond — +2 Persuasion', args: { player } })
      }
    },
  },

  'Desert Power': {
    revealEffect(game, player) {
      const hasMaker = game.state.makerHooks?.[player.name]
      const choices = ['+2 Persuasion']
      if (hasMaker && player.water >= 1) {
        choices.push('Pay 1 Water for 1 Sandworm')
      }
      const [choice] = game.actions.choose(player, choices, { title: 'Desert Power' })
      if (choice.includes('Persuasion')) {
        player.incrementCounter('persuasion', 2, { silent: true })
      }
      else {
        player.decrementCounter('water', 1, { silent: true })
        game.state.conflict.deployedSandworms[player.name] =
          (game.state.conflict.deployedSandworms[player.name] || 0) + 1
        game.log.add({ template: '{player}: deploys 1 Sandworm', args: { player } })
      }
    },
  },

  'Southern Elders': {
    revealEffect(game, player, card, allRevealedCards) {
      player.incrementCounter('water', 1, { silent: true })
      game.log.add({ template: '{player}: +1 Water', args: { player } })
      const hasFremen = allRevealedCards.some(c =>
        c !== card && c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('fremen')
      )
      if (hasFremen) {
        player.incrementCounter('persuasion', 2, { silent: true })
        game.log.add({ template: '{player}: Fremen Bond — +2 Persuasion', args: { player } })
      }
    },
  },

  "Spacing Guild's Favor": {
    revealEffect(game, player) {
      if (player.spice >= 3) {
        const choices = ['Pass', 'Pay 3 Spice for +1 Influence']
        const [choice] = game.actions.choose(player, choices, { title: "Spacing Guild's Favor" })
        if (choice !== 'Pass') {
          player.decrementCounter('spice', 3, { silent: true })
          const [faction] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence with:' })
          factions.gainInfluence(game, player, faction)
        }
      }
    },
  },

  'Stilgar, The Devoted': {
    revealEffect(game, player, card, allRevealedCards) {
      const fremenCount = allRevealedCards.filter(c =>
        c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('fremen')
      ).length
      const total = fremenCount * 2
      if (total > 0) {
        player.incrementCounter('persuasion', total, { silent: true })
        game.log.add({ template: '{player}: +{total} Persuasion ({count} Fremen)', args: { player, total, count: fremenCount } })
      }
    },
  },

  'Unswerving Loyalty': {
    revealEffect(game, player, card, allRevealedCards) {
      const recruit = Math.min(1, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        player.incrementCounter('troopsInGarrison', recruit, { silent: true })
      }
      const hasFremen = allRevealedCards.some(c =>
        c !== card && c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('fremen')
      )
      if (hasFremen) {
        const choices = ['Pass']
        if (player.troopsInGarrison > 0) {
          choices.push('Deploy 1 troop')
        }
        const deployed = game.state.conflict.deployedTroops[player.name] || 0
        if (deployed > 0) {
          choices.push('Retreat 1 troop')
        }
        if (choices.length > 1) {
          const [choice] = game.actions.choose(player, choices, { title: 'Fremen Bond' })
          if (choice.includes('Deploy')) {
            player.decrementCounter('troopsInGarrison', 1, { silent: true })
            game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + 1
          }
          else if (choice.includes('Retreat')) {
            game.state.conflict.deployedTroops[player.name]--
            player.incrementCounter('troopsInSupply', 1, { silent: true })
          }
        }
      }
    },
  },
}

// Add reveal effects to cards that already have agent implementations
implementations['Boundless Ambition'].revealEffect = function(game, player) {
  if (game.state.turnTracking) {
    game.state.turnTracking.freeAcquire5 = true
  }
  game.log.add({ template: '{player}: May acquire a card costing 5 or less', args: { player }, event: 'memo' })
}
implementations['Corrinth City'].revealEffect = function(game, player) {
  if (!player.hasHighCouncil && player.solari >= 5) {
    const choices = ['Pass', 'Pay 5 Solari for High Council seat']
    const [choice] = game.actions.choose(player, choices, { title: 'Corrinth City' })
    if (choice !== 'Pass') {
      player.decrementCounter('solari', 5, { silent: true })
      player.setCounter('hasHighCouncil', 1, { silent: true })
      game.log.add({ template: '{player} takes High Council seat', args: { player } })
    }
  }
}
implementations['Guild Accord'].revealEffect = function(game, player) {
  player.incrementCounter('water', 1, { silent: true })
  if (game.state.alliances.guild === player.name) {
    player.incrementCounter('spice', 3, { silent: true })
    game.log.add({ template: '{player}: +1 Water, +3 Spice (Guild Alliance)', args: { player } })
  }
  else {
    game.log.add({ template: '{player}: +1 Water', args: { player } })
  }
}
implementations['Guild Spy'].revealEffect = function(game) {
  if (game.state.turnTracking) {
    game.state.turnTracking.guildSpyTSMF = true
  }
}
implementations['Undercover Asset'].revealEffect = function(game, player) {
  const choices = ['+1 Spy', '+2 Swords']
  const [choice] = game.actions.choose(player, choices, { title: 'Undercover Asset' })
  if (choice.includes('Spy')) {
    spies.placeSpy(game, player)
  }
  else {
    player.incrementCounter('strength', 2 * constants.SWORD_STRENGTH, { silent: true })
    game.log.add({ template: '{player}: +2 Swords', args: { player } })
  }
}

// ── Intrigue Card Effects ──────────────────────────────────────
// Plot, Combat, and Endgame effects for intrigue cards.
// Added as separate entries or augmented onto existing entries.

Object.assign(implementations, {
  'Adaptive Tactics': {
    plotEffect(game, player) {
      if (player.spice >= 1) {
        const choices = ['Pass', 'Spend 1 Spice for +1 Troop and Combat space']
        const [choice] = game.actions.choose(player, choices, { title: 'Adaptive Tactics' })
        if (choice !== 'Pass') {
          player.decrementCounter('spice', 1, { silent: true })
          const recruit = Math.min(1, player.troopsInSupply)
          if (recruit > 0) {
            player.decrementCounter('troopsInSupply', recruit, { silent: true })
            player.incrementCounter('troopsInGarrison', recruit, { silent: true })
          }
          if (game.state.turnTracking) {
            game.state.turnTracking.spaceIsCombat = true
          }
        }
      }
    },
  },

  'Ambitious': {
    plotEffect(game, player) {
      if (player.troopsInGarrison >= 3) {
        const choices = ['Pass', 'Lose 3 troops for +1 Influence']
        const [choice] = game.actions.choose(player, choices, { title: 'Ambitious' })
        if (choice !== 'Pass') {
          player.decrementCounter('troopsInGarrison', 3, { silent: true })
          const [faction] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence with:' })
          factions.gainInfluence(game, player, faction)
        }
      }
    },
  },

  'Bribery': {
    plotEffect(game, player) {
      if (player.solari >= 2) {
        player.decrementCounter('solari', 2, { silent: true })
        const [faction] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence with:' })
        factions.gainInfluence(game, player, faction)
      }
    },
  },

  'Buy Access': {
    plotEffect(game, player) {
      if (player.solari >= 5) {
        player.decrementCounter('solari', 5, { silent: true })
        for (let i = 0; i < 2; i++) {
          const [faction] = game.actions.choose(player, constants.FACTIONS, { title: `+1 Influence (${i + 1}/2)` })
          factions.gainInfluence(game, player, faction)
        }
      }
    },
  },

  'Calculating': {
    plotEffect(game, player) {
      let types = 0
      if ((game.state.conflict.deployedTroops[player.name] || 0) > 0) {
        types++
      }
      if ((game.state.conflict.deployedSandworms[player.name] || 0) > 0) {
        types++
      }
      if (types > 0) {
        player.incrementCounter('solari', types, { silent: true })
        game.log.add({ template: '{player}: +{count} Solari ({count} unit types)', args: { player, count: types } })
      }
    },
  },

  'Call to Arms': {
    plotEffect(game) {
      if (game.state.turnTracking) {
        game.state.turnTracking.troopOnAcquire = true
      }
    },
  },

  'Change Allegiences': {
    plotEffect(game, player) {
      // Lose 1 Influence -> +1 Influence; Pay 3 Spice -> +1 Influence
      const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
      if (loseFactions.length > 0) {
        const choices = ['Pass', ...loseFactions.map(f => `Lose 1 ${f}`)]
        const [choice] = game.actions.choose(player, choices, { title: 'Swap influence?' })
        if (choice !== 'Pass') {
          const loseFaction = loseFactions.find(f => choice.includes(f))
          factions.loseInfluence(game, player, loseFaction, 1)
          const [gf] = game.actions.choose(player, constants.FACTIONS, { title: 'Gain +1 Influence' })
          factions.gainInfluence(game, player, gf)
        }
      }
      if (player.spice >= 3) {
        const choices2 = ['Pass', 'Pay 3 Spice for +1 Influence']
        const [c2] = game.actions.choose(player, choices2, { title: 'Also pay 3 Spice?' })
        if (c2 !== 'Pass') {
          player.decrementCounter('spice', 3, { silent: true })
          const [gf] = game.actions.choose(player, constants.FACTIONS, { title: 'Gain +1 Influence' })
          factions.gainInfluence(game, player, gf)
        }
      }
    },
  },

  'Charisma': {
    plotEffect(game, player) {
      player.incrementCounter('persuasion', 2, { silent: true })
      game.log.add({ template: '{player}: +2 Persuasion this Reveal turn', args: { player } })
    },
  },

  'Depart for Arrakis': {
    plotEffect(game, player) {
      if (player.spice >= 2) {
        const choices = ['Pass', 'Pay 2 Spice for +3 Troops']
        const [choice] = game.actions.choose(player, choices, { title: 'Depart for Arrakis' })
        if (choice !== 'Pass') {
          player.decrementCounter('spice', 2, { silent: true })
          const recruit = Math.min(3, player.troopsInSupply)
          if (recruit > 0) {
            player.decrementCounter('troopsInSupply', recruit, { silent: true })
            player.incrementCounter('troopsInGarrison', recruit, { silent: true })
          }
          if (player.getInfluence('guild') >= 3) {
            deckEngine.drawCards(game, player, 1)
            game.log.add({ template: '{player}: Guild synergy — draws 1 card', args: { player } })
          }
        }
      }
    },
  },

  'Detonation': {
    plotEffect(game, player) {
      const choices = []
      if (game.state.shieldWall) {
        choices.push('Blow the Shield Wall')
      }
      if (player.troopsInGarrison > 0) {
        choices.push('Deploy up to 4 Troops to Conflict')
      }
      choices.push('Pass')
      const [choice] = game.actions.choose(player, choices, { title: 'Detonation' })
      if (choice.includes('Shield Wall')) {
        game.state.shieldWall = false
        game.log.add({ template: '{player} destroys the Shield Wall!', args: { player } })
      }
      else if (choice.includes('Deploy')) {
        const max = Math.min(4, player.troopsInGarrison)
        const deployChoices = []
        for (let i = 1; i <= max; i++) {
          deployChoices.push(`Deploy ${i}`)
        }
        const [dc] = game.actions.choose(player, deployChoices, { title: 'How many?' })
        const count = parseInt(dc.match(/\d+/)[0])
        player.decrementCounter('troopsInGarrison', count, { silent: true })
        game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + count
        game.log.add({ template: '{player} deploys {count} troops to Conflict', args: { player, count } })
      }
    },
  },

  'Devious': {
    plotEffect(game, player) {
      const choices = []
      const handZone = game.zones.byId(`${player.name}.hand`)
      if (handZone.cardlist().length > 0) {
        choices.push('Trash a card from hand')
      }
      if (player.troopsInGarrison > 0) {
        choices.push('Deploy up to 2 troops')
      }
      choices.push('Pass')
      const [choice] = game.actions.choose(player, choices, { title: 'Devious' })
      if (choice.includes('Trash')) {
        const cards = handZone.cardlist()
        const [tc] = game.actions.choose(player, cards.map(c => c.name), { title: 'Trash which card?' })
        const card = cards.find(c => c.name === tc)
        if (card) {
          deckEngine.trashCard(game, card)
        }
      }
      else if (choice.includes('Deploy')) {
        const max = Math.min(2, player.troopsInGarrison)
        const deployChoices = []
        for (let i = 1; i <= max; i++) {
          deployChoices.push(`Deploy ${i}`)
        }
        const [dc] = game.actions.choose(player, deployChoices, { title: 'How many?' })
        const count = parseInt(dc.match(/\d+/)[0])
        player.decrementCounter('troopsInGarrison', count, { silent: true })
        game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + count
      }
    },
  },

  'Discerning': {
    plotEffect(game, player) {
      const handZone = game.zones.byId(`${player.name}.hand`)
      const hasAlliance = constants.FACTIONS.some(f => game.state.alliances[f] === player.name)
      if (hasAlliance) {
        deckEngine.drawCards(game, player, 1)
      }
      else if (handZone.cardlist().length > 0) {
        const cards = handZone.cardlist()
        const [choice] = game.actions.choose(player, cards.map(c => c.name), { title: 'Discard a card to draw' })
        const card = cards.find(c => c.name === choice)
        if (card) {
          deckEngine.discardCard(game, player, card)
          deckEngine.drawCards(game, player, 1)
        }
      }
    },
  },

  'Double Cross': {
    plotEffect(game, player) {
      if (player.solari >= 1) {
        const opponents = game.players.all().filter(p =>
          p.name !== player.name && (game.state.conflict.deployedTroops[p.name] || 0) > 0
        )
        if (opponents.length > 0) {
          const choices = ['Pass', ...opponents.map(p => p.name)]
          const [choice] = game.actions.choose(player, choices, { title: 'Pay 1 Solari — which opponent loses a troop?' })
          if (choice !== 'Pass') {
            player.decrementCounter('solari', 1, { silent: true })
            game.state.conflict.deployedTroops[choice]--
            const target = game.players.byName(choice)
            target.incrementCounter('troopsInSupply', 1, { silent: true })
            // Deploy one of your troops
            if (player.troopsInGarrison > 0) {
              player.decrementCounter('troopsInGarrison', 1, { silent: true })
              game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + 1
            }
            game.log.add({ template: '{player} forces {target} to lose 1 troop, deploys 1', args: { player, target } })
          }
        }
      }
    },
  },

  "Emperor's Invitation": {
    plotEffect(game) {
      if (game.state.turnTracking) {
        game.state.turnTracking.hasEmperorIcon = true
      }
      game.log.add({ template: 'Card gains Emperor icon this turn', event: 'memo' })
    },
  },

  'Finesse': {
    plotEffect(game, player) {
      const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
      if (loseFactions.length > 0) {
        const choices = ['Pass', ...loseFactions.map(f => `Lose 1 ${f}`)]
        const [choice] = game.actions.choose(player, choices, { title: 'Swap influence?' })
        if (choice !== 'Pass') {
          const loseFaction = loseFactions.find(f => choice.includes(f))
          factions.loseInfluence(game, player, loseFaction, 1)
          const [gf] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence' })
          factions.gainInfluence(game, player, gf)
        }
      }
    },
  },

  'Infiltrate': {
    plotEffect(game) {
      if (game.state.turnTracking) {
        game.state.turnTracking.ignoreOccupancy = true
      }
    },
  },

  'Intelligence Report': {
    plotEffect(game, player) {
      deckEngine.drawCards(game, player, 1)
      // Check spy count on board
      const observationPosts = require('../res/observationPosts.js')
      let spyCount = 0
      for (const post of observationPosts) {
        const occupants = game.state.spyPosts[post.id] || []
        if (occupants.includes(player.name)) {
          spyCount++
        }
      }
      if (spyCount >= 2) {
        deckEngine.drawCards(game, player, 1)
        game.log.add({ template: '{player}: 2+ Spies — draws another card', args: { player } })
      }
    },
  },

  'Leverage': {
    plotEffect(game, player) {
      const gained = game.state.turnTracking?.spiceGained || 0
      if (gained > 0) {
        const choam = require('./choam.js')
        choam.takeContract(game, player)
        player.incrementCounter('solari', 1, { silent: true })
        game.log.add({ template: '{player}: +1 Contract, +1 Solari', args: { player } })
      }
    },
  },

  'Opportunism': {
    plotEffect(game, player) {
      if (player.solari >= 2) {
        const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
        if (loseFactions.length >= 2) {
          const choices = ['Pass', 'Lose 1 Influence with 2 Factions + 2 Solari -> +1 VP']
          const [choice] = game.actions.choose(player, choices, { title: 'Opportunism' })
          if (choice !== 'Pass') {
            for (let i = 0; i < 2; i++) {
              const available = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
              const [faction] = game.actions.choose(player, available, { title: `Lose Influence (${i + 1}/2)` })
              factions.loseInfluence(game, player, faction, 1)
            }
            player.decrementCounter('solari', 2, { silent: true })
            player.incrementCounter('vp', 1, { silent: true })
            game.log.add({ template: '{player}: +1 VP', args: { player } })
          }
        }
      }
    },
  },

  'Poison Snooper': {
    plotEffect(game, player) {
      const deckZone = game.zones.byId(`${player.name}.deck`)
      const topCards = deckZone.cardlist()
      if (topCards.length > 0) {
        const topCard = topCards[0]
        const choices = [`Draw ${topCard.name}`, `Trash ${topCard.name}`]
        const [choice] = game.actions.choose(player, choices, { title: 'Poison Snooper: Top card' })
        if (choice.includes('Draw')) {
          const handZone = game.zones.byId(`${player.name}.hand`)
          topCard.moveTo(handZone)
        }
        else {
          deckEngine.trashCard(game, topCard)
        }
      }
    },
  },

  'Quid Pro Quo': {
    plotEffect(game, player) {
      if (player.spice >= 2) {
        const choices = ['Pass', 'Pay 2 Spice for +1 Influence per faction with agents']
        const [choice] = game.actions.choose(player, choices, { title: 'Quid Pro Quo' })
        if (choice !== 'Pass') {
          player.decrementCounter('spice', 2, { silent: true })
          // Gain influence with each faction that has at least one of your agents
          const boardSpacesData = require('../res/boardSpaces.js')
          const factionSet = new Set()
          for (const space of boardSpacesData) {
            if (game.state.boardSpaces[space.id] === player.name && space.faction) {
              factionSet.add(space.faction)
            }
          }
          for (const faction of factionSet) {
            factions.gainInfluence(game, player, faction)
          }
        }
      }
    },
  },

  'Refocus': {
    plotEffect(game, player) {
      const discardZone = game.zones.byId(`${player.name}.discard`)
      const deckZone = game.zones.byId(`${player.name}.deck`)
      for (const card of discardZone.cardlist()) {
        card.moveTo(deckZone)
      }
      deckZone.shuffle(game.random)
      deckEngine.drawCards(game, player, 1)
      game.log.add({ template: '{player}: Shuffles discard into deck, draws 1', args: { player } })
    },
  },

  'Reinforcements': {
    plotEffect(game, player) {
      if (player.solari >= 3) {
        const choices = ['Pass', 'Pay 3 Solari for +3 Troops']
        const [choice] = game.actions.choose(player, choices, { title: 'Reinforcements' })
        if (choice !== 'Pass') {
          player.decrementCounter('solari', 3, { silent: true })
          const recruit = Math.min(3, player.troopsInSupply)
          if (recruit > 0) {
            player.decrementCounter('troopsInSupply', recruit, { silent: true })
            player.incrementCounter('troopsInGarrison', recruit, { silent: true })
          }
        }
      }
    },
  },

  'Resourceful': {
    plotEffect(game) {
      if (game.state.turnTracking) {
        game.state.turnTracking.allIcons = true
      }
    },
  },

  "Shaddam's Favor": {
    plotEffect(game, player) {
      const recruit = Math.min(1, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        player.incrementCounter('troopsInGarrison', recruit, { silent: true })
      }
      if (player.getInfluence('emperor') >= 3) {
        player.incrementCounter('solari', 3, { silent: true })
        game.log.add({ template: '{player}: Emperor synergy — +3 Solari', args: { player } })
      }
    },
  },

  'Special Mission': {
    plotEffect(game, player) {
      const choices = ['Place 1 Spy']
      const observationPosts = require('../res/observationPosts.js')
      const hasSpy = observationPosts.some(p => (game.state.spyPosts[p.id] || []).includes(player.name))
      if (hasSpy) {
        choices.push('Recall Spy -> Blow Shield Wall + 2 Spice')
      }
      choices.push('Pass')
      const [choice] = game.actions.choose(player, choices, { title: 'Special Mission' })
      if (choice.includes('Place')) {
        spies.placeSpy(game, player)
      }
      else if (choice.includes('Recall')) {
        spies.recallSpy(game, player)
        game.state.shieldWall = false
        player.incrementCounter('spice', 2, { silent: true })
        game.log.add({ template: '{player}: Blows Shield Wall, +2 Spice', args: { player } })
      }
    },
  },

  'Strongarm': {
    plotEffect(game, player) {
      if (player.troopsInGarrison > 0) {
        player.decrementCounter('troopsInGarrison', 1, { silent: true })
        const [faction] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence' })
        factions.gainInfluence(game, player, faction)
      }
    },
  },

  'Unexpected Allies': {
    plotEffect(game, player) {
      if (player.water >= 2) {
        const choices = ['Pass', 'Pay 2 Water: Blow Shield Wall + 1 Sandworm']
        const [choice] = game.actions.choose(player, choices, { title: 'Unexpected Allies' })
        if (choice !== 'Pass') {
          player.decrementCounter('water', 2, { silent: true })
          game.state.shieldWall = false
          game.state.conflict.deployedSandworms[player.name] =
            (game.state.conflict.deployedSandworms[player.name] || 0) + 1
          game.log.add({ template: '{player}: Blows Shield Wall, deploys Sandworm', args: { player } })
        }
      }
    },
  },

  'Unnatural': {
    plotEffect(game, player) {
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
            const recruit = Math.min(1, player.troopsInSupply)
            if (recruit > 0) {
              player.decrementCounter('troopsInSupply', recruit, { silent: true })
              player.incrementCounter('troopsInGarrison', recruit, { silent: true })
            }
          }
        }
      }
    },
  },

  'Withdrawn': {
    plotEffect(game) {
      if (game.state.turnTracking) {
        game.state.turnTracking.passedTurn = true
      }
    },
  },

  // ── Combat Intrigue Effects ──────────────────────────────────

  'Demand Respect': {
    combatEffect(game) {
      // When you win: +1 Influence OR Pay 2 Spice -> +2 Influence
      if (game.state.turnTracking) {
        game.state.turnTracking.demandRespect = true
      }
    },
  },

  'Devour': {
    combatEffect(game, player) {
      player.incrementCounter('strength', 2 * constants.SWORD_STRENGTH, { silent: true })
      const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
      if (sandworms > 0) {
        player.incrementCounter('strength', 2 * constants.SWORD_STRENGTH, { silent: true })
        // Trash a card
        const handZone = game.zones.byId(`${player.name}.hand`)
        const cards = handZone.cardlist()
        if (cards.length > 0) {
          const [choice] = game.actions.choose(player, cards.map(c => c.name), { title: 'Trash a card' })
          const card = cards.find(c => c.name === choice)
          if (card) {
            deckEngine.trashCard(game, card)
          }
        }
        game.log.add({ template: '{player}: +4 Swords (Sandworm bonus)', args: { player } })
      }
      else {
        game.log.add({ template: '{player}: +2 Swords', args: { player } })
      }
    },
  },

  'Find Weakness': {
    combatEffect(game, player) {
      player.incrementCounter('strength', 2 * constants.SWORD_STRENGTH, { silent: true })
      const observationPosts = require('../res/observationPosts.js')
      const hasSpy = observationPosts.some(p => (game.state.spyPosts[p.id] || []).includes(player.name))
      if (hasSpy) {
        spies.recallSpy(game, player)
        player.incrementCounter('strength', 3 * constants.SWORD_STRENGTH, { silent: true })
        game.log.add({ template: '{player}: +5 Swords (recalled Spy)', args: { player } })
      }
      else {
        game.log.add({ template: '{player}: +2 Swords', args: { player } })
      }
    },
  },

  'Go to Ground': {
    combatEffect(game, player) {
      const deployed = game.state.conflict.deployedTroops[player.name] || 0
      const retreatMax = Math.min(2, deployed)
      if (retreatMax > 0) {
        const choices = []
        for (let i = 1; i <= retreatMax; i++) {
          choices.push(`Retreat ${i}`)
        }
        choices.push('Pass')
        const [choice] = game.actions.choose(player, choices, { title: 'Retreat for +1 Spy?' })
        if (choice !== 'Pass') {
          const count = parseInt(choice.match(/\d+/)[0])
          game.state.conflict.deployedTroops[player.name] -= count
          player.incrementCounter('troopsInSupply', count, { silent: true })
          spies.placeSpy(game, player)
        }
      }
    },
  },

  'Impress': {
    combatEffect(game, player) {
      player.incrementCounter('strength', 2 * constants.SWORD_STRENGTH, { silent: true })
      // Acquire a card costing 3 or less — modifier
      player.incrementCounter('persuasion', 3, { silent: true })
      game.log.add({ template: '{player}: +2 Swords, +3 Persuasion for acquire', args: { player } })
    },
  },

  'Questionable Methods': {
    combatEffect(game, player) {
      player.incrementCounter('strength', 1 * constants.SWORD_STRENGTH, { silent: true })
      const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
      if (loseFactions.length > 0) {
        const choices = ['Pass', ...loseFactions.map(f => `Lose 1 ${f} for +4 Swords`)]
        const [choice] = game.actions.choose(player, choices, { title: 'Questionable Methods' })
        if (choice !== 'Pass') {
          const faction = loseFactions.find(f => choice.includes(f))
          factions.loseInfluence(game, player, faction, 1)
          player.incrementCounter('strength', 4 * constants.SWORD_STRENGTH, { silent: true })
        }
      }
    },
  },

  'Reach Agreement': {
    combatEffect(game, player) {
      const deployed = game.state.conflict.deployedTroops[player.name] || 0
      const retreatMax = Math.min(2, deployed)
      if (retreatMax > 0) {
        const choices = []
        for (let i = 1; i <= retreatMax; i++) {
          choices.push(`Retreat ${i}`)
        }
        choices.push('Pass')
        const [choice] = game.actions.choose(player, choices, { title: 'Retreat for +1 Contract?' })
        if (choice !== 'Pass') {
          const count = parseInt(choice.match(/\d+/)[0])
          game.state.conflict.deployedTroops[player.name] -= count
          player.incrementCounter('troopsInSupply', count, { silent: true })
          const choam = require('./choam.js')
          choam.takeContract(game, player)
        }
      }
    },
  },

  'Return the Favor': {
    combatEffect(game, player) {
      let swords = 1
      for (const faction of constants.FACTIONS) {
        if (player.getInfluence(faction) >= 2) {
          swords++
        }
      }
      player.incrementCounter('strength', swords * constants.SWORD_STRENGTH, { silent: true })
      game.log.add({ template: '{player}: +{count} Swords', args: { player, count: swords } })
    },
  },

  'Ripples in the Sand': {
    combatEffect(game, player) {
      player.incrementCounter('strength', 3 * constants.SWORD_STRENGTH, { silent: true })
      const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
      if (sandworms > 0) {
        deckEngine.drawIntrigueCard(game, player, 1)
        game.log.add({ template: '{player}: +3 Swords, +1 Intrigue (Sandworm)', args: { player } })
      }
      else {
        game.log.add({ template: '{player}: +3 Swords', args: { player } })
      }
    },
  },

  'Second Wave': {
    combatEffect(game, player) {
      player.incrementCounter('strength', 2 * constants.SWORD_STRENGTH, { silent: true })
      const max = Math.min(2, player.troopsInGarrison)
      if (max > 0) {
        const choices = []
        for (let i = 0; i <= max; i++) {
          choices.push(`Deploy ${i}`)
        }
        const [choice] = game.actions.choose(player, choices, { title: 'Deploy to Conflict?' })
        const count = parseInt(choice.match(/\d+/)[0])
        if (count > 0) {
          player.decrementCounter('troopsInGarrison', count, { silent: true })
          game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + count
        }
      }
    },
  },

  'Shrewd': {
    combatEffect(game, player) {
      const deployed = game.state.conflict.deployedTroops[player.name] || 0
      if (deployed > 0) {
        game.state.conflict.deployedTroops[player.name]--
        player.incrementCounter('troopsInSupply', 1, { silent: true })
        player.incrementCounter('spice', 1, { silent: true })
        game.log.add({ template: '{player}: Loses 1 troop, +1 Spice', args: { player } })
      }
    },
  },

  'Staged Incident': {
    combatEffect(game, player) {
      const deployed = game.state.conflict.deployedTroops[player.name] || 0
      if (deployed >= 3) {
        game.state.conflict.deployedTroops[player.name] -= 3
        player.incrementCounter('troopsInSupply', 3, { silent: true })
        player.incrementCounter('vp', 1, { silent: true })
        game.log.add({ template: '{player}: Loses 3 troops, +1 VP', args: { player } })
      }
    },
  },

  'Strategic Push': {
    combatEffect(game, player) {
      player.incrementCounter('strength', 2 * constants.SWORD_STRENGTH, { silent: true })
      if (game.state.turnTracking) {
        game.state.turnTracking.strategicPush = true
      }
      game.log.add({ template: '{player}: +2 Swords (if win: +2 Solari)', args: { player } })
    },
  },

  'The Strong Survive': {
    combatEffect(game, player) {
      const choices = ['+3 Troops']
      const deployed = game.state.conflict.deployedTroops[player.name] || 0
      if (deployed > 0) {
        choices.push('Retreat 1 troop -> Trash a card')
      }
      const [choice] = game.actions.choose(player, choices, { title: 'The Strong Survive' })
      if (choice.includes('+3')) {
        const recruit = Math.min(3, player.troopsInSupply)
        if (recruit > 0) {
          player.decrementCounter('troopsInSupply', recruit, { silent: true })
          player.incrementCounter('troopsInGarrison', recruit, { silent: true })
        }
      }
      else {
        game.state.conflict.deployedTroops[player.name]--
        player.incrementCounter('troopsInSupply', 1, { silent: true })
        const handZone = game.zones.byId(`${player.name}.hand`)
        const cards = handZone.cardlist()
        if (cards.length > 0) {
          const [tc] = game.actions.choose(player, cards.map(c => c.name), { title: 'Trash' })
          const card = cards.find(c => c.name === tc)
          if (card) {
            deckEngine.trashCard(game, card)
          }
        }
      }
    },
  },

  'To the Victor …': {
    combatEffect(game) {
      if (game.state.turnTracking) {
        game.state.turnTracking.toTheVictor = true
      }
    },
  },

  'Weirding Combat': {
    combatEffect(game, player) {
      let swords = 3
      if (player.getInfluence('bene-gesserit') >= 3) {
        swords += 2
      }
      player.incrementCounter('strength', swords * constants.SWORD_STRENGTH, { silent: true })
      game.log.add({ template: '{player}: +{count} Swords', args: { player, count: swords } })
    },
  },

  // ── Endgame Intrigue Effects ─────────────────────────────────

  'Corner The Market': {
    endgameEffect(game, player) {
      // Count TSMF cards
      const allZones = [
        game.zones.byId(`${player.name}.deck`),
        game.zones.byId(`${player.name}.hand`),
        game.zones.byId(`${player.name}.discard`),
        game.zones.byId(`${player.name}.played`),
      ]
      let tsmfCount = 0
      for (const zone of allZones) {
        tsmfCount += zone.cardlist().filter(c => c.name === 'The Spice Must Flow').length
      }
      if (tsmfCount >= 2) {
        player.incrementCounter('vp', 1, { silent: true })
        game.log.add({ template: '{player}: +1 VP (2+ TSMF)', args: { player } })
      }
    },
  },

  'Crysknife': {
    endgameEffect(game, player) {
      // Flip a crysknife/wild conflict card -> +1 VP
      const wonCards = game.state.conflict.wonCards?.[player.name] || []
      const flippable = wonCards.filter(c => c.battleIcon === 'blue' || c.battleIcon === 'wild')
      if (flippable.length > 0) {
        player.incrementCounter('vp', 1, { silent: true })
        game.log.add({ template: '{player}: Flips Crysknife icon — +1 VP', args: { player } })
      }
    },
  },

  'Desert Mouse': {
    endgameEffect(game, player) {
      const wonCards = game.state.conflict.wonCards?.[player.name] || []
      const flippable = wonCards.filter(c => c.battleIcon === 'yellow' || c.battleIcon === 'wild')
      if (flippable.length > 0) {
        player.incrementCounter('vp', 1, { silent: true })
        game.log.add({ template: '{player}: Flips Desert Mouse icon — +1 VP', args: { player } })
      }
    },
  },

  'Grasp Arrakis': {
    endgameEffect(game, player) {
      // Flip two conflict cards -> +1 VP
      const wonCards = game.state.conflict.wonCards?.[player.name] || []
      if (wonCards.length >= 2) {
        player.incrementCounter('vp', 1, { silent: true })
        game.log.add({ template: '{player}: Flips 2 conflict cards — +1 VP', args: { player } })
      }
    },
  },

  'Ornithopter': {
    endgameEffect(game, player) {
      const wonCards = game.state.conflict.wonCards?.[player.name] || []
      const flippable = wonCards.filter(c => c.battleIcon === 'green' || c.battleIcon === 'wild')
      if (flippable.length > 0) {
        player.incrementCounter('vp', 1, { silent: true })
        game.log.add({ template: '{player}: Flips Ornithopter icon — +1 VP', args: { player } })
      }
    },
  },

  'Plans Within Plans': {
    endgameEffect(game, player) {
      // Having 3+ Influence on 3 Factions: +1 VP OR 3+ on all 4: +2 VP
      const factionsAt3 = constants.FACTIONS.filter(f => player.getInfluence(f) >= 3).length
      if (factionsAt3 >= 4) {
        player.incrementCounter('vp', 2, { silent: true })
        game.log.add({ template: '{player}: +2 VP (3+ on all 4 Factions)', args: { player } })
      }
      else if (factionsAt3 >= 3) {
        player.incrementCounter('vp', 1, { silent: true })
        game.log.add({ template: '{player}: +1 VP (3+ on 3 Factions)', args: { player } })
      }
    },
  },

  'Secure Spice Trade': {
    endgameEffect(game, player) {
      const allZones = [
        game.zones.byId(`${player.name}.deck`),
        game.zones.byId(`${player.name}.hand`),
        game.zones.byId(`${player.name}.discard`),
        game.zones.byId(`${player.name}.played`),
      ]
      let tsmfCount = 0
      for (const zone of allZones) {
        tsmfCount += zone.cardlist().filter(c => c.name === 'The Spice Must Flow').length
      }
      if (tsmfCount >= 2) {
        player.incrementCounter('vp', 1, { silent: true })
        player.incrementCounter('spice', 2, { silent: true })
        game.log.add({ template: '{player}: +1 VP, +2 Spice (2+ TSMF)', args: { player } })
      }
    },
  },
})

// Add Tenuous Bond combat effect to existing entry or create new
if (!implementations['Tenuous Bond']) {
  implementations['Tenuous Bond'] = {}
}
implementations['Tenuous Bond'].plotEffect = function(game, player) {
  const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
  if (loseFactions.length > 0) {
    const choices = ['Pass', ...loseFactions.map(f => `Lose 1 ${f}`)]
    const [choice] = game.actions.choose(player, choices, { title: 'Swap influence?' })
    if (choice !== 'Pass') {
      const loseFaction = loseFactions.find(f => choice.includes(f))
      factions.loseInfluence(game, player, loseFaction, 1)
      const [gf] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence' })
      factions.gainInfluence(game, player, gf)
    }
  }
}
implementations['Tenuous Bond'].combatEffect = function(game, player) {
  // Trash a card from discard that costs 1+ Persuasion -> +4 Swords
  const discardZone = game.zones.byId(`${player.name}.discard`)
  const trashable = discardZone.cardlist().filter(c => c.persuasionCost > 0)
  if (trashable.length > 0) {
    const choices = ['Pass', ...trashable.map(c => c.name)]
    const [choice] = game.actions.choose(player, choices, { title: 'Trash from discard for +4 Swords?' })
    if (choice !== 'Pass') {
      const card = trashable.find(c => c.name === choice)
      if (card) {
        deckEngine.trashCard(game, card)
        player.incrementCounter('strength', 4 * constants.SWORD_STRENGTH, { silent: true })
      }
    }
  }
}

// ── Remaining intrigue card effects (expansion-adjacent and unique) ──

Object.assign(implementations, {
  'Bindu Suspension': {
    plotEffect(game) {
      // At start of turn: draw a card, may pass turn
      if (game.state.turnTracking) {
        game.state.turnTracking.binduSuspension = true
      }
    },
  },

  'Bypass Protocol': {
    plotEffect(game, player) {
      // Acquire card costing 3 or less, OR pay 2 Spice for card costing 5 or less
      const choices = ['Acquire card costing 3 Persuasion or less']
      if (player.spice >= 2) {
        choices.push('Pay 2 Spice: Acquire card costing 5 or less')
      }
      choices.push('Pass')
      const [choice] = game.actions.choose(player, choices, { title: 'Bypass Protocol' })
      if (choice.includes('3')) {
        player.incrementCounter('persuasion', 3, { silent: true })
      }
      else if (choice.includes('5')) {
        player.decrementCounter('spice', 2, { silent: true })
        player.incrementCounter('persuasion', 5, { silent: true })
      }
    },
  },

  'Controlled': {
    plotEffect(game, player) {
      const deckZone = game.zones.byId(`${player.name}.deck`)
      const topCards = deckZone.cardlist()
      if (topCards.length > 0) {
        const topCard = topCards[0]
        const choices = [`Put ${topCard.name} back`, `Discard ${topCard.name}`]
        if (player.solari >= 1) {
          choices.push(`Pay 1 Solari: Draw ${topCard.name}`)
        }
        const [choice] = game.actions.choose(player, choices, { title: 'Controlled: Top card' })
        if (choice.includes('Discard')) {
          deckEngine.discardCard(game, player, topCard)
        }
        else if (choice.includes('Draw')) {
          player.decrementCounter('solari', 1, { silent: true })
          const handZone = game.zones.byId(`${player.name}.hand`)
          topCard.moveTo(handZone)
        }
        // "Put back" = do nothing
      }
    },
  },

  'Dispatch an Envoy': {
    plotEffect(game) {
      // Card gets all faction icons this turn
      if (game.state.turnTracking) {
        game.state.turnTracking.allFactionIcons = true
      }
    },
  },

  'False Orders': {
    plotEffect(game, player) {
      // Move opponent spies from your space, then place your spy there
      spies.placeSpy(game, player)
      game.log.add({ template: '{player}: False Orders — places Spy', args: { player } })
    },
  },

  'Insider Information': {
    plotEffect(game, player) {
      // Recall Spy -> Trash + Draw OR Ignore Influence requirements
      const observationPosts = require('../res/observationPosts.js')
      const hasSpy = observationPosts.some(p => (game.state.spyPosts[p.id] || []).includes(player.name))
      const choices = []
      if (hasSpy) {
        choices.push('Recall Spy: Trash a card and Draw a card')
      }
      choices.push('Ignore Influence requirements this turn')
      choices.push('Pass')
      const [choice] = game.actions.choose(player, choices, { title: 'Insider Information' })
      if (choice.includes('Recall')) {
        spies.recallSpy(game, player)
        // Trash from hand
        const handZone = game.zones.byId(`${player.name}.hand`)
        const cards = handZone.cardlist()
        if (cards.length > 0) {
          const [tc] = game.actions.choose(player, cards.map(c => c.name), { title: 'Trash a card' })
          const card = cards.find(c => c.name === tc)
          if (card) {
            deckEngine.trashCard(game, card)
          }
        }
        deckEngine.drawCards(game, player, 1)
      }
      else if (choice.includes('Ignore')) {
        if (game.state.turnTracking) {
          game.state.turnTracking.ignoreInfluenceRequirements = true
        }
      }
    },
  },

  'Insidious': {
    plotEffect(game, player) {
      // Give an opponent an Intrigue card -> +1 Spice (or +2 if non-Twisted)
      const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
      const cards = intrigueZone.cardlist()
      if (cards.length > 0) {
        const cardChoices = cards.map(c => c.name)
        const [cardChoice] = game.actions.choose(player, cardChoices, { title: 'Give which Intrigue card?' })
        const card = cards.find(c => c.name === cardChoice)
        const opponents = game.players.all().filter(p => p.name !== player.name)
        const [opponentName] = game.actions.choose(player, opponents.map(p => p.name), { title: 'Give to which opponent?' })
        const oppIntrigue = game.zones.byId(`${opponentName}.intrigue`)
        card.moveTo(oppIntrigue)
        player.incrementCounter('spice', 1, { silent: true })
        game.log.add({ template: '{player}: Gives Intrigue to {opponent}, +1 Spice', args: { player, opponent: opponentName } })
      }
    },
  },

  'Inspire Awe': {
    plotEffect(game, player) {
      // Acquire card costing 3 or less; if sandworm, put on top of deck
      player.incrementCounter('persuasion', 3, { silent: true })
      const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
      if (sandworms > 0) {
        if (game.state.turnTracking) {
          game.state.turnTracking.acquireToTopOfDeck = true
        }
      }
    },
  },

  'Recruitment Mission': {
    plotEffect(game, player) {
      player.incrementCounter('persuasion', 1, { silent: true })
      if (game.state.turnTracking) {
        game.state.turnTracking.acquireToTopOfDeck = true
      }
    },
  },

  'Seize Production': {
    plotEffect(game, player) {
      // +2 Solari OR if Sardaukar Commanders in Conflict: +2 Spice
      // Sardaukar Commanders are Bloodlines expansion — just give +2 Solari for now
      player.incrementCounter('solari', 2, { silent: true })
      game.log.add({ template: '{player}: +2 Solari', args: { player } })
    },
  },

  // Expansion-dependent effects (Dreadnoughts, Tech, Freighter, Mentat)
  // These cards exist in base Uprising but reference expansion mechanics.
  // Stubbed with the non-expansion part of their effect or logged as memo.

  'Advanced Weaponry': {
    plotEffect(game, player) {
      // Pay 3 Solari -> +1 Dreadnought (expansion) — stub: log
      game.log.add({ template: '{player}: Advanced Weaponry — Dreadnought not available (expansion)', args: { player }, event: 'memo' })
    },
    combatEffect(game, player) {
      // Tech tiles condition (expansion) — stub
      game.log.add({ template: '{player}: Advanced Weaponry — Tech tiles not tracked (expansion)', args: { player }, event: 'memo' })
    },
  },

  'Battlefield Research': {
    combatEffect(game, player) {
      // Retreat troops -> Buy Tech (expansion) — stub
      game.log.add({ template: '{player}: Battlefield Research — Tech not available (expansion)', args: { player }, event: 'memo' })
    },
    endgameEffect(game, player) {
      // 3+ Tech tiles -> +1 VP (expansion) — stub
      game.log.add({ template: '{player}: Battlefield Research — Tech tiles not tracked (expansion)', args: { player }, event: 'memo' })
    },
  },

  'Calculated Hire': {
    plotEffect(game, player) {
      // Pay 1 Spice -> Take Mentat (expansion) — stub
      game.log.add({ template: '{player}: Calculated Hire — Mentat not available (expansion)', args: { player }, event: 'memo' })
    },
  },

  'Cannon Turrets': {
    combatEffect(game, player) {
      // +2 Swords; Each opponent retreats one Dreadnought (expansion)
      player.incrementCounter('strength', 2 * constants.SWORD_STRENGTH, { silent: true })
      game.log.add({ template: '{player}: +2 Swords (Dreadnought retreat is expansion)', args: { player } })
    },
  },

  'Coercive Negotiation': {
    plotEffect(game) {
      // When deploy 3+ units: Reveal 3 contracts, take 1 (triggered effect)
      if (game.state.turnTracking) {
        game.state.turnTracking.coerciveNegotiation = true
      }
    },
  },

  'Distraction': {
    plotEffect(game) {
      // When deploy 3+ units: +1 Spy
      if (game.state.turnTracking) {
        game.state.turnTracking.distraction = true
      }
    },
  },

  'Diversion': {
    plotEffect(game, player) {
      // When deploy 4+ units: Move Freighter (expansion) — stub
      game.log.add({ template: '{player}: Diversion — Freighter not available (expansion)', args: { player }, event: 'memo' })
    },
  },

  'Expedite': {
    plotEffect(game, player) {
      // Pay 1 Spice -> Move Freighter (expansion) — stub
      game.log.add({ template: '{player}: Expedite — Freighter not available (expansion)', args: { player }, event: 'memo' })
    },
  },

  'Grand Conspiracy': {
    endgameEffect(game, player) {
      // Complex multi-condition check (Dreadnoughts, TSMF, Influence, High Council)
      // Check the non-expansion conditions
      let conditions = 0
      // 1+ TSMF
      const allZones = [game.zones.byId(`${player.name}.deck`), game.zones.byId(`${player.name}.hand`),
        game.zones.byId(`${player.name}.discard`), game.zones.byId(`${player.name}.played`)]
      const hasTSMF = allZones.some(z => z.cardlist().some(c => c.name === 'The Spice Must Flow'))
      if (hasTSMF) {
        conditions++
      }
      // 4+ Influence on 2+ tracks
      const tracksAt4 = constants.FACTIONS.filter(f => player.getInfluence(f) >= 4).length
      if (tracksAt4 >= 2) {
        conditions++
      }
      // High Council seat
      if (player.hasHighCouncil) {
        conditions++
      }
      // Dreadnoughts — expansion, skip
      // Any 3 of these: +1 VP; all 5: +3 VP (but we only have 3 non-expansion conditions)
      if (conditions >= 3) {
        player.incrementCounter('vp', 1, { silent: true })
        game.log.add({ template: '{player}: Grand Conspiracy — +1 VP ({count}/5 conditions)', args: { player, count: conditions } })
      }
    },
  },

  'Honor Guard': {
    plotEffect(game, player) {
      // +1 Troop (Sardaukar Commander discount is Bloodlines — skip)
      const recruit = Math.min(1, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        player.incrementCounter('troopsInGarrison', recruit, { silent: true })
      }
    },
  },

  'Machine Culture': {
    plotEffect(game, player) {
      // Acquire Tech (expansion) — stub
      game.log.add({ template: '{player}: Machine Culture — Tech not available (expansion)', args: { player }, event: 'memo' })
    },
    endgameEffect(game, player) {
      // 3+ Tech tiles -> +1 VP (expansion) — stub
      game.log.add({ template: '{player}: Machine Culture — Tech tiles not tracked (expansion)', args: { player }, event: 'memo' })
    },
  },

  'Manipulate': {
    plotEffect(game, player) {
      // Remove and replace a card in Imperium Row — complex market manipulation
      game.log.add({ template: '{player}: Manipulate — Imperium Row manipulation', args: { player }, event: 'memo' })
    },
  },

  'Rapid Engineering': {
    plotEffect(game, player) {
      // Discard -> Buy Tech (expansion) OR 3+ Tech -> Influence (expansion)
      game.log.add({ template: '{player}: Rapid Engineering — Tech not available (expansion)', args: { player }, event: 'memo' })
    },
  },
})

/**
 * Get the implementation for a card by name, if one exists.
 */
function getImplementation(cardName) {
  return implementations[cardName] || null
}

module.exports = { getImplementation, implementations }
