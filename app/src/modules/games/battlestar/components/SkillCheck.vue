<template>
  <div class="skill-check">

    <div v-show="showTitle" class="heading">
      {{ data.name }}
    </div>

    <div class="skill">
      <div>
        <span class="heading">Skills:</span>

        <span v-for="skill in data.skills" :key="skill">
          <SkillLink :skillName="skill" />
        </span>
      </div>
    </div>

    <div class="outcomes">
      <div class="outcome-group">
        <div class="heading">{{ data.passValue }}+</div>
        <div class="outcome">
          {{ data.passEffect }}
        </div>
      </div>

      <template v-if="data.partialValue">
        <div class="outcome-group">
          <div class="heading">{{ data.partialValue }}+</div>
          <div class="outcome">
            {{ data.partialEffect }}
          </div>
        </div>
      </template>

      <div class="outcome-group">
        <div class="heading">fail</div>
        <div class="outcome">
          {{ data.failEffect }}
        </div>
      </div>
    </div>

    <div class="flags">
      <div v-if="data.investigativeCommittee" class="special-effect">
        <CardLink :card="investigativeCommitteeCard()" />
      </div>
      <div v-if="data.scientificResearch" class="special-effect">
        <CardLink :card="scientificResearchCard()" />
      </div>
    </div>

    <div v-if="data.investigativeCommittee">
      <DeckZone name="Face-up Cards" deckName="crisisPool" :expanded="true" />
    </div>

  </div>
</template>


<script>
import CardLink from './CardLink'
import DeckZone from './DeckZone'
import SkillLink from './SkillLink'

import { bsg } from 'battlestar-common'

export default {
  name: 'SkillCheck',

  components: {
    CardLink,
    DeckZone,
    SkillLink,
  },

  props: {
    data: Object,
    showTitle: Boolean,
  },

  data() {
    return {
      skillList: bsg.util.skillList,
    }
  },

  computed: {
    crisisPoolCards() {
      return this.$game.getZoneByName('crisisPool').cards
    },
  },

  methods: {
    investigativeCommitteeCard() {
      const card = this
        .$game
        .data
        .filtered
        .skillCards
        .find(c => c.name === 'Investigative Committee')

      card.kind = 'skill'
      return card
    },

    scientificResearchCard() {
      const card = this
        .$game
        .data
        .filtered
        .skillCards
        .find(c => c.name === 'Scientific Research')

      card.kind = 'skill'
      return card
    },
  },
}
</script>


<style scoped>
.heading {
  min-width: 3em;
}

.outcome-group {
  display: flex;
  flex-direction: row;
}

.special-effect {
  margin: .25em;
  padding: .25em;
  padding-bottom: .2em;
  border-radius: .25em;
  background-color: #FFEBCD;
  border: 1px solid #DEB887;
  text-align: center;
}
</style>
