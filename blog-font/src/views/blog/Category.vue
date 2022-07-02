<template>
    <div class="block">
        <div >
            <el-card style="margin-left: 120px; margin-top: 20px; margin-right: 100px;height: 200px;background-color: rgba(232,228,228,0.61);">
                <img :src="user.avatarUrl" class="image">
                <div style="margin-top: 20px">
                    <span  style="text-align: center;display:block;font-weight: bold; font-size: 20px">欢迎你！{{user.nickname}}</span>
                </div>
            </el-card>
        </div>
        <div >
<!--            <el-card style="width: 300px;margin-left: 120px; margin-top: 20px; margin-right: 100px;height: 150px;background-color: rgba(232,228,228,0.61);">-->
                <div style="margin-left: 120px; margin-top: 20px; margin-right: 100px;">
                    <span style="display:block;font-weight: bold; font-size: 50px;color: #0f8593 ">推荐博客</span>
                </div>
<!--            </el-card>-->
        </div>
        <div style="padding: 20px 100px">
            <el-timeline v-for="blog in blogs" :key="blog.id" >
                <el-timeline-item :timestamp="blog.time" placement="top">
                    <el-card style="background-color: rgba(232,228,228,0.61);">
                        <div>
                            <div>
                                <img style=" float: right; font-size: 18px;color: #136071;margin-bottom: 10px;width: 300px;height: 150px;" :src="blog.turl"/>
                            </div>
                            <el-link @click="getDetail(blog)" style="font-size: 30px;font-weight: bold;margin-bottom: 10px">{{blog.name}}</el-link>
                            <div>
                                <span style=" font-size: 18px;color: #136071;margin-bottom: 10px">{{blog.description}}</span>
                            </div>
                            <div style="margin-top: 10px">
                                <el-tag type="warning" style="font-size: 15px;cursor: pointer">{{blog.cname}}</el-tag>
                            </div>
                            <div style="margin-top: 10px">
                                <i class="el-icon-user-solid" style="margin-right: 5px"></i>
                                <span>{{blog.user}}</span>
                                <span style="margin-left: 10px;">发布时间：{{blog.time}}</span>
                            </div>

                        </div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Category",
        data(){
            return{
                blogs:[],
                userId:[],
                userInfo:[],
                user:"",
                name:"",
                options:[]
            }
        },
        methods:{
            getUserInfo(){
                this.request.get("/user/info").then((res)=>{
                    this.user = res.data
                })
            },
            getDetail(blog){
                this.$router.push({
                    name: 'MyBlog',
                    params: {
                        id: blog.id
                    }
                })
            },
            getRecommendBlog(){
                this.request.get("/blog/is_recommend").then((res)=>{
                    this.blogs = res.data
                    const blog = this.blogs
                    for(const i in blog){
                        this.userId.push(blog[i].uid)
                    }
                })

                this.request.get("/category/all").then((res)=>{
                    this.options = res.data
                })
            },
        },
        created() {
            this.getUserInfo()
            this.getRecommendBlog()
        }
    }
</script>

<style scoped>
    .el-card >>>{
        padding: 0;
    }
    .image {
        width: 100px;
        height: 100px;
        clear: both;
        display: block;
        margin: auto;
    }

</style>