<template>
  <div class="decks-container">
    <slot name="header">
      <SectionHeader>
        <div class="d-flex justify-content-between">
          <div>My Decks</div>
          <div @click="createDeck"><i class="bi bi-plus-square"/></div>
        </div>
      </SectionHeader>
    </slot>

    <div v-if="loading" class="loading">
      Loading decks...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="!decks.length" class="no-decks">
      No decks found. Create your first deck to get started.
    </div>

    <div v-else class="deck-list">
      <div v-for="deck in decks" :key="deck._id" class="deck-item">
        <div class="deck-content" @click="$emit('deck-clicked', deck._id)">
          <div class="deck-name">
            {{ deck.name }}
          </div>
          <div class="deck-format">{{ deck.format || 'Custom' }}</div>
        </div>
        <div class="deck-actions" @click.stop>
          <Dropdown :notitle="true">
            <DropdownItem @click="duplicateDeck(deck._id)">Duplicate</DropdownItem>
            <DropdownItem @click="confirmDelete(deck._id, deck.name)">Delete</DropdownItem>
          </Dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SectionHeader from '@/components/SectionHeader'
import Dropdown from '@/components/Dropdown'
import DropdownItem from '@/components/DropdownItem'

export default {
  name: 'Decks',

  components: {
    SectionHeader,
    Dropdown,
    DropdownItem,
  },

  data() {
    return {
      decks: [],
      loading: true,
      error: null
    }
  },

  methods: {
    async createDeck() {
      try {
        const { deck } = await this.$post('/api/magic/deck/create', {
          userId: this.$store.state.auth.user._id
        })

        this.$router.push(`/magic/deck/${deck._id}`)
      }
      catch (err) {
        this.error = `Error creating deck: ${err.message || 'Unknown error'}`
      }
    },

    async fetchDecks() {
      try {
        this.loading = true
        const { status, decks } = await this.$post('/api/user/magic/decks', {
          userId: this.$store.state.auth.user._id
        })

        if (status === 'success') {
          this.decks = decks
          this.error = null
        }
        else {
          this.error = 'Failed to load decks'
        }
      }
      catch (err) {
        this.error = `Error: ${err.message || 'Failed to load decks'}`
      }
      finally {
        this.loading = false
      }
    },

    confirmDelete(deckId, deckName) {
      if (confirm(`Are you sure you want to delete "${deckName}"?`)) {
        this.deleteDeck(deckId)
      }
    },

    async deleteDeck(deckId) {
      try {
        await this.$post('/api/magic/deck/delete', { deckId })
        this.fetchDecks()
      }
      catch (err) {
        this.error = `Error deleting deck: ${err.message || 'Unknown error'}`
      }
    },

    async duplicateDeck(deckId) {
      try {
        const { deck } = await this.$post('/api/magic/deck/duplicate', { deckId })
        this.$router.push(`/magic/deck/${deck._id}`)
      }
      catch (err) {
        this.error = `Error duplicating deck: ${err.message || 'Unknown error'}`
      }
    }
  },

  created() {
    this.fetchDecks()
  }
}
</script>

<style scoped>
.decks-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.loading, .error, .no-decks {
  text-align: center;
  margin: 2rem 0;
}

.error {
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 4px;
}

.no-decks {
  color: #6c757d;
  font-style: italic;
  text-align: center;
  margin: 2rem 0;
}

.deck-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.deck-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.deck-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.deck-content:hover {
  background-color: rgba(0, 123, 255, 0.05);
}

.deck-name {
  font-weight: 500;
  color: #212529;
}

.deck-format {
  font-size: 0.8rem;
  color: #6c757d;
  margin-left: 1rem;
  margin-top: -0.3rem;
}

.deck-actions {
  flex-shrink: 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.actions-container {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}
</style>
