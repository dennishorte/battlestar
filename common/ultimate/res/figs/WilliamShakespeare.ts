import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `William Shakespeare`,  // Card names are unique in Innovation
  name: `William Shakespeare`,
  color: `purple`,
  age: 4,
  expansion: `figs`,
  biscuits: `4phs`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue a Rivaly Decree with any two figures.`,
    `You may issue any decree with any three figures.`,
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'decree-for-any-three',
    }

  ]
} satisfies AgeCardData
