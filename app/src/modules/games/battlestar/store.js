import util from './util.js'


export default {
  namespaced: true,

  state() {
    return {
      ////////////////////////////////////////////////////////////
      // UI State

      charactersModal: {
        selected: '',
      },

      ////////////////////////////////////////////////////////////
      // Game State

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
    }
  },

  mutations: {
    character_assign(state, { playerId, characterName }) {
      const player = state.players.find(p => p._id === playerId)
      player.character = characterName

      state.log.push({
        id: state.log.length,
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
      state.charactersModal.selected = name
    }
  },
}
