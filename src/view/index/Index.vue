<template>
  <div class="index">
    <p>{{msg}}</p>
    <img src="@/assets/img/QQ截图20201107142931.jpg" alt="icon">
    <router-link to="/about">about</router-link>
    <div>
      <p @click="handleClick">点击事件</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Index",
    data(){
      return{
        msg:'Index1'
      }
    },
    methods:{
      handleClick(){
        console.log(1);
        console.log(this.$store.state);
        console.log(this.$store.state.msg);
      }
    }
  }
</script>

<style scoped lang="scss">
  .index{
    color: blue;
    background-color: #f2f3f4;
    transform: translate(0,0);
    display: flex;
  }
  .index input::placeholder{
    color: red;
  }
</style>
