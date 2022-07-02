<template>
    <div>
        <div style="text-align: center;margin:20px 280px">
            <el-form label-position="right" label-width="80px">
                <el-form-item label="原密码:" v-if="this.password">
                    <el-input v-model="editForm.password"></el-input>
                </el-form-item>
                <el-form-item label="密码:" v-if="!this.password">
                    <el-input v-model="editForm.password"></el-input>
                </el-form-item>
                <el-form-item label="新密码:" v-if="this.password">
                    <el-input v-model="editForm.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="校验密码:">
                    <el-input v-model="editForm.preNewpassword"></el-input>
                </el-form-item>

            </el-form>
        </div>
        <div style="border-bottom:1px solid #CCC"></div>
        <div style="text-align: center;margin-top: 30px">
            <el-button type="primary" style="padding: 15px 50px" @click="editPwd">提交</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "EditPwd",
        data() {
            return {
                user:{},
                password:"",
                editForm:{}
            };
        },
        created() {
            this.getUserInfo()
        },
        methods:{
            getUserInfo(){
                this.request.get("/user/info").then((res)=>{
                    this.user = res.data
                    this.password = res.data.password
                    console.log(res.data)
                    if(this.password == null){
                        this.editForm.role = 0
                    }else {
                        this.editForm.role = 1
                    }
                    this.editForm.id = res.data.id
                })
            },
            editPwd(){
                this.request.post("/user/edit_pwd",this.editForm).then((res)=>{
                    if (res.code === 100){
                        this.$message.success("提交成功！")
                        //更新缓存
                        let user = JSON.parse(localStorage.getItem("user"))
                        user.password = res.data.password
                        localStorage.setItem("user",JSON.stringify(user))
                        setTimeout(function (){
                            window.location.reload();
                        }, 2000);
                    }else {
                        this.$message.error(res.msg)
                    }
                })
            }
        }
    }
</script>

<style>

</style>