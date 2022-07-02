<template>
    <div style="color: #1d1d1d" >
        <div style="text-align: center">
            <span style="font-size: 30px; font-weight: bold;cursor:pointer;" >{{title}}</span>
        </div>
        <div style="float: left;margin-left:120px; margin-bottom: 10px">
            <el-image :src="user.avatarUrl" style="width: 50px;height: 50px;border-radius: 50%"></el-image>
            <span style="font-size: 20px; font-weight: bold;cursor:pointer;color:#021a21;margin-left: 5px">{{user.nickname}}</span>
        </div>
        <div style="float: right;padding-right: 20px;">
            <i class="el-icon-s-help"></i>
            <span style="font-size: 20px; font-weight: bold;cursor:pointer" @click="logout">退出</span>
        </div>
        <div style="float: right;padding-right: 20px">
            <i class="el-icon-s-custom"></i>
            <span style="font-size: 20px;font-weight: bold;cursor:pointer" @click="toHome">信息</span>
        </div>
        <div style="float: right;padding-right: 20px">
            <i class="el-icon-edit"></i>
            <span style="font-size: 20px;font-weight: bold;cursor:pointer" @click="toWrite">发布</span>
        </div>
        <div style="float: right;padding-right: 20px">
            <i class="el-icon-s-home"></i>
            <span style="font-size: 20px;font-weight: bold;cursor:pointer" @click="toFirst">博客</span>
        </div>
        <div style="float: right;padding-right: 20px">
            <i class="el-icon-s-grid"></i>
            <span style="font-size: 20px;font-weight: bold;cursor:pointer" @click="toCategory">首页</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OwnHeader",
        data(){
          return{
              title:"首页",
              user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
          }
        },
        methods:{
            toFirst(){
                this.$router.push('/first')
                this.title="博客"
            },
            toHome(){
                this.$router.push('/')
            },
            toCategory(){
                this.$router.push('/category')
                this.title="首页"
            },
            toWrite(){
                this.$router.push('/write')
                this.title="写博客"
            },
            logout(){
                this.$router.push('/login')
                localStorage.removeItem("user")
                this.$message.success("退出成功")
            }
        }
    }
</script>

<style scoped>

</style>