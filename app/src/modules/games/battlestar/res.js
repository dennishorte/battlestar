const cards = {
  {
    name: 'Admiral',
    kind: 'role',
    abilities: [
      "When the fleet jumps, you draw 2 Destination Cards and choose 1.",
      "You control the nuke tokens.",
    ],
    action: "Launch 1 nuke at a basestar. (The nuke is used up.)",
    reminder: "Nukes damage a basestar twice on a roll of 1-2, and automatically destroy a basestar on a roll of 3-8.",
  },
  {
    name: "President",
    kind: 'role',
    abilities: [
      "At the start of the game, draw 1 Quorum Card. You control the hand of Quorum Cards.",
    ],
    action: "Draw a Quorum Card into your hand.",
    reminder: "Quorum cards can be played as an action and specialize in increasing resources and dealing with unrevealed Cylons.",
  },

  ////////////////////////////////////////////////////////////
  // super crises

  {
    name: "Massive Assault",
    kind: 'super_crisis',
    skill: {
      difficulty: 24,
      skills: ['leadership', 'tactics', 'piloting', 'engineering'],
    },
    outcome: [
      {
        score: 'pass',
        result: ['activate basestars', 'launch raiders'],
      },
      {
        score: 'fail',
        result: [
          'activate basestars',
          'activate raiders',
          'activate heavy raiders and centurions',
          'launch raiders',
        ],
      },
    ],
    flavor: "You know the drill, people. Scatter formation, keep 'em off the civies and don't stray beyond the recovery line. --Lee Adama"
  },
  {
    name: "Cylon Intruders",
    kind: 'super_crisis',
    skill: {
      difficulty: 18,
      skills: ['leadership', 'tactics'],
    },
    outcome: [
      {
        score: 'pass',
        result: ["no effect"],
      },
      {
        score: 14,
        result: "Place 1 centurion marker at the start of the boarding party track."
      },
      {
        score: 'fail',
        result: "Damage Galactica and place 2 centurion markers at the start of the Boarding Party track."
      },
    ],
    flavor: "If they succeed, they'll override the decompression safeties and vent us all into space. Once we're all dead, they'll turn the ship's guns on the fleet and wipe it out, once and for all. --Saul Tigh",
  },
  {
    name: "Inbound Nukes",
    kind: 'super_crisis',
    skill: {
      difficulty: 15,
      skills: ['leadership', 'tactics'],
    },
    outcome: [
      {
        score: 'pass',
        result: ["no effect"],
      },
      {
        score: 'fail',
        result: ["-1 fuel", "-1 food", "-1 population"],
      },
    ],
    flavor: "Spread out the fleet. No ship closer than five hundred clicks from any other ship. If there is a nuke, I want to limit the damage. --William Adama",
  },
  {
    name: "Bomb on Colonial One",
    kind: 'super_crisis',
    skill: {
      difficulty: 15,
      skills: ['tactics', 'piloting', 'engineering'],
    },
    outcome: [
      {
        score: 'pass',
        result: ["no effect"],
      },
      {
        score: 'fail',
        result: [
          "-2 morale",
          "All characters on Colonial One are sent to sickbay."
          "Keep this card in play. Characters may not move to Colonial One for the rest of the game."
        ],
      },
    ],
    flavor: "We're running out of time. There's four minutes until your bomb goes off. I'm here to tell you that this conflict between out people... it doesn't have to continue. --Laura Roslin",
  },
  {
    name: "Massive Assault",
    kind: 'super_crisis',
    components: [
      ['basestar', 'raider', 'raider', 'raider', 'raider'],
      ['basestar', 'raider', 'raider', 'heavy raider'],
      [],
      ['viper', 'civilian', 'civilian'],
      ['viper', 'civilian', 'civilian'],
      [],
    ],
    instructions: [
      {
        name: 'activate',
        components: ['heavy raider', 'basestar'],
      },
      {
        name: 'setup',
      },
      {
        name: 'special rule',
        heading: 'Power Failure',
        text: "Move the fleet token 2 spaces towards the start of the Jump Preparation track",
      },
    ],
  },
}

