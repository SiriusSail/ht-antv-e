import { defineComponent, onMounted, ref, inject, reactive } from 'vue';
import { Node, Graph } from '@antv/x6';
import * as echarts from 'echarts';
import styles from './echatVide.module.scss';
import lineSimple from './images/lineSimple.jpeg';

type EChartsOption = echarts.EChartsOption;

export default defineComponent({
  setup(props, context) {
    const chatRef = ref<HTMLDivElement | null>();
    const chartDom = ref<HTMLElement | null>();
    const getGraph = inject<() => Graph >('getGraph')?.() || {} as Graph;
    const getNode = inject<() => Node >('getNode')?.() || {} as Node;
    const cartSize = ref(getNode.size());
    const option = ref<EChartsOption>();
    let myChart :echarts.ECharts;
    const updateEchart = () => {
      if (!chatRef.value) return;
      myChart = echarts.init(chatRef.value!, undefined, {
        width: cartSize.value.width,
        height: cartSize.value.height,
      });
    }

    onMounted(() => {
      if (!chatRef.value) return;

      cartSize.value = getNode.size();
      updateEchart();

      myChart.setOption(getNode.attrs?.option || {});

      getNode.on('change:size', () => {
        if (!chatRef.value) return;
        cartSize.value = getNode.size();
        myChart.resize(cartSize.value)
      }, this)

      getNode.on('change:attrs', () => {
        myChart.setOption(getNode.attrs?.option || {});
      }, this)
    })
    return () => {
      const { width, height } = cartSize.value;
      return (
        <div className={styles.content} style={{
          width: `${width}px`,
          height: `${height}px`,
        }}>
          {getNode.attrs?.body?.show
            ?
            <div
              // className={styles.echat_content}
              style={{
                width: `${width}px`,
                height: `${height}px`,
              }} ref={(e) => {
                chatRef.value = e;
              }}></div>
            : <img alt='' src={getNode.attrs?.image || lineSimple} style={{
              width: '100%',
              height: '100%',
            }} />
          }
        </div>)
    }

  },

})
