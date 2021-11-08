<template>
  <div class="row">
    <div class="col-5">
      <div
        v-for="ch in characters"
        :key="ch.name"
        class="character-name"
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

        <div>
          <div class="selected-heading">Starting Location</div>
          {{ selectedData.setup }}
        </div>
      </div>

      <div v-else>
        click on a character for details and menu options
      </div>
    </div>

  </div>
</template>


<script>
import { bsg, util } from 'battlestar-common'


export default {
  name: 'Characters',

  data() {
    return {
      skillList: bsg.util.skillList,
    }
  },

  computed: {
    characters() {
      const characters = util.deepcopy(this.$game.data.filtered.characterCards)
      characters.sort((l, r) => l.name.localeCompare(r.name))
      return characters
    },
    players() {
      return this.$game.getPlayerAll()
    },
    selected() {
      return this.$game.ui.modal.characters
    },
    selectedData() {
      return this.characters.find(ch => ch.name === this.selected)
    },
  },

  methods: {
    assign(playerName) {
      console.log('assignCharacter', {
        characterName: this.selectedData.name,
        playerName: playerName,
      })
    },

    characterCloseup(name) {
      this.$game.ui.modal.characters = name
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
.character-name {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: .85em;
  line-height: 1;
  padding: .25em;

  min-height: 2rem;
}

.highlighted-character {
  border: 1px solid black;
  border-radius: .25em;
}

.selected-heading {
    font-weight: bold;
    margin-top: .25em;
}
</style>
