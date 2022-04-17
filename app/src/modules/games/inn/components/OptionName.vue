<template>
  <span class="option-name">
    <CardNameFull
      v-if="isCard"
      :name="displayName"
      class="option-card-name"
    />

    <span v-else>
      {{ displayName }}
    </span>
  </span>
</template>


<script>
import CardNameFull from './CardNameFull'

export default {
  name: 'OptionName',

  components: {
    CardNameFull,
  },

  inject: ['game'],

  props: {
    option: [Object, String]
  },

  computed: {
    isCard() {
      return !!this.game.getCardByName(this.option, '')
    },

    displayName() {
      return this.option.title ? this.option.title : this.option
    },
  },
}
</script>


<style scoped>
.option-card-name {
  font-size: 1.1em;
  margin-left: .2em;
}
</style>
