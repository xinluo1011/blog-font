import Vue from 'vue'
import VueRouter from 'vue-router'
import Manager from "@/views/Manager";
import User from '../views/manager/User'
import Home from "@/views/manager/Home";
import Login from "@/views/home/Login";
import Register from "@/views/home/Register";
import HomePage from "@/views/blog/HomePage";
import Myself from "@/views/manager/Myself";
import EditPwd from "@/views/manager/EditPwd";
import Role from "@/views/manager/Role";
import Menu from "@/views/manager/Menu"
import First from "@/views/blog/First";
import Category from "@/views/blog/Category";
import MyBlog from "@/views/blog/MyBlog";
import Write from "@/views/blog/Write";
import Article from "@/views/manager/Article";
import Edit from "@/views/blog/Edit";
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/homePage',
    redirect:'/category',
    component: HomePage,
    children:[
      {
        path:'/first',
        component:First
      },
      {
        path:'/category',
        component:Category
      },
      {
        path:'/write',
        name:'Write',
        component:Write
      },
      {
        path:'/edit/:id',
        name:'Edit',
        component:Edit
      },
      {
        path:'/myBlog/:id',
        name:'MyBlog',
        component:MyBlog,
      }
    ]
  },

  // {
  //   path: '*',
  //   component:() => import('@/views/manager/404.vue')
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//提供一个重置路由的方法
export const resetRouter =()=>{
  router.matcher = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
}
export const setRoutes = () =>{
  const  storeMenus = localStorage.getItem("menus")
  if(storeMenus){
    //拼装动态路由
    const manageRoute ={path: '/', name:'Manage',component: Manager, redirect:"/home",children: [] }
    const menus = JSON.parse(storeMenus)
    menus.forEach(item => {
      if(item.path){ //当且仅当path不为空的时候才去设置路由
        let itemMenu = {path:item.path.replace("/",""),name:item.name, component:() => import('@/views/manager/'+item.pagePath+'.vue')}
        manageRoute.children.push(itemMenu)
      }else if(item.children.length){
        item.children.forEach(item => {
          if(item.path){
            let itemMenu = {path:item.path.replace("/",""),name:item.name, component:() => import('@/views/manager/'+item.pagePath+'.vue')}
            manageRoute.children.push(itemMenu)
          }
        })
      }

    })

    //获取当前路由对象名称数组
    const currentRoutes = router.getRoutes().map(v=>v.name)
    if(!currentRoutes.includes('Manage')){
      //动态添加到现在的路由对象中去
      router.addRoute(manageRoute)
    }
  }
}
//重置再set一次路由
setRoutes()




export default router
