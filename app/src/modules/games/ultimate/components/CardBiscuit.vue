<template>
  <span class="card-biscuit">
    <img
      v-if="kind === 'image'"
      class="card-biscuit-image"
      :class="classesComputed"
      :src="imagePath"
    />
    <span v-else-if="kind === 'inline-age'" class="age-biscuit">{{ ageBiscuit }}</span>
    <div v-else-if="kind === 'inline-other'">*{{ biscuit }}*</div>
  </span>
</template>


<script>
import biscuitBonus1 from '@/assets/img/new/biscuit-bonus-1.png'
import biscuitBonus2 from '@/assets/img/new/biscuit-bonus-2.png'
import biscuitBonus3 from '@/assets/img/new/biscuit-bonus-3.png'
import biscuitBonus4 from '@/assets/img/new/biscuit-bonus-4.png'
import biscuitBonus5 from '@/assets/img/new/biscuit-bonus-5.png'
import biscuitBonus6 from '@/assets/img/new/biscuit-bonus-6.png'
import biscuitBonus7 from '@/assets/img/new/biscuit-bonus-7.png'
import biscuitBonus8 from '@/assets/img/new/biscuit-bonus-8.png'
import biscuitBonus9 from '@/assets/img/new/biscuit-bonus-9.png'
import biscuitBonus10 from '@/assets/img/new/biscuit-bonus-10.png'
import biscuitBonus11 from '@/assets/img/new/biscuit-bonus-11.png'
import biscuitBonus12 from '@/assets/img/new/biscuit-bonus-12.png'
import biscuitFountain from '@/assets/img/new/biscuit-fountain.png'
import biscuitFlag from '@/assets/img/new/biscuit-flag.png'
import biscuitPlus from '@/assets/img/new/biscuit-plus.png'
import biscuitLeft from '@/assets/img/new/biscuit-left.png'
import biscuitRight from '@/assets/img/new/biscuit-right.png'
import biscuitUp from '@/assets/img/new/biscuit-up.png'
import biscuitAslant from '@/assets/img/new/biscuit-aslant.png'
import biscuitUplift from '@/assets/img/new/biscuit-uplift.png'
import biscuitUnsplay from '@/assets/img/new/biscuit-unsplay.png'
import biscuitJunk from '@/assets/img/new/biscuit-junk.png'
import biscuitEcho from '@/assets/img/new/biscuit-echo.png'
import biscuitHex from '@/assets/img/new/biscuit-hex.png'
import biscuitHexnote from '@/assets/img/new/biscuit-hexnote.png'
import biscuitCrown from '@/assets/img/new/biscuit-crown.png'
import biscuitFactory from '@/assets/img/new/biscuit-factory.png'
import biscuitClock from '@/assets/img/new/biscuit-clock.png'
import biscuitCastle from '@/assets/img/new/biscuit-castle.png'
import biscuitLeaf from '@/assets/img/new/biscuit-leaf.png'
import biscuitLightbulb from '@/assets/img/new/biscuit-lightbulb.png'
import biscuitPerson from '@/assets/img/new/biscuit-person.png'
import biscuitMeat from '@/assets/img/new/biscuit-meat.png'

const imageMap = {
  '1': biscuitBonus1,
  '2': biscuitBonus2,
  '3': biscuitBonus3,
  '4': biscuitBonus4,
  '5': biscuitBonus5,
  '6': biscuitBonus6,
  '7': biscuitBonus7,
  '8': biscuitBonus8,
  '9': biscuitBonus9,
  'a': biscuitBonus10,
  'b': biscuitBonus11,
  't': biscuitBonus12,
  ':': biscuitFountain,
  ';': biscuitFlag,
  '+': biscuitPlus,
  '<': biscuitLeft,
  '>': biscuitRight,
  '^': biscuitUp,
  '/': biscuitAslant,
  '|': biscuitUplift,
  '=': biscuitUnsplay,
  'x': biscuitJunk,
  '&': biscuitEcho,
  'h': biscuitHex,
  'm': biscuitHexnote,
  'c': biscuitCrown,
  'f': biscuitFactory,
  'i': biscuitClock,
  'k': biscuitCastle,
  'l': biscuitLeaf,
  's': biscuitLightbulb,
  'p': biscuitPerson,
  'r': biscuitMeat,
}

export default {
  name: 'CardBiscuit',

  props: {
    biscuit: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      default: 0,
    },

    classes: {
      type: Array,
      default: () => [],
    },

    inline: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ageBiscuit() {
      if (this.biscuit === '0') {
        return 10
      }
      if (this.biscuit === 'e') {
        return 11
      }
      if (this.biscuit === 'z') {
        return 0
      }
      return this.biscuit
    },

    classesComputed() {
      const base = this.classes

      if (this.kind === 'image' && this.inline) {
        base.push('inline-image')
      }

      if (this.position === 1 && this.biscuit && 'cfikls'.indexOf(this.biscuit) !== -1) {
        base.push('discover-biscuit')
      }

      return base
    },

    isAgeBiscuit() {
      return this.biscuit === 'e' || this.biscuit === 'z' || !isNaN(this.biscuit)
    },

    kind() {
      if (this.imagePath) {
        return 'image'
      }
      else if (this.isAgeBiscuit) {
        return 'inline-age'
      }
      else if (this.inline) {
        return 'inline-other'
      }
      else {
        return ''
      }
    },

    imagePath() {
      if (this.inline && !isNaN(this.biscuit)) {
        return null
      }
      else {
        return imageMap[this.biscuit]
      }
    },
  },
}
</script>


<style scoped>
.card-biscuit {
  height: 1.2em;
  width: 1.2em;
  margin-right: 2px;
  margin-bottom: 2px;
}

.card-biscuit-image {
  height: 1.2em;
  width: 1.2em;
  object-fit: fill;
}

.inline-image {
  vertical-align: text-top;
}

.age-biscuit {
  width: 1.2em;
  background-color: black;
  color: white;
  display: inline-block;
  text-align: center;
}

.discover-biscuit {
  box-shadow: 0 0 5px 1px gold;
}

</style>
