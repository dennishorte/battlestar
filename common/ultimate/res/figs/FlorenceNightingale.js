module.exports = {
  id: `Florence Nightingale`,  // Card names are unique in Innovation
  name: `Florence Nightingale`,
  color: `yellow`,
  age: 7,
  expansion: `figs`,
  biscuits: `hlp7`,
  dogmaBiscuit: `l`,
  karma: [
    `You may issue an Expansion decree with any two figures.`,
    `If a player would transfer, return, meld, score, or junk a card from your score pile, instead leave it there.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion'
    },
    {
      trigger: ['transfer', 'return', 'meld', 'score', 'junk'],
      triggerAll: true,
      kind: 'would-instead',
      matches: (game, player, { card, owner }) => {
        return card.zone.id === game.zones.byPlayer(owner, 'score').id
      },
      func: (game, player, { card }) => {
        game.log.add({
          template: '{card} is not moved',
          args: { card }
        })
      }
    }
  ]
}
