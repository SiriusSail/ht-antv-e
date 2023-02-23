<template>
  <MyChart class="chart"
           ref="refChart"
           :option="options" />
</template>

<script lang="ts" setup>
  import dayjs from "dayjs";
  import { defineComponent, ref, onMounted } from "vue";
  import MyChart from "@/components/Echart/index.vue";
  import { getJan } from "../api/index";
  const refChart = ref(null)
  const options = ref({
    title: {
      text: '指标访问量'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      left: '40%',
      data: ['本期数', '目标数', '周期数']
    },
    grid: {
      left: '0%',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '本期数',
        type: 'line',
        data: [0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: '目标数',
        type: 'line',
        data: [0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: '周期数',
        type: 'line',
        data: [0, 0, 0, 0, 0, 0, 0]
      }
    ]
  });
  onMounted(() => {
    getJanList()
  })

  const getJanList = async () => {
    const res = await getJan();
    options.value.xAxis.data = []
    options.value.series[0].data = []
    if (res.result && res.result.length > 0) {
      res.result.map((item) => {
        options.value.series[0].data.push(item.currentTotal)
        options.value.series[1].data.push(item.expectTotal)
        options.value.series[2].data.push(item.periodTotal)
        options.value.xAxis.data.push(item.dateString)
      })
      refChart.value.echartInit()
    } else {
      options.value.xAxis.data = [1, 2, 3, 4, 5, 6, 7]
      options.value.series[0].data = [0, 0, 0, 0, 0, 0, 0]
      options.value.series[1].data = [0, 0, 0, 0, 0, 0, 0]
      options.value.series[2].data = [0, 0, 0, 0, 0, 0, 0]
    }
  }


</script>

<style scoped lang="scss">
  .chart {
    height: 240px;
  }
</style>