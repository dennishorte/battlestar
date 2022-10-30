<template>
  <li ref="li">
    <slot></slot>
  </li>
</template>


<script>
export default {
  name: 'DropdownItem',

  mounted() {
    // If only text was specified, replace it with a link to get better styling.
    if (this.$refs.li.children.length === 0) {
      const text = this.$refs.li.textContent

      const a = document.createElement("a")
      const textNode = document.createTextNode(text)
      a.appendChild(textNode)

      this.$refs.li.textContent = ''
      this.$refs.li.append(a)
    }

    // Insert the correct bootstrap class for styling.
    const links = this.$refs.li.querySelectorAll('a')
    for (const link of links) {
      link.classList.add('dropdown-item')
    }

    // Insert the correct bootstrap class for styling.
    const buttons = this.$refs.li.querySelectorAll('button')
    for (const button of buttons) {
      button.classList.add('dropdown-item')
    }
  },
}
</script>
