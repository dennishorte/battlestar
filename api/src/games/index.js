const Games = {
  'Innovation': require('./innovation.js'),
  'Magic': require('./magic.js'),
  'Tyrants of the Underdark': require('./tyrants.js'),
  'Set Draft': require('./set_draft.js'),
  'Cube Draft': require('./cube_draft.js'),
  'CubeDraft': require('./cube_draft.js'),
}

module.exports = {
  constructor(name) {
    if (name in Games) {
      return Games[name].constructor
    }
    else {
      throw new Error(`No constructor for game: ${name}`)
    }
  },

  factory(name) {
    if (name in Games) {
      return Games[name].factory
    }
    else {
      throw new Error(`No factory for game: ${name}`)
    }
  },
}
