import axios from 'axios'
import bsgutil from './lib/util.js'
import decks from './lib/decks.js'
import factory from './lib/factory.js'
import util from '@/util.js'


function adjustCounter(state, counter, amount) {
  if (amount === 0) return

  state.game.counters[counter] += amount
  log(state, {
    template: `${counter} adjusted by {amount}`,
    classes: [
      amount > 0 ? 'resource-up' : 'resource-down',
      'admin-action',
    ],
    args: { amount },
  })
}

function cardReveal(state, card) {
  card.visibility = state.game.players.map(p => p.name)
}

function cardView(state, card, player) {
  pushUnique(card.visibility, player.name)
}

function clearGrab(state) {
  // Pawn
  state.ui.pawnGrab.playerId = ''

  // Space Component
  state.ui.spaceComponentGrab.component = ''
  state.ui.spaceComponentGrab.source = ''

  // Grab Message
  state.ui.grabbing.message = ''
}

function deckGet(state, deckName) {
  const deck = state.game.zones.decks[deckName]
  if (!deck) {
    throw `Unknown deck name: ${deckName}`
  }
  return deck
}

function drawRandom(state, kind) {
  const deck = deckGet(state, kind)
  util.shuffleArray(deck)
  return deck.pop()
}

function drawTop(state, path) {
  maybeReshuffleDiscard(state, path)
  const deck = deckGet(state, path).cards
  return deck.shift()
}

function doSpaceComponentRemove(state) {
  const { component, source } = state.ui.spaceComponentGrab
  removeFromSpaceRegion(state)
  clearGrab(state)

  log(state, {
    template: "{component} returned to supply from {region}",
    classes: ['player-action', 'space-action'],
    args: {
      component: component,
      region: source,
    },
  })
}

function handGet(state, playerId) {
  const player = playerById(state, playerId)
  const hand = state.game.zones.players[player.name]
  return hand
}

function healBasestar(state, name) {
  state.game.space.ships[name].damage.forEach(token => {
    state.game.space.basestarDamageTokens.push(token)
  })
  state.game.space.ships[name].damage = []
}

function isRevealed(state, card) {
  return card.visibility.length === state.game.players.length
}

function isVisible(state, card) {
  return card.visibility.includes(state.ui.player.name)
}

function logEnrichArgClasses(msg) {
  if (!msg.args)
    return

  for (const key of Object.keys(msg.args)) {
    // Convert string args to a dict
    if (typeof msg.args[key] !== 'object') {
      msg.args[key] = {
        value: msg.args[key],
      }
    }

    // Ensure the dict has a classes entry
    const classes = msg.args[key].classes || []
    msg.args[key].classes = classes

    if (key === 'player') {
      pushUnique(classes, 'player-name')
    }
    else if (key === 'character') {
      pushUnique(classes, 'character-name')
      pushUnique(classes, bsgutil.characterNameToCssClass(msg.args[key].value))
    }
    else if (key === 'location') {
      pushUnique(classes, 'location-name')
    }
    else if (key === 'phase') {
      pushUnique(classes, 'phase-name')
    }
    else if (key === 'title') {
      pushUnique(classes, 'title-name')
    }
    else if (key === 'card') {
      const card = msg.args['card']
      if (typeof card !== 'object') {
        throw `Pass whole card object to log for better logging. Got: ${card}`
      }
      msg.args['card'] = {
        value: card.name,
        visibility: card.visibility,
        kind: card.kind,
        classes: [`card-${card.kind}`],
      }
    }
  }
}

function log(state, msgObject) {
  logEnrichArgClasses(msgObject)
  msgObject.actor = state.ui.player.name

  const log = state.game.log
  msgObject.id = log.length
  log.push(msgObject)
}

function maybeReshuffleDiscard(state, path) {
  if (!path.endsWith('deck'))
    return

  const discardPath = path.replace('deck', 'discard')

  let deck = deckGet(state, path)
  let discard = deckGet(state, discardPath)

  if (deck.length == 0 && discard.length > 0) {
    deck = util.shuffleArray([...discard])
    discard = []

    log(state, {
      template: "Shuffled this discard pile back into {deck}",
      classes: ['admin-action', 'skill-deck-shuffle'],
      args: {
        deck: path,
      },
    })
  }
}

