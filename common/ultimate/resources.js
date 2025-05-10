const sets = {
  base: require('./res/base'),
  // echo: require('./res/echo'),
  // figs: require('./res/figs'),
  city: require('./res/city'),
  // arti: require('./res/arti'),
  usee: require('./res/usee'),
  byName: {},
  generate
}

for (const exp of ['base', 'city', 'usee']) {
  const data = sets[exp].generateCardInstances()
  for (const card of data.cards) {
    sets.byName[card.name] = card
  }

  if (exp === 'arti') {
    for (const card of data.achievements) {
      sets.byName[card.name] = card
    }
  }
}


function generate() {
  const output = {
    base: sets.base.generateCardInstances(),
    // echo: sets.echo.generateCardInstances(),
    // figs: sets.figs.generateCardInstances(),
    city: sets.city.generateCardInstances(),
    // arti: sets.arti.generateCardInstances(),
    usee: sets.usee.generateCardInstances(),
    all: {
      byName: {},
    }
  }

  for (const exp of ['base', 'city', 'usee']) {
    const data = output[exp]
    for (const [name, card] of Object.entries(data.byName)) {
      output.all.byName[name] = card
    }
  }

  return output
}

module.exports = sets
