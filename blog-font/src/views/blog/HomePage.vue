<template>
    <div style="height: 100%">
        <el-container style="height: 100%" class="block" direction="vertical">
            <el-header height="110px">
                <OwnHeader></OwnHeader>
            </el-header>
            <el-container>
                <el-main style="height: 100%">

                <div>
                    <router-view/>
                </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>

    import OwnHeader from "@/components/OwnHeader";
    export default {
        name: "Home",
        components: {OwnHeader},
        data(){
            return{
                user:""
            }
        },
        methods:{
            getUserInfo(){
                this.request.get("/user/info").then((res)=>{
                    this.user = res.data

                })
            }
        },
        created() {
            this.getUserInfo()
        },
    }
</script>

<style scoped>
    .block{
        /*background-image: url("/src/assets/back.jpg") ;*/
        background-attachment:fixed;
    }
    .el-header >>>{
        padding: 0;
        /*background-image: url("/src/assets/header.jpg");*/
        line-height: 60px;
    }

    .left{
        width:300px;
        float: left;
    }
    .right{
        overflow:hidden;  /* 触发bfc */
    }

    .el-main >>> {
        /*background-image: url("/src/assets/main.jpg");*/
        padding: 0;
    }


    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
</style>