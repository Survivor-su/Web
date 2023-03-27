<template>
    <div>

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>物料管理</el-breadcrumb-item>
            <el-breadcrumb-item>出库数据</el-breadcrumb-item>
        </el-breadcrumb>

        <el-divider></el-divider>

        <el-row>
            <el-col :span="10">
                <div>
                    <el-input placeholder="请输入管理员关键ID" v-model="keyword">
                        <el-button slot="append" @click="search()" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>

        <el-divider></el-divider>

        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="orId" label="出库编号" width="180">
            </el-table-column>
            <el-table-column prop="mid" label="物料编号">
            </el-table-column>
            <el-table-column prop="orCount" label="出库数量">
            </el-table-column>
            <el-table-column prop="waId" label="出库库区编号" width="180">
            </el-table-column>
            <el-table-column prop="orTime" label="出库时间">
            </el-table-column>
            <el-table-column prop="suId" label="操作管理员ID">
            </el-table-column>
           
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
            :page-sizes="[1, 5, 10, 15]" :page-size="size" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
import axios from 'axios'
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
            outputRecord: {
                orId:'',
                orTime:'',
                waId: "",
                mId: "",
                orCount: "",
                usId: "",
            },
        }
    },
    methods: {
        initData() {
            axios.get("http://localhost:9090/outputRecordPage", { params: { page: this.page, size: this.size, keyword: this.keyword },headers:{token:window.localStorage.getItem("token")} }).then(res => {
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
    }
}
</script>
<style>

</style>