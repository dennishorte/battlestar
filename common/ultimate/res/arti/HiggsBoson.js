module.exports = {
  name: `Higgs Boson`,
  color: `blue`,
  age: 10,
  expansion: `arti`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Transfer all cards on your board to your score pile.`
  ],
  dogmaImpl: [
    (game, player) => {
      const autoReturn = game.aYesNo(player, 'Auto return cards?')
      const scoreZone = game.zones.byPlayer(player, 'score')

      if (autoReturn) {
        const cards = game
          .utilColors()
          .flatMap(color => game.getCardsByZone(player, color))

        game.actions.transferMany(player, cards, scoreZone, { ordered: true })
      }
      else {
        while (true) {
          const choices = game.cards.tops(player)
          if (choices.length === 0) {
            break
          }
          else {
            const card = game.actions.chooseCard(player, choices)
            if (card) {
              game.actions.transfer(player, card, scoreZone)
            }
            else {
              console.log({
                template: 'Unable to transfer card. Stopping.'
              })
              break
            }
          }
        }
      }
    }
  ],
}
