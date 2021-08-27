export default {
  namespaced: true,

  state() {
    return {
      charactersModal: {
        selected: '',
      },

      players: [
        {
          _id: 'asdf',
          index: 0,
          name: 'Dennis',
          character: 'William Adama',
          characterShort: 'adama',
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
          characterShort: 'starbuck',
          location: "Hangar Deck",
          admiral: false,
          president: true,
          active: true,
        },
      ],
    }
  },

  mutations: {
    character_info_request(state, name) {
      state.charactersModal.selected = name
    }
  },
}
