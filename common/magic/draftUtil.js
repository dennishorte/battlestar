const util = require('../lib/util.js')
const DraftUtil = {}
module.exports = DraftUtil


DraftUtil.makePacks = function(data) {
  const packs = []

  if (data.kind === 'cube') {
    const cards = []
    util.array.shuffle(cards, this.random)

    const players = this.players.all()
    const numPacks = data.count * players.length

    for (let i = 0; i < numPacks; i++) {
      const packCards = cards.slice(i * data.size, (i + 1) * data.size)
      const packPlayerIndex = Math.floor(players.length / data.count)
      const packPlayer = players[packPlayerIndex].name
      packs.push({
        cards: packCards,
        index: i,
        playerName: packPlayer,
        opened: false,
        picked: [],
      })
    }
  }
  else {
    throw new Error(`Unhandled pack kind: ${data.kind}`)
  }

  return packs
}
