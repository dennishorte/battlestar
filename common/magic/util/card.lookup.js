const util = require('../../lib/util.js')

module.exports = {
    generateLookup,
}

function generateLookup(cards) {
    const lookup = {}

    lookup.all = cards
    lookup.byName = util.array.groupBy(cards, (card) => card.name().toLowerCase())
    lookup.byId = Object.fromEntries(cards.map(card => [card.id(), card]))

    return lookup
}
