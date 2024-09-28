
const CardId = {}
module.exports = CardId


CardId.asDict = function(card) {
  const dict = {
    name: card.name,
    set: card.set,
    collector_number: card.collector_number,
    custom_id: card.custom_id,
  }

  for (const key of Object.keys(dict)) {
    if (dict[key] === undefined) {
      delete dict[key]
    }
  }

  return dict
}

CardId.asString = function(card, ignoreSet=false) {
  if (ignoreSet) {
    return card.name
  }
  else {
    return `${card.name} (${card.set}) ${card.collector_number}`
  }
}

CardId.equals = function(a, b, opts={}) {
  if (opts.nameOnly) {
    return a.name === b.name
  }
  else {
    return (
      a.name === b.name
      && a.set === b.set
      && a.collector_number === b.collector_number
      && a.custom_id === b.custom_id
    )
  }
}
