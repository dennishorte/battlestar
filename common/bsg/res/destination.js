module.exports =  [
  {
    name: 'Asteroid Field',
    expansion: 'base game',
    distance: 3,
    text: 'Lose 2 fuel. Then draw 1 civilian ship and destroy it (lose the resources on the back)',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -2,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 3
        },
        {
          kind: 'civilianDestroyed',
          count: 1
        },
      ],
    }
  },
  {
    name: 'Asteroid Field',
    expansion: 'base game',
    distance: 3,
    text: 'Lose 2 fuel. Then draw 1 civilian ship and destroy it (lose the resources on the back)',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -2,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 3
        },
        {
          kind: 'civilianDestroyed',
          count: 1
        },
      ],
    }
  },
  {
    name: 'Barren Planet',
    expansion: 'base game',
    distance: 2,
    text: 'Lose 2 fuel',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -2,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 2
        },
      ],
    }
  },
  {
    name: 'Barren Planet',
    expansion: 'base game',
    distance: 2,
    text: 'Lose 2 fuel',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -2,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 2
        },
      ],
    }
  },
  {
    name: 'Barren Planet',
    expansion: 'base game',
    distance: 2,
    text: 'Lose 2 fuel',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -2,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 2
        },
      ],
    }
  },
  {
    name: 'Barren Planet',
    expansion: 'base game',
    distance: 2,
    text: 'Lose 2 fuel',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -2,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 2
        },
      ],
    }
  },
  {
    name: 'Cylon Ambush',
    expansion: 'base game',
    distance: 3,
    text: 'Lose 1 fuel. Then place 1 basestar and 3 raiders in front of Galactica and 3 civilian ships behind Galactica',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 3
        },
        {
          kind: 'deploy',
          ships: [
            ['basestar', 'raider', 'raider', 'raider'], [], [],
            ['civilian', 'civilian', 'civilian'], [], []
          ]
        }
      ],
    }
  },
  {
    name: 'Cylon Refinery',
    expansion: 'base game',
    distance: 2,
    text: 'Lose 1 fuel. The Admiral may risk 2 vipers to roll a die. If 6 or higher, gain 2 fuel. Otherwise, damage 2 vipers',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 2
        },
        {
          kind: 'choice',
          actor: 'admiral',
          options: [
            {
              name: 'Risk 2 Vipers',
              effects: [{
                kind: 'dieRoll',
                outcomes: [
                  {
                    roll: '5-',
                    effects: [{
                      kind: 'damageVipers',
                      count: 2
                    }]
                  },
                  {
                    roll: '6+',
                    effects: [{
                      kind: 'counter',
                      counter: 'fuel',
                      amount: 2
                    }]
                  }
                ]
              }]
            },
            {
              name: 'Do Nothing',
              effects: []
            }
          ]
        }
      ],
    }
  },
  {
    name: 'Deep Space',
    expansion: 'base game',
    distance: 2,
    text: 'Lose 1 fuel and 1 morale',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 2
        },
      ],
    }
  },
  {
    name: 'Deep Space',
    expansion: 'base game',
    distance: 2,
    text: 'Lose 1 fuel and 1 morale',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 2
        },
      ],
    }
  },
  {
    name: 'Deep Space',
    expansion: 'base game',
    distance: 2,
    text: 'Lose 1 fuel and 1 morale',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'morale',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 2
        },
      ],
    }
  },
  {
    name: 'Desolate Moon',
    expansion: 'base game',
    distance: 3,
    text: 'Lose 3 fuel',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -3,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 3
        },
      ],
    }
  },
  {
    name: 'Icy Moon',
    expansion: 'base game',
    distance: 1,
    text: 'Lose 1 fuel. The Admiral may risk 1 raptor to roll a die. If 3 or higher, gain 1 food. Otherwise, destroy 1 raptor',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 1
        },
        {
          kind: 'choice',
          actor: 'admiral',
          options: [
            {
              name: 'Risk a Raptor',
              effects: [{
                kind: 'dieRoll',
                outcomes: [
                  {
                    roll: '2-',
                    effects: [{
                      kind: 'counter',
                      counter: 'raptors',
                      amount: -1
                    }]
                  }
                  {
                    roll: '3+',
                    effects: [{
                      kind: 'counter',
                      counter: 'food',
                      amount: 1
                    }]
                  },
                ]
              }]
            },
            {
              name: 'Do Nothing',
              effects: []
            }
          ]
        },
      ],
    }
  },
  {
    name: 'Icy Moon',
    expansion: 'base game',
    distance: 1,
    text: 'Lose 1 fuel. The Admiral may risk 1 raptor to roll a die. If 3 or higher, gain 1 food. Otherwise, destroy 1 raptor',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 1
        },
        {
          kind: 'choice',
          actor: 'admiral',
          options: [
            {
              name: 'Risk a Raptor',
              effects: [{
                kind: 'dieRoll',
                outcomes: [
                  {
                    roll: '2-',
                    effects: [{
                      kind: 'counter',
                      counter: 'raptors',
                      amount: -1
                    }]
                  }
                  {
                    roll: '3+',
                    effects: [{
                      kind: 'counter',
                      counter: 'food',
                      amount: 1
                    }]
                  },
                ]
              }]
            },
            {
              name: 'Do Nothing',
              effects: []
            }
          ]
        },
      ],
    }
  },
  {
    name: 'Ragnar Anchorage',
    expansion: 'base game',
    distance: 1,
    text: 'The Admiral may repair up to 3 vipers and 1 raptor. These ships may be damaged or even destroyed',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 1
        },
        {
          kind: 'choice',
          actor: 'Admiral'
          options: [
            {
              name: 'Order Repairs',
              effects: [
                {
                  kind: 'counter',
                  counter: 'raptors',
                  amount: +1,
                },
                {
                  kind: 'repairViper',
                  count: 3
                }
              ]
            },
            {
              name: 'Do Nothing',
              effects: []
            }
          ]
        },
      ],
    }
  },
  {
    name: 'Remote Planet',
    expansion: 'base game',
    distance: 2,
    text: 'Lose 1 fuel and destroy 1 raptor',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -2,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: +2
        },
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1
        },
        {
          kind: 'counter',
          counter: 'raptors',
          amount: -1
        },
      ],
    }
  },
  {
    name: 'Remote Planet',
    expansion: 'base game',
    distance: 2,
    text: 'Lose 1 fuel and destroy 1 raptor',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -2,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: +2
        },
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1
        },
        {
          kind: 'counter',
          counter: 'raptors',
          amount: -1
        },
      ],
    }
  },
  {
    name: 'Remote Planet',
    expansion: 'base game',
    distance: 2,
    text: 'Lose 1 fuel and destroy 1 raptor',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -2,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: +2
        },
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1
        },
        {
          kind: 'counter',
          counter: 'raptors',
          amount: -1
        },
      ],
    }
  },
  {
    name: 'Tylium Planet',
    expansion: 'base game',
    distance: 1,
    text: 'Lose 1 fuel. The Admiral may risk 1 raptor to roll a die. If 3 or higher, gain 2 fuel. Otherwise, destroy 1 raptor',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 1
        },
        {
          kind: 'choice',
          actor: 'admiral',
          options: [
            {
              name: 'Risk a Raptor',
              effects: [{
                kind: 'dieRoll',
                outcomes: [
                  {
                    roll: '2-',
                    effects: [{
                      kind: 'counter',
                      counter: 'raptors',
                      amount: -1
                    }]
                  }
                  {
                    roll: '3+',
                    effects: [{
                      kind: 'counter',
                      counter: 'fuel',
                      amount: +2
                    }]
                  },
                ]
              }]
            },
            {
              name: 'Do Nothing',
              effects: []
            }
          ]
        },
      ],
    }
  },
  {
    name: 'Tylium Planet',
    expansion: 'base game',
    distance: 1,
    text: 'Lose 1 fuel. The Admiral may risk 1 raptor to roll a die. If 3 or higher, gain 2 fuel. Otherwise, destroy 1 raptor',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 1
        },
        {
          kind: 'choice',
          actor: 'admiral',
          options: [
            {
              name: 'Risk a Raptor',
              effects: [{
                kind: 'dieRoll',
                outcomes: [
                  {
                    roll: '2-',
                    effects: [{
                      kind: 'counter',
                      counter: 'raptors',
                      amount: -1
                    }]
                  }
                  {
                    roll: '3+',
                    effects: [{
                      kind: 'counter',
                      counter: 'fuel',
                      amount: +2
                    }]
                  },
                ]
              }]
            },
            {
              name: 'Do Nothing',
              effects: []
            }
          ]
        },
      ],
    }
  },
  {
    name: 'Tylium Planet',
    expansion: 'base game',
    distance: 1,
    text: 'Lose 1 fuel. The Admiral may risk 1 raptor to roll a die. If 3 or higher, gain 2 fuel. Otherwise, destroy 1 raptor',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 1
        },
        {
          kind: 'choice',
          actor: 'admiral',
          options: [
            {
              name: 'Risk a Raptor',
              effects: [{
                kind: 'dieRoll',
                outcomes: [
                  {
                    roll: '2-',
                    effects: [{
                      kind: 'counter',
                      counter: 'raptors',
                      amount: -1
                    }]
                  }
                  {
                    roll: '3+',
                    effects: [{
                      kind: 'counter',
                      counter: 'fuel',
                      amount: +2
                    }]
                  },
                ]
              }]
            },
            {
              name: 'Do Nothing',
              effects: []
            }
          ]
        },
      ]
    }
  },
  {
    name: 'Tylium Planet',
    expansion: 'base game',
    distance: 1,
    text: 'Lose 1 fuel. The Admiral may risk 1 raptor to roll a die. If 3 or higher, gain 2 fuel. Otherwise, destroy 1 raptor',
    script: {
      effects: [
        {
          kind: 'counter',
          counter: 'fuel',
          amount: -1,
        },
        {
          kind: 'counter',
          counter: 'jumpTrack',
          amount: 1
        },
        {
          kind: 'choice',
          actor: 'admiral',
          options: [
            {
              name: 'Risk a Raptor',
              effects: [{
                kind: 'dieRoll',
                outcomes: [
                  {
                    roll: '2-',
                    effects: [{
                      kind: 'counter',
                      counter: 'raptors',
                      amount: -1
                    }]
                  }
                  {
                    roll: '3+',
                    effects: [{
                      kind: 'counter',
                      counter: 'fuel',
                      amount: +2
                    }]
                  },
                ]
              }]
            },
            {
              name: 'Do Nothing',
              effects: []
            }
          ]
        },
      ]
    }
  },
  {
    name: 'Algae Planet',
    expansion: 'exodus',
    distance: 1,
    text: 'Lose 1 fuel and gain 1 food'
  },
  {
    name: 'Cylon Raiders',
    expansion: 'exodus',
    distance: 3,
    text: 'Lose 2 fuel and place 3 raiders behind Galactica'
  },
  {
    name: 'Derelict Basestar',
    expansion: 'exodus',
    distance: 2,
    text: 'Lose 1 fuel. Then place 2 civilian ships behind Galactica and 1 basestar in front of Galactica. Damage the basestar once'
  },
  {
    name: 'Dying Star',
    expansion: 'exodus',
    distance: 2,
    text: 'Lose 1 fuel and damage Galactica once'
  },
  {
    name: 'Gas Giant',
    expansion: 'exodus',
    distance: 1,
    text: 'The Admiral may destroy 1 viper to gain 1 fuel'
  },
  {
    name: "Lion's Head Nebula",
    expansion: 'exodus',
    distance: 3,
    text: 'Lose 4 fuel. After the Reset Jump Preparation Track step of this jump, advance the Jump Preparation track by 2'
  },
  {
    name: 'Radioactive Cloud',
    expansion: 'exodus',
    distance: 2,
    text: 'Lose 1 fuel and 1 population'
  },
  {
    name: 'A Civilian Convoy',
    expansion: 'pegasus',
    distance: 3,
    text: 'Lose 3 fuel and gain 1 population. The admiral may choose to lose 1 morale to gain 1 fuel'
  },
  {
    name: 'Binary Star',
    expansion: 'pegasus',
    distance: 2,
    text: 'Lose 1 fuel. Place 1 civilian ship in front of Galactica and 1 civilian ship behind Galactica'
  },
  {
    name: 'Gas Cloud',
    expansion: 'pegasus',
    distance: 1,
    text: 'The Admiral may look at the top 3 cards of the Crisis deck, then palce them on the top or bottom of the deck in any order'
  },
  {
    name: 'Misjump',
    expansion: 'pegasus',
    distance: 0,
    text: 'Draw 1 civilian ship and destroy it. Then discard this card and draw a new Destination Card to resolve'
  }
]
