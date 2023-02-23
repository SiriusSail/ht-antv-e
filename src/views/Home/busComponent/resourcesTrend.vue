<template>
  <el-row :gutter="10">
    <el-col :span="16">
      <MyChart class="chart"
               ref='refChart'
               :option="options" />
    </el-col>
    <el-col :span="8">
      <div class="january_col">
        <div class="sub_title">
          <span class="num">{{num}}</span>
          <span class="text">人•天</span>
        </div>
        <MyChart class="chart"
                 ref='refJanuary'
                 :option="january" />
      </div>
    </el-col>
  </el-row>

</template>

<script lang="ts" setup>
  import { defineComponent, onMounted, ref } from "vue";
  import MyChart from "@/components/Echart/index.vue";
  import { getIicindcardTrend, iicresourcesgap } from "../api/index";
  const refChart = ref(null)
  const refJanuary = ref(null)
  const num = ref(0)
  const options = ref({
    title: {
      text: '研发资源走势'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: '30px',
      left: '5px',
      data: ['IPD', 'SRM', 'STE', 'OTD', 'PMS']
    },
    grid: {
      left: '5px',
      right: '4%',
      bottom: '4%',
      top: '35%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'IPD',
        type: 'line',
        stack: 'Total',
        data: [0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: 'SRM',
        type: 'line',
        stack: 'Total',
        data: [0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: 'STE',
        type: 'line',
        stack: 'Total',
        data: [0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: 'OTD',
        type: 'line',
        stack: 'Total',
        data: [0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: 'PMS',
        type: 'line',
        stack: 'Total',
        data: [0, 0, 0, 0, 0, 0, 0]
      }
    ]
  });
  const january = ref({
    title: {
      text: '未来一月资源缺口',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '未来一月资源缺口',
        type: 'pie',
        radius: '80%',
        top: '50px',
        label: {
          formatter: '{b}',
          position: 'inside'
        },
        data: [
          { value: 0, name: 'IPD' },
          { value: 0, name: 'SRM' },
          { value: 0, name: 'STE' },
          { value: 0, name: 'OTD' },
          { value: 0, name: 'PMS' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 4,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
  onMounted(() => {
    getList()
    getJanList()
  })

  const getList = async () => {
    const res = await getIicindcardTrend();
    options.value.xAxis.data = []
    options.value.series[0].data = []
    options.value.series[1].data = []
    options.value.series[2].data = []
    options.value.series[3].data = []
    options.value.series[4].data = []
    if (res.result && res.result.length > 0) {
      res.result.map((item) => {
        options.value.series[0].data.push(item.ipd)
        options.value.series[1].data.push(item.srm)
        options.value.series[2].data.push(item.ste)
        options.value.series[3].data.push(item.otd)
        options.value.series[4].data.push(item.pms)
        options.value.xAxis.data.push(item.dateString)
      })
      refChart.value.echartInit()
    } else {
      options.value.xAxis.data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      options.value.series[0].data = [0, 0, 0, 0, 0, 0, 0]
      options.value.series[1].data = [0, 0, 0, 0, 0, 0, 0]
      options.value.series[2].data = [0, 0, 0, 0, 0, 0, 0]
      options.value.series[3].data = [0, 0, 0, 0, 0, 0, 0]
      options.value.series[4].data = [0, 0, 0, 0, 0, 0, 0]
    }
  }

  const getJanList = async () => {
    const res = await iicresourcesgap();
    if (res.result && JSON.stringify(res.result) != "{}") {
      january.value.series[0].data[0].value = res.result.ipdGap
      january.value.series[0].data[1].value = res.result.srmGap
      january.value.series[0].data[2].value = res.result.steGap
      january.value.series[0].data[3].value = res.result.otdGap
      january.value.series[0].data[4].value = res.result.pmsGap
      num.value = res.result.ipdGap + res.result.srmGap + res.result.steGap + res.result.otdGap + res.result.pmsGap
      refJanuary.value.echartInit()
    } else {
      january.value.series[0].data = [{ value: 0, name: 'IPD' },
      { value: 0, name: 'SRM' },
      { value: 0, name: 'STE' },
      { value: 0, name: 'OTD' },
      { value: 0, name: 'PMS' }]
    }
  }

</script>

<style scoped lang="scss">
  .chart {
    height: 240px;
  }
  .january_col {
    position: relative;
    .sub_title {
      position: absolute;
      left: 40%;
      top: 12%;
      .num {
        color: red;
        font-size: 20px;
      }
      .text {
        font-size: 12px;
      }
    }
  }
</style>