const civilianShips = [
  {
    id: 0,
    population: 0,
    morale: 0,
    fuel: 0,
  },
  {
    id: 1,
    population: 0,
    morale: 0,
    fuel: 0,
  },
  {
    id: 2,
    population: 1,
    morale: 0,
    fuel: 0,
  },
  {
    id: 3,
    population: 1,
    morale: 0,
    fuel: 0,
  },
  {
    id: 4,
    population: 1,
    morale: 0,
    fuel: 0,
  },
  {
    id: 5,
    population: 1,
    morale: 0,
    fuel: 0,
  },
  {
    id: 6,
    population: 1,
    morale: 0,
    fuel: 0,
  },
  {
    id: 7,
    population: 1,
    morale: 0,
    fuel: 0,
  },
  {
    id: 8,
    population: 2,
    morale: 0,
    fuel: 0,
  },
  {
    id: 9,
    population: 2,
    morale: 0,
    fuel: 0,
  },
  {
    id: 10,
    population: 1,
    morale: 1,
    fuel: 0,
  },
  {
    id: 11,
    population: 1,
    morale: 0,
    fuel: 1,
  },
]

const locations = {
  'Galactica': [
    {
      name: "Admiral's Quarters",
      action: "Choose a character; then pass this skill check to send him to the Brig.",
      skill: {
        difficulty: 7,
        skills: ['leadership', 'tactics'],
      },
    },
    {
      name: "Armory",
      action: "Roll a die to attack a centurion on the Boarding Party track. If you roll 7-8, it is destroyed.",
    },
    {
      name: "Command",
      action: "Activate up to 2 unmanned vipers.",
    },
    {
      name: "Communications",
      action: "Look at the back of 2 civilian ships. You may then move them to adjacent area(s).",
    },
    {
      name: "FTL Control",
      action: "Jump the fleet if the Jump Preparation track is not in the red zone.",
    },
    {
      name: "Hangar Deck",
      action: "Launch yourself in a viper. You may then take 1 more action.",
    },
    {
      name: "Research Lab",
      action: "Draw 1 engineering or 1 tactics skill card.",
    },
    {
      name: "Weapons Control",
      action: "Attack 1 cylon ship with Galactica.",
    },
    {
      name: "Brig",
      hazard: "You may not move, draw Crisis Cards, or add more than 1 card to skill checks.",
      action: "Pass this skill check to move to any location",
      skill: {
        difficulty: 7,
        skills: ['politics', 'tactics'],
      }
    },
    {
      name: "Sickbay",
      hazard: "You may only draw 1 Skill Card during your Receive Skills step.",
    },
  ],

  'ColonialOne': [
    {
      name: "Administration",
      action: "Choose a character, then pass this skill check to give him the President title.",
      skill: {
        difficulty: 5,
        skills: ['politics', 'leadership'],
      }
    },
    {
      name: "President's Office",
      action: "If you are President, draw 1 Quorum Card. You may then draw 1 additional Quorum Card or play 1 from your hand.",
    },
    {
      name: "Press Room",
      action: "Draw 2 politics Skill Cards.",
    },
  ],

  'Cylon': [
    {
      name: "Caprica",
      action: "Play your Super Crisis Card or draw 2 Crisis Cards, choose 1 to resolve, and discard the other.",
      cylon: true,
    },
    {
      name: "Cylon Fleet",
      action: "Activate all Cylon ships of one type, or launch 2 raiders and 1 heavy raider from each basestar.",
      cylon: true,
    },
    {
      name: "Human Fleet",
      action: "Look at any player's hand, and steal 1 Skill card. Then roll a die, and if 5 or higher, damage Galactica.",
      cylon: true,
    },
    {
      name: "Resurrection Ship",
      action: "You may discard your Super Crisis Card to draw a new one. Then, if distance is 7 or less, give your unrevealed Loyalty Card(s) to any player.",
      cylon: true,
    },
  ],
}

module.exports = {
  cards,
  civilianShips,
  locations,
}
