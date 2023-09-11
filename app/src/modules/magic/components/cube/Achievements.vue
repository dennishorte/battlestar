<template>
  <div class="achievements">
    <div class="header">
      <button class="btn btn-success" @click="create">create</button>
    </div>

    <div>
      <Achievement v-for="ach in sortedAchievements" :ach="ach" />
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
    sortedAchievements() {
      return this
        .achievements
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
