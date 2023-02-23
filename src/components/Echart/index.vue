<template>
  <div ref="chart"
       class="chart_dom"></div>
</template>

<script lang="ts">
  import * as echarts from "echarts";
  import {
    defineComponent,
    onMounted,
    ref,
    onDeactivated,
    onUnmounted,
    markRaw,
  } from "vue";

  import "echarts-wordcloud/dist/echarts-wordcloud.min";

  export default defineComponent({
    props: {
      option: {
        type: Object,
        required: true,
        default: () => { },
      },
      init: {
        type: Boolean,
        default: true,
      },
    },
    emits: ['eventClick'],
    setup (porps, { emit }) {
      const myChart = ref<echarts.ECharts>();
      const chart = ref<HTMLElement>();

      const echartInit = () => {
        if (!chart.value) return;
        myChart.value = markRaw(echarts.init(chart.value));
        myChart.value.setOption(porps.option);
      };
      const resize = () => {
        myChart.value?.resize();
      };
      const dispose = () => {
        myChart.value?.dispose();
      };

      onMounted(() => {
        if (porps.init) echartInit();
        window.addEventListener("resize", resize);
        myChart.value?.on('click', function (param) {
          emit('eventClick', param)
        });
      });
      onDeactivated(() => {
        window.removeEventListener("resize", resize);
      });
      onUnmounted(() => {
        window.removeEventListener("resize", resize);
      });
      return { resize, echartInit, chart, dispose, myChart, emit };
    },
  });
</script>

<style scoped>
  .chart_dom {
    width: 100%;
    height: 100%;
  }
</style>
