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
import biscuitBonus1 from '@/assets/img/old/biscuit-bonus-1.png'
import biscuitBonus2 from '@/assets/img/old/biscuit-bonus-2.png'
import biscuitBonus3 from '@/assets/img/old/biscuit-bonus-3.png'
import biscuitBonus4 from '@/assets/img/old/biscuit-bonus-4.png'
import biscuitBonus5 from '@/assets/img/old/biscuit-bonus-5.png'
import biscuitBonus6 from '@/assets/img/old/biscuit-bonus-6.png'
import biscuitBonus7 from '@/assets/img/old/biscuit-bonus-7.png'
import biscuitBonus8 from '@/assets/img/old/biscuit-bonus-8.png'
import biscuitBonus9 from '@/assets/img/old/biscuit-bonus-9.png'
import biscuitBonus10 from '@/assets/img/old/biscuit-bonus-10.png'
import biscuitBonus11 from '@/assets/img/old/biscuit-bonus-11.png'
import biscuitBonus12 from '@/assets/img/old/biscuit-bonus-12.png'
import biscuitBlackflag from '@/assets/img/old/biscuit-blackflag.png'
import biscuitWhiteflag from '@/assets/img/old/biscuit-whiteflag.png'
import biscuitPlus from '@/assets/img/old/biscuit-plus.png'
import biscuitLeft from '@/assets/img/old/biscuit-left.png'
import biscuitRight from '@/assets/img/old/biscuit-right.png'
import biscuitUp from '@/assets/img/old/biscuit-up.png'
import biscuitEcho from '@/assets/img/old/biscuit-echo.png'
import biscuitInspire from '@/assets/img/old/biscuit-inspire.png'
import biscuitHex from '@/assets/img/old/biscuit-hex.png'
import biscuitHexnote from '@/assets/img/old/biscuit-hexnote.png'
import biscuitCrown from '@/assets/img/old/biscuit-crown.png'
import biscuitFactory from '@/assets/img/old/biscuit-factory.png'
import biscuitClock from '@/assets/img/old/biscuit-clock.png'
import biscuitCastle from '@/assets/img/old/biscuit-castle.png'
import biscuitLeaf from '@/assets/img/old/biscuit-leaf.png'
import biscuitLightbulb from '@/assets/img/old/biscuit-lightbulb.png'

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
  ':': biscuitBlackflag,
  ';': biscuitWhiteflag,
  '+': biscuitPlus,
  '<': biscuitLeft,
  '>': biscuitRight,
  '^': biscuitUp,
  '&': biscuitEcho,
  '*': biscuitInspire,
  'h': biscuitHex,
  'm': biscuitHexnote,
  'c': biscuitCrown,
  'f': biscuitFactory,
  'i': biscuitClock,
  'k': biscuitCastle,
  'l': biscuitLeaf,
  's': biscuitLightbulb,
}

export default {
  name: 'CardBiscuit',

  props: {
    biscuit: {
      type: String,
      required: true,
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
      return this.biscuit === '0' ? '10' : this.biscuit
    },

    classesComputed() {
      const base = this.classes

      if (this.kind === 'image' && this.inline) {
        base.push('inline-image')
      }

      if (this.biscuit === '*') {
        base.push('inspire-biscuit')
      }

      if (this.position === 1 && this.biscuit && 'cfikls'.indexOf(this.biscuit) !== -1) {
        base.push('discover-biscuit')
      }

      return base
    },

    kind() {
      if (this.imagePath) {
        return 'image'
      }
      else if (this.inline) {
        if (isNaN(this.biscuit)) {
          return 'inline-other'
        }
        else {
          return 'inline-age'
        }
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

.inspire-biscuit {
  border: 1px solid darkgray;
  border-radius: 50%;
}

.discover-biscuit {
  box-shadow: 0 0 5px 1px gold;
}

</style>
