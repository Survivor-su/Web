<template>
    <div>
       <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>图形数据</el-breadcrumb-item>
            <el-breadcrumb-item>仓库库区数量</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
       </div>
    <!-- 定义显示图表区域 -->
    <div ref="main" style="width: 100%; height:500px;">

    </div>
    </div>
</template>
<script>
// 引入echarts组件和axios组件
import * as echarts from 'echarts'
import axios from 'axios'
export default {
    // 渲染页面前
    mounted() {
        this.initDat()
    },
    
    methods: {
        initDat() {
        
            // 获取this.$ref表示获取拥有ref属性的标签集合
            var chartDom = this.$refs.main//或this.$refs["main"]表示获取ref属性值为main的方法

            var myChart = echarts.init(chartDom);
            var option;
            // 使用axios请求controller后给option赋值
            axios.get("http://localhost:9090/wa_count_of_mapper",{headers: { token: window.localStorage.getItem("token") }}).then(res => {
                
                if (res.data.code != 0) {
                    this.$message({
                        message: res.data.msg,
                        type: "error"
                    })
                    return;
                }
                option = {
                    title: {
                        text: '数据柱状图'
                    },
                    // 决定数据类型
                    // x轴相关内容
                    xAxis: {
                        // x轴说明
                        name: '仓库名称',
                        type: 'category',
                        // 横坐标数据
                        data:  res.data.obj.xAxis
                    },
                    // y轴相关内容
                    yAxis: {
                        name: '仓区数量',
                        type: 'value'
                    },
                    series: [{
                        // 数据含义
                        name: '库区数据',
                        // 实际数据
                        data:  res.data.obj.series,
                        type: 'bar' //柱状图类型
                    }],
                    // 图注
                    legend: {
                        data: ['库区数据']
                    }
                };

                if (option && typeof option === 'object') {
                    myChart.setOption(option);
                }
                window.addEventListener('resize', myChart.resize);
            })
        },
    }
}
</script>
<style>

</style>