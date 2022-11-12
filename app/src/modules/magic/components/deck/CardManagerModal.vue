<template>
  <Modal id="card-manager-modal">
    <template #header v-if="managedCard">
      {{ name }}
    </template>

    <template v-if="managedCard">
      <div class="wrapper">
        <div class="left-side">
          <div class="card-lock" @click="toggleCardLock">
            <i v-if="cardlock" class="bi-lock-fill"></i>
            <i v-else class="bi-unlock-fill"></i>
          </div>

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
import { mapGetters, mapState } from 'vuex'

import cardUtil from '../../util/cardUtil.js'

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

  data() {
    return {
      versionIndex: 0,
    }
  },

  computed: {
    ...mapState('magic/dm', {
      activeDeck: 'activeDeck',
      cardlock: 'cardlock',
      filteredCards: 'filteredCards',
      managedCard: 'managedCard',
    }),

    ...mapGetters('magic/dm', {
      name: 'mcName',
    }),

    mainCount() {
      if (!this.activeDeck) return 0
      return this
        .activeDeck
        .breakdown
        .main
        .filter(c => cardUtil.equals(c, this.managedCard))
        .reduce((acc, datum) => datum.count + acc, 0)
    },

    sideCount() {
      if (!this.activeDeck) return 0
      return this
        .activeDeck
        .breakdown
        .side
        .filter(c => cardUtil.equals(c, this.managedCard))
        .reduce((acc, datum) => datum.count + acc, 0)
    },

    commandCount() {
      if (!this.activeDeck) return 0
      return this
        .activeDeck
        .breakdown
        .command
        .filter(c => cardUtil.equals(c, this.managedCard))
        .reduce((acc, datum) => datum.count + acc, 0)
    },

    activeVersion() {
      return this.versions[this.versionIndex]
    },

    versions() {
      return this
        .filteredCards
        .filter(c => c.name === this.managedCard.name)
        .sort((l, r) => l === this.managedCard ? -1 : 0)
    },
  },

  methods: {
    addCard(zoneName) {
      if (zoneName === 'cmnd') zoneName = 'command'
      this.$store.dispatch('magic/dm/addCurrentCard', zoneName)
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

    toggleCardLock() {
      this.$store.dispatch('magic/dm/toggleCardLock')
    },
  },

  watch: {
    managedCard(newValue, oldValue) {
      if (newValue) {
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
