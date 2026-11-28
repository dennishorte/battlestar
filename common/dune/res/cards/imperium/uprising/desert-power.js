'use strict'

module.exports = {
  id: "desert-power",
  name: "Desert Power",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "If you sent an Agent to a Maker board space this turn:\n· +2 Spice",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "· +2 Persuasion\n  OR\nWith Maker Hooks:\n· 1 Water → 1 Sandworm",
  factionAffiliation: "fremen",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: true,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  // The sandworm branch is an ordinary choice. Cost, Maker Hook, and the
  // Shield Wall ban are applied by the shared option filter, so this card
  // does not decide for itself whether a worm can be summoned.
  revealEffects: [
    {
      type: 'choice',
      choices: [
        {
          id: 'persuasion',
          label: '+2 Persuasion',
          effects: [
            { type: 'gain', resource: 'persuasion', amount: 2 },
          ],
        },
        {
          id: 'sandworm',
          label: 'Pay 1 Water for 1 Sandworm',
          requires: 'maker-hook',
          cost: { water: 1 },
          effects: [
            { type: 'sandworm', amount: 1 },
          ],
        },
      ],
    },
  ],

  agentEffects: [
    {
      type: 'conditional',
      condition: {
        type: 'sent-to-maker'
      },
      effects: [
        {
          type: 'gain',
          resource: 'spice',
          amount: 2
        }
      ]
    }
  ],
}
