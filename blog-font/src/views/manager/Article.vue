<template>
    <div>
        <div style="padding: 10px 0">
            <el-input style="width: 200px" placeholder="请输入标题" suffix-icon="el-icon-search" v-model="name"></el-input>
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
        <el-table :data="tableData" border stripe @selection-change="handleSelectionChange"  >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="name" label="标题" ></el-table-column>
            <el-table-column prop="description" label="摘要" ></el-table-column>
            <el-table-column prop="content" label="内容">
                <template slot-scope="scope">
                    <el-button @click="view(scope.row.content)" type="primary">查看内容</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="user" label="发布人"></el-table-column>
            <el-table-column prop="time" label="发布时间"></el-table-column>


            <el-table-column label="操作" width="200" align="center">
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
        <el-dialog title="文章信息" :visible.sync="dialogFormVisible" width="60%">
            <el-form label-width="80px" size="small">
                <el-form-item label="标题">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="摘要">
                    <el-input v-model="form.description" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <mavon-editor ref="md" v-model="form.content" :ishljs="true" @imgAdd="imgAdd"/>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="文章信息" :visible.sync="ViewDialog" width="60%">
            <el-card>
                <div>
                    <mavon-editor
                            class="md"
                            :value="content"
                            :subfield="false"
                            :defaultOpen="'preview'"
                            :toolbarsFlag="false"
                            :editable="false"
                            :scrollStyle="true"
                            :ishljs="true"/>
                </div>
            </el-card>
        </el-dialog>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "User",
        data(){
            return{
                user:JSON.parse(localStorage.getItem("user")),
                tableData: [],
                total:0,
                pageNum:0,
                pageSize:2,
                name: '',
                email:'',
                address:'',
                dialogFormVisible:false,
                form:{},
                multipleSelection:[],
                roles:[],
                role:[],
                content:'',
                ViewDialog:false,
            }
        },
        created() {
            this.load()
        },
        methods:{
            view(content){
                this.ViewDialog=true
                this.content = content
            },
            //绑定imgAdd事件
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
            handleSizeChange(pageSize){
                this.pageSize = pageSize
                this.load()
            },
            handleCurrentChange(pageNum){
                this.pageNum = pageNum
                this.load()
            },
            load(){
                this.request.get('/blog/page/uid',{
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
                this.username = ""
                this.email = ""
                this.address = ""
                this.load()
            },
            handleAdd(){
                this.dialogFormVisible=true
                this.form={}
            },

            save(){
                this.request.post('/blog/save',this.form).then((res)=>{
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
                this.request.delete('/blog/remove',{
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
                this.request.post('/blog/removeIds',ids).then((res)=>{
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