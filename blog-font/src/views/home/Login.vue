<template>
    <div class="wrapper">
        <div style="margin: 200px auto; width: 350px;height: 310px;padding: 20px;border-radius: 10px;background: rgba(0,0,0,0.5);">
            <div style="margin: 20px 0; text-align: center;font-size: 24px;color: white"><b>登录</b></div>
            <el-form>
                <el-input size="medium" style="margin: 10px 0; width: 200px" prefix-icon="el-icon-phone" v-model="LoginForm.phone" placeholder="请输入正确格式的手机号"></el-input>
                <el-button style="margin-left: 10px; padding-top: 10px" type="success" @click="register">获取验证码</el-button>
                <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-setting" v-model="LoginForm.code" placeholder="请输入验证码">验证码</el-input>
                <div style="font-size: 10px;text-align: center;color: #ece6e6;">未注册的手机号码验证后自动创建用户</div>
                <div style="margin: 10px 0; text-align: center">
                    <el-button type="primary" size="small" style="margin-top: 10px;" autocomplete="off" @click="loginCode">登录</el-button>
                </div>
                <div style="text-align: right;color: white;margin-bottom: 5px">
                    <el-link type="warning" @click="goPwd">使用密码登录</el-link>
                </div>
            </el-form>

        </div>
    </div>
</template>

<script>
    import {setRoutes} from "@/router";

    export default {
        name: "Login",
        data(){
            return{
                LoginForm:{},

                }
        },
        methods:{
            register(){
                this.request.post("/user/code",this.LoginForm).then((res)=>{
                    if(res.code === 100){
                        this.$message.success("验证码已经发送，有效时间2分钟")
                    }
                })
            },
            goPwd(){
                this.$router.push('/register')
            },
            loginCode(){
                this.request.post("/user/loginCode",this.LoginForm).then((res)=>{
                    if (res.code === 100){
                        this.$message.success("登录成功！")
                        //登录成功后在前端存储用户信息
                        localStorage.setItem("user",JSON.stringify(res.data))
                        localStorage.setItem("menus",JSON.stringify(res.data.menus))
                        //动态设置当前用户的路由
                        setRoutes()
                        this.$router.push('/homePage')
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