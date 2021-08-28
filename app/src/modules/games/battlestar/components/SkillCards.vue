<template>
<b-row class="skill-cards">
  <b-col cols="5">
    <div v-for="skill in skillList" :key="skill">
      <div class="heading">{{ skill }}</div>
      <div class="card-names">
        <div
          v-for="name in sortedNames[skill]"
          :key="name"
          @click="selectCard($event, name)"
          :class="selectedName === name ? 'selected' : ''"
          class="card-name">
          {{ name }}
        </div>
      </div>
    </div>
  </b-col>

  <b-col cols="7">
    <template v-if="selectedName">
      <div class="heading">{{ selected.name }}</div>
      <div class="skill-type">{{ skillType(selected) }}</div>
      {{ selected.text }}

      <div class="distribution-caption">Card Distribution</div>
      <b-table
        :items="selectedDistributionTable"
        small
        fixed
        striped>
      </b-table>
    </template>
  </b-col>
</b-row>
</template>


<script>
import skillCardsList from '../res/skill.js'
import util from '../util.js'

export default {
  name: 'SkillCards',

  data() {
    return {
      skillCardsList,
      skillList: util.skillList,
    }
  },

  computed: {
    cardsAll() {
      const expansions = this.$store.state.bsg.game.settings.expansions
      return this.skillCardsList.filter(c => expansions.includes(c.expansion))
    },

    cardsByName() {
      const grouped = {}
      this.cardsAll.forEach(card => {
        // Insert new entry (which is just a copy of the card)
        if (!grouped[card.name]) {
          grouped[card.name] = util.deepcopy(card)
          delete grouped[card.name]['value']
          grouped[card.name].distribution = [null, 0, 0, 0, 0, 0, 0]
        }

        // Add this card to the distribution for this card name
        grouped[card.name].distribution[card.value] += 1
      })
      return grouped
    },

    selected() {
      return this.cardsByName[this.selectedName]
    },

    selectedDistributionTable() {
      if (this.selected) {
        const dist = {}
        for (let i = 1; i <= 6; i++) {
          dist[i] = this.selected.distribution[i]
        }
        return [dist]
      }
      else {
        return []
      }
    },

    selectedName() {
      return this.$store.state.bsg.ui.skillCardsModal.selected
    },

    sortedNames() {
      const sorted = {}
      util.skillList.forEach(skill => {
        sorted[skill] = Object.values(this.cardsByName)
          .filter(c => c[skill])
          .map(c => c.name)
          .sort()
      })
      return sorted
    },
  },

  methods: {
    selectCard(event, name) {
      this.$store.commit('bsg/skillCardInfoRequest', name)
    },

    skillType(card) {
      if (card.politics) return 'politics'
      if (card.leadership) return 'leadership'
      if (card.tactics) return 'tactics'
      if (card.piloting) return 'piloting'
      if (card.engineering) return 'engineering'
      if (card.treachery) return 'treachery'
      return 'UNKNOWN'
    },
  },
}
</script>


<style scoped>
.card-name {
    overflow: hidden;
    height: 1.5em;
}

.card-names {
    font-size: .8em;
    padding-left: .25em;
}

.distribution-caption {
    margin-top: .5em;
    margin-bottom: 0;
    font-size: .8em;
    color: #777;
}

.selected {
    background-color: #ddd;
    border-radius: .25em;
}

.skill-type {
    margin-left: .5em;
    font-size: .8em;
    margin-top: -.25em;
}
</style>
