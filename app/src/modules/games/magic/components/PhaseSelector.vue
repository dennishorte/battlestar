<template>
  <div class="phase-selector">

    <div class="section">
      <div class="section-heading">Actions</div>
      <div class="section-element">pass priority</div>
    </div>

    <div class="section">
      <div class="section-heading">Beginning</div>
      <div class="section-element">start turn</div>
      <div class="section-element">untap</div>
      <div class="section-element">upkeep</div>
      <div class="section-element">draw</div>
    </div>

    <div class="section">
      <div class="section-heading">Pre-Combat</div>
      <div class="section-element">main 1</div>
    </div>

    <div class="section">
      <div class="section-heading">Combat</div>
      <div class="section-element">begin</div>
      <div class="section-element">attackers</div>
      <div class="section-element">blockers</div>
      <div class="section-element">damage</div>
      <div class="section-element">end</div>
    </div>

    <div class="section">
      <div class="section-heading">Post-Combat</div>
      <div class="section-element">main 2</div>
    </div>

    <div class="section">
      <div class="section-heading">Ending</div>
      <div class="section-element">end</div>
    </div>

  </div>
</template>


<script>
export default {
  name: 'PhaseSelector',
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

.section-element {
  font-size: 1.1em;
}
</style>
