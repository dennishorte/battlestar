<template>
  <div class="achievements">
    <div class="header">
      <button class="btn btn-success" @click="create">create</button>
    </div>

    <div class="row">
      <div class="col">
        <h3>Unclaimed Achievements</h3>
        <Achievement v-for="ach in sortedAchievements" :ach="ach" />
      </div>

      <div class="col">
        <h3>Claimed Achievements</h3>
        <Achievement v-for="ach in claimedAchievements" :ach="ach" />
      </div>
    </div>

  </div>
</template>


<script>
import Achievement from './Achievement.vue'
import Modal from '@/components/Modal'


export default {
  name: 'Achievements',

  components: {
    Achievement,
    Modal,
  },

  inject: ['actor', 'cubeId'],

  props: {
    achievements: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      showAll: false,
    }
  },

  computed: {
    claimedAchievements() {
      return this
        .achievements
        .filter(ach => ach.claimed)
        .sort((l, r) => r.claimed.timestamp - l.claimed.timestamp)
    },

    sortedAchievements() {
      return this
        .achievements
        .filter(ach => !ach.claimed)
        .sort((l, r) => r.createdTimestamp - l.createdTimestamp)
    },
  },

  methods: {
    blank() {
      return {
        name: '',
        unlock: '',
        hidden: [],
        tags: [],
        starred: [],

        creatorId: this.actor._id,
        cubeId: this.cubeId,
      }
    },

    create() {
      this.$store.commit('magic/cube/manageAchievement', {
        achievement: this.blank(),
        showAll: true,
      })
      this.$modal('achievement-editor').show()
    },
  },
}
</script>


<style scoped>
.header {
  margin: .5em 0;
}
</style>
