<template>
    <div>
        <div style="text-align: center;margin:20px 280px">
            <el-upload
                    style="text-align: center;margin-bottom: 10px"
                    class="avatar-uploader"
                    action="http://localhost:8082/file/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess">
                <img v-if="user.avatarUrl" :src="user.avatarUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        <el-form label-position="right" label-width="80px">
            <el-form-item label="昵称:">
                <el-input v-model="user.nickname"></el-input>
            </el-form-item>
            <el-form-item label="用户名:">
                <el-input v-model="user.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱:">
                <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item label="联系电话:">
                <el-input v-model="user.phone" disabled></el-input>
            </el-form-item>
            <el-form-item label="地址:">
                <el-input type="textarea" v-model="user.address"></el-input>
            </el-form-item>
        </el-form>
            <div v-if="!this.password" style="text-align: center">
                <el-link type="warning" href="/editPwd">还未设置密码，账号安全偏低,点击进行密码设置</el-link>
            </div>
        </div>
        <div style="border-bottom:1px solid #CCC"></div>
        <div style="text-align: center;margin-top: 30px">
            <el-button type="primary" style="padding: 15px 50px" @click="saveUserInfo">保存</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Myself",
    data() {
        return {
            user:{},
            name:"",
            password:""
        };
    },
    created() {
        this.getUserInfo()
    },
    methods:{
        getUserInfo(){
            this.request.get("/user/info").then((res)=>{
                this.user = res.data
                this.name = res.data.username
                this.password = res.data.password
            })
        },
        handleAvatarSuccess(res){
            this.user.avatarUrl = res
        },
        saveUserInfo(){
            this.request.post("/user/save_info",this.user).then((res)=>{
                if (res.code === 100){
                    this.$message.success("保存成功！")
                    //更新缓存
                    let user = res.data
                    user.token = JSON.parse(localStorage.getItem("user")).token
                    localStorage.setItem("user",JSON.stringify(user))
                    this.getUserInfo()
                    setTimeout(function (){
                        window.location.reload();
                    }, 2000);
                }else {
                    this.$message.error(res.msg)
                }
            })
        },
    }
}
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>