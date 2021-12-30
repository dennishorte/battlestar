const sets = {
  base: require('./res/base'),
  echo: require('./res/echo'),
  figs: require('./res/figs'),
  city: require('./res/city'),
  arti: require('./res/arti'),
  all: {
    byName: {}
  },
}

for (const data of Object.values(sets)) {
  for (const [name, card] of Object.entries(data.byName)) {
    sets.all.byName[name] = card
  }
}

module.exports = sets
