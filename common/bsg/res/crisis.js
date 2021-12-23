module.exports =  [
  {
    name: 'Build Cylon Detector',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: false,
    option1: 'Discard 1 nuke token. If you do not have any nuke tokens, you may not choose this option.',
    option2: '-1 morale, and the Admiral discards 2 skill cards',
    actor: 'Admiral',
    script: {
      keepUntil: '',
      option1: {
        requires: 'hasNuke',
        effect: [{
          kind: 'counter',
          counter: 'nukes',
          amount: -1
        }]
      },
      option2: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'discardSkills',
          actor: 'admiral',
          count: 2,
        }
      ],
    },
  },
  {
    name: 'Declare Martial Law',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: false,
    option1: '-1 morale, and the Admiral recieves the President title',
    option2: '-1 population, and the Admiral discards 2 skill cards',
    actor: 'Admiral',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'title',
          title: 'President',
          assignTo: 'admiral',
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'population',
          amount: -1,
        },
        {
          kind: 'discardSkills',
          actor: 'admiral',
          count: 2,
        },
      ],
    },
  },
  {
    name: 'Food Shortage',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-2 food',
    option2: '-1 food. The President discards 2 Skill Cards; then the current player discards 3 Skill Cards',
    actor: 'President',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -2,
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
        {
          kind: 'discardSkills',
          actor: 'president',
          count: 2,
        },
        {
          kind: 'discardSkills',
          actor: 'currentPlayer',
          count: 3,
        },
      ],
    },
  },
  {
    name: 'Food Shortage',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-2 food',
    option2: '-1 food. The President discards 2 Skill Cards; then the current player discards 3 Skill Cards',
    actor: 'President',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -2,
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
        {
          kind: 'discardSkills',
          actor: 'president',
          count: 2,
        },
        {
          kind: 'discardSkills',
          actor: 'currentPlayer',
          count: 3,
        },
      ],
    },
  },
  {
    name: 'Food Shortage',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-2 food',
    option2: '-1 food. The President discards 2 Skill Cards; then the current player discards 3 Skill Cards',
    actor: 'President',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -2,
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
        {
          kind: 'discardSkills',
          actor: 'president',
          count: 2,
        },
        {
          kind: 'discardSkills',
          actor: 'currentPlayer',
          count: 3,
        },
      ],
    },
  },
  {
    name: 'Food Shortage',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-2 food',
    option2: '-1 food. The President discards 2 Skill Cards; then the current player discards 3 Skill Cards',
    actor: 'President',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -2,
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
        {
          kind: 'discardSkills',
          actor: 'president',
          count: 2,
        },
        {
          kind: 'discardSkills',
          actor: 'currentPlayer',
          count: 3,
        },
      ],
    },
  },
  {
    name: 'Requested Resignation',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: false,
    option1: 'The President and Admiral both discard 2 Skill Cards',
    option2: 'The President may choose to give the President title to the Admiral, or move to the "Brig" location',
    actor: 'Admiral',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'discardSkills',
          actor: 'president',
          count: 2,
        },
        {
          kind: 'discardSkills',
          actor: 'admiral',
          count: 2,
        },
      ],
      option2: [
        {
          kind: 'choice',
          actor: 'president',
          options: [
            {
              name: 'resign',
              description: 'Give the President title to the Admiral',
              effect: [{
                kind: 'title',
                title: 'President',
                assignTo: 'admiral',
              }]
            },
            {
              name: 'resist',
              description: 'Move to the Brig',
              effect: [{
                kind: 'move',
                actor: 'president',
                location: 'Brig',
              }]
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Rescue Caprica Survivors',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-1 fuel, -1 food, +1 population',
    option2: '-1 morale',
    actor: 'President',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'population',
          amount: +1,
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
      ],
    },
  },
  {
    name: 'Rescue Mission',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-1 morale, and the current player is sent to "Sickbay"',
    option2: '-1 fuel and destroy 1 raptor',
    actor: 'Admiral',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'move',
          actor: 'currentPlayer',
          location: 'Sickbay',
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'raptors',
          amount: -1,
        },
      ],
    },
  },
  {
    name: 'Rescue Mission',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: '-1 morale, and the current player is sent to "Sickbay"',
    option2: '-1 fuel and destroy 1 raptor',
    actor: 'Admiral',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'move',
          actor: 'currentPlayer',
          location: 'Sickbay',
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'raptors',
          amount: -1,
        },
      ],
    },
  },
  {
    name: 'Rescue the Fleet',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-2 population',
    option2: '-1 morale. Place 1 basestar and 3 raiders in front of Galactica and 3 civilian ships behind it',
    actor: 'Admiral',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'population',
          amount: -2,
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'deploy',
          ships: [
            ['basestar', 'raider', 'raider', 'raider'],
            [],
            [],
            ['civilian', 'civilian', 'civilian'],
            [],
            []
          ]
        },
      ],
    },
  },
  {
    name: 'Riots',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    option1: '-1 food, -1 morale',
    option2: '-1 population, -1 fuel',
    actor: 'Admiral',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'population',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
      ],
    },
  },
  {
    name: 'Riots',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: '-1 food, -1 morale',
    option2: '-1 population, -1 fuel',
    actor: 'Admiral',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'population',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
      ],
    },
  },
  {
    name: 'Sleep Deprivation',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: 'Return all undamaged vipers on the game board to the "Reserves." Then send the current player to "Sickbay" ',
    option2: '-1 morale',
    actor: 'Admiral',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'returnAllVipers',
        },
        {
          kind: 'move',
          actor: 'currentPlayer',
          location: 'Sickbay',
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
      ],
    },
  },
  {
    name: 'Water Shortage',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: false,
    option1: '-1 food',
    option2: 'The President discards 2 Skill Cards; then the current player discards 3 Skill Cards',
    actor: 'President',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
      ],
      option2: [
        {
          kind: 'discardSkills',
          actor: 'president',
          count: 2,
        },
        {
          kind: 'discardSkills',
          actor: 'currentPlayer',
          count: 3,
        },
      ],
    },
  },
  {
    name: 'Water Shortage',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: '-1 food',
    option2: 'The President discards 2 Skill Cards; then the current player discards 3 Skill Cards',
    actor: 'President',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
      ],
      option2: [
        {
          kind: 'discardSkills',
          actor: 'president',
          count: 2,
        },
        {
          kind: 'discardSkills',
          actor: 'currentPlayer',
          count: 3,
        },
      ],
    },
  },
  {
    name: 'Water Shortage',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: '-1 food',
    option2: 'The President discards 2 Skill Cards; then the current player discards 3 Skill Cards',
    actor: 'President',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
      ],
      option2: [
        {
          kind: 'discardSkills',
          actor: 'president',
          count: 2,
        },
        {
          kind: 'discardSkills',
          actor: 'currentPlayer',
          count: 3,
        },
      ],
    },
  },
  {
    name: 'Water Shortage',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: '-1 food',
    option2: 'The President discards 2 Skill Cards; then the current player discards 3 Skill Cards',
    actor: 'President',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
      ],
      option2: [
        {
          kind: 'discardSkills',
          actor: 'president',
          count: 2,
        },
        {
          kind: 'discardSkills',
          actor: 'currentPlayer',
          count: 3,
        },
      ],
    },
  },
  {
    name: 'Water Shortage',
    expansion: 'base game',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-1 food',
    option2: 'The President discards 2 Skill Cards; then the current player discards 3 Skill Cards',
    actor: 'President',
    script: {
      keepUntil: '',
      option1: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
      ],
      option2: [
        {
          kind: 'discardSkills',
          actor: 'president',
          count: 2,
        },
        {
          kind: 'discardSkills',
          actor: 'currentPlayer',
          count: 3,
        },
      ],
    },
  },
  {
    name: 'Ambush',
    expansion: 'base game',
    type: 'Cylon Attack',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: false,
    effect: 'Training new Pilots: Keep this card in play until the fleet jumps. Each unmanned viper suffers a -2 penalty to its attack rolls',
    deploy: [
      [ 'raider', 'raider', 'raider', 'raider' ],
      [],
      [ 'civilian' ],
      [ 'basestar', 'raider', 'raider', 'raider', 'raider' ],
      [ 'viper', 'viper', 'civilian' ],
      [ 'civilian' ]
    ],
    script: {
      keepUntil: 'jump',
    },
  },
  {
    name: 'Besieged',
    expansion: 'base game',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'Heavy Casualties: The 4 raiders that were just setup are immediately activated',
    deploy: [
      [ 'civilian' ],
      [ 'civilian' ],
      [],
      [ 'heavy raider' ],
      [ 'basestar' ],
      [
        'raider',   'raider',
        'raider',   'raider',
        'viper',    'viper',
        'civilian'
      ]
    ],
    script: {
      keepUntil: '',
      effect: ['besieged'],
    },
  },
  {
    name: 'Boarding Parties',
    expansion: 'base game',
    type: 'Cylon Attack',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: false,
    effect: 'Surprise Assault: There are no vipers in this setup',
    deploy: [
      [ 'heavy raider', 'heavy raider' ],
      [ 'basestar', 'raider', 'raider', 'raider', 'raider' ],
      [ 'heavy raider', 'heavy raider' ],
      [ 'civilian' ],
      [ 'civilian', 'civilian' ],
      []
    ],
    script: {
      keepUntil: '',
      effect: [],
    },
  },
  {
    name: 'Cylon Swarm',
    expansion: 'base game',
    type: 'Cylon Attack',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: false,
    effect: 'Massive Deployment: Keep this card in play until the fleet jumps. Each time a basestar launches raiders or heavy raiders, it launches 1 additional ship of the same type.',
    deploy: [
      [ 'basestar', 'raider', 'raider', 'raider', 'raider', 'raider' ],
      [ 'heavy raider' ],
      [],
      [ 'civilian' ],
      [ 'viper', 'civilian' ],
      [ 'viper', 'civilian' ]
    ],
    script: {
      keepUntil: 'jump',
      effect: [],
    },
  },
  {
    name: 'Heavy Assault',
    expansion: 'base game',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'Heavy Bombardment: Each basestar immediately attacks Galactica',
    deploy: [
      [ 'basestar' ],
      [ 'basestar' ],
      [],
      [ 'civilian' ],
      [ 'civilian' ],
      [ 'viper', 'civilian' ]
    ],
    script: {
      keepUntil: '',
      effect: [{
        kind: 'cylonActivation',
        activationKind: 'Basestar Attacks',
      }],
    },
  },
  {
    name: 'Jammed Assault',
    expansion: 'base game',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'Communications Jamming: Keep this card in play until the fleet jumps. Players may not activate the "Communications" location',
    deploy: [
      [ 'civilian' ],
      [ 'raider', 'raider', 'raider', 'raider' ],
      [ 'basestar', 'heavy raider', 'heavy raider' ],
      [ 'civilian' ],
      [ 'viper', 'civilian' ],
      [ 'viper', 'civilian' ]
    ],
    script: {
      keepUntil: 'jump',
      effect: [],
    },
  },
  {
    name: 'Raiding Party',
    expansion: 'base game',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'FTL Failure: Move the fleet token 1 space towards the start of the Jump Prep track',
    deploy: [
      [],
      [],
      [ 'basestar', 'raider', 'raider', 'raider' ],
      [ 'heavy raider', 'heavy raider', 'raider', 'raider' ],
      [ 'civilian' ],
      [ 'viper', 'viper', 'civilian', 'civilian' ]
    ],
    script: {
      keepUntil: '',
      effect: [
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: -1,
        },
      ],
    },
  },
  {
    name: 'Surrounded',
    expansion: 'base game',
    type: 'Cylon Attack',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: false,
    effect: 'Panic: The current player must discard 3 Skill Cards',
    deploy: [
      [ 'raider', 'raider', 'raider', 'raider' ],
      [ 'basestar' ],
      [ 'heavy raider', 'raider', 'raider', 'raider' ],
      [ 'civilian' ],
      [ 'viper', 'civilian' ],
      [ 'viper', 'civilian' ]
    ],
    script: {
      keepUntil: '',
      effect: [{
        kind: 'discardSkills',
        actor: 'currentPlayer',
        count: 3,
      }],
    },
  },
  {
    name: 'Tactical Strike',
    expansion: 'base game',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'Hangar Assault: Damage 2 vipers in the reserves',
    deploy: [
      [ 'heavy raider' ],
      [],
      [ 'civilian' ],
      [ 'civilian' ],
      [ 'viper', 'viper', 'civilian' ],
      [ 'basestar', 'raider', 'raider', 'raider', 'raider', 'raider' ]
    ],
    script: {
      keepUntil: '',
      effect: ['tacticalStrike'],
    },
  },
  {
    name: 'Thirty-Three',
    expansion: 'base game',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'Relentless Pursuit: Keep this card in play until a civilian ship or basestar is destroyed. If this card is in play when the fleet jumps, shuffle it back into the Crisis deck',
    deploy: [
      [ 'basestar' ],
      [],
      [ 'civilian' ],
      [ 'civilian' ],
      [ 'viper', 'civilian' ],
      [ 'viper', 'civilian' ]
    ],
    script: {
      keepUntil: 'jump, basestarDestroyed',
    },
  },
  {
    name: 'A Traitor Accused',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 8,
    passEffect: 'No Effect',
    failEffect: 'The current player chooses a character to send to the "Brig"',
    option2: 'The current player discards 5 skill cards',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: ['aTraitorAccused'],
      option2: [{
        kind: 'discardSkills',
        actor: 'currentPlayer',
        count: 5,
      }],
    },
  },
  {
    name: 'Admiral Grilled',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 9,
    passEffect: 'No Effect',
    failEffect: '-1 morale, and the Admiral discards 2 Skill Cards',
    option2: '-1 morale',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'discardSkills',
          actor: 'admiral',
          count: 2,
        }
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
      ]
    },
  },
  {
    name: 'Analyze Enemy Fighter',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 7,
    passEffect: 'Repair 1 destroyed raptor',
    failEffect: '-1 population',
    option2: 'Roll a die. If 4 or lower, -1 population and the current player discards 2 Skill Cards',
    actor: 'currentPlayer',
    skills: [ 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
      pass: [{
        kind: 'counter',
        counter: 'raptors',
        amount: +1,
      }],
      fail: [{
        kind: 'counter',
        counter: 'morale',
        amount: -1,
      }],
      option2: {
        dieRoll: '4-',
        effect: [
          {
            kind: 'counter',
            counter: 'population',
            amount: -1,
          },
          {
            kind: 'discardSkills',
            actor: 'currentPlayer',
            count: 2,
          }
        ]
      }
    },
  },
  {
    name: 'Bomb Threat',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 13,
    passEffect: 'No Effect',
    failEffect: '-1 morale and draw civilian ship and destroy it',
    option2: 'Roll a die. If 4 or lower, trigger the "Fail" effect of this card',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'civilianDestroyed',
          count: 1,
        }
      ],
      option2: {
        dieRoll: '4-',
        effect: [
          {
            kind: 'counter',
            counter: 'morale',
            amount: -1,
          },
          {
            kind: 'civilianDestroyed',
            count: 1,
          }
        ],
      },
    },
  },
  {
    name: 'Colonial Day',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    passValue: 10,
    passEffect: '+1 morale',
    failEffect: '-2 morale',
    option2: '-1 morale',
    actor: 'currentPlayer',
    skills: [ 'politics', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [{
        kind: 'counter',
        counter: 'morale',
        amount: +1,
      }],
      fail: [{
        kind: 'counter',
        counter: 'morale',
        amount: -2,
      }],
      option2: [{
        kind: 'counter',
        counter: 'morale',
        amount: -1,
      }],
    },
  },
  {
    name: 'Crippled Raider',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 10,
    passEffect: 'Increase the Jump Prep track by 1',
    failEffect: '-1 population',
    option2: 'Roll a die. If 4 or lower, place 3 raiders in front of Galactica and 1 civilian ship behind it',
    actor: 'currentPlayer',
    skills: [ 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
      pass: [{
        kind: 'counter',
        counter: 'jumpTrack',
        amount: +1,
      }],
      fail: [{
        kind: 'counter',
        counter: 'population',
        amount: -1,
      }],
      option2: {
        dieRoll: '4-',
        effect: [{
          kind: 'deploy',
          ships: [
            ['raider', 'raider', 'raider'], [], [],
            ['civilian'], [], []
          ]
        }]
      }
    },
  },
  {
    name: 'Cylon Screenings',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 9,
    passEffect: 'No Effect',
    failEffect: '-1 morale, and the current player looks at 1 random Loyalty Card belonging to the President or Admiral',
    option2: 'Each player discards 2 Skill Cards',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'choice',
          actor: 'currentPlayer',
          options: [
            {
              name: 'Admiral',
              description: 'Look at one random loyalty card of the Admiral',
              effect: [{
                kind: 'viewLoyalty',
                target: 'admiral',
                viewer: 'currentPlayer',
                count: 1,
              }],
            },
            {
              name: 'President',
              description: 'Look at one random loyalty card of the President',
              effect: [{
                kind: 'viewLoyalty',
                target: 'president',
                viewer: 'currentPlayer',
                count: 1,
              }],
            },
          ]
        },
      ],
      option2: [{
        kind: 'discardSkills',
        actor: 'each',
        count: 2
      }]
    },
  },
  {
    name: 'Forced Water Mining',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 17,
    passEffect: '+1 food',
    failEffect: '-1 population, -1 morale',
    option2: '+1 food, -1 morale, and each player discards 1 random Skill Card',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership', 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
      pass: [{
        kind: 'counter',
        counter: 'food',
        amount: +1,
      }],
      fail: [
        {
          kind: 'counter',
          counter: 'population',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'food',
          amount: +1,
        },
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'discardSkills',
          actor: 'each',
          count: 1
        }
      ]
    },
  },
  {
    name: 'Fulfiller of Prophecy',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: false,
    passValue: 6,
    passEffect: 'The current player draws 1 politics Skill Card',
    failEffect: '-1 population',
    option2: 'Current player discards 1 Skill Card. After the Activate Cylon Ships step, return to the Resolve Crisis step (Draw a new Crisis Card and resolve it.)',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
      option2: [
        {
          kind: 'drawSkills',
          actor: 'currentPlayer',
          kinds: ['politics', 'leadership', 'tactics', 'piloting', 'engineering'],
          count: 1,
        },
        {
          kind: 'fulfillerOfProphecy',
        }
      ],
      pass: [{
        kind: 'drawSkills',
        actor: 'currentPlayer',
        kinds: ['politics', 'leadership', 'tactics', 'piloting', 'engineering'],
        count: 1,
      }],
      fail: [{
        kind: 'counter',
        counter: 'population',
        amount: -1,
      }],
    },
  },
  {
    name: 'Informing the Public',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 7,
    passEffect: 'Current player looks at 1 random Loyalty Card belonging to any player',
    failEffect: '-2 morale',
    option2: 'Roll a die. On a 4 or lower, -1 morale and -1 population',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
      pass: [{
        kind: 'viewLoyalty',
        target: 'choice',
        viewer: 'currentPlayer',
        count: 1
      }],
      fail: [{
        kind: 'counter',
        counter: 'morale',
        amount: -2,
      }],
      option2: {
        dieRoll: '4-',
        effect: [
          {
            kind: 'counter',
            counter: 'morale',
            amount: -1,
          },
          {
            kind: 'counter',
            counter: 'population',
            amount: -1,
          },
        ],
      },
    },
  },
  {
    name: 'Keep Tabs on Visitor',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 12,
    passEffect: 'No Effect',
    failEffect: 'Roll a die. If 4 or lower, -2 population',
    option2: 'The current player discards 4 random Skill Cards',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: {
        dieRoll: '4-',
        effect: [{
          kind: 'counter',
          counter: 'population',
          amount: -2,
        }]
      },
      option2: [{
        kind: 'discardSkills',
        actor: 'currentPlayer',
        count: 4,
      }],
    },
  },
  {
    name: 'Network Computers',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 11,
    passEffect: 'Increase the Jump Prep track by 1',
    failEffect: '-1 population and place 1 centurion marker at the star of the Boarding Party track',
    option2: '-1 population and decrease the Jump Prep track by 1',
    actor: 'currentPlayer',
    skills: [ 'politics', 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
      pass: [{
        kind: 'counter',
        counter: 'jumpTrack',
        amount: +1,
      }],
      fail: [
        {
          kind: 'counter',
          counter: 'population',
          amount: -1,
        },
        {
          kind: 'addCenturion',
        },
      ],
      option2: [
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'population',
          amount: -1,
        }
      ],
    },
  },
  {
    name: 'Scouting for Fuel',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 12,
    passEffect: '+1 fuel',
    failEffect: '-1 fuel and destroy 1 raptor',
    option2: 'Roll a die. If 4 or lower, -1 fuel',
    actor: 'currentPlayer',
    skills: [ 'tactics', 'piloting' ],
    script: {
      keepUntil: '',
      pass: [{
        kind: 'counter',
        counter: 'fuel',
        amount: +1,
      }],
      fail: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'raptors',
          amount: -1,
        }
      ],
      option2: {
        dieRoll: '4-',
        effect: [
          {
            kind: 'counter',
            counter: 'fuel',
            amount: -1,
          }
        ],
      },
    },
  },
  {
    name: 'Scouting for Water',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 9,
    passEffect: '+1 food',
    failEffect: '-1 fuel and destroy 1 raptor',
    option2: '-1 food',
    actor: 'currentPlayer',
    skills: [ 'tactics', 'piloting' ],
    script: {
      keepUntil: '',
      pass: [{
        kind: 'counter',
        counter: 'food',
        amount: +1,
      }],
      fail: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'raptors',
          amount: -1,
        }
      ],
      option2: [{
        kind: 'counter',
        counter: 'food',
        amount: -1,
      }]
    },
  },
  {
    name: 'Send Survey Team',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 15,
    passEffect: 'No Effect',
    failEffect: 'The current player is sent to "Sickbay" and destroy 1 raptor',
    option2: 'Roll a die. If 5 or less, -1 fuel',
    actor: 'currentPlayer',
    skills: [ 'tactics', 'piloting', 'engineering' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'move',
          actor: 'currentPlayer',
          location: 'Sickbay',
        },
        {
          kind: 'counter',
          counter: 'raptors',
          amount: -1
        }
      ],
      option2: {
        dieRoll: '5-',
        effect: [
          {
            kind: 'counter',
            counter: 'fuel',
            amount: -1,
          }
        ],
      }
    },
  },
  {
    name: 'Water Sabotaged',
    expansion: 'base game',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 13,
    passEffect: 'No Effect',
    failEffect: '-2 food',
    option2: '-1 food',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [{
        kind: 'counter',
        counter: 'food',
        amount: -2,
      }],
      option2: [{
        kind: 'counter',
        counter: 'food',
        amount: -1,
      }],
    },
  },
  {
    name: 'Crash Landing',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: false,
    passValue: 6,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'The Admiral may spend 1 fuel. If he does not, -1 morale, and the current player is sent to "Sickbay"',
    skills: [ 'tactics', 'piloting' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [{
        kind: 'choice',
        actor: 'admiral',
        options: [
          {
            name: 'Recover crashed pilot',
            description: '-1 fuel',
            effect: [{
              kind: 'counter',
              counter: 'fuel',
              amount: -1
            }],
          },
          {
            name: 'Abandon crashed pilot',
            description: '-1 morale and current player goes to Sickbay',
            effect: [
              {
                kind: 'counter',
                counter: 'morale',
                amount: -1
              },
              {
                kind: 'move',
                actor: 'currentPlayer',
                location: 'Sickbay',
              }
            ],
          }
        ]
      }]
    },
  },
  {
    name: 'Cylon Accusation',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 10,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'The current player is placed in the "Brig" location',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [{
        kind: 'move',
        actor: 'currentPlayer',
        location: 'Brig',
      }]
    },
  },
  {
    name: 'Cylon Tracking Device',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 10,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'Destroy 1 raptor and place a basestar in front of Galactica and 2 civilian ships behind it',
    skills: [ 'tactics', 'piloting', 'engineering' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'counter',
          counter: 'raptors',
          amount: -1,
        },
        {
          kind: 'deploy',
          ships: [
            ['basestar'], [], [],
            ['civilian', 'civilian'], [], []
          ]
        }
      ],
    },
  },
  {
    name: 'Cylon Virus',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 13,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'All characters in the "FTL Control" location are sent to "Sickbay." Then place 1 centurion marker at the start of the Boarding Party track',
    skills: [ 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'moveAll',
          from: 'FTL Control',
          dest: 'Sickbay',
        },
        {
          kind: 'addCenturion',
        }
      ]
    },
  },
  {
    name: 'Detector Sabotage',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 8,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: `All characters in the "Research Lab" location are sent to "Sickbay." Keep this card in play. Players may not look at other players' Loyalty Cards`,
    skills: [ 'leadership', 'tactics' ],
    script: {
      keepUntil: 'forever',
      pass: [],
      fail: [{
        kind: 'moveAll',
        from: 'Research Lab',
        dest: 'Sickbay',
      }]
    },
  },
  {
    name: 'Elections Loom',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 8,
    passEffect: 'No Effect',
    partialValue: 5,
    partialEffect: '-1 morale',
    failEffect: '-1 morale, and the President discards 4 Skill Cards',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
      pass: [],
      partial: [{
        kind: 'counter',
        counter: 'morale',
        amount: -1,
      }],
      fail: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'discardSkills',
          actor: 'president',
          count: 4
        }
      ]
    },
  },
  {
    name: 'Guilt by Collusion',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 9,
    passEffect: 'The current player may choose a character to move to the "Brig"',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale',
    skills: [ 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [{
        kind: 'sendPlayerTo',
        location: 'Brig',
        actor: 'currentPlayer'
      }],
      fail: [{
        kind: 'counter',
        counter: 'morale',
        amount: -1
      }]
    },
  },
  {
    name: 'Hanger Accident',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 10,
    passEffect: 'No Effect',
    partialValue: 7,
    partialEffect: '-1 population',
    failEffect: '-1 population and damage 2 vipers in the "Reserves"',
    skills: [ 'tactics', 'piloting', 'engineering' ],
    script: {
      keepUntil: '',
      pass: [],
      partial: [{
        kind: 'counter',
        counter: 'population',
        amount: -1,
      }],
      fail: [
        {
          kind: 'counter',
          counter: 'population',
          amount: -1,
        },
        {
          kind: 'damageReserveVipers',
          count: 2,
        },
      ]
    },
  },
  {
    name: 'Jump Computer Failure',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 7,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 population and move the fleet token 1 space towards the start of the Jump Prep track',
    skills: [ 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'counter',
          counter: 'population',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: -1,
        },
      ],
    },
  },
  {
    name: 'Legendary Discovery',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 14,
    passEffect: 'Place this card next to the Kobol Objective card. It counts as 1 distance',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 food and destroy 1 raptor',
    skills: [ 'tactics', 'piloting' ],
    script: {
      keepUntil: 'forever',
      pass: [{
        kind: 'counter',
        counter: 'distance',
        amount: +1,
      }],
      fail: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'raptors',
          amount: -1,
        },
      ]
    },
  },
  {
    name: 'Loss of a Friend',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 9,
    passEffect: 'No Effect',
    partialValue: 7,
    partialEffect: 'The current player discards 2 Skill Cards',
    failEffect: '-1 morale, and the current player discards 2 Skill Cards',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
      pass: [],
      partial: [{
        kind: 'discardSkills',
        actor: 'currentPlayer',
        count: 2,
      }],
      fail: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'discardSkills',
          actor: 'currentPlayer',
          count: 2,
        }
      ]
    },
  },
  {
    name: 'Low Supplies',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 7,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale. If food is less than 6, -1 additional morale',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'conditional',
          check: 'food < 6',
          effect: [{
            kind: 'counter',
            counter: 'morale',
            amount: -1,
          }]
        }
      ],
    },
  },
  {
    name: 'Mandatory Testing',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 13,
    passEffect: 'The President looks at 1 random Loyalty card of the current player',
    partialValue: 9,
    partialEffect: 'No Effect',
    failEffect: '-1 morale',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
      pass: [{
        kind: 'viewLoyalty',
        viewer: 'president',
        target: 'currentPlayer',
        count: 1
      }],
      partial: [],
      fail: [{
        kind: 'counter',
        counter: 'morale',
        amount: -1
      }]
    },
  },
  {
    name: 'Missing G4 Explosives',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 7,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 food, and all characters in the "Armory" location are sent to the "Brig"',
    skills: [ 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1
        },
        {
          kind: 'moveAll',
          from: 'Armory',
          dest: 'Brig',
        },
      ],
    },
  },
  {
    name: 'Prison Labor',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 10,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale, -1 food',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1
        },
        {
          kind: 'counter',
          counter: 'food',
          amount: -1
        },
      ],
    },
  },
  {
    name: 'Prisoner Revolt',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 11,
    passEffect: 'No Effect',
    partialValue: 6,
    partialEffect: '-1 population',
    failEffect: '-1 population, and the President chooses another player to receive the President title',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [],
      partial: [{
        kind: 'counter',
        counter: 'population',
        amount: -1
      }],
      fail: [
        {
          kind: 'counter',
          counter: 'population',
          amount: -1
        },
        {
          kind: 'assignTitle',
          title: 'president',
          actor: 'president',
          target: 'other',
        }
      ]
    },
  },
  {
    name: 'Resistance',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 12,
    passEffect: 'No Effect',
    partialValue: 9,
    partialEffect: '-1 food',
    failEffect: '-1 food, -1 fuel',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [],
      partial: [{
        kind: 'counter',
        counter: 'food',
        amount: -1
      }],
      fail: [
        {
          kind: 'counter',
          counter: 'food',
          amount: -1
        },
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1
        }
      ],
    },
  },
  {
    name: 'Security Breach',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 6,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale, and all characters in the "Command" location are sent to "Sickbay"',
    skills: [ 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1
        },
        {
          kind: 'moveAll',
          from: 'Command',
          dest: 'Sickbay',
        },
      ],
    },
  },
  {
    name: 'Terrorist Bomber',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 9,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale, and the current player is sent to "Sickbay"',
    skills: [ 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1
        },
        {
          kind: 'move',
          location: 'Sickbay',
          actor: 'currentPlayer',
        },
      ],
    },
  },
  {
    name: 'Terrorist Investigations',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 12,
    passEffect: 'Current player looks at 1 random Loyalty Card belonging to any player',
    partialValue: 6,
    partialEffect: 'No effect',
    failEffect: '-1 morale',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
      pass: [{
        kind: 'viewLoyalty',
        viewer: 'currentPlayer',
        target: 'any',
        count: 1
      }],
      partial: [],
      fail: [{
        kind: 'counter',
        counter: 'morale',
        amount: -1
      }]
    },
  },
  {
    name: 'The Olympic Carrier',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 11,
    passEffect: 'No Effect',
    partialValue: 8,
    partialEffect: '-1 population',
    failEffect: '-1 morale, -1 population',
    skills: [ 'politics', 'leadership', 'piloting' ],
    script: {
      keepUntil: '',
      pass: [],
      partial: [{
        kind: 'counter',
        counter: 'population',
        amount: -1
      }],
      fail: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1
        },
        {
          kind: 'counter',
          counter: 'population',
          amount: -1
        },
      ]
    },
  },
  {
    name: 'Unexpected Reunion',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 8,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale, and the current player discards his hand of Skill Cards',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1
        },
        {
          kind: 'discardSkills',
          actor: 'currentPlayer',
          count: 999
        }
      ]
    },
  },
  {
    name: 'Unidentified Ship',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 10,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 Population',
    skills: [ 'tactics', 'piloting' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [{
        kind: 'counter',
        counter: 'population',
        amount: -1
      }]
    },
  },
  {
    name: 'Weapon Malfunction',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 11,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: `Damage 2 vipers in space areas. All characters in the "Weapons Control" location are sent to "Sickbay"`,
    skills: [ 'tactics', 'piloting', 'engineering' ],
    script: {
      keepUntil: '',
      pass: [],
      fail: [
        {
          kind: 'damageSpaceVipers',
          actor: 'currentPlayer',
          count: 2,
        },
        {
          kind: 'moveAll',
          from: "Weapons Control",
          dest: 'Sickbay',
        },
      ]
    },
  },
  {
    name: 'Witch Hunt',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 10,
    passEffect: 'No Effect',
    partialValue: 6,
    partialEffect: '-1 morale',
    failEffect: '-1 morale. Current player chooses a character and moves him to "Sickbay"',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
      pass: [],
      partial: [{
        kind: 'counter',
        counter: 'morale',
        amount: -1
      }],
      fail: [
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1
        },
        {
          kind: 'sendPlayerTo',
          actor: 'currentPlayer',
          location: 'Sickbay'
        },
      ]
    },
  },
  {
    name: 'Détente',
    expansion: 'cylon fleet board',
    type: 'Choice',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    option1: 'All vipers in space areas are returned to the "Reserves". All characters who were piloting vipers are placed in the "Hangar Deck". Increase the Pursuit track by 1.',
    option2: 'Basestar Attacks, Activate Raiders, Activate Hvy Raiders',
    actor: 'CAG',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Raiders Inbound',
    expansion: 'cylon fleet board',
    type: 'Choice',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: false,
    option1: '-1 population and damage Galactica once.',
    option2: 'The CAG and the Admiral must each discard 3 Skill Cards.',
    actor: 'CAG',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Return to Duty',
    expansion: 'cylon fleet board',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    option1: 'Any character on Galactica with piloting in his skill set may immediately launch himself in a viper then Raiders Launch.',
    option2: 'Basestar Attacks.',
    actor: 'CAG',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Review Camera Footage',
    expansion: 'cylon fleet board',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: false,
    option1: 'Damage 2 vipers in the "Reserves" (if able) and increase the Pursuit track by 1. The CAG may then activate 1 unmanned viper.',
    option2: 'The CAG discards 2 Skill Cards, then the current player discards 3 Skill Cards.',
    actor: 'CAG',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Tracked by Radiation',
    expansion: 'cylon fleet board',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: false,
    option1: 'Place a basestar and 3 raiders in front of Galactica and 2 civilian ships behind Galactica.',
    option2: '-1 fuel.',
    actor: 'CAG',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Training a Rookie',
    expansion: 'cylon fleet board',
    type: 'Choice',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    option1: 'Activate one unmanned viper. Then: Activate raiders',
    option2: 'The CAG chooses 2 vipers that are not currently damaged or destroyed and moves them to the "Damaged Viper" box.',
    actor: 'CAG',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Abandon Galactica',
    expansion: 'daybreak',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: 'Discard 1 nuke token. If you do not have any nuke tokens, you may not choose this option.',
    option2: '-1 food, and the Admiral draws 2 Treachery Cards.',
    actor: 'Admiral',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'An Ambitious Operation',
    expansion: 'daybreak',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-1 fuel. The Admiral chooses another player to gain 1 miracle token.',
    option2: 'Roll a die. On a 4 or less, -1 fuel.',
    actor: 'Admiral',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Dangerous Plots',
    expansion: 'daybreak',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: 'The Admiral and the President both draw 1 Mutiny Card.',
    option2: '-1 morale, and the current player discads 3 Skill Cards.',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Dishonest Tactics',
    expansion: 'daybreak',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-1 morale, and the President may choose 1 player to move from the "Brig" to "Command.',
    option2: '-1 fuel, and the President draws 2 Quorum Cards.',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Question Procedure',
    expansion: 'daybreak',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: '-1 morale.',
    option2: 'Damage Galactica, and the President discards 3 Skill Cards.',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Requisition for Demetrius',
    expansion: 'daybreak',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: false,
    option1: '-1 food, then roll a die. On a 6 or lower, shuffle 2 Treachery Cards into the Destiny deck.',
    option2: 'The Admiral draws 1 Mutiny Card and 2 Treachery Cards.',
    actor: 'Admiral',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Starvation in Dogsville',
    expansion: 'daybreak',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: 'Roll a die. On a 4 or less,-1 population and -1 food.',
    option2: 'Roll a die. On a 4 or less, -2 food.',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Bundsided',
    expansion: 'daybreak',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'Pluck Out Their Eyes: Destroy 1 raptor.',
    deploy: [
      [ 'basestar', 'heavy raider' ],
      [ 'raider', 'raider', 'raider' ],
      [],
      [ 'basestar', 'heavy raider' ],
      [ 'civilian' ],
      [ 'viper', 'civilian', 'civilian' ]
    ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Event Horizon',
    expansion: 'daybreak',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'Gravity Well: Keep this card in play until the fleet jumps. No player can activate a viper unless he first discards a Skill Card.',
    deploy: [
      [ 'raider', 'raider', 'viper' ],
      [ 'basestar' ],
      [],
      [ 'basestar', 'raider', 'raider' ],
      [ 'viper' ],
      [ 'viper' ]
    ],
    script: {
      keepUntil: 'jump',
    },
  },
  {
    name: "Hornet's Nest",
    expansion: 'daybreak',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'Suppressive Fire: Keep this card in play until the fleet jumps or a basestar is destroyed. Players cannot use actions on Piloting Cards.',
    deploy: [
      [ 'raider', 'raider', 'raider', 'viper', 'civilian' ],
      [],
      [ 'basestar' ],
      [ 'raider', 'raider', 'raider' ],
      [ 'viper' ],
      [ 'civilian', 'civilian' ]
    ],
    script: {
      keepUntil: 'jump,basestarDestroyed',
    },
  },
  {
    name: 'Lockdown',
    expansion: 'daybreak',
    type: 'Cylon Attack',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: false,
    effect: 'Concerted Attack: Keep this card in play until the fleet jumps or a basestar is destroyed. Players cannot activate the Armory location.',
    deploy: [
      [ 'heavy raider', 'heavy raider' ],
      [ 'basestar', 'heavy raider', 'heavy raider' ],
      [],
      [ 'viper', 'civilian' ],
      [ 'civilian' ],
      []
    ],
    script: {
      keepUntil: 'jump,basestarDestroyed',
    },
  },
  {
    name: 'Reprisal',
    expansion: 'daybreak',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'Opportunity for Treason: Shuffle 2 Treachery Cards into the Destiny deck. Then, the current player draws a Mutiny Card.',
    deploy: [
      [ 'raider', 'raider', 'civilian' ],
      [ 'viper' ],
      [ 'viper' ],
      [ 'heavy raider', 'raider', 'raider', 'raider' ],
      [ 'civilian' ],
      [ 'basestar' ]
    ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Trial by Fire',
    expansion: 'daybreak',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: "Calvary's Here: The human fleet gains an assault raptor. The current player places it in a space area with a viper launch icon and may immediately activate it.",
    deploy: [
      [ 'heavy raider', 'heavy raider', 'raider', 'raider', 'raider' ],
      [ 'viper' ],
      [],
      [ 'basestar' ],
      [],
      [ 'civilian' ]
    ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'A Desperate Pact',
    expansion: 'daybreak',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 15,
    passEffect: 'No Effect',
    failEffect: '-1 morale, and give the President title to the player (aside from the current President) highest on the Presidential line of succession',
    option2: 'The President discards 3 Skill Cards, then the current player draws 1 Mutiny Card',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership', 'piloting' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Earth in Ruins',
    expansion: 'daybreak',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 9,
    passEffect: '-1 morale',
    failEffect: '-2 morale',
    option2: '-1 food, and the current player draws 1 Mutiny Card',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Enemy of my Enemy',
    expansion: 'daybreak',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 13,
    passEffect: '-1 morale',
    failEffect: '-2 morale, and damage Galactica',
    option2: 'Damage Galactica twice',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership', 'piloting' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Galactica Falling Apart',
    expansion: 'daybreak',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 8,
    passEffect: 'No Effect',
    failEffect: '-1 morale, and damage Galactica',
    option2: 'Roll a die. On a 6 or lower, -1 food',
    actor: 'currentPlayer',
    skills: [ 'leadership', 'piloting', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'One Last Cocktail',
    expansion: 'daybreak',
    type: 'Optional Skill Check',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    passValue: 7,
    passEffect: 'No Effect',
    failEffect: '-1 food, -1 morale',
    option2: 'Roll a die. On a 6 or lower, -1 morale and the President is sent to "Sickbay"',
    actor: 'currentPlayer',
    skills: [ 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Religious Turmoil',
    expansion: 'daybreak',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 7,
    passEffect: 'No Effect',
    failEffect: '-1 morale, and each player discards 1 Skill Card',
    option2: 'Roll a die. On a 4 or lower, -1 food and -1 population',
    actor: 'currentPlayer',
    skills: [ 'politics', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Secret Meetings',
    expansion: 'daybreak',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 9,
    passEffect: 'No Effect',
    failEffect: '-1 morale',
    option2: 'The current player draws 1 Mutiny Card. Then, he chooses a player to draw 1 Mutiny Card.',
    actor: 'currentPlayer',
    skills: [ 'politics', 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Consult the Hybrid',
    expansion: 'daybreak',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 10,
    passEffect: 'The current player draws a Mutiny Card and 2 Skill Cards (they may be from outside his skill set)',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 food, and shuffle 2 Treachery Cards into the Destiny deck',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Domestic Dispute',
    expansion: 'daybreak',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 9,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale, and the current player is sent to "Sickbay"',
    skills: [ 'politics', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Give in to Despair',
    expansion: 'daybreak',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 14,
    passEffect: 'No Effect',
    partialValue: 9,
    partialEffect: '-1 food and the current player draws 3 Treachery Cards',
    failEffect: '-2 morale',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Hybrid in Panic',
    expansion: 'daybreak',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 12,
    passEffect: 'Increase the Jump Preparation track by 1',
    partialValue: 8,
    partialEffect: 'The current player discards 2 Skill Cards',
    failEffect: '-1 fuel',
    skills: [ 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Incitenement to Mutiny',
    expansion: 'daybreak',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 13,
    passEffect: 'No Effect',
    partialValue: 7,
    partialEffect: 'Shuffle 2 Treachery Cards into the Destiny Deck',
    failEffect: 'Shuffle 4 Treachery Cards into the Destiny deck',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Insubordinate Crew',
    expansion: 'daybreak',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 12,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale, and each player that does not have a Mutiny Card draws 1 Mutiny Card',
    skills: [ 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Quorum in Uproar',
    expansion: 'daybreak',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 8,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'The President discards 2 random Quorum Cards and 2 random Skill Cards',
    skills: [ 'politics', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Rallying Support',
    expansion: 'daybreak',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 8,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 population, and the current player draws 1 Mutiny Card and 1 Treachery Card',
    skills: [ 'politics', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Reactor Critical',
    expansion: 'daybreak',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 7,
    passEffect: 'The current player draws 2 Treachery Cards',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 fuel',
    skills: [ 'tactics', 'piloting', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Rebuild Trust',
    expansion: 'daybreak',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 9,
    passEffect: 'Each character in the "Brig" may move to any location on Galactica',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-2 morale',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Ambushed by the Press',
    expansion: 'exodus',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-1 morale.',
    option2: 'The President must discard all of his Skill Cards.',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Appoint Head of Security',
    expansion: 'exodus',
    type: 'Choice',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    option1: 'Return all undamaged vipers on the game board to the "Reserves." Then the Admiral must discard 2 random Skill Cards.',
    option2: '-1 morale and damage Galactica once.',
    actor: 'Admiral',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Controversial Manuscript',
    expansion: 'exodus',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-1 morale',
    option2: '+1 morale and damage Galactica twice.',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Hidden Explosives',
    expansion: 'exodus',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: 'Destroy 1 raptor and then the current player is sent to "Sickbay".',
    option2: '-1 morale.',
    actor: 'Admiral',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Interrogation',
    expansion: 'exodus',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: false,
    option1: `The Admiral chooses another player to send to "Sickbay". The Admiral may then look at 1 of that character's Loyalty Cards at random.`,
    option2: 'The Admiral discards 2 Skill Cards; then the current player discards 3 Skill Cards.',
    actor: 'Admiral',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Labor Dispute',
    expansion: 'exodus',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: false,
    option1: '-2 morale.',
    option2: '-1 fuel and decrease Jump Preparation track by 1.',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Medal of Distinction',
    expansion: 'exodus',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: '+1 morale, place 2 civilian ships on the game board and then: Activate Raiders.',
    option2: '-1 morale.',
    actor: 'Admiral',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'The Circle',
    expansion: 'exodus',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: 'You must choose another player to receive the President title or the current player is executed',
    option2: 'The President discards 2 Skill Cards; then the current player discards 3 Skill Cards',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Truth and Reconciliation',
    expansion: 'exodus',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: '-1 morale and the President must choose a character to send to the "Brig".',
    option2: 'The President discards 2 Skill Cards; then the current player discards 3 Skill Cards',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Unwelcome Faces',
    expansion: 'exodus',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: 'The Admiral must discard all of his skill cards and then choose a character to send to the "Brig".',
    option2: '-1 morale and damage Galactica once.',
    actor: 'Admiral',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Widespread Starvation',
    expansion: 'exodus',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-2 food',
    option2: '-1 food, -1 population.',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Consult the Prisoner',
    expansion: 'exodus',
    type: 'Optional Skill Check',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    passValue: 13,
    passEffect: 'Increase the Jump Preparation track by 1',
    failEffect: 'Each player discards 1 Skill Card and the current player is sent to the "Brig"',
    option2: 'The Admiral discards 2 Skill Cards and the current player discards 3 Skill Cards',
    actor: 'currentPlayer',
    skills: [ 'politics', 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Cylon Genocide',
    expansion: 'exodus',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 21,
    passEffect: 'Destroy all Cylon ships currently on the main game board',
    failEffect: '-1 morale, then: Basestar Attacks, Raiders Launch, Hvy Raider Activation',
    option2: 'Roll a die. If 4 or lower, the current player is sent to the "Brig"',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership', 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Familiar Face',
    expansion: 'exodus',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 12,
    passEffect: 'The Admiral may choose a character to send to the "Brig"',
    failEffect: '-1 morale and the Admiral must discard all his Skill Cards',
    option2: '-1 morale',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Hera Rescued',
    expansion: 'exodus',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 10,
    passEffect: 'No Effect',
    failEffect: '-2 morale and destroy 1 raptor',
    option2: '-1 morale',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Mysterious Guide',
    expansion: 'exodus',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 11,
    passEffect: 'Increase the Jump Preparation track by 1',
    failEffect: '-1 fuel and the current player discards all of his Skill Cards',
    option2: '-1 morale',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Mysterious Message',
    expansion: 'exodus',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 9,
    passEffect: 'The current player may search the Destiny deck and choose 2 cards to discard. He then reshuffles the Destiny deck',
    failEffect: 'Raiders Launch, Basestar Attacks',
    option2: 'Basestar Attacks',
    actor: 'currentPlayer',
    skills: [ 'politics', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Raptor Malfunction',
    expansion: 'exodus',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 12,
    passEffect: 'No Effect',
    failEffect: 'Damage Galactica once and destroy 1 raptor',
    option2: 'The current player is sent to "Sickbay"',
    actor: 'currentPlayer',
    skills: [ 'tactics', 'piloting', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Set a Trap',
    expansion: 'exodus',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 10,
    passEffect: 'Destroy a centurion on the Boarding Party track',
    failEffect: 'Place a centurion at the start of the Boarding Party track. The current player is sent to the "Sickbay"',
    option2: 'Roll a die: If 4 or lower, place a centurion at the start of the Boarding Party track',
    actor: 'currentPlayer',
    skills: [ 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'The Passage',
    expansion: 'exodus',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 14,
    passEffect: 'Increase the Jump Preparation track by 1',
    failEffect: 'Destroy 2 civilian ships',
    option2: 'Roll a die. If 6 or lower, the current player is sent to "Sickbay"',
    actor: 'currentPlayer',
    skills: [ 'tactics', 'piloting', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Airlock Leak',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: false,
    passValue: 6,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'Damage Galactica and the current player is sent to "Sickbay"',
    skills: [ 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Centurion Assault',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 9,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'Destroy 1 raptor and the current player is sent to "Sickbay"',
    skills: [ 'tactics', 'piloting' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Divisive Behavior',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 10,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Guilty Conscience',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 7,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'The current player discards 3 random Skill Cards',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Haunted by the Past',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 12,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'Each player must discard 1 random Skill Card',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Hidden Identity',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 12,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale. Current player is sent to the "Brig"',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'In the Ring',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 12,
    passEffect: '+1 morale',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale and the current player is sent to "Sickbay"',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: "Joe's Bar",
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 12,
    passEffect: '+1 morale',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale and the current player is sent to "Brig"',
    skills: [ 'politics', 'leadership', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Power Failure',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: false,
    passValue: 14,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'Reduce the Jump Preparation track by 1',
    skills: [ 'leadership', 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Strange Beacon',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 13,
    passEffect: 'Choose 1 space area on the main game board and remove all Cylon ships in that area',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'Decrease the Jump Preparation track by 1',
    skills: [ 'tactics', 'piloting', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Temple of the Five',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 9,
    passEffect: 'The current player may draw 2 Skill Cards',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'Decrease the Jump Preparation track by 1',
    skills: [ 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Threat of Super Nova',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 10,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 population and damage Galactica',
    skills: [ 'leadership', 'piloting', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Unexplained Deaths',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 8,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale, -1 population',
    skills: [ 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Unfair Bias',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 12,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'Damage Galactica and the current player discards his hand of Skill Cards',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'A Verdict of Guilty',
    expansion: 'pegasus',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: 'The current player is executed and the Admiral discards 3 Skill Cards.',
    option2: 'Damage Galactica twice.',
    actor: 'Admiral',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Assassination Plot',
    expansion: 'pegasus',
    type: 'Choice',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    option1: 'The Admiral and the current player must both discards 3 Skill Cards and draw 3 Treatchery Cards.',
    option2: 'The Admiral is executed.',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Civilian Ship Nuked',
    expansion: 'pegasus',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: 'Draw 1 civilian ship and destroy it. Then each player discards 1 Skill Card and draws 1 Treatchery Card.',
    option2: 'Draw 2 civilian ships and destroy them.',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Food Hoarding in the Fleet',
    expansion: 'pegasus',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '-1 morale and roll a die. If 3 or less, draw 1 civilizan ship and destroy it.',
    option2: '-2 food',
    actor: 'President',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Pressure the Supply Ships',
    expansion: 'pegasus',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    option1: '+1 food and -1 morale. The Admiral discards 2 Skill Cards and draws 2 Treatchery Cards',
    option2: '-2 food',
    actor: 'Admiral',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Suspicious Election Results',
    expansion: 'pegasus',
    type: 'Choice',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    option1: 'Give the President title to the character (aside from the current President) highest in the line of succession.',
    option2: 'The Admiral discards 1 random Skill Card and draws 1 Treatchery Card.',
    actor: 'Admiral',
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Dogfight',
    expansion: 'pegasus',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'Constant Barrage: Keep this card in play until the fleet jumps or no raiders remain on the board. Each time raiders are activated, launch two raiders from each basestar (do not activate these new raiders).',
    deploy: [
      [],
      [],
      [ 'basestar', 'raider', 'raider' ],
      [ 'raider', 'raider' ],
      [ 'viper' ],
      [ 'viper', 'civilian' ]
    ],
    script: {
      keepUntil: 'jump,noRaiders',
    },
  },
  {
    name: 'Scar',
    expansion: 'pegasus',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'Personal Vendetta: Keep this card in play until the fleet jumps or Scar is destroyed. Whenever raiders are activated, activate the Scar raider twice. Scar may only by destroyed by a roll of 7 or 8.',
    deploy: [
      [],
      [ 'raider' ],
      [],
      [ 'civilian', 'civilian' ],
      [ 'viper' ],
      [ 'viper' ]
    ],
    script: {
      keepUntil: 'jump,scarDestroyed',
    },
  },
  {
    name: 'The Guardians',
    expansion: 'pegasus',
    type: 'Cylon Attack',
    cylonActivation: 'Basestars',
    jumpTrack: false,
    effect: 'Raptor Crew Captured: Keep this card in play until the fleet jumps. When a basestar is destroyed, lose 1 morale and destroy 1 raptor.',
    deploy: [
      [ 'basestar' ],
      [ 'raider', 'raider' ],
      [ 'heavy raider' ],
      [ 'civilian' ],
      [ 'viper' ],
      [ 'raider', 'raider', 'viper' ]
    ],
    script: {
      keepUntil: 'jump',
    },
  },
  {
    name: 'Code Blue',
    expansion: 'pegasus',
    type: 'Optional Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 13,
    passEffect: 'The current player looks at 1 random Loyalty Card of any player',
    failEffect: '-1 morale an the current player is sent to the "Brig"',
    option2: 'Each player discards 2 Skill Cards and draws 2 Treachery Cards',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Reunite the Fleet',
    expansion: 'pegasus',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    passValue: 10,
    passEffect: '+1 population',
    failEffect: '-1 morale and each player discards 1 Skill Card and draws 1 Treachery Card',
    option2: 'The current player discards 2 random Skill Cards and draws 2 Treachery Cards',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'The Black Market',
    expansion: 'pegasus',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 13,
    passEffect: '+1 food',
    failEffect: '-2 food, -1 morale',
    option2: '-1 food and each player discards 1 Skill card and draws 1 Treachery Card',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Unsettling Stories',
    expansion: 'pegasus',
    type: 'Optional Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 9,
    passEffect: 'No Effect',
    failEffect: '-1 morale, and each player discards 1 Skill Card and draws 1 Treachery Card',
    option2: '-1 morale',
    actor: 'currentPlayer',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'An Offer of Peace',
    expansion: 'pegasus',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 12,
    passEffect: 'No Effect',
    partialValue: 6,
    partialEffect: 'Shuffle 2 Treachery Cards into the Destiny deck',
    failEffect: '-1 morale and shuffle 2 Treachery Cards into the Destiny deck',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Defending a Prisoner',
    expansion: 'pegasus',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 11,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale and roll a die. If 4 or lower, the current player is executed',
    skills: [ 'politics', 'leadership' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Medical Breakthrough',
    expansion: 'pegasus',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: false,
    passValue: 12,
    passEffect: 'Each human player draws 1 Skill Card',
    partialValue: 6,
    partialEffect: 'No Effect',
    failEffect: '-1 morale and each player discards 1 Skill Card and draws 1 Treachery Card',
    skills: [ 'politics', 'leadership', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: "Review Galactica's Log",
    expansion: 'pegasus',
    type: 'Skill Check',
    cylonActivation: 'Raiders',
    jumpTrack: true,
    passValue: 14,
    passEffect: 'No Effect',
    partialValue: 6,
    partialEffect: 'The Admiral must discard 3 Skill Cards',
    failEffect: '-1 morale and the Admiral must discard 5 Skill Cards',
    skills: [ 'politics', 'leadership', 'tactics' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Sabotage Investigated',
    expansion: 'pegasus',
    type: 'Skill Check',
    cylonActivation: 'Hvy Raiders',
    jumpTrack: true,
    passValue: 9,
    passEffect: '-1 food',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale, -1 fuel, -1 food',
    skills: [ 'tactics', 'engineering' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Standoff with Pegasus',
    expansion: 'pegasus',
    type: 'Skill Check',
    cylonActivation: 'Raiders Launch',
    jumpTrack: false,
    passValue: 22,
    passEffect: 'The current player may move 1 character from the "Brig" to any other location',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 population, -1 morale, and damage 1 viper in a space area (if able)',
    skills: [ 'politics', 'leadership', 'tactics', 'piloting' ],
    script: {
      keepUntil: '',
    },
  },
  {
    name: 'Training Snafu',
    expansion: 'pegasus',
    type: 'Skill Check',
    cylonActivation: 'Basestar Attacks',
    jumpTrack: true,
    passValue: 8,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'Damage 3 vipers in space areas or in the "Reserves"',
    skills: [ 'leadership', 'piloting' ],
    script: {
      keepUntil: '',
    },
  },
]
