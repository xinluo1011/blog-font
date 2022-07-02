<template>
    <div class="wrapper">
        <div style="margin: 200px auto; width: 350px;height: 310px;padding: 20px;border-radius: 10px;background: rgba(0,0,0,0.5);">
            <div style="margin: 20px 0; text-align: center;font-size: 24px;color: white"><b>登录</b></div>
            <el-input size="medium" style="margin: 10px 0;" prefix-icon="el-icon-user" v-model="LoginForm.username" placeholder="请输入手机号或用户账号"></el-input>
                        <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password v-model="LoginForm.password" placeholder="请输入密码"></el-input>
            <div style="margin: 10px 0; text-align: center">
                <el-button type="primary" size="small" style="margin-top: 10px;" autocomplete="off" @click="login">登录</el-button>
            </div>
            <div style="text-align: right;color: white;margin-bottom: 5px">
                <el-link type="warning" @click="goPwd">使用手机验证码登录</el-link>
            </div>
        </div>
    </div>
</template>

<script>

    import {setRoutes} from "@/router";

    export default {
        name: "Register",
        data(){
            return{
                LoginForm:{}
            }
        },
        methods:{
            goPwd(){
                this.$router.push('/login')
            },
            login(){
                this.request.post("/user/login",this.LoginForm).then((res)=>{
                    if (res.code === 100){
                        this.$message.success("登录成功！")
                        //登录成功后在前端存储用户信息
                        localStorage.setItem("user",JSON.stringify(res.data))
                        localStorage.setItem("menus",JSON.stringify(res.data.menus))
                        setRoutes()
                        this.$router.push('/homePage')
                        console.log(res)
                    }else {
                        this.$message.error(res.msg)
                    }
                })
            }

        }
    }
</script>

<style scoped>
    .wrapper {
        height: 100vh;
        background: url("../../assets/img.jpg");
        overflow: hidden;
    }
</style>