<template>
<span :class="classes" @click="openCharacterInfo()">
  {{ name }}
</span>
</template>


<script>
export default {
  name: 'CharacterLink',

  props: {
    name: String,
  },

  computed: {
    classes() {
      return ['character-link']
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
