<template>
  <b-modal
    id="card-modal"
    title="Card Viewer"
    ok-only>

    <CrisisCard v-if="card.kind === 'crisis'" :card="card" />
    <SkillCard v-if="card.kind === 'skill'" :card="card" />

    <div v-else-if="card.kind === 'player-token'">
      <p><span class="heading">Name:</span> {{ card.name }}</p>
      <p>This is a player token. It is used to represent the location of {{ card.name }}. It has no other interesting properties.</p>
    </div>

    <div v-else>
      Unsupported Card Kind
      <b-table :items="cardProps">
      </b-table>

    </div>

  </b-modal>
</template>


<script>
import CrisisCard from './CrisisCard'
import SkillCard from './SkillCard'

export default {
  name: 'CardInfoModal',

  components: {
    CrisisCard,
    SkillCard,
  },

  computed: {
    card() {
      return this.$game.ui.modal.cardInfo
    },
    cardName() {
      return this.card.name ? this.card.name : 'No Card'
    },
    cardProps() {
      if (!this.card)
        return []

      return Object.entries(this.card)
    },
  },
}
</script>
