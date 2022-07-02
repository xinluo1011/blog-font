<template>
  <div style="height: 100%;">
    <el-container style="height: 100%;">
      <el-aside :width="sideWidth + 'px'" style="background-color: rgb(238, 241, 246); height: 100%; box-shadow: 2px 0 6px rgb(0 21 41/35%);">
        <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow" :menus="menus"></Aside>
      </el-aside>

      <el-container>
        <el-header style=" border-bottom: 1px solid #ccc;">
          <Header :collapseBtnClass="collapseBtnClass" :collapse="collapse"></Header>
        </el-header>

        <el-main>
<!--          表示当前页面的子路由会显示在<router-view/>-->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
// @ is an alias to /src

import Aside from "@/components/Aside";
import Header from "@/components/Header";
export default {
    name: 'HomeView',
    components: {Aside, Header},
    data() {
        return {
            collapseBtnClass: 'el-icon-s-fold',
            isCollapse: false,
            sideWidth: 200,
            logoTextShow: true,
            user:"",
            menus:""
        }
    },
    created() {
        this.user=localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : ""
        this.menus=localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")) : ""
    },
    methods: {
        //点击搜索按钮触发方法
        collapse() {
            this.isCollapse = !this.isCollapse
            if (this.isCollapse) {//收缩
                this.sideWidth = 64
                this.collapseBtnClass = 'el-icon-s-unfold'
                this.logoTextShow = false
            } else {//展开
                this.sideWidth = 200
                this.collapseBtnClass = 'el-icon-s-fold'
                this.logoTextShow = true
            }
        },
        getUser() {
            let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : ""
            // console.log(user)
            // if(user){
            //     this.request.get("/user/info").then((res)=>{
            //         console.log(res.data)
            //         this.user = res.data;
            //     })
            // }
        }
    }
}
</script>
