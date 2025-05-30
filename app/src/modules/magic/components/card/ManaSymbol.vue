<template>
  <i v-if="valid" class="ms ms-cost" :class="manaClasses"/>
  <span v-else>{{ m }}</span>
</template>


<script>
import { util } from 'battlestar-common'

export default {
  name: 'ManaSymbol',

  props: {
    m: {
      type: String,
      default: ''
    },
  },

  computed: {
    manaClasses() {
      if (this.valid) {
        const lower = this.convertToManaFontSymbol(this.m.toLowerCase())
        return `ms-${lower}`
      }
      else {
        return undefined
      }
    },

    valid() {
      return Boolean(this.m)
    },
  },

  methods: {
    convertToManaFontSymbol(text) {
      if (text == '1/2') {
        return 'half'
      }
      else {
        text = text.replace('/', '').toLowerCase().trim()

        if (text == 't') {
          return 'tap'
        }
        else if (text == 'q') {
          return 'untap'
        }
        else if (text == 'inf') {
          return 'infinity'
        }
        else {
          if (['uw', 'wg', 'gr', 'rb', 'bu', 'w2', 'u2', 'b2', 'r2', 'g2'].indexOf(text) >= 0) {
            text = util.stringReverse(text)
          }

          return text
        }
      }
    },
  },
}
</script>


<style scoped>
i {
  margin-left: 0!important;  /* This overrides bootstrap margin start classes (eg. ms-1) */
}
</style>
