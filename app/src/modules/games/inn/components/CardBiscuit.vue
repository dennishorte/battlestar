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
  '1': require('@/assets/img/old/biscuit-bonus-1.png'),
  '2': require('@/assets/img/old/biscuit-bonus-2.png'),
  '3': require('@/assets/img/old/biscuit-bonus-3.png'),
  '4': require('@/assets/img/old/biscuit-bonus-4.png'),
  '5': require('@/assets/img/old/biscuit-bonus-5.png'),
  '6': require('@/assets/img/old/biscuit-bonus-6.png'),
  '7': require('@/assets/img/old/biscuit-bonus-7.png'),
  '8': require('@/assets/img/old/biscuit-bonus-8.png'),
  '9': require('@/assets/img/old/biscuit-bonus-9.png'),
  'a': require('@/assets/img/old/biscuit-bonus-10.png'),
  'b': require('@/assets/img/old/biscuit-bonus-11.png'),

  ':': require('@/assets/img/old/biscuit-blackflag.png'),
  ';': require('@/assets/img/old/biscuit-whiteflag.png'),
  '+': require('@/assets/img/old/biscuit-plus.png'),
  '<': require('@/assets/img/old/biscuit-left.png'),
  '>': require('@/assets/img/old/biscuit-right.png'),
  '^': require('@/assets/img/old/biscuit-up.png'),

  '&': require('@/assets/img/old/biscuit-echo.png'),
  '*': require('@/assets/img/old/biscuit-inspire.png'),

  'h': require('@/assets/img/old/biscuit-hex.png'),
  'm': require('@/assets/img/old/biscuit-hexnote.png'),

  'c': require('@/assets/img/old/biscuit-crown.png'),
  'f': require('@/assets/img/old/biscuit-factory.png'),
  'i': require('@/assets/img/old/biscuit-clock.png'),
  'k': require('@/assets/img/old/biscuit-castle.png'),
  'l': require('@/assets/img/old/biscuit-leaf.png'),
  's': require('@/assets/img/old/biscuit-lightbulb.png'),
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

      if (this.slot === 1 && this.biscuit && 'cfikls'.indexOf(this.biscuit) !== -1) {
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
