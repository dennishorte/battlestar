<template>
  <div class="zones">

    <b-row>
      <b-col>

        <div class="heading">
          Players
        </div>
        <div
          v-for="name in playerNames"
          :key="name"
        >
          <DeckZone
            :name="name"
            :deck-name="`players.${name}`"
            :expanded="true"
          />
        </div>

      </b-col>
      <b-col>

        <div class="heading">
          Skill Decks
        </div>
        <div
          v-for="name in skillList"
          :key="name"
        >
          <DeckZone
            :name="name"
            :deck-name="`decks.${name}`"
            :variant="name"
          />
        </div>

      </b-col>
    </b-row>

    <b-row>
      <b-col>

        <div class="heading">
          Open
        </div>
        <DeckZone name="Common" deck-name="common" :expanded="true" />
        <DeckZone name="Exile" deck-name="exile" />

      </b-col>
      <b-col>

        <div class="heading">
          Quorum
        </div>
        <DeckZone name="Quroum Deck" deck-name="decks.quorum" />

      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <div class="heading">
          Crisis
        </div>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <DeckZone name="Crisis Deck" deck-name="decks.crisis" />
        <DeckZone name="Super Crisis" deck-name="decks.superCrisis" />
      </b-col>
      <b-col>
        <DeckZone name="Crisis Pool" deck-name="crisisPool" />
        <DeckZone name="Destiny" deck-name="destiny" />
      </b-col>
    </b-row>

    <b-row>
      <b-col>

        <div class="heading">
          Other
        </div>
        <DeckZone name="Destination" deck-name="decks.destination" />
        <DeckZone name="Characters" deck-name="decks.character" />
        <DeckZone name="Titles" deck-name="decks.title" />

      </b-col>
      <b-col>

        <div class="heading">
          Loyalty
        </div>
        <DeckZone name="Loyalty Deck" deck-name="decks.loyalty" />
        <DeckZone name="Human Cards" deck-name="decks.human" />
        <DeckZone name="Cylon Cards" deck-name="decks.cylon" />
        <DeckZone name="Sympathizer" deck-name="decks.sympathizer" />

      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <hr>
        <div class="heading">
          Locations
        </div>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <div class="heading">
          Galactica
        </div>
        <DeckZone
          v-for="(loc, index) in zones.locations.galactica"
          :key="index"
          :expanded="true"
          variant="location"
          :name="loc.details.name"
          :deck-name="loc.name" />

      </b-col>
      <b-col>
        <div class="heading">
          Colonial One
        </div>
        <DeckZone
          v-for="(loc, index) in zones.locations.colonialOne"
          :key="index"
          :expanded="true"
          variant="location"
          :name="loc.details.name"
          :deck-name="loc.name" />


        <div class="heading">
          Cylon
        </div>
        <DeckZone
          v-for="(loc, index) in zones.locations.cylonLocations"
          :key="index"
          :expanded="true"
          variant="location"
          :name="loc.details.name"
          :deck-name="loc.name" />


      </b-col>

      <hr>
    </b-row>

    <div>
      <b-row>
        <b-col>
          <div class="heading">
            Space
          </div>
          <div class="reminder-text">
            <p>Ships can only move clockwise or counter-clockwise around these zones.</p>
            <p>Vipers can launch into the lower zones.</p>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <DeckZone
            name="Upper Left"
            deck-name="space.space1"
            variant="space"
            :expanded="true"
          />
        </b-col>
        <b-col>
          <DeckZone
            name="Upper Right"
            deck-name="space.space2"
            variant="space"
            :expanded="true"
          />
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <DeckZone
            name="Front"
            deck-name="space.space0"
            variant="space"
            :expanded="true"
          />
        </b-col>
        <b-col>
          <DeckZone
            name="Back"
            deck-name="space.space3"
            variant="space"
            :expanded="true"
          />
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <DeckZone
            name="Lower Left"
            deck-name="space.space5"
            variant="space"
            :expanded="true"
          />
        </b-col>
        <b-col>
          <DeckZone
            name="Lower Right"
            deck-name="space.space4"
            variant="space"
            :expanded="true"
          />
        </b-col>
      </b-row>
    </div>

    <b-row>
      <b-col>
        <div class="heading">Ship Tokens</div>
        <DeckZone name="Vipers" deck-name="ships.vipers" />
        <DeckZone name="Damaged Vipers" deck-name="ships.damagedVipers" />
        <DeckZone name="Civilians" deck-name="decks.civilian" />
        <DeckZone name="Raiders" deck-name="ships.raiders" />
        <DeckZone name="Heavy Raiders" deck-name="ships.heavyRaiders" />
      </b-col>
      <b-col>
        <div class="heading">Basestars</div>
        <DeckZone name="Basestar A" deck-name="ships.basestarA" :expanded="true" />
        <DeckZone name="Basestar B" deck-name="ships.basestarB" :expanded="true" />

        <div class="heading">
          Damage Tokens
        </div>
        <DeckZone name="Basestar Damage" deck-name="decks.damageBasestar" />
        <DeckZone name="Galactica Damage" deck-name="decks.damageGalactica" />

      </b-col>
    </b-row>

  </div>
</template>


<script>
import DeckZone from './DeckZone'

import { skillList } from '../lib/util.js'


export default {
  name: 'Zones',

  components: {
    DeckZone,
  },

  data() {
    return {
      skillList,
    }
  },

  computed: {
    playerNames() {
      return Object.keys(this.zones.players)
    },
    viewerIsPresident() {
      return false
    },
    zones() {
      return this.$store.getters['bsg/zones']
    },
  },

  methods: {
  },
}
</script>


<style scoped>
</style>
