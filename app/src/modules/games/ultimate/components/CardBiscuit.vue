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
const imageMap = {
  '1': require('@/assets/img/biscuit-bonus-1.png'),
  '2': require('@/assets/img/biscuit-bonus-2.png'),
  '3': require('@/assets/img/biscuit-bonus-3.png'),
  '4': require('@/assets/img/biscuit-bonus-4.png'),
  '5': require('@/assets/img/biscuit-bonus-5.png'),
  '6': require('@/assets/img/biscuit-bonus-6.png'),
  '7': require('@/assets/img/biscuit-bonus-7.png'),
  '8': require('@/assets/img/biscuit-bonus-8.png'),
  '9': require('@/assets/img/biscuit-bonus-9.png'),
  'a': require('@/assets/img/biscuit-bonus-10.png'),
  'b': require('@/assets/img/biscuit-bonus-11.png'),

  ':': require('@/assets/img/biscuit-blackflag.png'),
  ';': require('@/assets/img/biscuit-whiteflag.png'),
  '+': require('@/assets/img/biscuit-plus.png'),
  '<': require('@/assets/img/biscuit-left.png'),
  '>': require('@/assets/img/biscuit-right.png'),
  '^': require('@/assets/img/biscuit-up.png'),
  '/': require('@/assets/img/biscuit-aslant.png'),

  '&': require('@/assets/img/biscuit-echo.png'),
  '*': require('@/assets/img/biscuit-inspire.png'),

  'h': require('@/assets/img/biscuit-hex.png'),
  'm': require('@/assets/img/biscuit-hexnote.png'),

  'c': require('@/assets/img/biscuit-crown.png'),
  'f': require('@/assets/img/biscuit-factory.png'),
  'i': require('@/assets/img/biscuit-clock.png'),
  'k': require('@/assets/img/biscuit-castle.png'),
  'l': require('@/assets/img/biscuit-leaf.png'),
  's': require('@/assets/img/biscuit-lightbulb.png'),
  'p': require('@/assets/img/biscuit-person.png'),
  'r': require('@/assets/img/biscuit-meat.png'),      // r = raw meat
}

export default {
  name: 'CardBiscuit',

  props: {
    biscuit: String,
    slot: Number,

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
      if (this.biscuit === '0') return 10
      if (this.biscuit === 'e') return 11
      return this.biscuit
    },

    classesComputed() {
      const base = this.classes

      if (this.kind === 'image' && this.inline) {
        base.push('inline-image')
      }

      if (this.biscuit === '*') {
        base.push('inspire-biscuit')
      }

      if (this.slot === 1 && this.biscuit && 'cfikls'.indexOf(this.biscuit) !== -1) {
        base.push('discover-biscuit')
      }

      return base
    },

    isAgeBiscuit() {
      return this.biscuit === 'e' || !isNaN(this.biscuit)
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

.inspire-biscuit {
  border: 1px solid darkgray;
  border-radius: 50%;
}

.discover-biscuit {
  box-shadow: 0 0 5px 1px gold;
}

</style>
