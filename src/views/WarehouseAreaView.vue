<template>
    <!-- <el-row>
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
    <el-divider></el-divider> -->

    <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="waId" label="库区编号" width="180">
        </el-table-column>
        <el-table-column prop="whId" label="所属仓库" width="180">
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
        </el-table-column>
        <el-table-column prop="waNote" label="备注">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">使用</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">停用</el-button>
            </template>
        </el-table-column>
    </el-table>
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
            page: 1,
            size: 5,
            keyword: "",
            tableData: [],
        }
    },
    methods: {
        initData() {
            axios.get("http://localhost:9090/warehouseAreaPage", { params: { page: this.page, size: this.size, keyword: this.keyword } }).then(res => {
                console.log(res)
                this.tableData = res.data.obj.records
            })
        }
    }
}
</script>
<style>

</style>