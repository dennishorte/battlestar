const { MagicCard } = require('./MagicCard.js')
const lookup = require('./util/cardLookup.js')

const whiteCards = [
  {
    _id: '00293ce4-3475-4064-8510-9e8c02faf3bf',
    source: 'scryfall',
    data: {
      layout: 'normal',
      cmc: 0,
      color_identity: [ 'W' ],
      produced_mana: [ 'W' ],
      set: 'cma',
      collector_number: '292',
      digital: false,
      rarity: 'common',
      card_faces: [
        {
          artist: 'Andreas Rocha',
          name: 'Plains',
          oracle_text: '({T}: Add {W}.)',
          type_line: 'Basic Land — Plains',
          colors: [],
          image_uri: 'https://cards.scryfall.io/art_crop/front/0/0/00293ce4-3475-4064-8510-9e8c02faf3bf.jpg?1592674050'
        }
      ],
      name: 'Plains',
      colors: [],
      type_line: 'Basic Land — Plains',
      legal: [
        'standard',      'future',
        'historic',      'timeless',
        'gladiator',     'pioneer',
        'explorer',      'modern',
        'legacy',        'pauper',
        'vintage',       'penny',
        'commander',     'oathbreaker',
        'standardbrawl', 'brawl',
        'alchemy',       'paupercommander',
        'duel',          'premodern',
        'predh'
      ],
      _id: '00293ce4-3475-4064-8510-9e8c02faf3bf'
    }
  },
  {
    _id: '11600105-56c6-4073-a4a6-8469030b39c9',
    source: 'scryfall',
    data: {
      layout: 'normal',
      cmc: 1,
      color_identity: [ 'W' ],
      set: 'lea',
      collector_number: '4',
      digital: false,
      rarity: 'common',
      card_faces: [
        {
          artist: 'Douglas Shuler',
          flavor_text: 'Benalia has a complex caste system that changes with the lunar year. No matter what the season, the only caste that cannot be attained by either heredity or money is that of the hero.',
          mana_cost: '{W}',
          name: 'Benalish Hero',
          oracle_text: "Banding (Any creatures with banding, and up to one without, can attack in a band. Bands are blocked as a group. If any creatures with banding you control are blocking or being blocked by a creature, you divide that creature's combat damage, not its controller, among any of the creatures it's being blocked by or is blocking.)",
          power: '1',
          toughness: '1',
          type_line: 'Creature — Human Soldier',
          colors: [ 'W' ],
          image_uri: 'https://cards.scryfall.io/art_crop/front/1/1/11600105-56c6-4073-a4a6-8469030b39c9.jpg?1559591360'
        }
      ],
      name: 'Benalish Hero',
      colors: [ 'W' ],
      type_line: 'Creature — Human Soldier',
      legal: [
        'legacy',
        'pauper',
        'vintage',
        'commander',
        'oathbreaker',
        'paupercommander',
        'duel',
        'oldschool',
        'premodern',
        'predh'
      ],
      _id: '11600105-56c6-4073-a4a6-8469030b39c9'
    }
  },
  {
    _id: '042b8d98-59b8-4fba-96b0-608e416c487f',
    source: 'scryfall',
    data: {
      layout: 'normal',
      cmc: 2,
      color_identity: [ 'W' ],
      set: 'prm',
      collector_number: '35950',
      digital: true,
      rarity: 'uncommon',
      card_faces: [
        {
          artist: 'Daniel Gelon',
          flavor_text: '"When good men die their goodness does not perish, / But lives though they are gone."\n' +
            '—Euripides, *Termenidae*, trans. Morgan',
          mana_cost: '{W}{W}',
          name: 'White Knight',
          oracle_text: 'First strike (This creature deals combat damage before creatures without first strike.)\n' +
            "Protection from black (This creature can't be blocked, targeted, dealt damage, or enchanted by anything black.)",
          power: '2',
          toughness: '2',
          type_line: 'Creature — Human Knight',
          colors: [ 'W' ],
          image_uri: 'https://cards.scryfall.io/art_crop/front/0/4/042b8d98-59b8-4fba-96b0-608e416c487f.jpg?1562542625'
        }
      ],
      name: 'White Knight',
      colors: [ 'W' ],
      type_line: 'Creature — Human Knight',
      legal: [
        'modern',    'legacy',
        'vintage',   'penny',
        'commander', 'oathbreaker',
        'duel',      'premodern',
        'predh'
      ],
      _id: '042b8d98-59b8-4fba-96b0-608e416c487f'
    }
  },
  {
    _id: '81ce7e1e-ffe5-4ced-8967-9a6917245240',
    source: 'scryfall',
    data: {
      layout: 'normal',
      cmc: 2,
      color_identity: [ 'W' ],
      set: 'tmp',
      collector_number: '1',
      digital: false,
      rarity: 'common',
      card_faces: [
        {
          artist: 'Heather Hudson',
          flavor_text: `"The soldier's path is worn smooth by the tread of many feet—all in one direction, none returning."\n` +
            '—Oracle *en*-Vec',
          mana_cost: '{1}{W}',
          name: 'Advance Scout',
          oracle_text: 'First strike\n' +
            '{W}: Target creature gains first strike until end of turn.',
          power: '1',
          toughness: '1',
          type_line: 'Creature — Human Soldier Scout',
          colors: [ 'W' ],
          image_uri: 'https://cards.scryfall.io/art_crop/front/8/1/81ce7e1e-ffe5-4ced-8967-9a6917245240.jpg?1562054972'
        }
      ],
      name: 'Advance Scout',
      colors: [ 'W' ],
      type_line: 'Creature — Human Soldier Scout',
      legal: [
        'legacy',
        'pauper',
        'vintage',
        'penny',
        'commander',
        'oathbreaker',
        'paupercommander',
        'duel',
        'premodern',
        'predh'
      ],
      _id: '81ce7e1e-ffe5-4ced-8967-9a6917245240'
    }
  },
  {
    _id: 'aae08938-e563-4322-b2eb-db81913ea730',
    source: 'scryfall',
    data: {
      layout: 'normal',
      cmc: 1,
      color_identity: [ 'W' ],
      set: 'vis',
      collector_number: '23',
      digital: false,
      rarity: 'rare',
      card_faces: [
        {
          artist: 'Jon J Muth',
          mana_cost: '{W}',
          name: 'Tithe',
          oracle_text: 'Search your library for a Plains card. If target opponent controls more lands than you, you may search your library for an additional Plains card. Reveal those cards, put them into your hand, then shuffle.',
          type_line: 'Instant',
          colors: [ 'W' ],
          image_uri: 'https://cards.scryfall.io/art_crop/front/a/a/aae08938-e563-4322-b2eb-db81913ea730.jpg?1562278172'
        }
      ],
      name: 'Tithe',
      colors: [ 'W' ],
      type_line: 'Instant',
      legal: [
        'legacy',
        'vintage',
        'commander',
        'oathbreaker',
        'duel',
        'premodern',
        'predh'
      ],
      _id: 'aae08938-e563-4322-b2eb-db81913ea730'
    }
  },
  {
    _id: '096eacf4-16bb-47d5-b229-c46cbe6a73f7',
    source: 'scryfall',
    data: {
      layout: 'normal',
      cmc: 1,
      color_identity: [ 'W' ],
      set: 'sum',
      collector_number: '24',
      digital: false,
      rarity: 'common',
      card_faces: [
        {
          artist: 'Anson Maddocks',
          mana_cost: '{W}',
          name: 'Holy Strength',
          oracle_text: 'Enchant creature\nEnchanted creature gets +1/+2.',
          type_line: 'Enchantment — Aura',
          colors: [ 'W' ],
          image_uri: 'https://cards.scryfall.io/art_crop/front/0/9/096eacf4-16bb-47d5-b229-c46cbe6a73f7.jpg?1559593030'
        }
      ],
      name: 'Holy Strength',
      colors: [ 'W' ],
      type_line: 'Enchantment — Aura',
      legal: [
        'modern',      'legacy',
        'pauper',      'vintage',
        'penny',       'commander',
        'oathbreaker', 'paupercommander',
        'duel',        'oldschool',
        'premodern',   'predh'
      ],
      _id: '096eacf4-16bb-47d5-b229-c46cbe6a73f7'
    }
  },
]

