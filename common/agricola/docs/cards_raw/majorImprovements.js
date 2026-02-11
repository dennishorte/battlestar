// eslint-disable-next-line no-unused-vars
const cards = [
  {
    expansion: 'revised',
    deck: 'major_improvements',
    type: 'major improvement',

    id: 'fireplace_2',
    name: 'Fireplace',
    vps: 1,

    cost: [{ clay: 2 }],
    text: [
      `At any time: Vegetable → 2 Food; Sheep → 2 Food; Wild boar → 2 Food; Cattle → 3 Food`,
      `"Bake Bread" action: Grain → 2 Food`
    ],
    impl: [],
  },
  {
    expansion: 'revised',
    deck: 'major_improvements',
    type: 'major improvement',

    id: 'fireplace_3',
    name: 'Fireplace',
    vps: 1,

    cost: [{ clay: 3 }],
    text: [
      `At any time: Vegetable → 2 Food; Sheep → 2 Food; Wild boar → 2 Food; Cattle → 3 Food`,
      `"Bake Bread" action: Grain → 2 Food`
    ],
    impl: [],
  },
  {
    expansion: 'revised',
    deck: 'major_improvements',
    type: 'major improvement',

    id: 'cooking_hearth_4',
    name: 'Cooking Hearth',
    vps: 1,

    cost: [
      { clay: 4 },
      { special: 'return_fireplace' },
    ],
    text: [
      `At any time: Vegetable → 3 Food; Sheep → 2 Food; Wild boar → 3 Food; Cattle → 4 Food`,
      `"Bake Bread" action: Grain → 3 Food`
    ],
    impl: [],
  },
  {
    expansion: 'revised',
    deck: 'major_improvements',
    type: 'major improvement',

    id: 'cooking_hearth_5',
    name: 'Cooking Hearth',
    vps: 1,

    cost: [
      { clay: 5 },
      { special: 'return_fireplace' },
    ],
    text: [
      `At any time: Vegetable → 3 Food; Sheep → 2 Food; Wild boar → 3 Food; Cattle → 4 Food`,
      `"Bake Bread" action: Grain → 3 Food`
    ],
    impl: [],
  },
  {
    expansion: 'revised',
    deck: 'major_improvements',
    type: 'major improvement',

    id: 'well',
    name: 'Well',
    vps: 4,

    cost: [{ wood: 1, stone: 3 }],
    text: [
      `Place 1 food on each of the next 5 round spaces. At the start of these rounds, you get the food.`
    ],
    impl: [],
  },
  {
    expansion: 'revised',
    deck: 'major_improvements',
    type: 'major improvement',

    id: 'clay_oven',
    name: 'Clay Over',
    vps: 2,

    cost: [{ clay: 3, stone: 1 }],
    text: [
      `"Bake Bread" action: At most 1 time Grain → 5 Food`,
      `When you build this improvement, you can immediately take a "Bake Bread" action.`
    ],
    impl: [],
  },
  {
    expansion: 'revised',
    deck: 'major_improvements',
    type: 'major improvement',

    id: 'stone_oven',
    name: 'Stone Oven',
    vps: 3,

    cost: [{ clay: 1, stone: 3 }],
    text: [
      `"Bake Bread" action: Up to 2 times Grain → 4 Food`,
      `When you build this improvement, you can immediately take a "Bake Bread" action.`
    ],
    impl: [],
  },
  {
    expansion: 'revised',
    deck: 'major_improvements',
    type: 'major improvement',

    id: 'joinery',
    name: 'Joinery',
    vps: 2,

    cost: [{ wood: 2, stone: 2 }],
    text: [
      `Harvest: At most 1 time Wood → 2 Food`,
      `Scoring: 3/5/7 Wood → 1/2/3 bonus points`
    ],
    impl: [],
  },
  {
    expansion: 'revised',
    deck: 'major_improvements',
    type: 'major improvement',

    id: 'pottery',
    name: 'Pottery',
    vps: 2,

    cost: [{ clay: 2, stone: 2 }],
    text: [
      `Harvest: At most 1 time Clay → 2 Food`,
      `Scoring: 3/5/7 Clay → 1/2/3 bonus points`
    ],
    impl: [],
  },
  {
    expansion: 'revised',
    deck: 'major_improvements',
    type: 'major improvement',

    id: 'basket_workshop',
    name: "Basketmaker's Workshop",
    vps: 2,

    cost: [{ reed: 2, stone: 2 }],
    text: [
      `Harvest: At most 1 time Reed → 3 Food`,
      `Scoring: 2/4/5 Reed → 1/2/3 bonus points`
    ],
    impl: [
    ],
  },
]

module.exports = []
