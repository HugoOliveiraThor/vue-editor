<template>
  <button
    class="menubar__button"
    :class="{ 'is-active': classButton }"
    @click="onClick"
  >
    <i :class="icon"></i>
  </button>
</template>

<script>
export default {
  name: "button-menu",
  props: {
      classButton: {
        type: Boolean,
        required: false,
        default:() => {}
      },
      icon: {
        type:String,
        required:false,
        default:'fas fa-bold'
      }
  },
  methods: {
    onClick() {
      return this.$emit('onClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.is-active {
  background: grey;
}
</style>
