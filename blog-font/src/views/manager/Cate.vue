<template>
    <div>
        <div style="padding: 10px 0">
            <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
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
        </div>
        <el-table :data="tableData" border stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="name" label="分类名"></el-table-column>

            <el-table-column label="操作" align="center">
                <template slot-scope="scope" >
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
        <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small">
                <el-form-item label="分类名">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Cate",
        data(){
            return{
                tableData: [],
                total:0,
                pageNum:0,
                pageSize:2,
                name: '',
                dialogFormVisible:false,
                form:{},
                multipleSelection:[],
                roles:[],
                role:[]
            }
        },
        created() {
            this.load()
        },
        methods:{
            handleSizeChange(pageSize){
                this.pageSize = pageSize
                this.load()
            },
            handleCurrentChange(pageNum){
                this.pageNum = pageNum
                this.load()
            },
            load(){
                this.request.get('/category/page',{
                    params:{
                        pageNum:this.pageNum,
                        pageSize:this.pageSize,
                        name:this.name,
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
            //新增或修改用户
            save(){
                this.request.post('/category/save',this.form).then((res)=>{
                    if(res){
                        this.$message.success("操作成功")
                        this.dialogFormVisible=false
                        this.load()
                    }else {
                        this.$message.error("操作失败")
                    }
                })
            },
            //修改用户
            handleEdit(row){
                this.form = row
                this.dialogFormVisible=true
            },
            //更加主键删除用户
            handleDel(id){
                this.request.delete('/category/remove',{
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
                this.request.post('/category/removeIds',ids).then((res)=>{
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