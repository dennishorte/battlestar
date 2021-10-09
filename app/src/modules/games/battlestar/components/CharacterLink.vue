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
      this.$game.ui.modal.characters = this.name
      this.$bvModal.show('characters-modal')
    }
  },
}
</script>
