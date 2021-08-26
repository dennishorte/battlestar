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
        <div class="selected-role">
          <span class="selected-heading">Role: </span>{{ selectedData.role }}
        </div>

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

        <div class="selected-skill-cards">
          <div class="selected-heading">Skills</div>
          <template v-for="skill in skillList">
            <div v-if="!!selectedData[skill]" :key="skill">
              {{ skill }}: {{ selectedData[skill] }}
            </div>
          </template>
        </div>

        <div class="selected-succession">
          <div class="selected-heading">Succession</div>
          <div>Admiral: {{ selectedData["admiral line of succession order"] }}</div>
          <div>President: {{ selectedData["president line of succession order"] }}</div>
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

const skillList = [
  'politics',
  'leadership',
  'tactics',
  'piloting',
  'engineering',
  'treachery',
]

export default {
  name: 'CharactersModal',

  props: {
    characters: Array,
  },

  data() {
    return {
      skillList,
    }
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
