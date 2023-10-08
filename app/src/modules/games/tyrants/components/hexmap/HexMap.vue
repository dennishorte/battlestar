<template>
  <div class="hex-map">
    <svg class="game-map" width="1000" height="800" ref="gamemap">

      <Hex :cx="300" :cy="300" :sites="a2sites" :rotation="0" />
      <Hex :cx="525" :cy="430" :sites="b2sites" :rotation="0" />
      <Hex :cx="525" :cy="170" :sites="c1sites" :rotation="0" />


    </svg>
  </div>
</template>


<script>
import Hex from './Hex'


const a2sites = [
  {
    name: 'Fogtown',
    dx: -30,
    dy: +80,
    size: 3,
    neutrals: 2,
    value: 4,
    paths: [
      'Gallenghast',
      'Darkflame',
      'hex0',
      'hex6',
    ],
  },
  {
    name: 'Gallenghast',
    dx: +60,
    dy: +10,
    size: 6,
    neutrals: 2,
    value: 2,
    paths: [
      'Fogtown',
      'Darkflame',
      'hex1',
      'hex2',
    ],
  },
  {
    name: 'Darkflame',
    dx: -35,
    dy: -70,
    size: 3,
    neutrals: 2,
    value: 3,
    paths: [
      'Fogtown',
      'Gallenghast',
      'hex4',
      'hex5',
    ],
  },
]

const b2sites = [
  {
    name: 'Lolth Shrine',
    token: 'Tsenviilyq',
    dx: -2,
    dy: +20,
    size: 4,
    neutrals: 2,
    value: 3,
    paths: [
      'Vrith',
      'b2-troop-a',
      'b2-troop-b',
      'b2-troop-c',
      'b2-troop-d',
    ],
  },
  {
    name: 'Vrith',
    dx: +0,
    dy: -90,
    size: 1,
    neutrals: 1,
    value: 2,
    paths: [
      'Lolth Shrine',
      'hex0',
    ],
  },
  {
    name: 'b2-troop-a',
    kind: 'troop-spot',
    dx: -90,
    dy: -35,
    paths: [
      'Lolth Shrine',
      'hex5',
    ],
  },
  {
    name: 'b2-troop-b',
    kind: 'troop-spot',
    dx: -80,
    dy: +60,
    paths: [
      'Lolth Shrine',
      'hex4',
    ],
  },
  {
    name: 'b2-troop-c',
    kind: 'troop-spot',
    dx: +85,
    dy: -30,
    paths: [
      'Lolth Shrine',
      'hex1',
    ],
  },
  {
    name: 'b2-troop-d',
    kind: 'troop-spot',
    dx: +80,
    dy: +55,
    paths: [
      'Lolth Shrine',
      'hex2',
    ],
  },
]

const c1sites = [
  {
    name: 'The Twilight',
    dx: -15,
    dy: -70,
    size: 3,
    value: 3,
    paths: [
      'c1-troop-a',
      'c1-troop-c',
      'hex0',
    ],
  },
  {
    name: 'Magma Gate',
    dx: +70,
    dy: +10,
    size: 6,
    value: 2,
    start: true,
    paths: [
      'c1-troop-c',
      'c1-troop-d',
      'hex1',
      'hex2',
    ],
  },
  {
    name: 'Spiral Desert',
    dx: -40,
    dy: +40,
    size: 3,
    value: 3,
    paths: [
      'c1-troop-a',
      'c1-troop-b',
      'c1-troop-d',
    ],
  },
  {
    name: 'c1-troop-a',
    kind: 'troop-spot',
    dx: -90,
    dy: -35,
    paths: [
      'The Twilight',
      'Spiral Desert',
    ],
  },
  {
    name: 'c1-troop-b',
    kind: 'troop-spot',
    dx: -45,
    dy: +100,
    paths: [
      'Spiral Desert',
      'hex3',
    ],
  },
  {
    name: 'c1-troop-c',
    kind: 'troop-spot',
    dx: +65,
    dy: -60,
    paths: [
      'The Twilight',
      'Magma Gate',
    ],
  },
  {
    name: 'c1-troop-d',
    kind: 'troop-spot',
    dx: +40,
    dy: +75,
    paths: [
      'Magma Gate',
      'Spiral Desert',
    ],
  },
]

const c6sites = [

]


export default {
  name: 'HexMap',

  components: {
        Hex,
      },

      data() {
    return {
      a2sites,
      b2sites,
      c1sites,
    }
  },
}
</script>


<style scoped>
</style>
