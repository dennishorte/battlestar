<template>
  <div class="loc-name">
    LocName: {{ name }}
  </div>
</template>


<script>
export default {
  name: 'LocName',

  props: {
    name: String,
  },
}
</script>