function moveCard(state, data) {
  const source = zoneGet(state, data.source).cards
  const target = zoneGet(state, data.target).cards

  const sourceIdx = data.cardId
                  ? source.findIndex(x => x.id === data.cardId)
                  : data.sourceIndex
  const targetIdx = data.targetIdx || target.length

  if (sourceIdx === -1) {
    throw `Card not found in source. ${data.cardId}, ${data.source}`
  }

  const card = source.splice(sourceIdx, 1)[0]
  target.splice(targetIdx, 0, card)

  log(state, {
    template: "{card} moved from {source} to {target}",
    classes: ['card-move'],
    args: {
      card,
      source: data.source,
      target: data.target,
    },
  })
}

  function playerById(state, playerId) {
    return state.game.players.find(p => p._id === playerId)
}

function pushUnique(array, value) {
  if (array.indexOf(value) === -1) {
    array.push(value)
  }
}

function removeFromSpaceRegion(state) {
  const { component, source } = state.ui.spaceComponentGrab
  if (source !== 'supply') {
    const deployRegion = state.game.space.deployed[source]
    const idx = deployRegion.indexOf(component)
    deployRegion.splice(idx, 1)
  }

  if (component.startsWith('basestar')) {
    healBasestar(state, component)
  }
}

function zoneGet(state, name) {
  const tokens = name.split('.')
  let zone = state.game.zones
  while (tokens.length) {
    const next = tokens.shift()
    zone = zone[next]
    if (!zone) {
      throw `Error loading ${next} of zone ${name}.`
    }
  }

  return zone
}


