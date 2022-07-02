<template>
    <div>
        <div style="padding: 10px 0">
            <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-location" class="ml-5" v-model="name"></el-input>
            <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
            <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
        </div>

        <div style="margin: 10px 0">
            <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i></el-button>
            <el-popconfirm
                    style="margin-left: 5px;margin-right: 5px"
                    confirm-button-text='确定'
                    cancel-button-text='我再想想'
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定删除吗？"
                    @confirm="handleDelIds"
            >
                <el-button type="danger" slot="reference">批量删除<i class="el-icon-remove-outline"></i></el-button>
            </el-popconfirm>
<!--            <el-button type="primary">导入<i class="el-icon-bottom"></i></el-button>-->
<!--            <el-button type="primary">导出<i class="el-icon-top"></i></el-button>-->
        </div>
        <el-table :data="tableData" border stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID"  width="80"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="description" label="描述" ></el-table-column>

            <el-table-column label="操作" align="center">
                <template slot-scope="scope" >
                    <el-button type="info" slot="reference" @click="selectMenu(scope.row.id)">分配菜单 <i class="el-icon-menu"></i></el-button>
                    <el-button type="warning" @click="handleEdit(scope.row)">编辑<i class="el-icon-edit"></i></el-button>
                    <el-popconfirm
                            class="ml-5"
                            confirm-button-text='确定'
                            cancel-button-text='我再想想'
                            icon="el-icon-info"
                            icon-color="red"
                            title="确定删除吗？"
                            @confirm="handleDel(scope.row.id)"
                    >
                        <el-button type="danger" slot="reference" >删除 <i class="el-icon-remove-outline"></i></el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div style="padding: 10px 0">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[2, 5, 10, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
        <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small">
                <el-form-item label="名称">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标识">
                    <el-input v-model="form.flag" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="菜单分配" :visible.sync="menuDialogVisible" width="30%" style="padding: 0 50px;">
            <el-tree
                    :props="props"
                    :data="menuData"
                    show-checkbox
                    :default-expanded-keys="expends"
                    :default-checked-keys="checks"
                    node-key="id"
                    ref="tree">
                <span class="custom-tree-node" slot-scope="{node,data}">
                    <span><i :class="data.icon">{{data.name}}</i></span>
                </span>
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="menuDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleMenu">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {resetRouter} from "@/router";

    export default {
        name: "Role",
        data(){
            return{
                tableData: [],
                total:0,
                pageNum:0,
                pageSize:2,
                name:'',
                dialogFormVisible:false,
                form:{},
                multipleSelection:[],
                menuDialogVisible:false,
                menuData:[],
                props:{
                    label:'name'
                },
                expends:[],
                checks:[],
                roleId:0
            }
        },
        created() {
            this.load()
        },
        methods:{
            saveRoleMenu(){
                this.request.post("/role/role_menu/"+this.roleId,this.$refs.tree.getCheckedKeys()).then((res)=>{
                    if (res.code === 100){
                        this.$message.success("绑定成功")
                        this.menuDialogVisible = false

                        let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
                        if(user.role === this.roleId){
                            this.$message("菜单变化，请重新登录")
                            //修改完菜单后需要重新登录
                            localStorage.removeItem("user")
                            localStorage.removeItem("menu")
                            this.$router.push('/register')
                            //重置路由
                            resetRouter()
                        }

                    }else {
                        this.$message.error(res.msg)
                    }
                })
            },
            selectMenu(roleId){
                this.menuDialogVisible=true
                this.roleId = roleId
                //请求菜单数据
                this.request.get('/menu/all',{
                }).then((res)=>{
                    this.menuData = res.data
                    //把后台返回的菜单数据处理成id数组
                    this.expends = this.menuData.map(v=>v.id)
                })
                this.request.get("/role/role_menu/"+roleId).then((res)=>{
                    this.checks = res.data
                })
            },
            handleSizeChange(pageSize){
                this.pageSize = pageSize
                this.load()
            },
            handleCurrentChange(pageNum){
                this.pageNum = pageNum
                this.load()
            },
            load(){
                this.request.get('/role/page',{
                    params:{
                        pageNum:this.pageNum,
                        pageSize:this.pageSize,
                        name:this.name
                    }
                }).then((res)=>{
                    this.tableData = res.data.records
                    this.total = res.data.total
                })

            },
            reset(){
                this.name = ""
                this.load()
            },
            handleAdd(){
                this.dialogFormVisible=true
                this.form={}
            },

            save(){
                this.request.post('/role/save',this.form).then((res)=>{
                    if(res){
                        this.$message.success("操作成功")
                        this.dialogFormVisible=false
                        this.load()
                    }else {
                        this.$message.error("操作失败")
                    }
                })
            },

            handleEdit(row){
                this.form = row
                this.dialogFormVisible=true
            },

            handleDel(id){
                this.request.delete('/role/remove',{
                    params: {
                        id: id
                    }
                }).then((res)=>{
                    if(res){
                        this.$message.success("删除成功")
                        this.load()
                    }else {
                        this.$message.error("删除失败")
                    }
                })
            },
            handleSelectionChange(val){
                this.multipleSelection = val
            },
            handleDelIds(){
                let ids = this.multipleSelection.map(v=>v.id)  //把对象数组变成一个纯id数组
                this.request.post('/role/removeIds',ids).then((res)=>{
                    if(res){
                        this.$message.success("删除成功")
                        this.load()
                    }else {
                        this.$message.error("删除失败")
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>