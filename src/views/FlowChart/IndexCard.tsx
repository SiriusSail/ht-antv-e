import { defineComponent, ref, onMounted, provide, watch } from 'vue'
// import Graph from '@/components/Graph'
import * as Element from 'element-plus'
import { Node } from '@antv/x6';
import classNames from 'classnames';
import Iconfont from '@/components/Iconfont/index'
import { chartConfig } from './config'
import styles from './index.module.scss'
import Graph from '@/components/Graph/graph'
import Sidebar from './components/sidebar.vue'
import Footer from './components/footer'
import Slider from './components/slider'
import Tabel from '@/components/TableFormItem'
import http, {PageItem}from './components/indexCard/api';
import { FormOption} from '@/components/TableFormItem/index.d'

const { ElMessage, ElMessageBox, ElTooltip } = Element;

export default defineComponent({
  setup() {
    let graph: Graph = {} as any;
    const dataSources = ['1', '2', '3']; // 数据源tab 组
    const templates = ['4', '5']; // 卡片 tab 组
    const sideBarIndex = ref('6'); // 菜单 index
    const selectNode = ref<Node | null>();
    const formOptions = ref<FormOption[]>([]);
    const sliderValue = ref(1); // 放大倍率
    const isShowLeft = ref(true); // 展示列表
    const isShowFoot = ref(false); // 展示列表
    const isShowRight = ref(false); // 展示列表

    // 添加指标卡片
    const selectDataDeve = () => {
      graph.upDateStencil({
        title: '数据开发',
        layoutOptions: {
          columns: 3,
          columnWidth: 65,
        },
        nodeOppoOption: chartConfig,
      })
    };

    // const getList = () => {
    //   switch(sideBarIndex.value) {
    //     case '6':
    //       selectDataDeve();
    //       break;
    //     default:
    //   }
    // }

    // watch(sideBarIndex, getList)

    //  切换底部展示
    const toggleFooter = () => {
      graph.autoReSize({
        w: 1,
        h: 1
      })
      setTimeout(() => {
        graph.autoReSize()
      }, 400)
      isShowFoot.value = !isShowFoot.value
    }

    const intGraph = () => {
      // 创建x6实例
      graph = new Graph({
        containerId: 'graphContent',
        stencilId: 'stencilContent',
        minimapId: 'minimapContainer',
      })
      // 添加 选择 NODE 节点事件
      graph.graph.on('node:click', ({ e, x, y, node, view }) => {
        selectNode.value = node;
        switch (node.shape) {
          case 'echart-shape':
          // echatOption.value = node.attrs?.option;
            break;
          default:
            formOptions.value = []
        }
        isShowRight.value = true;
      })
      // 缩放回调
      graph.graph.on('scale', ({ sx, sy }) => {
        console.log(sx, sy);
        sliderValue.value = sx;
      })
      // 取消选择事件
      graph.graph.on('blank:click', () => {
        formOptions.value = [];
        selectNode.value = null;
        isShowRight.value = false;
      })
      // 删除时间
      graph.graph.on('node:removed', () => {
        formOptions.value = [];
        selectNode.value = null;
        isShowRight.value = false;
      })
      // 添加节点事件
      graph.graph.on('node:added', (data) => {
        console.log('data', 'added', data)
      })
      // graph.addStencilItem(dataDevelopmentConfig[0].options)
    }

    onMounted (() => {
      intGraph();
      selectDataDeve();
      // toggleFooter();
    })

    // 测试回显
    const showEcho = () => {
      const cells: Node.Metadata = [
        {
          position: {
            x: 70,
            y: 40,
          },
          size: {
            width: 400,
            height: 300,
          },
          view: "vue-shape-view",
          attrs: {
            body: {
              show: true,
            },
            option: {
              xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  data: [150, 230, 224, 218, 135, 147, 260],
                  type: "line",
                },
              ],
            },
            image: {
              width: 400,
              height: 300,
            },
          },
          shape: "echart-shape",
          id: "ac38fcb5-df5c-4659-8cfe-ee276362cc58",
          zIndex: 1,
        },
      ];
      const node = graph.graph.fromJSON(cells);
      console.log("eee", node);
    };

    let graphForm:Node.Metadata = [];
    let graphString = '';
    const draftsParam:PageItem = {limit: 10, page: 1};

    // 去掉无用的字段
    const filterData = () => {
      const orign = graph.graph.toJSON();
      graphForm = orign.cells.map((item) => {
        delete item.component
        return item;
      })
      graphString = JSON.stringify(graphForm)
      // ElMessage.info('序列化内容已打印到控制台')
      console.log('序列化流程图：', graphForm)
    }

    // 保存草稿箱
    const saveDrafts = async() => {
      filterData();
      await http.ApiSaveDrafts({content: graphString, name: 'a2'})
      ElMessage.success('成功')
      // showEcho();
    }

    // 获取草稿箱列表
    const getDraftsList = () => {
      draftsParam.status = 0;
      http.ApiGetDraftsList(draftsParam).then((res) => {
        // debugger
        const {result} = res;
        const replaceData = JSON.parse(result.records[result.records.length - 1].cardContent.replace(/\\/g, "").replace(/'/g, ""));
        console.log('草稿箱列表', replaceData)
        // const cur = JSON.parse(result.records[result.records.length-1].cardContent)

        graph.graph.fromJSON(replaceData)
      })

      // showEcho();
    }

    watch([sliderValue], ([foo]) => {
      const zoom = graph.graph.zoom();
      if (zoom !== foo) {
        graph.graph.zoom(foo - zoom);
      }
    })

    // 序列化x6
    const downLoad = () => {
      graph.graph.toPNG((dataUri: string) => {
        console.log(dataUri);
        // 下载
        // DataUri.downloadDataUri(dataUri, 'chart.png')
      })
    }

    const siderBarChange = async (newIndex: string, oldIndex: string) => {
      console.log(newIndex, oldIndex)
      if (
        (dataSources.includes(oldIndex) && dataSources.includes(newIndex)) ||
        (templates.includes(oldIndex) && templates.includes(newIndex))
      ) {
        console.log('旧图纸')
        return Promise.resolve(true);
      }
      await new Promise((resolve) => {
        ElMessageBox.confirm('本次操作尚未保存，是否保存后跳转')
          .then(() => {
            graph.graph.dispose();
            intGraph();
            resolve(true);
          })
          .catch(() => {
            graph.graph.dispose();
            intGraph();
            resolve(true);
          })
      })

    }

    provide('pageStore', {
      selectNode,
      formOptions,
    })

    return () => (
      <div className={styles.flow_chart}>
        {/* 左侧 */}
        <div className={styles.left}>
          <Sidebar value={sideBarIndex} onChange={siderBarChange} />
          <div className={classNames(styles.stencil_overflow, {
            [styles.stencil_hide]: !isShowLeft.value
          })}>
            <div className={styles.stencil_content} id='stencilContent'></div>
          </div>
          <div
            onClick={() => {
              setTimeout(() => {
                graph.autoReSize()
              }, 400)
              isShowLeft.value = !isShowLeft.value
            }}
            className={classNames(styles.collapse_item_title, styles.collapse_left)}
          >
            {isShowLeft.value ? '<' : '>'}
          </div>
        </div>

        {/* 中间 */}
        <div className={styles.center}>
          <div className={ classNames({
            graph_content_footer_show: isShowFoot.value
          }, styles.graph_content)}>
					  <div className={styles.graph_title}>
              <div>按车型 - 单车维修成本(YQ-C-20</div>
              <div className={classNames('flex-row', styles.graph_title_icon)}>
                <ElTooltip
                  effect='dark'
                  content={'锁定'}
                  placement='bottom'
                >
                  <Iconfont className={styles.graph_icon} name='icon-lock' />
                </ElTooltip>
                <ElTooltip
                  effect='dark'
                  content={'保存草稿箱'}
                  placement='bottom'
                >
								  <Iconfont  onClick={saveDrafts} className={styles.graph_icon} name='icon-save' />
                </ElTooltip>
                <ElTooltip
                  effect='dark'
                  content={'发布'}
                  placement='bottom'
                >
								  <Iconfont className={styles.graph_icon} name='icon-issue' />
                </ElTooltip>
                <ElTooltip
                  effect='dark'
                  content={'下载'}
                  placement='bottom'
                >
								  <Iconfont onClick={downLoad} className={styles.graph_icon} name='icon-download' />
                </ElTooltip>
                <ElTooltip
                  effect='dark'
                  content={'上传'}
                  placement='bottom'
                >
								  <Iconfont className={styles.graph_icon} name='icon-upload' />
                </ElTooltip>
                <ElTooltip
                  effect='dark'
                  content={'预览'}
                  placement='bottom'
                >
								  <Iconfont onClick={getDraftsList} className={styles.graph_icon} name='icon-preview' />
                </ElTooltip>
              </div>
            </div>
					  <div className={styles.graph} id='graphContent'></div>
            <div className={styles.graph_slider}>
              <Slider
                v-models={[
                  [sliderValue.value, 'value']
                ]}
              />
            </div>
          </div>
          <div className={classNames(styles.graph_footer_content, {
            [styles.graph_footer_hide]: !isShowFoot.value
          })}>
            <div
              onClick={toggleFooter}
              className={classNames(styles.graph_footer_icon)}
            >
              {!isShowFoot.value ? '^' : '···'}
            </div>
            <div className={styles.graph_footer}>
              <Footer />
            </div>
          </div>
        </div>

        {/* 右侧 */}
        <div className={classNames(styles.right, {
          [styles.right_hide]: !isShowRight.value
        })}>
          <div
            onClick={() => {
              setTimeout(() => {
                graph.autoReSize()
              }, 400)
              isShowRight.value = !isShowRight.value
            }}
            className={classNames(styles.collapse_item_title, styles.collapse_right)}
          >
            {!isShowRight.value ? '<' : '>'}
          </div>
          <div className={styles.right_overflow}>
            <div className={styles.right_content}>
              <div className={styles.info_table}>
                <Tabel />
              </div>
              <div className={styles.info_text}></div>
              <div className={styles.info_thumbnail} id='minimapContainer'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
