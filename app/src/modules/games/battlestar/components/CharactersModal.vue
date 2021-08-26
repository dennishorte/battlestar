<template>
<b-modal
  id="characters-modal"
  title="Characters"
  ok-only>

  <div class="row">
    <div class="col-5">
      <div
        v-for="ch in characters"
        :key="ch.name"
        :class="classes(ch.name)"
        @click="characterCloseup(ch.name)"
        >
        {{ ch.name }}
      </div>
    </div>

    <div class="col">

      <div v-if="!!selectedData">
        <div class="selected-ability">
          <div class="selected-heading">Ability</div>
          {{ selectedData.ability }}
        </div>

        <div class="selected-once-per-game">
          <div class="selected-heading">Once Per Game</div>
          {{ selectedData['once per game ability'] }}
        </div>

        <div class="selected-weakness">
          <div class="selected-heading">Weakness</div>
          {{ selectedData.weakness }}
        </div>
      </div>

      <div v-else>
        click on a character for details and menu options
      </div>
    </div>

  </div>

</b-modal>
</template>


<script>
export default {
  name: 'CharactersModal',

  props: {
    characters: Array,
  },

  computed: {
    selected() {
      return this.$store.state.bsg.charactersModal.selected
    },
    selectedData() {
      return this.characters.find(ch => ch.name === this.selected)
    },
  },

  methods: {
    characterCloseup(name) {
      this.$store.commit('bsg/character_request', name)
    },

    classes(name) {
      if (name === this.selected) {
        return 'highlighted-character'
      }
      else {
        return ''
      }
    },
  },
}
</script>


<style scoped>
.highlighted-character {
    background-color: #ddd;
    border-radius: .25em;
}

.selected-heading {
    font-weight: bold;
    margin-top: .25em;
}
</style>
