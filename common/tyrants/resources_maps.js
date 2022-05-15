const MapZone = require('./MapZone.js')

const mapData = [
  {
    "name": "araum-chasm",
    "short": "araum-chasm",
    "region": 2,
    "size": 1,
    "neutrals": 1,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Araumycos",
      "Chasmleap Bridge"
    ]
  },
  {
    "name": "araum-ched",
    "short": "araum-ched",
    "region": 2,
    "size": 1,
    "neutrals": 1,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Araumycos",
      "Ched Nasad"
    ]
  },
  {
    "name": "araum-erynd",
    "short": "araum-erynd",
    "region": 2,
    "size": 1,
    "neutrals": 1,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Araumycos",
      "Eryndlyn"
    ]
  },
  {
    "name": "araum-labyr a",
    "short": "araum-labyr a",
    "region": 2,
    "size": 1,
    "neutrals": 1,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Araumycos",
      "araum-labyr b"
    ]
  },
  {
    "name": "araum-labyr b",
    "short": "araum-labyr b",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "The Labyrinth",
      "araum-labyr b"
    ]
  },
  {
    "name": "bling-mant",
    "short": "bling-mant",
    "region": 2,
    "size": 1,
    "neutrals": 1,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Blingdenstone",
      "Mantol-Derith"
    ]
  },
  {
    "name": "buiyr-jhach",
    "short": "buiyr-jhach",
    "region": 1,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Buiyrandyn",
      "Jhachalkhyn"
    ]
  },
  {
    "name": "buiyr-labyr",
    "short": "buiyr-labyr",
    "region": 1,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Buiyrandyn",
      "The Labyrinth"
    ]
  },
  {
    "name": "buiyr-stone",
    "short": "buiyr-stone",
    "region": 1,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Buiyrandyn",
      "Stoneshaft Clanhold"
    ]
  },
  {
    "name": "ch'chi-kama",
    "short": "ch'chi-kama",
    "region": 1,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Ch'chitl",
      "Kamaglym"
    ]
  },
  {
    "name": "ch'chi-stone",
    "short": "ch'chi-stone",
    "region": 1,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Ch'chitl",
      "Stoneshaft Clanhold"
    ]
  },
  {
    "name": "chasm-ever",
    "short": "chasm-ever",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Chasmleap Bridge",
      "Everfire"
    ]
  },
  {
    "name": "chasm-grack a",
    "short": "chasm-grack a",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Chasmleap Bridge",
      "chasm-grack b"
    ]
  },
  {
    "name": "chasm-grack b",
    "short": "chasm-grack b",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Gracklstugh",
      "chasm-grack b"
    ]
  },
  {
    "name": "chasm-menzo a",
    "short": "chasm-menzo a",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Chasmleap Bridge",
      "chasm-menzo b"
    ]
  },
  {
    "name": "chasm-menzo b",
    "short": "chasm-menzo b",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Menzoberranzan",
      "chasm-menzo b"
    ]
  },
  {
    "name": "chaul-ever",
    "short": "chaul-ever",
    "region": 3,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Chaulssin",
      "Everfire"
    ]
  },
  {
    "name": "chaul-phaer",
    "short": "chaul-phaer",
    "region": 3,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Chaulssin",
      "The Phaerlin"
    ]
  },
  {
    "name": "ched-halls a",
    "short": "ched-halls a",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Ched Nasad",
      "ched-halls b"
    ]
  },
  {
    "name": "ched-halls b",
    "short": "ched-halls b",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Halls of the Scoured Legion",
      "ched-halls b"
    ]
  },
  {
    "name": "ched-llace a",
    "short": "ched-llace a",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Ched Nasad",
      "ched-llace b"
    ]
  },
  {
    "name": "ched-llace b",
    "short": "ched-llace b",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Llacerellyn",
      "ched-llace b"
    ]
  },
  {
    "name": "ched-ruins",
    "short": "ched-ruins",
    "region": 3,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Ched Nasad",
      "Ruins of Dekanter"
    ]
  },
  {
    "name": "ched-yath",
    "short": "ched-yath",
    "region": 3,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Ched Nasad",
      "Yathchol"
    ]
  },
  {
    "name": "erynd-kama a",
    "short": "erynd-kama a",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Eryndlyn",
      "erynd-kama b"
    ]
  },
  {
    "name": "erynd-kama b",
    "short": "erynd-kama b",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Kamaglym",
      "erynd-kama b"
    ]
  },
  {
    "name": "erynd-llace",
    "short": "erynd-llace",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Eryndlyn",
      "Llacerellyn"
    ]
  },
  {
    "name": "ever-halls",
    "short": "ever-halls",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Everfire",
      "Halls of the Scoured Legion"
    ]
  },
  {
    "name": "ever-menzo a",
    "short": "ever-menzo a",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Everfire",
      "ever-menzo b"
    ]
  },
  {
    "name": "ever-menzo b",
    "short": "ever-menzo b",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Menzoberranzan",
      "ever-menzo b"
    ]
  },
  {
    "name": "gaunt-jhach",
    "short": "gaunt-jhach",
    "region": 1,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Gauntlgrim",
      "Jhachalkhyn"
    ]
  },
  {
    "name": "grack-jhach",
    "short": "grack-jhach",
    "region": 1,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Gracklstugh",
      "Jhachalkhyn"
    ]
  },
  {
    "name": "grack-labyr",
    "short": "grack-labyr",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Gracklstugh",
      "The Labyrinth"
    ]
  },
  {
    "name": "grack-mant",
    "short": "grack-mant",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Gracklstugh",
      "Mantol-Derith"
    ]
  },
  {
    "name": "halls-yath",
    "short": "halls-yath",
    "region": 3,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Halls of the Scoured Legion",
      "Yathchol"
    ]
  },
  {
    "name": "kama-skull",
    "short": "kama-skull",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Kamaglym",
      "Skullport"
    ]
  },
  {
    "name": "kama-tsen a",
    "short": "kama-tsen a",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Kamaglym",
      "kama-tsen b"
    ]
  },
  {
    "name": "kama-tsen b",
    "short": "kama-tsen b",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Tsenviilyq",
      "kama-tsen b"
    ]
  },
  {
    "name": "labyr-skull a",
    "short": "labyr-skull a",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "The Labyrinth",
      "labyr-skull b"
    ]
  },
  {
    "name": "labyr-skull b",
    "short": "labyr-skull b",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Skullport",
      "labyr-skull b"
    ]
  },
  {
    "name": "llace-ss'zur a",
    "short": "llace-ss'zur a",
    "region": 3,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Llacerellyn",
      "llace-ss'zur b"
    ]
  },
  {
    "name": "llace-ss'zur b",
    "short": "llace-ss'zur b",
    "region": 3,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Ss'zuraass'nee",
      "llace-ss'zur b"
    ]
  },
  {
    "name": "llace-tsen",
    "short": "llace-tsen",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Llacerellyn",
      "Tsenviilyq"
    ]
  },
  {
    "name": "mant-menzo a",
    "short": "mant-menzo a",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Mantol-Derith",
      "mant-menzo b"
    ]
  },
  {
    "name": "mant-menzo b",
    "short": "mant-menzo b",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "mant-menzo a",
      "mant-menzo c"
    ]
  },
  {
    "name": "mant-menzo c",
    "short": "mant-menzo c",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Menzoberranzan",
      "mant-menzo b"
    ]
  },
  {
    "name": "mant-worm",
    "short": "mant-worm",
    "region": 1,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Mantol-Derith",
      "The Wormwrithings"
    ]
  },
  {
    "name": "phaer-ruins a",
    "short": "phaer-ruins a",
    "region": 3,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "The Phaerlin",
      "phaer-ruins b"
    ]
  },
  {
    "name": "phaer-ruins b",
    "short": "phaer-ruins b",
    "region": 3,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Ruins of Dekanter",
      "phaer-ruins b"
    ]
  },
  {
    "name": "phaer-yath",
    "short": "phaer-yath",
    "region": 3,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "The Phaerlin",
      "Yathchol"
    ]
  },
  {
    "name": "ruins-ss'zur",
    "short": "ruins-ss'zur",
    "region": 3,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Ruins of Dekanter",
      "Ss'zuraass'nee"
    ]
  },
  {
    "name": "skull-stone a",
    "short": "skull-stone a",
    "region": 1,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Skullport",
      "skull-stone b"
    ]
  },
  {
    "name": "skull-stone b",
    "short": "skull-stone b",
    "region": 1,
    "size": 1,
    "neutrals": 0,
    "points": 0,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "Stoneshaft Clanhold",
      "skull-stone b"
    ]
  },
  {
    "name": "Gauntlgrim",
    "short": "gaunt",
    "region": 1,
    "size": 3,
    "neutrals": 2,
    "points": 2,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "gaunt-jhach"
    ]
  },
  {
    "name": "The Wormwrithings",
    "short": "worm",
    "region": 1,
    "size": 3,
    "neutrals": 0,
    "points": 3,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "mant-worm"
    ]
  },
  {
    "name": "Jhachalkhyn",
    "short": "jhach",
    "region": 1,
    "size": 4,
    "neutrals": 0,
    "points": 4,
    "start": true,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "grack-jhach",
      "buiyr-jhach"
    ]
  },
  {
    "name": "Buiyrandyn",
    "short": "buiyr",
    "region": 1,
    "size": 3,
    "neutrals": 1,
    "points": 3,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "buiyr-labyr",
      "buiyr-stone"
    ]
  },
  {
    "name": "Stoneshaft Clanhold",
    "short": "stone",
    "region": 1,
    "size": 2,
    "neutrals": 2,
    "points": 4,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "skull-stone a",
      "ch'chi-stone"
    ]
  },
  {
    "name": "Ch'chitl",
    "short": "ch'chi",
    "region": 1,
    "size": 3,
    "neutrals": 2,
    "points": 2,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "ch'chi-kama"
    ]
  },
  {
    "name": "Blingdenstone",
    "short": "bling",
    "region": 2,
    "size": 2,
    "neutrals": 2,
    "points": 4,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      null
    ]
  },
  {
    "name": "Mantol-Derith",
    "short": "mant",
    "region": 2,
    "size": 5,
    "neutrals": 2,
    "points": 4,
    "start": true,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "mant-worm",
      "grack-mant",
      "mant-menzo a"
    ]
  },
  {
    "name": "Gracklstugh",
    "short": "grack",
    "region": 2,
    "size": 4,
    "neutrals": 2,
    "points": 3,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "grack-jhach",
      "chasm-grack b",
      "grack-labyr"
    ]
  },
  {
    "name": "The Labyrinth",
    "short": "labyr",
    "region": 2,
    "size": 3,
    "neutrals": 1,
    "points": 3,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "buiyr-labyr",
      "labyr-skull a",
      "araum-labyr b"
    ]
  },
  {
    "name": "Skullport",
    "short": "skull",
    "region": 2,
    "size": 5,
    "neutrals": 2,
    "points": 4,
    "start": true,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "skull-stone a",
      "kama-skull"
    ]
  },
  {
    "name": "Kamaglym",
    "short": "kama",
    "region": 2,
    "size": 3,
    "neutrals": 0,
    "points": 3,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "kama-skull",
      "erynd-kama b",
      "kama-tsen a"
    ]
  },
  {
    "name": "Menzoberranzan",
    "short": "menzo",
    "region": 2,
    "size": 6,
    "neutrals": 3,
    "points": 5,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "chasm-menzo b",
      "ever-menzo b"
    ]
  },
  {
    "name": "Chasmleap Bridge",
    "short": "chasm",
    "region": 2,
    "size": 1,
    "neutrals": 0,
    "points": 1,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "chasm-grack a",
      "araum-chasm*",
      "chasm-ever"
    ]
  },
  {
    "name": "Araumycos",
    "short": "araum",
    "region": 2,
    "size": 4,
    "neutrals": 4,
    "points": 3,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "araum-labyr a*",
      "araum-ched*",
      "araum-erynd*"
    ]
  },
  {
    "name": "Eryndlyn",
    "short": "erynd",
    "region": 2,
    "size": 3,
    "neutrals": 0,
    "points": 3,
    "start": true,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "erynd-kama a",
      "erynd-llace"
    ]
  },
  {
    "name": "Tsenviilyq",
    "short": "tsen",
    "region": 2,
    "size": 3,
    "neutrals": 3,
    "points": 4,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "llace-tsen"
    ]
  },
  {
    "name": "Everfire",
    "short": "ever",
    "region": 2,
    "size": 3,
    "neutrals": 0,
    "points": 3,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "chasm-ever",
      "chaul-ever",
      "ever-halls"
    ]
  },
  {
    "name": "Halls of the Scoured Legion",
    "short": "halls",
    "region": 2,
    "size": 2,
    "neutrals": 1,
    "points": 3,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "ched-halls b",
      "halls-yath"
    ]
  },
  {
    "name": "Ched Nasad",
    "short": "ched",
    "region": 2,
    "size": 4,
    "neutrals": 0,
    "points": 3,
    "start": true,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "ched-halls a",
      "ched-llace a",
      "ched-yath",
      "ched-ruins"
    ]
  },
  {
    "name": "Llacerellyn",
    "short": "llace",
    "region": 2,
    "size": 2,
    "neutrals": 0,
    "points": 2,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "erynd-llace",
      "llace-tsen",
      "llace-ss'zur a"
    ]
  },
  {
    "name": "Chaulssin",
    "short": "chaul",
    "region": 3,
    "size": 5,
    "neutrals": 0,
    "points": 4,
    "start": true,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "chaul-phaer"
    ]
  },
  {
    "name": "The Phaerlin",
    "short": "phaer",
    "region": 3,
    "size": 3,
    "neutrals": 2,
    "points": 2,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "phaer-yath",
      "phaer-ruins a"
    ]
  },
  {
    "name": "Yathchol",
    "short": "yath",
    "region": 3,
    "size": 2,
    "neutrals": 2,
    "points": 4,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "halls-yath",
      "ched-yath"
    ]
  },
  {
    "name": "Ruins of Dekanter",
    "short": "ruins",
    "region": 3,
    "size": 6,
    "neutrals": 2,
    "points": 5,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "ched-ruins",
      "ruins-ss'zur"
    ]
  },
  {
    "name": "Ss'zuraass'nee",
    "short": "ss'zur",
    "region": 3,
    "size": 3,
    "neutrals": 2,
    "points": 2,
    "start": false,
    "control": {
      "influence": 0,
      "points": 0
    },
    "totalControl": {
      "influence": 0,
      "points": 0
    },
    "neighbors": [
      "llace-ss'zur b"
    ]
  }
].map(data => new MapZone(data))

module.exports = {
  'base-2': mapData.filter(zone => zone.region === 2),
  'base-3a': mapData.filter(zone => [1, 2].includes(zone.region)),
  'base-3b': mapData.filter(zone => [2, 3].includes(zone.region)),
  'base-4': mapData,
}
