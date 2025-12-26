module.exports = {
  id: `Bear Grylls`,  // Card names are unique in Innovation
  name: `Bear Grylls`,
  color: `green`,
  age: 11,
  expansion: `figs`,
  biscuits: `hllp`,
  dogmaBiscuit: `l`,
  karma: [
    `When you meld this card, junk all cards that are not achievements or in decks. Introduce the {z} deck. Draw a {z}.`
  ],
  karmaImpl: [
    {
      trigger: 'when-meld',
      matches: () => true,
      func: (game, player) => {
        throw new Error('not implemented; need the zero deck')
      }
    },
  ]
}
