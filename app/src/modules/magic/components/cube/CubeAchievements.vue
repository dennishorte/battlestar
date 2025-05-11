<template>
  <div class="achievements">
    <div class="header">
      <button class="btn btn-success" @click="create">create</button>
    </div>

    <div class="row">
      <div class="col">
        <h3>Unclaimed Achievements</h3>
        <CubeAchievement v-for="ach in sortedAchievements" :key="ach._id" :ach="ach" />
      </div>

      <div class="col">
        <h3>Claimed Achievements</h3>
        <CubeAchievement v-for="ach in claimedAchievements" :key="ach._id" :ach="ach" />
      </div>
    </div>

  </div>
</template>


<script>
import CubeAchievement from './CubeAchievement.vue'


export default {
  name: 'CubeAchievements',

  components: {
    CubeAchievement,
  },

  inject: ['actor', 'cubeId'],

  props: {
    achievements: {
      type: Array,
      default: () => [],
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
