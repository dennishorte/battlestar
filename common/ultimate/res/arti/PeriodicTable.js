const util = require('../../../lib/util.js')

module.exports = {
  name: `Periodic Table`,
  color: `blue`,
  age: 7,
  expansion: `arti`,
  biscuits: `shss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Choose two top cards on your board of the same value. If you do, draw a card of value one higher and meld it. If you meld it over one of the chosen cards, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player) => {
      while (true) {
        const byAge = {}
        for (const card of game.cards.tops(player)) {
          if (!Object.hasOwn(byAge, card.age)) {
            byAge[card.age] = [card]
          }
          else {
            byAge[card.age].push(card)
          }
        }

        const choices = Object
          .values(byAge)
          .filter(cards => cards.length > 1)
          .flatMap(cards => util.array.pairs(cards))
          .map(([x, y]) => game.actions.option({
            id: `${x.id}|${y.id}`,
            title: `${x.name}, ${y.name}`,
            kind: 'card-pair',
          }))

        const selections = game.actions.choose(player, choices, { title: 'Choose two cards' })
        if (selections && selections.length > 0) {
          const pick = selections[0]
          const pickId = (pick && typeof pick === 'object') ? pick.id : pick
          const cards = pickId
            .split('|')
            .map(name => game.cards.byId(name))

          const melded = game.actions.drawAndMeld(player, cards[0].age + 1)

          if (melded && (melded.color === cards[0].color || melded.color === cards[1].color)) {
            continue
          }
          else {
            break
          }
        }
        else {
          break
        }
      }
    }
  ],
}
