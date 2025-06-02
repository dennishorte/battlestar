<template>
  <div class="phase-selector">

    <div class="section">
      <div class="section-heading">Undo</div>
      <div class="phase-button" @click="undo">undo</div>
    </div>

    <div class="section">
      <div class="section-heading">Actions</div>
      <div class="phase-button" @click="passPriority">pass&nbsp;priority</div>
      <div class="phase-button" @click="saveGame">save</div>
    </div>

    <div class="section">
      <div class="section-heading beginning-heading">
        <div>Beginning</div>
        <div @click="fastBeginning">
          <i class="bi bi-star-fill"/>
        </div>
      </div>
      <PhaseButton name="start turn" />
      <PhaseButton name="untap" />
      <PhaseButton name="upkeep" />
      <PhaseButton name="draw" />
    </div>

    <div class="section">
      <div class="section-heading">Pre-Combat</div>
      <PhaseButton name="main 1" />
    </div>

    <div class="section">
      <div class="section-heading">Combat</div>
      <PhaseButton name="c begin" />
      <PhaseButton name="attackers" />
      <PhaseButton name="blockers" />
      <PhaseButton name="damage" />
      <PhaseButton name="c end" />
    </div>

    <div class="section">
      <div class="section-heading">Post-Combat</div>
      <PhaseButton name="main 2" />
    </div>

    <div class="section">
      <div class="section-heading">Ending</div>
      <PhaseButton name="end" />
      <div class="phase-button" @click="passPriority">pass&nbsp;priority</div>
    </div>

  </div>
</template>


<script>
import PhaseButton from './PhaseButton'


export default {
  name: 'PhaseSelector',

  components: {
    PhaseButton,
  },

  inject: ['actor', 'game', 'do'],

  computed: {
    player() {
      return this.game.players.byName(this.actor.name)
    },
  },

  methods: {
    fastBeginning() {
      this.do(null, { name: 'select phase', phase: 'start turn' })
      this.do(null, { name: 'select phase', phase: 'untap' })
      this.do(null, { name: 'select phase', phase: 'upkeep' })
      this.do(null, { name: 'select phase', phase: 'draw' })
      this.do(null, { name: 'select phase', phase: 'main 1' })
    },

    passPriority() {
      this.do(null, { name: 'pass priority' })
      this.saveGame()
    },

    saveGame() {
      this.$store.dispatch('game/save')
    },

    undo() {
      this.game.undo()
    },
  },
}
</script>


<style scoped>
.beginning-heading {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.phase-button {
  font-size: 1.1em;
}

.phase-selector {
  color: var(--bs-secondary);
}

.section {
  background-color: var(--not-as-light);
  padding: .5em;
  border: 1px solid var(--bs-secondary);
  margin-bottom: .25em;
  border-radius: .25em;
}

.section-heading {
  font-size: .6em;
  border-bottom: 1px solid var(--bs-secondary);
}
</style>
