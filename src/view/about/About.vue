<template>
  <div>About
    <p @click="handleClick">点击事件</p>
  </div>
</template>

<script>
  import {a} from "@/utils/tool";

  export default {
    name: "About",
    methods:{
      handleClick(){
        a()
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
