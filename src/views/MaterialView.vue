<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>物料管理</el-breadcrumb-item>
            <el-breadcrumb-item>物料信息</el-breadcrumb-item>
        </el-breadcrumb>

        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <el-button type="primary" @click="toAdd()">入库</el-button>
            </el-col>
            <el-col :span="10">
                <div>
                    <el-input placeholder="请输入物料名称关键名" v-model="keyword">
                        <el-button slot="append" @click="search()" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <el-divider></el-divider>

        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="物料编号" width="180">
            </el-table-column>
            <el-table-column prop="name" label="物料名称" width="180">
            </el-table-column>
            <el-table-column prop="count" label="当前库存">
            </el-table-column>
            <el-table-column prop="unit" label="计量单位">
            </el-table-column>
            <el-table-column prop="safeCount" label="安全库存">
            </el-table-column>
            <el-table-column prop="supplier" label="供应商">
            </el-table-column>
            <el-table-column prop="waId" label="所在库区">
                <template slot-scope="scope">
                    <span v-for="o in warehouseAreaList" v-if="o.waId == scope.row.waId">{{ o.waName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="230">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleOutput(scope.$index, scope.row)">出库</el-button>
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
            :page-sizes="[1, 5, 10, 15]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>



        <!-- 修改对话框 -->
        <el-dialog @close="upform()" width="400px" :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item v-show="updataShow" label="物料编号" :label-width="formLabelWidth">
                    <el-input v-model="form.id" readonly autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="物料名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" :disabled="readonly" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="当前库存" :label-width="formLabelWidth">
                    <el-input-number v-model="form.count" :disabled="readonly" :step="100" autocomplete="off"></el-input-number>
                </el-form-item>
                <el-form-item label="出库数量" :label-width="formLabelWidth">
                    <el-input-number v-model="count" :step="100" autocomplete="off"></el-input-number>
                </el-form-item>
                <el-form-item label="计量单位" :label-width="formLabelWidth">
                    <el-input :min="0" :step="100" :disabled="readonly" v-model="form.unit" autocomplete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="安全库存" :label-width="formLabelWidth">
                    <el-input-number :min="0" :disabled="readonly" :step="100" v-model="form.safeCount" autocomplete="off">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="供应商" :label-width="formLabelWidth">
                    <el-input :min="0" :step="100" :disabled="readonly" v-model="form.supplier" autocomplete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="所在库区" :label-width="formLabelWidth">
                    <el-select v-model="form.waId" :disabled="readonly" placeholder="请选择库区">
                        <el-option v-for="o in warehouseAreaList" :label="o.waName" :value="o.waId"
                            :disabled='o.waAvailableCapacity > 0 ? false : true'>
                            <span v-if="o.waName == ''">未定义名称</span>
                            {{ o.waName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;



                            <el-tag v-if="o.waAvailableCapacity == null" style="float: right;  font-size: 13px"
                                type="danger">
                                剩余容量:0
                            </el-tag>

                            <el-tag v-else-if="o.waAvailableCapacity >= o.waCapacity * 0.7" type="success"
                                style="float: right;  font-size: 13px">剩余容量:{{ o.waAvailableCapacity }}
                            </el-tag>

                            <el-tag v-else-if="o.waAvailableCapacity >= 0" type="warning"
                                style="float: right;  font-size: 13px">剩余容量:{{ o.waAvailableCapacity }}
                            </el-tag>

                            <el-tag v-else="o.waAvailableCapacity==0" style="float: right;  font-size: 13px" type="danger">
                                剩余容量:0
                            </el-tag>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="upform()">取 消</el-button>
                <el-button v-show="updataShow" type="primary" @click="updata()">修 改</el-button>
                <el-button v-show="insertShow" type="primary" @click="adddata()">入 库</el-button>
                <el-button v-show="output" type="primary" @click="outputRecord()">出 库</el-button>
            </div>
        </el-dialog>




    </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
export default {
    created() {

        this.initData()
    },
    data() {

        return {
            count:0,
            output: '',
            lable: '',
            readonly: false,
            tableData: [],
            form: {
                id: '',
                name: '',
                count: '',
                unit: '',
                safeCount: '',
                supplier: '',
                waId: '',
            },
            page: 1,
            size: 5,
            total: 0,
            keyword: '',
            warehouseAreaList: [],
            dialogFormVisible: false,
            // warehosue:[],
            insertShow: false,
            updataShow: false,
            formLabelWidth: "80px",
            title: "",

        }
    },
    methods: {
        upform() {
            this.dialogFormVisible = false
            this.initData()
        },
        // 跳入库
        toAdd() {
            
            this.readonly = false
            this.output = false
            this.title = "添加物料信息"
            this.dialogFormVisible = true
            this.updataShow = false
            this.insertShow = true
            this.form = {}
        },
        // 跳出库
        handleOutput(index, row) {
            this.title = "物料出库"
            this.dialogFormVisible = true
           
            this.readonly = true
            this.updataShow = false
            this.insertShow = false
            this.output = true
            this.form = row
            // axios.get("http://localhost:9090/warehouseArea").then(res=>{
            //     this.warehosue=res.data.list
            // })
        },
           // 跳编辑
           handleEdit(index, row) {
            
            this.readonly = false
            this.output = false
            this.title = "修改物料信息"
            this.dialogFormVisible = true
           
            this.updataShow = true
            this.insertShow = false

            this.form = row
            // axios.get("http://localhost:9090/warehouseArea").then(res=>{
            //     this.warehosue=res.data.list
            // })
        },
        //出库
        outputRecord() {

            this.$confirm('此操作将出库物料, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.form.count=this.count
                axios.put("http://localhost:9090/outMaterial", qs.stringify(this.form), { headers: { token: window.localStorage.getItem("token") } }).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        })
                        console.log(this.pages)
                        this.initData()
                        this.dialogFormVisible = false
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
                    message: '已取消出库'
                });
            });

        },
        // 修改
        updata() {

            this.$confirm('此操作将修改该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.put("http://localhost:9090/material", qs.stringify(this.form), { headers: { token: window.localStorage.getItem("token") } }).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        })
                        console.log(this.pages)
                        this.initData()
                        this.dialogFormVisible = false
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
                    message: '已取消修改'
                });
            });

        },
        // 入库
        adddata() {

            this.$confirm('此操作将修添加文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.post("http://localhost:9090/material", qs.stringify(this.form), { headers: { token: window.localStorage.getItem("token") } }).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        })
                        console.log(this.pages)
                        this.initData()
                        this.dialogFormVisible = false
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
                    message: '已取消添加'
                });
            });

        },
     

        search() {
            this.initData()
        },
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.delete("http://localhost:9090/material/" + row.id, { headers: { token: window.localStorage.getItem("token") } }).then(res => {
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
        },
        initData() {
            axios.get("http://localhost:9090/materialPage", { params: { page: this.page, size: this.size, keyword: this.keyword }, headers: { token: window.localStorage.getItem("token") } }).then(res => {
                console.log(res)
                this.tableData = res.data.obj.records
                this.total = res.data.obj.total
                this.pages = res.data.obj.pages
            })
            axios.get("http://localhost:9090/warehouseArea", { headers: { token: window.localStorage.getItem("token") } }).then(res => {
                this.warehouseAreaList = res.data.list
            })

        },
        handleSizeChange(val) {
            this.size = val
            this.initData()
        },
        handleCurrentChange(val) {
            this.page = val
            this.initData();
        },
    }
}

</script>
<style></style>