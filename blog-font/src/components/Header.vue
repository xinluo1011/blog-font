<template>
    <div style="line-height: 60px;display: flex">
        <div style="flex: 1; ">
            <span :class="collapseBtnClass" style="cursor: pointer;font-size: 18px" @click="collapse"></span>
        </div>
        <el-dropdown style="width: 150px; cursor: pointer" >
            <div style="display: inline-block">
                <el-avatar size="large" :src="user.avatarUrl" style="position: relative;top:10px;right: 5px"></el-avatar>
                <span>{{user.nickname}}</span>
            </div>
            <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
                <el-dropdown-item style="font-size: 14px; padding: 5px 0;" @click.native="goHomePage">返回首页</el-dropdown-item>
                <el-dropdown-item style="font-size: 14px; padding: 5px 0;" @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    import {resetRouter} from "@/router";

    export default {
        name: "Header",
        props:{
            collapseBtnClass:String,
            collapse:Function,
        },
        data(){
            return{
                user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
            }
        },
        methods:{
            logout(){
                this.$router.push('/login')
                localStorage.removeItem("user")
                this.$message.success("退出成功")
                resetRouter()
            },
            goHomePage(){
                this.$router.push('/category')
            }
        }
    }
</script>

<style scoped>

</style>