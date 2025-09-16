module.exports = {
  name: `Lurgan Canoe`,
  color: `yellow`,
  age: 1,
  expansion: `arti`,
  biscuits: `hccc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Meld a card from your hand. Score all other cards of the same color from your board. If you scored at least one card, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player) => {
      while (true) {
        const melded = game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))
        if (melded && melded.length > 0) {
          const card = melded[0]
          const toScore = game
            .getCardsByZone(player, card.color)
            .filter(other => other !== card)
          const scored = game.aScoreMany(player, toScore)
          if (scored && scored.length > 0) {
            game.log.add({ template: 'Repeat this effect.' })
            continue
          }
          else {
            game.log.add({ template: 'No cards were scored.' })
            break
          }
        }
        else {
          game.log.add({ template: 'No cards were scored.' })
          break
        }
      }
    }
  ],
}
