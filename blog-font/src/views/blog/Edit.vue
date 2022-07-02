<template>
    <div style="margin-top: 30px; margin-left: 200px;margin-right: 200px;">
        <div style="margin-bottom: 10px">
            <i class="el-icon-d-arrow-left" style="margin-left: 10px"></i>
            <span style="font-weight: bold; cursor: pointer" @click="back">返回</span>
        </div>
        <div style="margin-bottom: 10px">
            <span>封面图：</span>
            <el-upload
                    style="text-align: center;margin-bottom: 10px"
                    class="avatar-uploader"
                    action="http://localhost:8082/file/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess">
                <img v-if="blog.turl" :src="blog.turl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
        <div style="margin-bottom: 10px">
            <span>标题：</span>
            <el-input style="width: 1000px" v-model="blog.name"></el-input>
        </div>
        <div style="margin-bottom: 10px">
            <span>摘要：</span>
            <el-input style="width: 1000px" v-model="blog.description"></el-input>
        </div>
        <div style="margin-bottom: 10px;">
            <span>分类：</span>
            <el-select  clearable v-model="blog.cid" placeholder="请选择" style="width: 1000px">
                <el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.name">
                    {{item.name}}
                </el-option>
            </el-select>
        </div>
        <mavon-editor  style="height:100%" ref="md" v-model="blog.content" :ishljs="true" @imgAdd="imgAdd"/>
        <div style="margin-top: 10px;text-align: center">
            <el-button type="primary" size="large" @click="submit">发布博客</el-button>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "Edit",
        data(){
            return{
                blog:{},
                id:this.$route.params.id,
                options:[]
            }
        },
        methods:{
            handleAvatarSuccess(res){
                this.blog.turl = res
            },
            load(){
                  this.request.get('/blog/id/'+this.id).then((res)=>{
                      this.blog = res.data
                  })
                this.request.get("/category/all").then((res)=>{
                    this.options = res.data
                })
            },
            back(){
                this.$router.push({
                    name: 'MyBlog',
                    params: {
                        id: this.id
                    }
                })
            },
            submit(){
                this.request.post('/blog/save',this.blog).then((res)=>{
                    if(res){
                        this.$message.success("发布成功")
                        this.$router.push("/first")
                    }else {
                        this.$message.error("发布失败")
                    }
                })
            },
            imgAdd(pos,$file){
                let $vm = this.$refs.md
                //第一步 将图片上传到服务器
                const formData = new FormData()
                formData.append('file',$file);
                axios({
                    url:"http://localhost:8082/file/upload",
                    method:'post',
                    data:formData,
                    headers:{'Content-Type':'multipart/form-data'},
                }).then((res)=>{
                    //将返回的url替换到文本原位置
                    $vm.$img2Url(pos,res.data);
                })
            },
        },
        created() {
            this.load()
        }
    }
</script>

<style scoped>
    .avatar {
        width: 500px;
        height: 300px;
        display: block;
    }
</style>