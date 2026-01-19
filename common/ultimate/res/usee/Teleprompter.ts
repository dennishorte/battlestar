export default {
  name: `Teleprompter`,
  color: `green`,
  age: 9,
  expansion: `usee`,
  biscuits: `liih`,
  dogmaBiscuit: `i`,
  dogma: [
    //    `Reveal the top card of any value deck from any set. Execute the first sentence of non-demand dogma effect on the card. If you do, return the revealed card and repeat this effect using the next sentence.`
    `Reveal the top card of any value deck from any set. Execute the first non-demand dogma effect on the card. If the revealed card has a {c}, repeat this effect with a different deck.`
  ],
  dogmaImpl: [
    (game, player) => {
      const checkHasDemand = (text) => {
        const lower = text.toLowerCase()
        return lower.startsWith('i demand') || lower.startsWith('i compel')
      }

      const used = []

      while (true) {
        // Prompt player to choose an age (value) deck
        const exp = game.actions.choose(player, game.getExpansionList())[0]
        const age = game.actions.chooseAge(player)

        const key = `${exp}-${age}`
        if (used.includes(key)) {
          game.log.add({ template: 'You have already chosen that deck.' })
          continue
        }

        used.push(key)

        // Reveal the top card of the chosen deck
        const card = game.zones.byDeck(exp, age).cardlist()[0]
        if (!card) {
          game.log.addNoEffect()
          return
        }

        game.actions.reveal(player, card)

        for (let i = 0; i < card.dogma.length; i++) {
          if (checkHasDemand(card.dogma[i])) {
            continue
          }

          game.aOneEffect(
            player,
            card,
            card.dogma[i],
            card.dogmaImpl[i],
          )
          break
        }

        if (card.checkHasBiscuit('c')) {
          continue
        }
        else {
          break
        }
      }
    },
  ],
}