export default {
  namespaced: true,

  state() {
    return {
      ////////////////////////////////////////////////////////////
      // Data

      data: {
        decks: {},  // All of the raw decks, for displaying information.
      },

      ////////////////////////////////////////////////////////////
      // UI State

      ui: {
        charactersModal: {
          selected: '',
        },

        playerModal: {
          player: {},
        },

        skillCardsModal: {
          selected: '',
        },

        grab: {
          source: '',
          sourceIndex: -1,
        },

        grabbing: {
          message: '',
        },

        modalZone: {
          name: '',
        },

        pawnGrab: {
          playerId: '',
        },

        player: {},

        spaceComponentGrab: {
          component: '',
          source: '',
        },
      },

      ////////////////////////////////////////////////////////////
      // Game State

      game: {},
    }
  },

  getters: {
    ////////////////////////////////////////////////////////////
    // Game

    deck: (state) => (key) => deckGet(state, key),
    hand: (state) => (playerName) => state.game.zones.players[playerName],
    players: (state) => state.game.players,
    visible: (state) => (card) => isVisible(state, card),
    zone: (state) => (key) => zoneGet(state, key),
    zones: (state) => state.game.zones,

    setupLoyaltyComplete: (state) => state.game.setupLoyaltyComplete,


    ////////////////////////////////////////////////////////////
    // Data

    deckData: (state) => (key) => state.data.decks[key],


    ////////////////////////////////////////////////////////////
    // UI

    grab: (state) => state.ui.grab,
    playerModal: (state) => state.ui.playerModal,
    uiModalZone: (state) => state.ui.modalZone,


    ////////////////////////////////////////////////////////////
    // Older ones

    distanceTraveled(state) {
      const cardDistance = state.game.destination.chosen
                                .reduce((acc, next) => acc + next.distance, 0)
      return state.game.destination.bonusDistance + cardDistance
    },

    isPawnGrabbing(state) {
      return !!state.ui.pawnGrab.playerId
    },

    spaceComponentGrabbing(state) {
      return !!state.ui.spaceComponentGrab.component
    },
  },

  mutations: {
    ////////////////////////////////////////////////////////////
    // New Deck Mutations

    draw(state, { playerId, deckName }) {
      const card = drawTop(state, deckName)
      handGet(state, playerId).cards.push(card)

      const playerName = playerById(state, playerId).name

      log(state, {
        template: "{player} draw a card from {deck}",
        classes: ['player-action', 'draw'],
        args: {
          player: playerName,
          deck: deckName,
        },
      })
    },

    move(state, data) {
      moveCard(state, data)
    },

    userSet(state, user) {
      state.ui.player = user
    },

    zoneClick(state, data) {
      if (state.ui.grab.source) {
        if (state.ui.grab.source !== data.source) {
          moveCard(state, {
            source: state.ui.grab.source,
            sourceIndex: state.ui.grab.sourceIndex,
            target: data.source,
            targetIndex: data.sourceIndex,
          })
        }

        state.ui.grab = {}
      }
      else {
        state.ui.grab = data
      }
    },

    zoneRevealAll(state, zoneName) {
      const cards = zoneGet(state, zoneName).cards
      for (const card of cards) {
        if (!isRevealed(state, card)) {
          cardReveal(state, card)
        }
      }
    },

    zoneRevealNext(state, zoneName) {
      const cards = zoneGet(state, zoneName).cards
      for (const card of cards) {
        if (!isRevealed(state, card)) {
          cardReveal(state, card)
          break
        }
      }
    },

    zoneShuffle(state, zoneName) {
      const cards = zoneGet(state, zoneName).cards
      cards.forEach(c => c.visibility = [])
      util.shuffleArray(cards)
    },

    zoneViewAll(state, zoneName) {
      const cards = zoneGet(state, zoneName).cards
      for (const card of cards) {
        if (!isVisible(state, card)) {
          cardView(state, card, state.ui.player)
        }
      }
    },

    zoneViewNext(state, zoneName) {
      const cards = zoneGet(state, zoneName).cards
      for (const card of cards) {
        if (!isVisible(state, card)) {
          cardView(state, card, state.ui.player)
          break
        }
      }
    },

    uiZoneViewer(state, zoneName) {
      state.ui.modalZone.name = zoneName
    },

    ////////////////////////////////////////////////////////////
    // Older mutations

    beginSkillCheck(state, card) {
      state.game.skillCheck.active.card = card
    },

    character_info_request(state, name) {
      state.ui.charactersModal.selected = name
    },

    destinationCardChoose(state, index) {
      state.game.destination.admiralViewing.forEach((viewIdx, card) => {
        if (viewIdx === index) {
          state.game.destination.active = card
        }
        else {
          state.game.decks.destination.discard.push(card)
        }
      })
      state.game.destination.admiralViewing = []


    },

    destinationCardDraw(state) {
      util.shuffleArray(state.game.decks.destination.cards)
      state.game.destination.admiralViewing.push(state.game.decks.destinaion.cards.pop())
      log(state, {
        template: "Admiral draws a destination card",
        classes: [],
        args: {},
      })
    },

    grabCancel(state) {
      clearGrab(state)
    },

    loadDeckData(state, data) {
      state.data.decks = data
    },

    loadGameData(state, data) {
      state.game = data
    },

    locationRepair(state, name) {
      const damagedLocations = state.game.space.ships.galactica.damage
      const damagedIndex = damagedLocations.indexOf(name)

      if (damagedIndex === -1) {
        alert(`That location is not damaged. ${name}`)
      }

      damagedLocations.splice(damagedIndex, 1)
      state.game.space.galacticaDamageTokens.push(name)
    },

    loyaltyCardDraw(state, playerId) {
      const player = playerById(state, playerId)
      const deck = state.game.loyaltyDeck
      player.loyaltyCards.push(deck.pop())

      log(state, {
        template: "{player} ({character}) drew a loyalty card",
        classes: ['loyalty-draw'],
        args: {
          player: player.name,
          character: player.character,
        },
      })
    },

    loyaltyDeckSet(state, deck) {
      state.game.players.forEach(p => p.loyaltyCards = [])
      state.game.loyaltyDeck = deck
      log(state, {
        template: "Loyalty deck created with {numHuman} Human cards and {numCylon} Cylon cards",
        classes: ['loyalty-deck'],
        args: {
          numHuman: deck.filter(c => c.team === 'Human').length,
          numCylon: deck.filter(c => c.team === 'Cylon').length,
        },
      })
    },

    pawnDrop(state, targetRoomName) {
      const playerId = state.ui.pawnGrab.playerId
      const player = playerById(state, playerId)
      clearGrab(state)

      player.location = targetRoomName

      log(state, {
        template: "{player} moves {character} to {location}",
        classes: ['pawn-move', 'player-action'],
        args: {
          player: 'tbd',
          character: player.character,
          location: targetRoomName,
        },
      })
    },

    pawnGrab(state, playerId) {
      const player = playerById(state, playerId)
      state.ui.grabbing.message = `Holding pawn ${player.character}`
      state.ui.pawnGrab.playerId = playerId
    },

    phaseSet(state, phase) {
      state.game.phase = phase

      log(state, {
        template: "Phase set to {phase}",
        classes: ['phase-change'],
        args: { phase },
      })
    },

    playerShow(state, player) {
      state.ui.playerModal.player = player
    },

    skillCardDraw(state, { skill, playerId }) {
      skill = skill.toLowerCase()
      const player = playerById(state, playerId)
      const draw = drawTop(state, 'skill.' + skill)

      if (draw) {
        player.skillCards.push(draw)

        log(state, {
          template: "{player} drew a {skill} card",
          classes: ['player-action', 'skill-card-draw'],
          args: {
            player: player.name,
            skill: skill,
          },
        })
      }
      else {
        log(state, {
          template: "{skill} deck and discard are empty",
          classes: ['admin-action'],
          args: { skill },
        })
      }
    },

    skillCardInfoRequest(state, cardName) {
      state.ui.skillCardsModal.selected = cardName
    },

    spaceComponentDamage(state) {
      const { component, source } = state.ui.spaceComponentGrab

      if (component === 'viper') {
        state.game.space.ships.viper.damaged += 1
        removeFromSpaceRegion(state)
        log(state, {
          template: 'Viper from region {region} damaged',
          classes: ['space-action', 'admin-action'],
          args: {
            region: source,
          },
        })
      }
      else if (component.startsWith('basestar')) {
        const letter = component[component.length - 1].toUpperCase()
        const key = 'basestar' + letter

        const damageToken = drawRandom(state, 'damageBasestar')
        if (!damageToken) {
          alert('No more damage tokens for basestars')
          return
        }

        state.game.space.ships[key].damage.push(damageToken)
        log(state, {
          template: `{basestar} gains {token} damage token`,
          classes: ['space-action', 'admin-action'],
          args: {
            basestar: key,
            token: damageToken,
          },
        })
      }
      else if (component === 'galactica') {
        const damageToken = drawRandom(state, 'damageGalactica')
        if (!damageToken) {
          alert('No more damage tokens for galactica. Usually this means humans lose.')
          return
        }

        log(state, {
          template: `Galactica gains {token} damage token`,
          classes: ['space-action', 'admin-action'],
          args: {
            token: damageToken,
          },
        })

        if (damageToken === '-1 fuel') {
          adjustCounter(state, 'fuel', -1)
        }
        else if (damageToken === '-1 food') {
          adjustCounter(state, 'food', -1)
        }
        else {
          state.game.space.ships.galactica.damage.push(damageToken)
        }
      }

      clearGrab(state)
    },

    spaceComponentDestroy(state) {
      const { component, source } = state.ui.spaceComponentGrab

      if (component === 'viper') {
        state.game.space.ships.viper.destroyed += 1
        log(state, {
          template: 'Viper from region {region} destroyed',
          classes: ['space-action', 'admin-action'],
          args: {
            region: source,
          },
        })
        removeFromSpaceRegion(state)
        clearGrab(state)
      }
      else if (component === 'civilian') {
        state.game.space.ships.civilian.destroyed += 1
        const destroyed = state.game.space.ships.civilian.remaining.pop()
        log(state, {
          template: 'Civilian ship destroyed: {effect}',
          classes: ['space-action', 'admin-action'],
          args: {
            effect: destroyed.effect,
          },
        })
        adjustCounter(state, 'population', destroyed.population)
        adjustCounter(state, 'morale', destroyed.morale)
        adjustCounter(state, 'fuel', destroyed.fuel)
        removeFromSpaceRegion(state)
        clearGrab(state)
      }
      else {
        doSpaceComponentRemove(state)
      }
    },

    spaceComponentDrop(state, target) {
      const { component, source } = state.ui.spaceComponentGrab

      removeFromSpaceRegion(state)
      clearGrab(state)

      // Add the component to the new region
      state.game.space.deployed[target].push(component)

      log(state, {
        template: "{player} moved {component} from {source} to {target}",
        classes: ['space-action', 'player-action'],
        args: {
          player: 'tbd',
          component,
          source: {
            value: source,
            classes: ['space-location'],
          },
          target: {
            value: target,
            classes: ['space-location'],
          },
        },
      })
    },

    spaceComponentGrab(state, { component, source, message }) {
      state.ui.spaceComponentGrab.component = component
      state.ui.spaceComponentGrab.source = source
      state.ui.grabbing.message = message
    },

    spaceComponentRemove(state) {
      doSpaceComponentRemove(state)
    },

    spaceComponentsClear(state) {
      state.game.space.deployed = [[], [], [], [], [], []]
      healBasestar('basestarA')
      healBasestar('basestarB')

      log(state, {
        template: "All space components returned to the supply",
        classes: ['admin-action', 'space-action'],
        args: {},
      })
    },

    titleAssign(state, { title, character }) {
      state.game.titles[title] = character
      log(state, {
        template: "{character} becomes the {title}",
        classes: ['title-assign'],
        args: {
          title,
          character,
        },
      })
    }
  },

  actions: {
    async load(context, data) {
      const deckData = decks.factory(data.options.expansions)
      context.commit('loadDeckData', deckData)

      if (data) {
        if (!data.initialized) {
          await factory.initialize(data)
        }
        context.commit('loadGameData', data)
        await context.dispatch('save')
      }
      else {
        context.commit('loadGameData', data)
      }
    },

    async save({ state }) {
      const requestResult = await axios.post('/api/game/save', state.game)
      if (requestResult.data.status !== 'success') {
        throw requestResult.data.message
      }
    },
  },
}
