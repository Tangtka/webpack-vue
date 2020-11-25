<template>
  <div>Login
    <p @click="handleClick">点击事件</p>
  </div>
</template>

<script>
  import {a,c} from "@/utils/tool";

  export default {
    name: "Login",
    methods:{
      handleClick(){
        a()
        c()
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
