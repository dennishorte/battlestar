<template>
  <div class="player-info">

    <b-table-simple borderless small>
      <b-tbody>
        <b-tr>
          <b-th>Player Name</b-th>
          <b-td>{{ player.name }}</b-td>
        </b-tr>

        <b-tr>
          <b-th>Character</b-th>
          <b-td><CharacterLink :name="player.character" /></b-td>
        </b-tr>

        <b-tr>
          <b-th>Skill Cards</b-th>
          <b-td>{{ player.skillCards.length }}</b-td>
        </b-tr>

        <b-tr>
          <b-th>Loyalty Cards</b-th>
          <b-td>{{ player.loyaltyCards.length }}</b-td>
        </b-tr>

      </b-tbody>
    </b-table-simple>

    <div v-if="viewerIsThisPlayer">
      <div>
        <div class="heading">Skill Card Details</div>
        <b-list-group>
          <b-list-group-item
            class="skill-card-wrapper"
            v-for="(card, index) in player.skillCards"
            :key="index">
            <SkillCardLink :card="card" />
          </b-list-group-item>
        </b-list-group>
      </div>

      <div>
        <div class="heading">Loyalty Card Details</div>
        <b-card
          v-for="(card, index) in player.loyaltyCards"
          :key="index"
          :title="card.name"
          :bg-variant="card.name === 'You Are a Cylon' ? 'danger' : ''"
        >
          <b-card-text>{{ card.text }}</b-card-text>
        </b-card>
      </div>
    </div>

  </div>
</template>


<script>
import CharacterLink from './CharacterLink'
import SkillCardLink from './SkillCardLink'

export default {
  name: "PlayerInfo",

  components: {
    CharacterLink,
    SkillCardLink,
  },

  computed: {
    player() {
      const playerId = this.$store.state.bsg.ui.playerModal.playerId
      return this.$store.state.bsg.game.players.find(p => p._id === playerId)
    },
    viewerIsThisPlayer() {
      return this.player._id === this.$store.state.auth.user._id
    },
  },
}
</script>


<style scoped>
</style>
