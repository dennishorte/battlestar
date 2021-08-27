import util from './util.js'


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

        spaceComponentGrab: {
          component: '',
          source: '',
          message: '',
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
    spaceComponentGrabbing(state) {
      return !!state.ui.spaceComponentGrab.component
    },
  },

  mutations: {
    character_assign(state, { playerId, characterName }) {
      const player = state.game.players.find(p => p._id === playerId)
      player.character = characterName

      state.game.log.push({
        id: state.game.log.length,
        template: "{player} chooses {character}",
        classes: ['character-selection', 'player-action'],
        args: {
          player: {
            value: player.name,
            classes: ['player-name']
          },
          character: {
            value: characterName,
            classes: [util.characterNameToCssClass(characterName)],
          },
        }
      })
    },

    character_info_request(state, name) {
      state.ui.charactersModal.selected = name
    },

    spaceComponentCancel(state) {
      state.ui.spaceComponentGrab.component = ''
      state.ui.spaceComponentGrab.source = ''
      state.ui.spaceComponentGrab.message = ''
    },

    spaceComponentDrop(state, target) {
      const { component, source } = state.ui.spaceComponentGrab

      state.ui.spaceComponentGrab.component = ''
      state.ui.spaceComponentGrab.source = ''
      state.ui.spaceComponentGrab.message = ''

      // Remove the component from its original region
      if (source !== 'supply') {
        const deployRegion = state.game.space.deployed[source]
        const idx = deployRegion.indexOf(component)
        deployRegion.splice(idx, 1)
      }

      // Add the component to the new region
      state.game.space.deployed[target].push(component)

      state.game.log.push({
        id: state.game.log.length,
        template: "{player} moved {component} from {source} to {target}",
        classes: ['space-action', 'player-action'],
        args: {
          player: {
            value: 'tbd',
            classes: ['player-name'],
          },
          component: {
            value: component,
            classes: ['space-component'],
          },
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
      state.ui.spaceComponentGrab.message = message
    },
  },
}
