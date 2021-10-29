module.exports =  [
  {
    name: 'Massive Assault',
    expansion: 'base game',
    type: 'Cylon Attack',
    cylonActivation: 'Hvy Raiders, Basestar Attacks',
    jumpTrack: false,
    effect: 'Power Failure: Move the fleet token 2 spaces towards the start of the Jump Preparation track',
    deploy: [
      [],
      [ 'basestar', 'raider', 'raider', 'raider', 'raider' ],
      [ 'basestar', 'heavy raider', 'raider', 'raider' ],
      [],
      [ 'viper', 'civilian', 'civilian' ],
      [ 'viper', 'civilian', 'civilian' ]
    ]
  },
  {
    name: 'Bomb on Colonial One',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: '',
    jumpTrack: false,
    passValue: 15,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-2 morale, and all characters on Colonial One are sent to "Sickbay". Keep this card in play. Characters may not move to Colonial One for the rest of the game',
    skills: [ 'tactics', 'piloting', 'engineering' ]
  },
  {
    name: 'Cylon Intruders',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: '',
    jumpTrack: false,
    passValue: 18,
    passEffect: 'No Effect',
    partialValue: 14,
    partialEffect: 'Place 1 centurion marker at the star of the Boarding Party track',
    failEffect: 'Damage Galactica and place 2 centurion markers at the start of the Boarding Party track',
    skills: [ 'leadership', 'tactics' ]
  },
  {
    name: 'Fleet Mobilization',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: '',
    jumpTrack: false,
    passValue: 24,
    passEffect: 'Activate: Basestar Attacks, Raiders Launch',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 morale and activate: Basestar Attacks, Raiders, Hvy Raiders, Raiders Launch',
    skills: [ 'leadership', 'tactics', 'piloting', 'engineering' ]
  },
  {
    name: 'Inbound Nukes',
    expansion: 'base game',
    type: 'Skill Check',
    cylonActivation: '',
    jumpTrack: false,
    passValue: 15,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: '-1 fuel, -1 food, and -1 population',
    skills: [ 'leadership', 'tactics' ]
  },
  {
    name: 'Fighting Blind',
    expansion: 'exodus',
    type: 'Choice',
    cylonActivation: '',
    jumpTrack: false,
    option1: 'Place 2 centurions at the start of the Boarding Party track',
    option2: 'The CAG is executed',
    actor: 'CAG'
  },
  {
    name: 'Fire All Missiles',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: '',
    jumpTrack: false,
    passValue: 22,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: 'Draw 2 civilian ships to destroy',
    skills: [ 'tactics', 'piloting' ]
  },
  {
    name: 'Human Prisoner',
    expansion: 'exodus',
    type: 'Skill Check',
    cylonActivation: '',
    jumpTrack: false,
    passValue: 18,
    passEffect: 'No Effect',
    partialValue: 0,
    partialEffect: '',
    failEffect: `The Cylon player who played this card chooses one human player and takes allof his Skill Cards. That human player's character is then sent to "Sickbay"`,
    skills: [ 'leadership', 'tactics' ]
  },
  {
    name: '"Demand Peace" Manifesto',
    expansion: 'pegasus',
    type: 'Choice',
    cylonActivation: '',
    jumpTrack: false,
    option1: '-1 morale and damage Galactica twice',
    option2: 'The president and the Admiral each discard their hand of Skill Cards',
    actor: 'Admiral'
  },
  {
    name: 'Psychological Warfare',
    expansion: 'pegasus',
    type: 'Choice',
    cylonActivation: '',
    jumpTrack: false,
    option1: '-1 morale, each player discards 2 Skill Cards and draws 2 Treachery Cards',
    option2: 'Each revealed Cylon player draws 2 Treachery Cards. Then, discard the entire Destiny deck and build a new one consisting of only 6 Treachery Cards',
    actor: 'President'
  },
  {
    name: 'Lured into a Trap',
    expansion: 'pegasus',
    type: 'Cylon Attack',
    cylonActivation: 'Raiders',
    jumpTrack: false,
    effect: 'Dangerous Reparis are Necessary: Keep this card in play until after the fleet jumps. Any character in either the "Engine Room" or "FTL Control" location when the fleet jumps is executed',
    deploy: [
      [],
      [ 'basestar', 'raider', 'raider', 'raider' ],
      [ 'basestar', 'raider', 'raider', 'raider' ],
      [ 'heavy raider' ],
      [ 'viper', 'civilian' ],
      [ 'viper', 'civilian' ]
    ]
  },
  {
    name: 'Footage Transmitted',
    expansion: 'pegasus',
    type: 'Skill Check',
    cylonActivation: '',
    jumpTrack: false,
    passValue: 17,
    passEffect: 'Each player draws 1 Treachery Card',
    partialValue: 12,
    partialEffect: 'Each revealed Cylon player draws 2 Treachery Cards',
    failEffect: 'Each revealed Cylon player draws 2 Treachery Cards and 1 Super Crisis Card',
    skills: [ 'politics', 'leadership', 'tactics' ]
  },
  {
    name: 'The Farm',
    expansion: 'pegasus',
    type: 'Skill Check',
    cylonActivation: '',
    jumpTrack: false,
    passValue: 15,
    passEffect: 'No Effect',
    partialValue: 8,
    partialEffect: '-1 food',
    failEffect: '-1 food, -1 population. Keep this card in play. Human players may not use their once-per-game abilities',
    skills: [ 'tactics', 'engineering' ]
  }
]
