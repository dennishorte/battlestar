<template>
  <CardSearchModal @card-selected="importCardEmit">
    <template #header>Insert Card</template>

    <template #middle-slot>
      <select class="form-select mt-2" v-model="zoneId">
        <option v-for="zoneId in importZoneIds">{{ zoneId }}</option>
      </select>
      <input class="form-control mt-2" v-model.number="count" placeholder="count" />

      <input class="form-control mt-2" v-model="annotation" placeholder="annotation" />

      <div class="form-check mt-2">
        <input class="form-check-input" type="checkbox" v-model="isToken" />
        <label class="form-check-label">token</label>
      </div>
    </template>
  </CardSearchModal>
</template>


<script>
import { mapGetters } from 'vuex'
import { mag } from 'battlestar-common'

import CardSearchModal from '@/modules/magic/components/CardSearchModal'

export default {
  name: 'ImportCardModal',

  components: {
    CardSearchModal,
  },

  props: {
    zoneSuggestion: String,
  },

  data() {
    return {
      annotation: '',
      count: 1,
      isToken: true,
      name: '',
      zoneId: this.zoneSuggestion,

      cards: [],
      selected: null,
    }
  },

  computed: {
    ...mapGetters('magic/game', {
      importZoneIds: 'importZoneIds',
    }),

    versions() {
      const unique = []
      for (const card of this.cards) {
        if (unique.some(other => mag.util.card.playableStatsEquals(card, other))) {
          continue
        }
        else {
          unique.push(card)
        }
      }

      return unique
    },
  },

  watch: {
    zoneSuggestion(newValue) {
      this.zoneId = newValue
    },
  },

  methods: {
    checkVersions() {
      this.cards = this.$store.getters['magic/cards/getLookupFunc'](
        { name: this.name },
        { allVersions: true },
      ) || []

      if (this.cards) {
        this.selected = this.cards[0]
      }
    },

    selectVersion(card) {
      this.selected = card
    },

    importCardEmit(cardData) {
      this.$emit('import-card', {
        card: cardData,
        annotation: this.annotation,
        count: this.count,
        zoneId: this.zoneId,
        isToken: this.isToken,
      })
    },
  },
}
</script>


<style scoped>
.form-check-input {
  width: 1.5em;
  height: 1.5em;
}

.form-check-label {
  font-size: 1.2em;
  margin-left: .25em;
}

.versions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.versions-list {
  min-width: 0;
}

.version-text {
  overflow-x: hidden;
  white-space: nowrap;
  padding: 0 .25em;
}

.version-selected {
  background-color: #7df;
}
</style>
