import util from './util.js'


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
    if (typeof msg.args[key] === 'string') {
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
      pushUnique(classes, util.characterNameToCssClass(msg.args[key].value))
    }
        else if (key === 'location') {
      pushUnique(classes, 'location-name')
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

      game: {
        log: [],

        players: [
          {
            _id: 'asdf',
            index: 0,
            name: 'Dennis',
            character: 'William Adama',
            location: "Admiral's Quarters",
            admiral: true,
            president: false,
            active: false,
          },
          {
            _id: 'jkl',
            index: 1,
            name: 'Micah',
            character: 'Kara "Starbuck" Thrace',
            location: "Hangar Deck",
            admiral: false,
            president: true,
            active: true,
          },
        ],

        settings: {
          expansions: ['base game'],
        },

        skillCheck: {
          past: [],
          active: {
            card: {},
            logIds: [],  // List of log ids that were created during resolution
            skillCards: {},
          }
        },

        space: {
          deployed: [
            [],
            [],
            [ 'civilian', 'civilian' ],
            [ 'viper' ],
            [ 'viper' ],
            [ 'basestar', 'raider', 'raider', 'raider' ],
          ],
        },
      }
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
  },
}
