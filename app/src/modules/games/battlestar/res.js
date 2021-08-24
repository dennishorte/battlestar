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
  locations,
}
