<template>
  <ModalBase id="dune-refresh-info">
    <template #header>Imperium Row Refresh Variants</template>

    <div class="refresh-info">
      <div class="variant">
        <div class="variant-title">None (standard)</div>
        <div class="variant-desc">No extra refresh — the row only changes when a card is acquired, reserved, or otherwise removed during play.</div>
      </div>

      <div class="variant">
        <div class="variant-title">Dice</div>
        <div class="variant-desc">At round end, roll two dice. Each die matches a 1-indexed row position and removes that card. A 6 does nothing by itself; double sixes clear the entire row. Non-6 doubles remove only one card.</div>
      </div>

      <div class="variant">
        <div class="variant-title">Nuke</div>
        <div class="variant-desc">Each player gets one Nuke to use during an Acquire step, clearing and immediately refilling the entire Imperium Row.</div>
      </div>

      <div class="variant">
        <div class="variant-title">Conveyor Belt</div>
        <div class="variant-desc">New cards always enter at the front of the row. At round end, the oldest card — the one that has been at the back the longest — falls off and is discarded.</div>
      </div>
    </div>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'

export default {
  name: 'DuneRefreshInfoModal',

  components: { ModalBase },
}
</script>


<style scoped>
.refresh-info {
  font-size: .85em;
}

.variant {
  margin-bottom: .75em;
}

.variant:last-child {
  margin-bottom: 0;
}

.variant-title {
  font-weight: 600;
  color: #8b6914;
}

.variant-desc {
  color: #3a3024;
  line-height: 1.4;
}
</style>
