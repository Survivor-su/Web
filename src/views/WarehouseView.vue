<template>
    <!-- template只允许一个根标签 -->
    <div>

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
            <el-breadcrumb-item>仓库信息</el-breadcrumb-item>
        </el-breadcrumb>

        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <el-button type="primary" @click="toAdd()">添加</el-button>
            </el-col>
            <el-col :span="10">
                <div>
                    <el-input placeholder="请输入仓库关键名" v-model="keyword">
                        <el-button slot="append" @click="search()" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <el-divider></el-divider>




        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="whId" label="仓库编号" width="180">
            </el-table-column>
            <el-table-column prop="whName" label="仓库名称" width="180">
            </el-table-column>
            <el-table-column prop="whProfitCenter" label="利润中心">
            </el-table-column>
            <el-table-column prop="whAddr" label="地址">
            </el-table-column>
            <el-table-column prop="whCapacity" label="容量">
            </el-table-column>
            <el-table-column prop="whNotes" label="备注">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table> 
        <!--
             @size-change 每页显示数量发生变化时触发
             @current-change 当前页发生变化时触发
             :current-page当前页
             :total 总页数
             :page-size 当前页显示的记录数
             :page-sizes 能选择的显示记录数
         -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
            :page-sizes="[1, 5, 10, 15]" :page-size="size" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>




        <!-- 修改对话框 -->
        <el-dialog @close="upform()" width="400px" :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item v-show="updataShow" label="仓库编号" :label-width="formLabelWidth">
                    <el-input v-model="form.whId" readonly autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="仓库名称" :label-width="formLabelWidth">
                    <el-input v-model="form.whName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="仓库地址" :label-width="formLabelWidth">
                    <el-input v-model="form.whAddr" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="仓库容量" :label-width="formLabelWidth">
                    <el-input-number :min="0" :step="100" v-model="form.whCapacity" autocomplete="off">
                    </el-input-number>
                </el-form-item>


                <el-form-item label="利润中心" :label-width="formLabelWidth">
                    <el-select v-model="form.whProfitCenter" placeholder="请选择利润中心">
                        <el-option label="重庆" value="重庆"></el-option>
                        <el-option label="成都" value="成都"></el-option>
                        <el-option label="西安" value="西安"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仓库备注" :label-width="formLabelWidth">
                    <el-input v-model="form.whNotes" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="upform()">取 消</el-button>
                <el-button v-show="updataShow" type="primary" @click="updata()">修 改</el-button>
                <el-button v-show="insertShow" type="primary" @click="adddata()">添 加</el-button>
            </div>
        </el-dialog>




    </div>
</template>

<script>
//   引入axios
import axios from 'axios'
// 引入qs
import qs from 'qs'
export default {
    // 页面创建成功后通过axios访问服务器的某个URL
    created() {
        this.initData()
    },
    data() {
        return {
            keyword: "",
            tableData: [],
            page: 1,
            size: 5,
            total: 0,
            pages: 0,
            // 用于显示/隐藏修改窗口的变量
            dialogFormVisible: false,
            // 显示/隐藏窗口中组件的宽度
            formLabelWidth: '80px',
            // 修改窗口表单的数据
            form: {
                whId: '',
                whName: '',
                whAddr: '',
                whCapacity: '',
                whProfitCenter: '',
                whNotes: ''
            },
            updataShow: "",
            insertShow: "",
            title: ""
        }
    },
    methods: {
        toAdd() {
            this.dialogFormVisible = true
            this.title = "添加仓库信息"
            this.form = {}
            this.updataShow = false
            this.insertShow = true
        },
        handleEdit(index, row) {
            this.dialogFormVisible = true
            this.title = "修改仓库信息"
            this.updataShow = true
            this.insertShow = false
            this.form = row

        },
        adddata() {
            axios.post("http://localhost:9090/warehouse", qs.stringify(this.form),{headers:{token:window.localStorage.getItem("token")}}).then(res => {
                // console.log(res)
                if (res.data.code == 0) {
                    this.$message({
                        message: res.data.msg,
                        type: "success"
                    })
                    this.initData()
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: "warning"
                    })
                }
                this.dialogFormVisible = false
            })
        },
        search() {
            this.initData()
        },
        handleSizeChange(val) {
            this.size = val
            this.initData()
        },
        handleCurrentChange(val) {
            this.page = val
            this.initData();
        },
        initData() {
            // axios.get("http://localhost:9090/warehousePage?page=" + this.page + "&size=" + this.size).then(res => {
            axios.get("http://localhost:9090/warehousePage", { params: { page: this.page, size: this.size, keyword: this.keyword },headers:{token:window.localStorage.getItem("token")} }).then(res => {
                this.tableData = res.data.obj.records
                this.total = res.data.obj.total
                this.pages = res.data.obj.pages
            })
        },

        updata() {
            // 使用qs工具将form对象中的数据解析为字符串后拼接到请求中
            // 1.导入qs工具 import qs from 'qs'
            // 2.调用qs.stringify(对象方法),会解析对象中的所有属性为一个字符串
            axios.put("http://localhost:9090/warehouse", qs.stringify(this.form),{headers:{token:window.localStorage.getItem("token")}}).then(res => {
                // console.log(res)
                if (res.data.code == 0) {
                    this.$message({
                        message: res.data.msg,
                        type: "success"
                    })
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: "warning"
                    })
                }
                this.dialogFormVisible = false
            })
        },
        upform() {
            this.dialogFormVisible = false
            this.initData()
        },
        handleDelete(index, row) {


            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.delete("http://localhost:9090/warehouse/" + row.whId,{headers:{token:window.localStorage.getItem("token")}}).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        })
                        console.log(this.pages)
                        if (this.pages != res.data.obj.pages) {
                            --this.page
                            this.initData()
                        }
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.msg
                        })
                    }
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
}
</script>
<style>

</style>