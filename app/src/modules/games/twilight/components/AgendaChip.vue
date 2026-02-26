<template>
  <div class="agenda-chip" :class="chipClass" @click.stop="showDetails">
    <span class="agenda-name">{{ agenda.name }}</span>
    <span class="agenda-type-badge" :class="typeBadgeClass">{{ agenda.type }}</span>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

export default {
  name: 'AgendaChip',

  props: {
    agendaId: { type: String, required: true },
  },

  inject: ['ui'],

  computed: {
    agenda() {
      return res.getAgendaCard(this.agendaId) || { name: this.agendaId, type: '?' }
    },

    chipClass() {
      return this.agenda.type === 'law' ? 'chip-law' : 'chip-directive'
    },

    typeBadgeClass() {
      return this.agenda.type === 'law' ? 'badge-law' : 'badge-directive'
    },
  },

  methods: {
    showDetails() {
      this.ui.modals.cardDetail.type = 'agenda'
      this.ui.modals.cardDetail.id = this.agendaId
      this.ui.modals.cardDetail.context = null
      this.$modal('twilight-card-detail').show()
    },
  },
}
</script>

<style scoped>
.agenda-chip {
  display: inline-flex;
  align-items: center;
  gap: .35em;
  padding: .3em .5em;
  border-radius: .25em;
  cursor: pointer;
  border-left: 3px solid;
  font-size: .9em;
}

.agenda-chip:hover {
  filter: brightness(0.95);
}

.chip-law {
  background: #e8eaf6;
  border-color: #3f51b5;
}

.chip-directive {
  background: #fff3e0;
  border-color: #e65100;
}

.agenda-name {
  font-weight: 600;
}

.agenda-type-badge {
  font-size: .75em;
  padding: .1em .35em;
  border-radius: .15em;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-law { background: #c5cae9; color: #283593; }
.badge-directive { background: #ffe0b2; color: #e65100; }
</style>
