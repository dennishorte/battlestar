import axios from 'axios'
import bsgutil from './util.js'
import factory from './factory.js'


function clearGrab(state) {
  // Pawn
  state.ui.pawnGrab.playerId = ''

  // Space Component
  state.ui.spaceComponentGrab.component = ''
  state.ui.spaceComponentGrab.source = ''

  // Grab Message
  state.ui.grabbing.message = ''
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
  }
}

function log(state, msgObject) {
  logEnrichArgClasses(msgObject)

  const log = state.game.log
  msgObject.id = log.length
  log.push(msgObject)
}

function pushUnique(array, value) {
  if (array.indexOf(value) === -1) {
    array.push(value)
  }
}


export default {
  namespaced: true,

  state() {
    return {
      ////////////////////////////////////////////////////////////
      // UI State
      ui: {
        charactersModal: {
          selected: '',
        },

        playerModal: {
          playerId: '',
        },

        skillCardsModal: {
          selected: '',
        },

        grabbing: {
          message: '',
        },

        pawnGrab: {
          playerId: '',
        },

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
    isPawnGrabbing(state) {
      return !!state.ui.pawnGrab.playerId
    },

    spaceComponentGrabbing(state) {
      return !!state.ui.spaceComponentGrab.component
    },
  },

  mutations: {
    beginSkillCheck(state, card) {
      state.game.skillCheck.active.card = card
    },

    character_assign(state, { playerId, characterName }) {
      const player = state.game.players.find(p => p._id === playerId)
      player.character = characterName

      log(state, {
        template: "{player} chooses {character}",
        classes: ['character-selection', 'player-action'],
        args: {
          player: player.name,
          character: characterName,
        }
      })
    },

    character_info_request(state, name) {
      state.ui.charactersModal.selected = name
    },

    grabCancel(state) {
      clearGrab(state)
    },

    loadGameData(state, data) {
      this.state.bsg.game = data
    },

    loyaltyCardDraw(state, playerId) {
      const player = state.game.players.find(p => p._id === playerId)
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
      const player = state.game.players.find(p => p._id === playerId)
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
      const player = state.game.players.find(p => p._id === playerId)
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

    playerShow(state, playerId) {
      state.ui.playerModal.playerId = playerId
    },

    skillCardInfoRequest(state, cardName) {
      state.ui.skillCardsModal.selected = cardName
    },

    spaceComponentDrop(state, target) {
      const { component, source } = state.ui.spaceComponentGrab
      clearGrab(state)

      // Remove the component from its original region
      if (source !== 'supply') {
        const deployRegion = state.game.space.deployed[source]
        const idx = deployRegion.indexOf(component)
        deployRegion.splice(idx, 1)
      }

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
