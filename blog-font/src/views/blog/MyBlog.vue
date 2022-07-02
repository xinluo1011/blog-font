<template>
    <div class="block">
        <el-card style="margin: 10px 200px; background-color: rgba(232,228,228,0.61);">
            <i class="el-icon-d-arrow-left" style="margin-left: 10px"></i>
            <span style="font-weight: bold; cursor: pointer" @click="back">返回</span>
            <div class="pd-10" style="font-size: 25px;color: #0f8593; cursor: pointer;font-weight: bold">{{blog.name}}</div>
            <div style="font-size: 14px;">
                <el-avatar size="large" :src="user.avatarUrl"></el-avatar>
                <span>{{blog.user}}</span>
                <i class="el-icon-time" style="margin-left: 10px"></i>
                <span>{{blog.time}}</span>
            </div>
            <div style="float: right;margin-right: 10px">
                <el-link style="font-size: 20px;" type="warning" @click="editBlog" v-if="blog.uid === parseInt(userInfo.userId)">修改博客</el-link>
                <el-link style="font-size: 20px; margin-left: 20px;" type="danger" @click="deleteBlog" v-if="blog.uid === parseInt(userInfo.userId)">删除博客</el-link>
            </div>
        </el-card>
        <div  style="margin-left: 200px;margin-right: 200px; margin-bottom: 20px">
                <mavon-editor
                        class="md"
                        :value="blog.content"
                        :subfield="false"
                        :defaultOpen="'preview'"
                        :toolbarsFlag="false"
                        :editable="false"
                        :scrollStyle="true"
                        :ishljs="true"/>
        </div>

        <el-card style="margin-left: 200px;margin-right: 200px; margin-bottom: 20px">
            <div style="font-size: 20px;padding: 10px 0;">评论</div>
            <div style="border-bottom: 1px solid orangered;"></div>
            <div style="padding: 10px 0;">
                <el-input type="textarea" v-model="commentForm.content"></el-input>
            </div>
            <div style="padding: 10px 0;text-align: right">
                <el-button type="primary" size="small" @click="save">评论</el-button>
            </div>

<!--            评论列表-->
            <div >
                <div v-for="item in comments" :key="item.id" style="border-bottom: 1px solid #ccc;padding: 10px 0;">
                    <div style="display: flex">
                        <!--                    头像-->
                        <div style="width: 100px;text-align: center;">
                            <el-image :src="item.avatarUrl" style="width: 50px;height: 50px;border-radius: 50%"></el-image>
                        </div>
                        <!--                    内容-->
                        <div style="flex: 1 ; font-size: 14px;padding: 5px 0;line-height: 25px">
                            <b>{{item.nickname}}：</b>
                            <span >{{item.content}}</span>
                            <div style="display: flex;margin-top: 5px;">
                                <div style="width: 200px;">
                                    <i class="el-icon-time"></i>
                                    <span style="margin-left: 5px;">{{item.time}}</span>
                                </div>
                                <div style="text-align: right; flex: 1">
                                    <el-button style="margin-left: 5px" type="text" @click="handleReply(item.id)">回复</el-button>
                                    <el-button style="color: red" type="text" @click="handleDel(item.id)" v-if="parseInt(userInfo.userId) === item.uid">删除</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
<!--                    回复列表-->
                    <div v-if="item.children.length" style="padding-left: 100px;" >
                        <div v-for="subItem in item.children" :key="subItem.id" style="background-color: #e2e1e1">
                            <div style="flex: 1 ; font-size: 14px;padding: 5px 0;line-height: 25px">
                                <div>
                                    <b style="color: #409EFF" v-if="subItem.pnickName">@{{subItem.pnickName}}：</b>
                                </div>
                                <div>
                                    <b>{{subItem.nickname}}：</b>
                                    <span >{{subItem.content}}</span>
                                </div>
                                <div style="display: flex;margin-top: 5px;">
                                    <div style="width: 200px;">
                                        <i class="el-icon-time"></i>
                                        <span style="margin-left: 5px;">{{subItem.time}}</span>
                                    </div>
                                    <div style="text-align: right; flex: 1">
                                        <el-button style="margin-left: 5px" type="text" @click="handleReply(subItem.id)">回复</el-button>
                                        <el-button style="color: red" type="text" @click="handleDel(subItem.id)" v-if="parseInt(userInfo.userId) === subItem.uid">删除</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </el-card>

        <el-dialog title="回复信息" :visible.sync="dialogFormVisible" width="50%">
            <el-form label-width="80px" size="small">
                <el-form-item label="回复内容">
                    <el-input type="textarea" v-model="commentForm.contentReply" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="save" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "MyBlog",
        data () {
            return {
                id:this.$route.params.id,
                blog:'',
                userId:'',
                user:'',
                comments:'',
                commentForm:{},
                userInfo:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
                dialogFormVisible:false
            }
        },
        methods:{
            deleteBlog(){
                this.$confirm('此操作将永久删除博客信息，是否继续？','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.request.delete("/blog/remove",{
                        params:{
                            id:this.id
                        }
                    }).then((res)=>{
                        if(res.code === 100){
                            this.$message.success("删除成功")
                            this.$router.push("/first")
                        }else {
                            this.$message.error("删除失败")
                        }
                    })
                })
            },
            editBlog(){
                this.$router.push({
                    name:'Edit',
                    params: {
                        id: this.id
                    }
                })
            },
            back(){
              this.$router.push("/first")
            },
            handleReply(pid){
              this.commentForm = {pid:pid}
              this.dialogFormVisible = true
            },
            getById(){
                this.request.get("/blog/id/"+this.id).then((res)=>{
                    this.blog=res.data
                    this.userId = res.data.uid
                    this.request.get("/user/id/"+this.userId).then((res)=>{
                        console.log(this.userInfo)
                        this.user = res.data
                    })

                })
            },
            loadComment(){
                this.request.get("/comment/tree/"+this.id).then((res)=>{
                    this.comments = res.data
                })
            },
            save(){
                this.commentForm.blogId = this.id
                this.commentForm.uid=this.userInfo.userId
                this.commentForm.avatarUrl=this.userInfo.avatarUrl
                if(this.commentForm.contentReply){
                    this.commentForm.content = this.commentForm.contentReply
                }
                this.request.post("/comment/save",this.commentForm).then((res)=>{
                    if (res.code === 100){
                        this.$message.success("评论成功")
                        this.commentForm = {} //初始化评论对象
                        this.loadComment()
                        this.dialogFormVisible = false
                    }else {
                        this.$message.error("评论失败")
                    }
                })
            },
            handleDel(id){
                this.request.delete('/comment/remove',{
                    params: {
                        id: id
                    }
                }).then((res)=>{
                    if(res){
                        this.$message.success("删除成功")
                        this.loadComment()
                    }else {
                        this.$message.error("删除失败")
                    }
                })
            },
        },
        created() {
            this.getById()
            this.loadComment()
        },

    }
</script>

<style scoped>
    .block{
        /*background-image: url("/src/assets/back.jpg") ;*/
        background-attachment:fixed ;
        height: 100%;
    }
</style>