const redCards = [
  {
    _id: '005a993c-5111-4364-9fba-75b3d94a8296',
    source: 'scryfall',
    data: {
      layout: 'normal',
      cmc: 0,
      color_identity: [ 'R' ],
      produced_mana: [ 'R' ],
      set: '2ed',
      collector_number: '298',
      digital: false,
      rarity: 'common',
      card_faces: [
        {
          artist: 'Douglas Shuler',
          name: 'Mountain',
          oracle_text: '({T}: Add {R}.)',
          type_line: 'Basic Land — Mountain',
          colors: [],
          image_uri: 'https://cards.scryfall.io/art_crop/front/0/0/005a993c-5111-4364-9fba-75b3d94a8296.jpg?1559591904'
        }
      ],
      name: 'Mountain',
      colors: [],
      type_line: 'Basic Land — Mountain',
      legal: [
        'standard',      'future',
        'historic',      'timeless',
        'gladiator',     'pioneer',
        'explorer',      'modern',
        'legacy',        'pauper',
        'vintage',       'penny',
        'commander',     'oathbreaker',
        'standardbrawl', 'brawl',
        'alchemy',       'paupercommander',
        'duel',          'oldschool',
        'premodern',     'predh'
      ],
      _id: '005a993c-5111-4364-9fba-75b3d94a8296'
    }
  },
  {
    _id: '00365412-41db-427c-9109-8f69c17c326d',
    source: 'scryfall',
    data: {
      layout: 'normal',
      cmc: 1,
      color_identity: [ 'R' ],
      set: 'aer',
      collector_number: '98',
      digital: false,
      rarity: 'common',
      card_faces: [
        {
          artist: 'Jason Rainville',
          flavor_text: 'The tools of invention became the weapons of revolution.',
          mana_cost: '{R}',
          name: 'Shock',
          oracle_text: 'Shock deals 2 damage to any target.',
          type_line: 'Instant',
          colors: [ 'R' ],
          image_uri: 'https://cards.scryfall.io/art_crop/front/0/0/00365412-41db-427c-9109-8f69c17c326d.jpg?1576381909'
        }
      ],
      name: 'Shock',
      colors: [ 'R' ],
      type_line: 'Instant',
      legal: [
        'standard',      'future',
        'historic',      'timeless',
        'gladiator',     'pioneer',
        'explorer',      'modern',
        'legacy',        'pauper',
        'vintage',       'penny',
        'commander',     'oathbreaker',
        'standardbrawl', 'brawl',
        'alchemy',       'paupercommander',
        'duel',          'premodern',
        'predh'
      ],
      _id: '00365412-41db-427c-9109-8f69c17c326d'
    }
  },
  {
    _id: '02e20655-321c-4194-ab72-b4a5473238d1',
    source: 'scryfall',
    data: {
      layout: 'normal',
      cmc: 1,
      color_identity: [ 'R' ],
      set: 'ptc',
      collector_number: 'et208',
      digital: false,
      rarity: 'common',
      card_faces: [
        {
          artist: 'Christopher Rush',
          mana_cost: '{R}',
          name: 'Lightning Bolt',
          oracle_text: 'Lightning Bolt deals 3 damage to any target.',
          type_line: 'Instant',
          colors: [ 'R' ],
          image_uri: 'https://cards.scryfall.io/art_crop/front/0/2/02e20655-321c-4194-ab72-b4a5473238d1.jpg?1562895519'
        }
      ],
      name: 'Lightning Bolt',
      colors: [ 'R' ],
      type_line: 'Instant',
      legal: [
        'timeless',  'gladiator',
        'modern',    'legacy',
        'pauper',    'vintage',
        'commander', 'oathbreaker',
        'brawl',     'paupercommander',
        'duel',      'oldschool',
        'premodern', 'predh'
      ],
      _id: '02e20655-321c-4194-ab72-b4a5473238d1'
    }
  },
  {
    _id: '059227f9-f6d7-45ab-8398-35e97b677a08',
    source: 'scryfall',
    data: {
      layout: 'normal',
      cmc: 1,
      color_identity: [ 'R' ],
      set: '9ed',
      collector_number: '189',
      digital: false,
      rarity: 'uncommon',
      card_faces: [
        {
          artist: 'Lars Grant-West',
          flavor_text: 'They patched the holes, loaded their sharpest rocks, spanked their children one last time, and lurched off into the sunset.',
          mana_cost: '{R}',
          name: 'Goblin Balloon Brigade',
          oracle_text: '{R}: This creature gains flying until end of turn.',
          power: '1',
          toughness: '1',
          type_line: 'Creature — Goblin Warrior',
          colors: [ 'R' ],
          image_uri: 'https://cards.scryfall.io/art_crop/front/0/5/059227f9-f6d7-45ab-8398-35e97b677a08.jpg?1562730811'
        }
      ],
      name: 'Goblin Balloon Brigade',
      colors: [ 'R' ],
      type_line: 'Creature — Goblin Warrior',
      legal: [
        'modern',
        'legacy',
        'pauper',
        'vintage',
        'commander',
        'oathbreaker',
        'paupercommander',
        'duel',
        'premodern',
        'predh'
      ],
      _id: '059227f9-f6d7-45ab-8398-35e97b677a08'
    }
  },
  {
    _id: '4d83e837-fcd1-4833-9117-e6f1bb53caad',
    source: 'scryfall',
    data: {
      layout: 'normal',
      cmc: 2,
      color_identity: [ 'R' ],
      set: 'neo',
      collector_number: '130',
      digital: false,
      rarity: 'common',
      card_faces: [
        {
          artist: 'April Prime',
          flavor_text: '"Follow my lantern, little ones."',
          mana_cost: '{1}{R}',
          name: 'Akki Ember-Keeper',
          oracle_text: 'Whenever a nontoken modified creature you control dies, create a 1/1 colorless Spirit creature token. (Equipment, Auras you control, and counters are modifications.)',
          power: '2',
          toughness: '1',
          type_line: 'Enchantment Creature — Goblin Warrior',
          colors: [ 'R' ],
          image_uri: 'https://cards.scryfall.io/art_crop/front/4/d/4d83e837-fcd1-4833-9117-e6f1bb53caad.jpg?1654567492'
        }
      ],
      name: 'Akki Ember-Keeper',
      colors: [ 'R' ],
      type_line: 'Enchantment Creature — Goblin Warrior',
      legal: [
        'historic',  'timeless',
        'gladiator', 'pioneer',
        'explorer',  'modern',
        'legacy',    'pauper',
        'vintage',   'penny',
        'commander', 'oathbreaker',
        'brawl',     'paupercommander',
        'duel'
      ],
      _id: '4d83e837-fcd1-4833-9117-e6f1bb53caad'
    }
  },
  {
    _id: '5694cb42-7489-40c5-b21a-aeb36636015f',
    source: 'scryfall',
    data: {
      layout: 'normal',
      cmc: 2,
      color_identity: [ 'R' ],
      set: 'mir',
      collector_number: '154',
      digital: false,
      rarity: 'common',
      card_faces: [
        {
          artist: 'Drew Tucker',
          mana_cost: '{1}{R}',
          name: 'Agility',
          oracle_text: 'Enchant creature\n' +
            'Enchanted creature gets +1/+1 and has flanking. (Whenever a creature without flanking blocks this creature, the blocking creature gets -1/-1 until end of turn.)',
          type_line: 'Enchantment — Aura',
          colors: [ 'R' ],
          image_uri: 'https://cards.scryfall.io/art_crop/front/5/6/5694cb42-7489-40c5-b21a-aeb36636015f.jpg?1562719275'
        }
      ],
      name: 'Agility',
      colors: [ 'R' ],
      type_line: 'Enchantment — Aura',
      legal: [
        'legacy',
        'pauper',
        'vintage',
        'commander',
        'oathbreaker',
        'paupercommander',
        'duel',
        'premodern',
        'predh'
      ],
      _id: '5694cb42-7489-40c5-b21a-aeb36636015f'
    }
  },
]

const cards = [
  ...whiteCards,
  ...redCards,
].map(data => new MagicCard(null, data))

module.exports = lookup.create(cards)
