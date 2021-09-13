<template>
  <div class="skill-card">
    <div class="heading" style="border-bottom: 1px solid darkgray;">
      {{ card.name }}
    </div>

    <div>
      <span class="heading">Skill: </span>{{ card.skill }}
    </div>

    <div>
      <span class="heading">Value: </span>{{ card.value }}
    </div>

    <div>
      <span class="heading">Text: </span>{{ card.text }}
    </div>

  </div>
</template>


<script>
export default {
  name: 'SkillCard',

  props: {
    card: Object,
  },
}
</script>


<style scoped>
</style>
