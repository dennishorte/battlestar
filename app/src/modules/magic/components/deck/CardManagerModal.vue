<template>
  <Modal id="card-manager-modal">
    <template #header v-if="card">
      {{ card.name }}
    </template>

    <template v-if="card">
      <div class="wrapper">
        <div class="left-side">
          <template v-if="activeDeck">
            <CardManagerButtonGroup
              name="main"
              variant="primary"
              :count="mainCount"
              @add-card="addCard"
              @remove-card="removeCard"
            />

            <CardManagerButtonGroup
              name="side"
              variant="info"
              :count="sideCount"
              @add-card="addCard"
              @remove-card="removeCard"
            />

            <CardManagerButtonGroup
              name="cmnd"
              variant="success"
              :count="commandCount"
              @add-card="addCard"
              @remove-card="removeCard"
            />
          </template>
        </div>

        <div class="right-side">
          <Card :card="activeVersion" />

          <div class="versions">
            <div
              v-for="(card, index) in versions"
              @click="setVersionIndex(index)"
              class="version-indicator"
              :class="index === versionIndex ? 'highlight-version-indicator': ''"
            >{{ index }}</div>
          </div>

          <button @click="prevVersion" class="btn btn-sm btn-primary">&lt;</button>
          <button @click="nextVersion" class="btn btn-sm btn-primary">&gt;</button>

        </div>
      </div>
    </template>
  </Modal>
</template>


<script>
import { mag } from 'battlestar-common'
import { mapGetters, mapState } from 'vuex'

import Card from '../Card'
import CardManagerButtonGroup from './CardManagerButtonGroup'
import Modal from '@/components/Modal'


export default {
  name: 'CardManagerModal',

  components: {
    Card,
    CardManagerButtonGroup,
    Modal,
  },

  props: {
    cardlist: Array,
  },

  data() {
    return {
      versionIndex: 0,
    }
  },

  computed: {
    ...mapState('magic/dm', {
      activeDeck: 'activeDeck',
      card: state => state.cardManager.card,
      source: state => state.cardManager.source,
    }),

    mainCount() { return this.count('main') },
    sideCount() { return this.count('side') },
    commandCount() { return this.count('command') },

    activeVersion() {
      return this.versions[this.versionIndex]
    },

    versions() {
      return this
        .cardlist
        .filter(c => c.name === this.card.name)
        .sort((l, r) => l === this.card ? -1 : 0)
    },
  },

  methods: {
    addCard(zoneName) {
      if (zoneName === 'cmnd') zoneName = 'command'
      this.$store.dispatch('magic/dm/addCurrentCard', zoneName)
    },

    count(zoneName) {
      if (!this.activeDeck) return 0
      return this
        .activeDeck
        .cardlist
        .filter(c => c.zone === zoneName && mag.util.card.softEquals(c, this.card))
        .length
    },

    nextVersion() {
      this.versionIndex = (this.versionIndex + 1) % this.versions.length
    },

    prevVersion() {
      this.versionIndex = (this.versionIndex + this.versions.length - 1) % this.versions.length
    },

    removeCard(zoneName) {
      if (zoneName === 'cmnd') zoneName = 'command'
      this.$store.dispatch('magic/dm/removeCurrentCard', zoneName)
    },

    setVersionIndex(index) {
      this.versionIndex = index
    },
  },

  watch: {
    card(newValue, oldValue) {
      if (newValue && oldValue) {
        this.versionIndex = 0
      }
      else if (newValue) {
        this.versionIndex = 0
        this.$modal('card-manager-modal').show()
      }
      else {
        this.$modal('card-manager-modal').hide()
      }
    },
  },

  mounted() {
    // Whenever the card management modal is closed, clear the state regarding the managed card.
    document
      .getElementById('card-manager-modal')
      .addEventListener('hidden.bs.modal', () => {
        this.$store.dispatch('magic/dm/unmanageCard')
      })
  },
}
</script>


<style scoped>
.card-lock {
  width: 1.8em;
  height: 1.8em;
  border: 1px solid black;
  border-radius: .25em;
  float: right;
  text-align: center;
}

.version-indicator {
  font-size: .6em;
  min-width: 1.4em;
  max-width: 1.4em;
  min-height: 1.4em;
  max-height: 1.4em;
  margin-right: .25em;
  margin-bottom: .25em;
  text-align: center;
}

.highlight-version-indicator {
  background-color: lightblue;
  border-radius: 50%;
}

.right-side {
  overflow: scroll;
}

.versions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}
</style>
