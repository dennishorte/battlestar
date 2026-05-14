<template>
  <ModalBase id="dune-shield-wall-modal">
    <template #header>Shield Wall</template>

    <div class="shield-wall-modal">
      <div class="status-line" :class="intact ? 'status-intact' : 'status-destroyed'">
        <span class="shield-icon">{{ intact ? '\u{1F6E1}' : '\u{1F4A5}' }}</span>
        <span>{{ intact ? 'Intact' : 'Destroyed' }}</span>
      </div>

      <p>
        The Shield Wall is a fortification that protects three locations on Arrakis. It
        begins each game intact and remains in effect until it is destroyed, at which
        point it stays destroyed for the rest of the game.
      </p>

      <h3>While intact, it protects:</h3>
      <ul>
        <li v-for="space in protectedSpaces" :key="space.id">{{ space.name }}</li>
      </ul>
      <p>
        Sandworms cannot be summoned to a conflict at a protected location, and the
        Maker Hook option of effects targeting those locations is disabled.
      </p>

      <h3>How to destroy it:</h3>
      <ul>
        <li>
          <strong>Sietch Tabr</strong> — agent space (requires 2 Fremen influence);
          choose the &ldquo;1 water, break Shield Wall&rdquo; option.
        </li>
        <li v-for="card in breakerCards" :key="card.id">
          <strong>{{ card.name }}</strong> <span class="card-kind">({{ card.kind }})</span>
        </li>
      </ul>
    </div>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'
import { dune } from 'battlestar-common'

const BREAKER_CARDS = [
  { id: 'arrakis-revolt',    name: 'Arrakis Revolt',    kind: 'Imperium' },
  { id: 'forbidden-weapons', name: 'Forbidden Weapons', kind: 'Tech' },
  { id: 'detonation',        name: 'Detonation',        kind: 'Intrigue' },
  { id: 'special-mission',   name: 'Special Mission',   kind: 'Intrigue' },
  { id: 'unexpected-allies', name: 'Unexpected Allies', kind: 'Intrigue' },
]

export default {
  name: 'DuneShieldWallModal',

  components: { ModalBase },

  inject: ['game'],

  computed: {
    intact() {
      return !!this.game.state.shieldWall
    },

    protectedSpaces() {
      return dune.res.boardSpaces.filter(s => s.isProtected)
    },

    breakerCards() {
      return BREAKER_CARDS
    },
  },
}
</script>


<style scoped>
.shield-wall-modal {
  font-size: .9em;
  line-height: 1.5;
  color: #2c2416;
}

.status-line {
  display: inline-flex;
  align-items: center;
  gap: .5em;
  padding: .35em .75em;
  border-radius: .3em;
  font-weight: 600;
  margin-bottom: .75em;
}

.status-intact {
  background: #e8f0e0;
  color: #3a6b1f;
  border: 1px solid #b8d09a;
}

.status-destroyed {
  background: #f8e0e0;
  color: #8b2a2a;
  border: 1px solid #d4a0a0;
}

.shield-icon {
  font-size: 1.1em;
}

h3 {
  font-size: 1em;
  font-weight: 700;
  margin: .75em 0 .25em;
  color: #8b6914;
}

ul {
  margin: .25em 0 .5em 1.25em;
  padding: 0;
}

li {
  margin-bottom: .2em;
}

.card-kind {
  color: #8a7a62;
  font-size: .9em;
}

:deep(.modal-dialog) {
  max-width: 480px;
}
</style>
