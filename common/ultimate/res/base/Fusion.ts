export default {
  name: `Fusion`,
  color: `red`,
  age: 11,
  expansion: `base`,
  biscuits: `iiih`,
  dogmaBiscuit: `i`,
  dogma: [
    `Score a top card of value 11 on your board. If you do, choose a value one or two lower than the scored card, then repeat this dogma effect using the chosen value.`
  ],
  dogmaImpl: [
    (game, player) => {
      const executeEffect = (value) => {
        const choices = game
          .cards.tops(player)
          .filter(card => card.getAge() === value)

        return game.actions.chooseAndScore(player, choices)[0]
      }

      let value = 11
      while (true) {
        const card = executeEffect(value)

        if (!card) {
          break
        }

        const options = [value - 2, value - 1]
          .filter(v => game.checkAgeZeroInPlay() ? v >= 0 : v >= 1)

        if (options.length === 0) {
          game.log.add({ template: 'Player has reached the minimum age' })
          break
        }

        value = game.actions.chooseAge(player, options, {
          title: 'Choose next value to return',
        })
      }
    }
  ],
}
