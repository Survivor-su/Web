<template>
    <div>

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
            <el-breadcrumb-item>库区信息</el-breadcrumb-item>
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
            <el-table-column prop="waId" label="库区编号" width="180">
            </el-table-column>
            <el-table-column prop="warehouse.whName" label="所属仓库" width="180">
            </el-table-column>
            <el-table-column prop="waName" label="库区名称">
            </el-table-column>
            <el-table-column prop="waAddr" label="库区地址">
            </el-table-column>
            <el-table-column prop="waCapacity" label="库区容量">
            </el-table-column>
            <el-table-column prop="waAvailableCapacity" label="库区可用容量">
            </el-table-column>
            <el-table-column prop="waStatus" label="库区状态">
                <template slot-scope="scope">
                    <el-tag class="ml-2" v-if="scope.row.waStatus == 0" type="success">闲置中</el-tag>
                    <el-tag class="ml-2" v-else type="danger">使用中</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="waNote" label="备注">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" type='primary' @click="handleUse(scope.$index, scope.row)"
                        v-if="scope.row.waStatus == 0">使用</el-button>
                    <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)"
                        v-if="scope.row.waStatus == 1">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleStop(scope.$index, scope.row)"
                        v-if="scope.row.waStatus == 1">停用</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
            :page-sizes="[1, 5, 10, 15]" :page-size="size" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <!-- 启动对话框 -->
        <el-dialog width="400px" :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="warehouseArea">
                <el-form-item label="库区编号" :label-width="formLabelWidth">
                    <el-input v-model="warehouseArea.waId" readonly autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="库区名称" :label-width="formLabelWidth">
                    <el-input v-model="warehouseArea.waName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="仓库备注" :label-width="formLabelWidth">
                    <el-input v-model="warehouseArea.waNote" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel()">取 消</el-button>
                <el-button v-show="editShow" type="primary" @click="edit()">修 改</el-button>
                <el-button v-show="useShow" type="primary" @click="use()">启 用</el-button>
            </div>
        </el-dialog>

        <!-- 添加对话框 -->
        <el-dialog width="400px" title="添加新库区信息" :visible.sync="addFormVisible">

            <el-form :model="warehouseArea">

                <el-form-item label="选择仓库" :label-width="formLabelWidth">
                    <el-select v-model="warehouseArea.whId" placeholder="请选择仓库">
                        <el-option v-for="(o, i) in warehouseList" :label="o.whName" :value="o.whId"
                            :disabled='o.whCapacity > o.waCapacity ? false : true'>
                            <span style="float: left">{{ o.whName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <el-tag v-if="o.whCapacity - o.waCapacity >= o.whCapacity * 0.7" type="success"
                                style="float: right;  font-size: 13px">剩余容量:{{ o.whCapacity - o.waCapacity }}</el-tag>
                            <el-tag v-else-if="o.whCapacity - o.waCapacity >= 0" type="warning"
                                style="float: right;  font-size: 13px">剩余容量:{{ o.whCapacity - o.waCapacity }}</el-tag>
                            <el-tag v-else="o.whCapacity-o.waCapacity==0" style="float: right;  font-size: 13px">
                                剩余容量:{{ 0 }}</el-tag>
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 
    <el-tag type="success">标签二</el-tag>
<el-tag type="warning">标签四</el-tag>
<el-tag type="danger">标签五</el-tag>
 -->
                <el-form-item label="库区名称" :label-width="formLabelWidth">
                    <el-input v-model="warehouseArea.waName" autocomplete="off" placeholder="请输入库区名称"></el-input>
                </el-form-item>
                <el-form-item label="库区容量" :label-width="formLabelWidth">
                    <el-input-number :min="0" :step="100" v-for="o in warehouseList" v-if="o.whId == warehouseArea.whId"
                        :max="o.whCapacity - o.waCapacity" v-model="warehouseArea.waCapacity" autocomplete="off">
                    </el-input-number>
                </el-form-item>
                <!-- <el-form-item label="仓库可用容量" :label-width="formLabelWidth">
                    <el-input v-model="warehouseArea.waAddr" autocomplete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="库区地址" :label-width="formLabelWidth">
                    <el-input v-model="warehouseArea.waAddr" autocomplete="off" placeholder="请输入库区地址"></el-input>
                </el-form-item>
                <el-form-item label="库区备注" :label-width="formLabelWidth">
                    <el-input v-model="warehouseArea.waNote" autocomplete="off" placeholder="请输入库区备注"></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelArea()">取 消</el-button>
                <el-button type="primary" @click="addArea()">添 加</el-button>
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
            total: 0,
            page: 1,
            size: 5,
            keyword: "",
            tableData: [],
            dialogFormVisible: false,
            title: "",
            warehouseArea: {
                waId: "",
                whId: "",
                waName: "",
                waAddr: "",
                waCapacity: "",
                waAvailableCapacity: "",
                waNote: "",
                waStatus: "",
            },
            editShow: false,
            useShow: false,
            formLabelWidth: "80px",
            addFormVisible: false,
            warehouseList: [],
        }
    },
    methods: {
        toAdd() {
            this.addFormVisible = true
            axios.get("http://localhost:9090/warehouseCapacity",{headers: { token: window.localStorage.getItem("token") }}).then(res => {
                this.warehouseList = res.data.list
            })
        },
        cancelArea() {
            this.addFormVisible = false
            this.warehouseArea = {}
        },
        addArea() {
            this.$confirm('此操作将新增库区, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.post("http://localhost:9090/warehouseArea", qs.stringify(this.warehouseArea),{headers: { token: window.localStorage.getItem("token") }}).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        })
                        this.initData()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.msg
                        })
                    }
                })
                this.warehouseArea = {}
                this.addFormVisible = false;
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消新增'
                })
            })
        },
        initData() {
            axios.get("http://localhost:9090/warehouseAreaPage", { params: { page: this.page, size: this.size, keyword: this.keyword },headers:{token:window.localStorage.getItem("token")} }).then(res => {
                console.log(res)
                this.tableData = res.data.obj.records
                this.total = res.data.obj.total
                this.pages = res.data.obj.pages
            })
        }, search() {
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
        handleUse(index, row) {
            this.dialogFormVisible = true
            this.warehouseArea = { waId: row.waId, waStatus: 1 }
            this.editShow = false
            this.useShow = true
            this.title = "启动库区信息配置"
        },
        cancel() {
            this.dialogFormVisible = false;
        },
        use() {
            this.$confirm('此操作将启用库区, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.put("http://localhost:9090/warehouseArea", qs.stringify(this.warehouseArea),{ headers: { token: window.localStorage.getItem("token") } } ).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        })
                        this.initData()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.msg
                        })
                    }
                })
                this.dialogFormVisible = false;
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消启用'
                })
            })
        },
        handleEdit(index, row) {
            this.dialogFormVisible = true
            this.warehouseArea = {}
            this.warehouseArea = { waId: row.waId, waStatus: 2, waName: row.waName, waNote: row.waNote }
            this.editShow = true
            this.useShow = false
            this.title = "修改库区信息配置"
        },
        handleStop(index, row) {
            this.$confirm('此操作将停用库区, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.put("http://localhost:9090/warehouseArea", qs.stringify({ waId: row.waId, waStatus: 0, waName: '', waNote: '' }),{headers: { token: window.localStorage.getItem("token") }}).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        })

                        this.initData()

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
                    message: '已取消停用'
                })
            })
        },
        edit() {
            this.$confirm('此操作将修改库区, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.put("http://localhost:9090/warehouseArea", qs.stringify(this.warehouseArea),{headers: { token: window.localStorage.getItem("token") }}).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        })

                        this.initData()

                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.msg
                        })
                    }
                })
                this.dialogFormVisible = false
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消修改'
                })
            })
        },
    }
}
</script>
<style>

</style>