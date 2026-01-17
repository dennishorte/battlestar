import { CardData } from '../card.js'

const Actions: CardData[] = [
  {
    type: 'action',
    id: 'action_fencing',
    name: 'Fencing',
    stage: 1,
    text: [
      'Build Fences',
    ],
    impl: [
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },
  {
    type: 'action',
    id: 'action_sheep_market',
    name: 'Sheep Market',
    stage: 1,
    text: [
      'Accumulate 1 Sheep',
      'Collect Sheep',
    ],
    impl: [
      {
        trigger: 'preparation-phase',
        func: (_game: unknown) => {

        }
      },
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },
  {
    type: 'action',
    id: 'action_grain_utilization',
    name: 'Grain Utilization',
    stage: 1,
    text: [
      'Sow and/or Bake Bread'
    ],
    impl: [
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },
  {
    type: 'action',
    id: 'action_major_improvement',
    name: 'Major Improvement',
    stage: 1,
    text: [
      '1 Major or Minor Improvement',
    ],
    impl: [
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },

  {
    type: 'action',
    id: 'action_basic_wish_for_children',
    name: 'Basic Wish for Children',
    stage: 2,
    text: [
      'Gain a Worker Token and afterward Minor Improvement',
    ],
    impl: [
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },
  {
    type: 'action',
    id: 'action_house_redevelopment',
    name: 'House Redevelopment',
    stage: 2,
    text: [
      'Renovate and afterward 1 Major or Minor Improvement',
    ],
    impl: [
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },
  {
    type: 'action',
    id: 'action_western_quarry',
    name: 'Western Quarry',
    stage: 2,
    text: [
      'Accumulate 1 Stone',
      'Collect Stone',
    ],
    impl: [
      {
        trigger: 'preparation-phase',
        func: (_game: unknown) => {

        }
      },
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },

  {
    type: 'action',
    id: 'action_pig_market',
    name: 'Pig Market',
    stage: 3,
    text: [
      'Accumulate 1 Pig',
      'Collect Pigs',
    ],
    impl: [
      {
        trigger: 'preparation-phase',
        func: (_game: unknown) => {

        }
      },
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },
  {
    type: 'action',
    id: 'action_vegetable_seeds',
    name: 'Vegetable Seeds',
    stage: 3,
    text: [
      'Take 1 Vegetable Seeds',
    ],
    impl: [
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },

  {
    type: 'action',
    id: 'action_cattle_market',
    name: 'Cattle Market',
    stage: 4,
    text: [
      'Accumulate 1 Cow',
      'Take Cows',
    ],
    impl: [
      {
        trigger: 'preparation-phase',
        func: (_game: unknown) => {

        }
      },
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },
  {
    type: 'action',
    id: 'action_eastern_quarry',
    name: 'Eastern Quarry',
    stage: 4,
    text: [
      'Accumulate 1 Stone',
      'Take Stone',
    ],
    impl: [
      {
        trigger: 'preparation-phase',
        func: (_game: unknown) => {

        }
      },
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },

  {
    type: 'action',
    id: 'action_urgent_wish_for_children',
    name: 'Urgent Wish for Children',
    stage: 5,
    text: [
      'Gain 1 Worker Token (even without room)',
    ],
    impl: [
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },
  {
    type: 'action',
    id: 'action_cultivation',
    name: 'Cultivation',
    stage: 5,
    text: [
      'Plow 1 Field and/or Sow',
    ],
    impl: [
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },

  {
    type: 'action',
    id: 'action_farm_redevelopment',
    name: 'Farm Redevelopment',
    stage: 6,
    text: [
      'Renovate and afterward Build Fences',
    ],
    impl: [
      {
        trigger: 'select-this-action',
        func: (_game: unknown, _player: unknown) => {

        }
      }
    ],
  },
]

export default Actions
