<template>
    <div class="block" >
        <div >
            <el-card style="margin-left: 120px; margin-top: 20px; margin-right: 100px;background-color: rgba(232,228,228,0.61);">
                <div style="text-align: center">
                    <el-input style="width: 500px" placeholder="请输入需要搜索的博客" suffix-icon="el-icon-location" class="ml-5" v-model="name"></el-input>
                    <el-button class="ml-5" type="info" @click="search">搜索</el-button>
                </div>
                <div style="text-align:center;margin-top: 15px;">
                    <el-tag @click="searchAll" type="success" style="font-size: 15px;cursor: pointer">全部</el-tag>
                    <div style="width:20px;margin-bottom: 10px;display:inline;margin-left: 10px" v-for="item in options" :key="item.id">
                        <el-tag @click="searchByCid(item.id)" type="success" style="font-size: 15px;cursor: pointer">{{item.name}}</el-tag>
                    </div>
                </div>

            </el-card>
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
                                <span style=" font-size: 18px;color: #136071;margin-bottom: 20px">{{blog.description}}</span>
                            </div>
                            <div style="margin-top: 10px;display:inline;margin-right: 5px" v-for="category in blog.categoryList" :key="blog">
                                <el-tag type="warning" style="font-size: 15px;cursor: pointer">{{category}}</el-tag>
                            </div>
                            <div style="margin-top: 10px">
                                <i class="el-icon-user-solid" style="margin-right: 5px"></i>
                                <span>{{blog.user}}</span>
                                <span style="margin-left: 10px;margin-right: 5px">发布时间：{{blog.time}}</span>
                                <div @click="liked(blog)">
                                    <svg t="1646634642977" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2187" width="14" height="14">
                                        <path d="M160 944c0 8.8-7.2 16-16 16h-32c-26.5 0-48-21.5-48-48V528c0-26.5 21.5-48 48-48h32c8.8 0 16 7.2 16 16v448zM96 416c-53 0-96 43-96 96v416c0 53 43 96 96 96h96c17.7 0 32-14.3 32-32V448c0-17.7-14.3-32-32-32H96zM505.6 64c16.2 0 26.4 8.7 31 13.9 4.6 5.2 12.1 16.3 10.3 32.4l-23.5 203.4c-4.9 42.2 8.6 84.6 36.8 116.4 28.3 31.7 68.9 49.9 111.4 49.9h271.2c6.6 0 10.8 3.3 13.2 6.1s5 7.5 4 14l-48 303.4c-6.9 43.6-29.1 83.4-62.7 112C815.8 944.2 773 960 728.9 960h-317c-33.1 0-59.9-26.8-59.9-59.9v-455c0-6.1 1.7-12 5-17.1 69.5-109 106.4-234.2 107-364h41.6z m0-64h-44.9C427.2 0 400 27.2 400 60.7c0 127.1-39.1 251.2-112 355.3v484.1c0 68.4 55.5 123.9 123.9 123.9h317c122.7 0 227.2-89.3 246.3-210.5l47.9-303.4c7.8-49.4-30.4-94.1-80.4-94.1H671.6c-50.9 0-90.5-44.4-84.6-95l23.5-203.4C617.7 55 568.7 0 505.6 0z" p-id="2188" :fill="blog.isLiked ? '#ff6633' : '#82848a'"></path>
                                    </svg>
                                    {{blog.liked}}
                                </div>
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
        name: "First",
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
            liked(blog){
              this.request.post("/blog/like",blog).then(res=>{
                  if(res.code === 100 && res.data===false){
                      this.$message.success("点赞成功！")
                  }else{
                      this.$message.error("取消点赞！")
                  }
                  this.getAllBlog()
              })
            },
            searchByCid(id){
                this.request.get("/blog/cid/"+id).then((res)=>{
                    this.blogs = res.data
                })
            },
            searchAll(){
                this.request.get("/blog/name",{
                    params:{
                        name:''
                    }
                }).then((res)=>{
                    this.blogs = res.data
                })
            },
            search(){
                this.request.get("/blog/name",{
                    params:{
                        name:this.name
                    }
                }).then((res)=>{
                    this.blogs = res.data
                })
            },
            getAllBlog(){
                this.request.get("/blog/all").then((res)=>{
                    this.blogs = res.data
                    const blog = this.blogs
                    for(const i in blog){
                        this.userId.push(blog[i].uid)
                    }
                })
            },
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
            }

        },
        created() {
            this.getAllBlog()
            this.getUserInfo()
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
.bg-purple {
    background: #d3dce6;
}
</style>