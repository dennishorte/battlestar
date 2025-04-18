const util = require('../../lib/util.js')

module.exports = {
    generateLookup,
}

function generateLookup(cards) {
    const lookup = {}

    lookup.all = cards
    lookup.byName = util.array.groupBy(cards, (card) => card.data.name)
    lookup.byId = util.array.toDict(cards.map(card => [card.data._id, card]))

    return lookup
}