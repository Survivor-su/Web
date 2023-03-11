<template>

    <div>

        <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>图形数据</el-breadcrumb-item>
            <el-breadcrumb-item>仓库库区数量</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
       </div>
       <div id="main" style="width:100%;height:500px;">

</div>
    </div>
   
</template>
<script>
import axios from 'axios'
import * as echarts from 'echarts'
export default {
    
    mounted() {
        this.initData()
    },
    methods: {
        initData() {
            axios.get("http://localhost:9090/capacity_oh_wh",{headers: { token: window.localStorage.getItem("token") }}).then(res => {
                if (res.data.code != 0) {
                    this.$message({
                        message: res.data.msg,
                        type: "error"
                    })
                    return;
                }
                var chartDom = document.getElementById('main');
                var myChart = echarts.init(chartDom);
                var option;
                console.log(res)
                option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: '5%',
                        left: 'center'
                    },
                    series: [
                        {
                            name: '单位:件',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '40',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: res.data.list
                        }
                    ]
                };

                option && myChart.setOption(option);
            })
        }
    }
}


</script>
<style>

</style>