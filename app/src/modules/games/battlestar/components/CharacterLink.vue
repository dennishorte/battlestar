<template>
<span :class="classes" @click="openCharacterInfo()">
  {{ name }}
</span>
</template>


<script>
import util from '../util.js'

export default {
  name: 'CharacterLink',

  props: {
    name: String,
  },

  computed: {
    classes() {
      return ['character-link', util.characterNameToCssClass(this.name)]
    },
  },

  methods: {
    openCharacterInfo() {
      this.$store.commit('bsg/character_request', this.name)
      this.$bvModal.show('characters-modal')
    }
  },
}
</script>
