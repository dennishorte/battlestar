<template>
  <div class="zone-viewer">
    <div>
      <span class="heading">name:</span>
      {{ zone.name }}
    </div>

    <div>
      <span class="heading">visibility:</span>
      {{ zone.visibility }}
    </div>

    <div class="action-buttons mt-2">
      <b-button @click="viewNext">view next</b-button>
      <b-button @click="revealNext">reveal next</b-button>
      <b-dropdown right text="other">
        <b-dropdown-item @click="shuffle">
          shuffle
        </b-dropdown-item>

        <b-dropdown-divider></b-dropdown-divider>

        <b-dropdown-item @click="revealAll">
          reveal all
        </b-dropdown-item>
        <b-dropdown-item @click="viewAll">
          view all
        </b-dropdown-item>
      </b-dropdown>
    </div>


    <b-list-group class="mt-2">
      <b-list-group-item
        v-for="(card, index) in cardListItems"
        :key="card.id"
        class="card-list-item"
      >
        <template v-if="card.hidden">
          <div>
            {{ index }}.
            <em>hidden</em>
          </div>
          <b-badge>{{ card.count }}</b-badge>
        </template>

        <template v-else>
          {{ index }}.
          {{ card.name }}
        </template>
      </b-list-group-item>
    </b-list-group>

  </div>
</template>


<script>
export default {
  name: 'ZoneViewer',

  props: {
    zoneName: String,
  },

  computed: {
    cards() {
      return this.zone.cards || []
    },

    cardListItems() {
      const items = [{
          name: 'sentinel',
      }]

      for (const card of this.cards) {
        if (this.$game.checkCardIsVisible(card)) {
          items.push(card)
        }
        else if (items[items.length - 1].hidden) {
          items.[items.length - 1].count += 1
        }
        else {
          items.push({
            hidden: true,
            count: 1,
          })
        }
      }

      // Remove the sentinel
      items.shift()

      return items
    },

    zone() {
      return this.$game.getZoneByName(this.zoneName)
    },
  },

  methods: {
    revealAll() {
      console.log('zone reveal all')
    },
    revealNext() {
      console.log('zone reveal next')
    },
    shuffle() {
      console.log('zone shuffle')
    },
    viewAll() {
      console.log('zone view all')
    },
    viewNext() {
      console.log('zone view next')
    }
  },
}
</script>


<style scoped>
.action-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.card-list-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
