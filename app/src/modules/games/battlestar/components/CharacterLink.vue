<template>
<span :class="classes" @click="openCharacterInfo()">
  {{ name }}
</span>
</template>


<script>
import bsgutil from '../lib/util.js'

export default {
  name: 'CharacterLink',

  props: {
    name: String,
  },

  computed: {
    classes() {
      return ['character-link', bsgutil.characterNameToCssClass(this.name)]
    },
  },

  methods: {
    openCharacterInfo() {
      this.$store.commit('bsg/character_info_request', this.name)
      this.$bvModal.show('characters-modal')
    }
  },
}
</script>
