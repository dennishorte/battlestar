<template>
  <div class="phase-selector">

    <div class="section">
      <div class="section-heading">Actions</div>
      <div class="phase-selector-element">pass priority</div>
    </div>

    <div class="section">
      <div class="section-heading">Beginning</div>
      <div class="phase-selector-element">start turn</div>
      <div class="phase-selector-element">untap</div>
      <div class="phase-selector-element">upkeep</div>
      <div class="phase-selector-element">draw</div>
    </div>

    <div class="section">
      <div class="section-heading">Pre-Combat</div>
      <div class="phase-selector-element">main 1</div>
    </div>

    <div class="section">
      <div class="section-heading">Combat</div>
      <div class="phase-selector-element">c begin</div>
      <div class="phase-selector-element">attackers</div>
      <div class="phase-selector-element">blockers</div>
      <div class="phase-selector-element">damage</div>
      <div class="phase-selector-element">c end</div>
    </div>

    <div class="section">
      <div class="section-heading">Post-Combat</div>
      <div class="phase-selector-element">main 2</div>
    </div>

    <div class="section">
      <div class="section-heading">Ending</div>
      <div class="phase-selector-element">end</div>
    </div>

  </div>
</template>


<script>
export default {
  name: 'PhaseSelector',

  inject: ['actor', 'game', 'save'],

  computed: {
    player() {
      return this.game.getPlayerByName(this.actor.name)
    },
  },

  methods: {
    passPriority() {
      this.game.aPassPriority()
      this.save()
    },
  },

  mounted() {
    document
      .querySelectorAll('.phase-selector-element')
      .forEach(el => el.addEventListener('click', event => {
        this.game.aSelectPhase(el.textContent)
      }))
  }
}
</script>


<style scoped>
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

.phase-selector-element {
  font-size: 1.1em;
}
</style>
