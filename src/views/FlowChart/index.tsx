import { defineComponent, ref, onMounted, provide, watch } from 'vue'
// import Graph from '@/components/Graph'
import * as Element from 'element-plus'
import { Cell, DataUri } from '@antv/x6';
import classNames from 'classnames';
import { useRouter } from 'vue-router'
import Iconfont from '@/components/Iconfont/index'
import Graph from '@/components/Graph/graph'
import { CustomImage } from '@/components/Graph/CustomImage'
import Tabel from '@/components/TableFormItem'
import { FormOption} from '@/components/TableFormItem/index.d'
import flowchartSidebarStore from "@/layout/components/FlowchartSidebar/store";
import { assignment } from '@/utils/func';
import styles from './index.module.scss'
import Sidebar from './components/sidebar.vue'
import Footer from './components/footer'
import Slider from './components/slider'
import apis, { NodeRuleModelType, DdmflowPageRes } from './apis'
import Upfile from './components/upfile'
import Drafts from './components/drafts'
import TitleForm from './components/titleForm'
import downfile from './components/downfile'
// import asset from './icon/card.svg';
// import icons from './icon/index';
// import DraftsPage from "./components/indexCard/draftsPage.vue";

const {
  ElMessage,
  ElMessageBox,
  ElTooltip,
} = Element;

export default defineComponent({
  setup() {
    let graph: Graph = {} as any;
    const router = useRouter();
    const sideBarIndex = ref('5'); // 菜单 index
    const selectNode = ref<Cell | null>();
    const formOptions = ref<FormOption[]>([]);
    const sliderValue = ref(1); // 放大倍率
    const version = ref(0); // 版本
    const isShowLeft = ref(true); // 展示列表
    // const isHideCart = ref(true); // 购物车
    const isShowForm = ref(false); // 是否展示表单
    const isShowFoot = ref(false); // 展示列表
    const isShowRight = ref(true); // 展示列表
    const flowchartStore = flowchartSidebarStore()
    const titleFormValues = ref({
      code: '',
      name: '',
      flowDefContent: '',
      flowType: '',
      gradation: [], // 指标层次
      dimension: '', // 分流程
      flowLevel: '', // 指标层级
    }); // 展示列表

    const postDdmflow = apis.保存数据开发({
      needInit: false
    })
    const viewDdmflow = apis.预览数据开发({
      needInit: false
    })
    const initModelInfo = apis.数据开发左侧列表({
      needInit: false
    })
    const getInitModelInfo = apis.获取指标数据({
      needInit: !!router.currentRoute.value.params.rowid,
      params: router.currentRoute.value.params.rowid as string
    })

    const selectDataDeve = async() => {

      graph.upDateStencil({
        title: '数据开发',
        layoutOptions: {
          columns: 4,
          columnWidth: 50,
        },
        nodeOppoOption: [{
          title: '测试',
          options: [
            {
              shape: 'imageText',
              // 还有什么属性可以加在这一层
              attrs: { // 这一层可以添加放入其他的数据
                moduleData: {},
                label: { // 组件名称
                  text: '图案',
                },
                body: { // 可以不用要
                  stroke: '#CDEAFF',
                  fill: '#CDEAFF',
                },
                background: { // 可以不用要
                  stroke: '#CDEAFF',
                  fill: '#CDEAFF',
                },
                image: { // 图片地址 svg 格式
                  'xlink:href': '/admin/flowChart/icon/card.svg',
                },
              },
            },
            {
              shape: 'imageText',
              // 还有什么属性可以加在这一层
              attrs: { // 这一层可以添加放入其他的数据
                moduleData: {},
                label: { // 组件名称
                  text: '图案2',
                },
                body: { // 可以不用要
                  stroke: '#CDEAFF',
                  fill: '#CDEAFF',
                },
                background: { // 可以不用要
                  stroke: '#CDEAFF',
                  fill: '#CDEAFF',
                },
                image: { // 图片地址 svg 格式
                  'xlink:href': '/admin/flowChart/icon/card.svg',
                },
              },
            }
          ]
        }],
      })
      // initModelInfo.request().then((res) => {
      //   const data = Object.entries(res.nodeRule).map(([key, item]) => ({
      //     title: key,
      //     options: item.map((item2) => ({
      //       shape: 'imageText',
      //       // 还有什么属性可以加在这一层
      //       attrs: { // 这一层可以添加放入其他的数据
      //         moduleData: item2,
      //         label: { // 组件名称
      //           text: item2.name || item2.description,
      //         },
      //         body: { // 可以不用要
      //           stroke: item2.enabled === false ? '#8e8f8f' : '#CDEAFF',
      //           fill: item2.enabled === false ? '#8e8f8f' : '#CDEAFF',
      //         },
      //         background: { // 可以不用要
      //           stroke: item2.enabled === false ? '#8e8f8f' : '#CDEAFF',
      //           fill: item2.enabled === false ? '#8e8f8f' : '#CDEAFF',
      //         },
      //         image: { // 图片地址 svg 格式
      //           'xlink:href': item2.icon ? `/admin/flowChart/icon/${item2.icon}` : '/admin/flowChart/icon/card.svg',
      //         },
      //       },
      //     }))
      //   }))
      // });

    }

    const getList = () => {
      switch(sideBarIndex.value) {
        case '5':
          selectDataDeve();
          break;
        default:
      }
    }

    watch(sideBarIndex, getList)

    //  切换底部展示
    const toggleFooter = (status?: boolean) => {
      graph.autoReSize({
        w: 1,
        h: 1
      })
      setTimeout(() => {
        graph.autoReSize()
      }, 400)
      if (typeof status === 'boolean') {
        isShowFoot.value = status;
      } else {
        isShowFoot.value = !isShowFoot.value;
      }
    }

    const intGraph = () => {
      // 创建x6实例
      graph = new Graph({
        containerId: 'graphContent',
        stencilId: 'stencilContent',
        minimapId: 'minimapContainer',
      })
      // 添加 选择 NODE 节点事件
      graph.graph.on('node:click', async ({ e, x, y, node, view }) => {
        formOptions.value = [];
        console.log(node);
        await graph.updateRelationship(node as any);
        (node as CustomImage).graphForm.useFormChange(() => {
          formOptions.value = (selectNode.value?.attrs?.formOptions as any) as FormOption[];
        })

        selectNode.value = node;
        (node as CustomImage).graphForm.upDateForm();
      })
      // 缩放回调
      graph.graph.on('scale', ({ sx, sy }) => {
        console.log(sx, sy);
        sliderValue.value = sx;
      })
      // 取消选择事件
      graph.graph.on('blank:click', () => {
        formOptions.value = [];
        selectNode.value?.off('change:attrs');
        selectNode.value = null;
      })
      // 删除事件
      graph.graph.on('node:removed', () => {
        formOptions.value = [];
        selectNode.value?.off('change:attrs');
        selectNode.value = null;
      })
      // 添加节点事件
      graph.graph.on('node:added', ({ cell }) => {
        if (cell.attrs.moduleData.enabled === false) {
          ElMessage.error('节点不可用')
          cell.remove();
        }
      })

      // 节点连接条件添加
      graph.graph.on('edge:connected', (data) => {
        const { sourceView, targetView } = data.view;
        if (!data.edge?.id) return;
        // 上游节点数据
        const sourceViewModuleData = (sourceView?.cell.getAttrs().moduleData as any) as NodeRuleModelType;
        // 下游节点数据
        const targetViewModuleData = (targetView?.cell.getAttrs().moduleData as any) as NodeRuleModelType;
        let isError = false;
        let mssage = '';
        let sourceViewHeaders = 0; // 上游节点当了几次头部
        let targetViewTails = 0; // 下游节点当了几次尾部

        const edges = graph.graph.getEdges();
        edges.forEach((item: any) => {
          if (item.getSource().cell === sourceView?.cell.id) {
            sourceViewHeaders++
          }
          if (item.getTarget().cell === targetView?.cell.id) {
            targetViewTails++
          }
        })
        // 判断上游节点是否可以连接下游节点
        if (
          (sourceViewModuleData.tailBigTypeRule && !sourceViewModuleData.tailBigTypeRule.includes(targetViewModuleData.bigType)) ||
          (sourceViewModuleData.rejectTailNodeRule && sourceViewModuleData.rejectTailNodeRule.includes(targetViewModuleData.type))
        ) {
          isError = true
          mssage = `关系创建失败: 节点 '${sourceViewModuleData.name || sourceViewModuleData.description}' 不能指向 节点 '${targetViewModuleData.name || targetViewModuleData.description}' `
        }
        // 判断下游节点是否可以连接上游节点
        else if (
          (targetViewModuleData.headBigTypeRule && !targetViewModuleData.headBigTypeRule.includes(sourceViewModuleData.bigType)) ||
          (targetViewModuleData.rejectHeadNodeRule && targetViewModuleData.rejectHeadNodeRule.includes(sourceViewModuleData.type))
        ) {
          isError = true
          mssage = `关系创建失败: 节点 '${sourceViewModuleData.name || sourceViewModuleData.description}' 不能指向 节点 '${targetViewModuleData.name || targetViewModuleData.description}' `
        }
        else if (sourceView?.cell.id === targetView?.cell.id) {
          isError = true
          mssage = '节点不可连接节点本身'
        }
        else if(sourceViewHeaders > 1 || targetViewTails > (targetViewModuleData.headMaxCount || 1)) {
          isError = true
          mssage = '节点连接数量过多'
        }


        if (isError) {
          graph.graph.removeNode(data.edge.id)
          ElMessage.error(mssage)
        }
        console.log('上游节点输出次数', sourceViewHeaders)
        console.log('下游节点接收次数', targetViewTails)
        console.log('上游节点数据', sourceViewModuleData)
        console.log('下游节点数据', targetViewModuleData)
      })
    }

    onMounted (() => {
      intGraph();
      getList();
    })

    // 序列化x6
    const graphFrom = async (status: 0 | 1 | 2) => {
      const graphForm = graph.toJSON({
        isValiDate: !!status
      });
      const dataUrl = new Promise<string>((resolve) => {
        graph.graph.toPNG((dataBase: string) => {
          // 下载
          console.log(dataBase)
          resolve(dataBase)
          // DataUri.downloadDataUri(dataUri, 'chart.png')
        })
      })
      if (!graphForm.success) return false;
      if (status !== 2) {

        if (!titleFormValues.value.name || !titleFormValues.value.flowType || !titleFormValues.value.flowDefContent) {
          ElMessage.error('请完善指标信息')
          isShowForm.value = true;
          return false;
        }
      }
      const params = graphForm.json.cells.map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { formOptions: _formOptions, ...attrs } = item.attrs;
        const data = {
          ...item,
          attrs
        }
        return data
      })

      const thumbnail = await dataUrl;
      const param: any = {
        cellList: graph.getTreeJSON(),
        formJSON: params,
        version: graphForm.version,
        status,
        thumbnail,
        // name: titleFormValues.value.name,
        // code: titleFormValues.value.code,
        // flowType: titleFormValues.value.flowType,
        // flowDefContent: titleFormValues.value.flowDefContent,
        ...titleFormValues.value,
        gradation: titleFormValues.value.gradation.toString()
      }
      const { rowId } = getInitModelInfo.data;
      if (rowId) {
        param.rowId = rowId
        console.log(version.value, param.version);
        if (version.value === param.version && status === getInitModelInfo.data.status) {
          return false;
        }
      }
      version.value = param.version
      return param
    }

    watch([sliderValue], ([foo]) => {
      const zoom = graph.graph.zoom();
      if (zoom !== foo) {
        graph.graph.zoom(foo - zoom);
      }
    })

    watch([getInitModelInfo.dataRef], () => {
      const data = JSON.parse(getInitModelInfo.data.jsonStr);
      data.gradation = data.gradation?.split(",") || [];
      graph.graph.dispose();
      version.value = data.version;
      assignment(titleFormValues.value, data)
      // titleFormValues.value = {
      //   name: data.name,
      //   code: data.code,
      //   flowDefContent: data.flowDefContent,
      //   flowType: data.flowType,
      //   flowLevel:data.flowLevel,
      //   dimension:data.dimension,
      //   gradation:data.dimension.split(","),
      // }
      intGraph();
      try {
        graph.fromJSON(data.formJSON);
      } catch (error) {
        ElMessage.error('error: 无法识别，草稿箱已过期')
      }
    })

    provide('pageStore', {
      selectNode,
      formOptions,
      viewDdmflowData: viewDdmflow.dataRef,
    })

    return () => (
      <div className={classNames(styles.flow_chart, 'flow_chart')}>
        {/* 左侧 */}
        <div className={styles.left}>
          {/* <Sidebar value={sideBarIndex} onChange={siderBarChange} key='5' /> */}
          <div v-loading={initModelInfo.loading} className={classNames(styles.stencil_overflow, {
            [styles.stencil_hide]: !isShowLeft.value
          })}>
            <div className={styles.stencil_content} id='stencilContent'></div>
            {/* <DraftsPage
              showFlag={isHideCart.value}
              onClose={() => {isHideCart.value = true}}
              onChange={console.log}
            /> */}
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
        <div
          className={styles.center}
          v-loading={postDdmflow.loading || viewDdmflow.loading || getInitModelInfo.loading}
        >
          <div className={ classNames({
            graph_content_footer_show: isShowFoot.value
          }, styles.graph_content)}>
					  <div className={styles.graph_title}>
              <div onClick={() => {isShowForm.value = true}}>
                {`${
                  titleFormValues.value.name || '新建指标'
                } ${
                  titleFormValues.value.flowDefContent ? `(${titleFormValues.value.flowDefContent}` : ''
                }`}
              </div>
              <div className={classNames('flex-row', styles.graph_title_icon)}>
                <ElTooltip
                  content={'已锁定'}
                  placement='bottom'
                >
                  <Iconfont className={styles.graph_icon} name='icon-lock' />
                </ElTooltip>
                <ElTooltip
                  content={'保存到草稿箱'}
                  placement='bottom'
                >
								  <Iconfont
                    onClick={async() => {
                      const data = await  graphFrom(0);
                      if (!data) return;
                      if (graph.isEmpty()) {
                        ElMessage.info('无内容')
                        return;
                      };
                      postDdmflow.request(data)
                        .then((res) =>
                        {
                          router.replace(`/flowchart/index/${res.rowId}`)
                          ElMessage.success('操作成功')

                        });
                    }}
                    className={styles.graph_icon}
                    name='icon-save' />
                </ElTooltip>
                <ElTooltip
                  content={'发布'}
                  placement='bottom'
                  v-loading={postDdmflow.loading}
                >
								  <Iconfont
                    onClick={async () => {
                      const data = await graphFrom(1);
                      if (!data) return;
                      if (graph.isEmpty()) {
                        ElMessage.info('无内容')
                        return
                      };

                      postDdmflow.request(data)
                        .then((res) => {
                          router.replace(`/flowchart/index/${res.rowId}`);
                          getInitModelInfo.request(res.rowId)
                          viewDdmflow.request(data).then(() => {
                            toggleFooter(true);
                          });
                        })
                    }}
                    className={styles.graph_icon}
                    name='icon-issue'
                  />
                </ElTooltip>
                <ElTooltip
                  content={'下载到本地'}
                  placement='bottom'
                >
								  <Iconfont
                    onClick={() => {
                      const data = graphFrom(0);
                      if (graph.isEmpty()) {
                        ElMessage.info('无内容')
                        return
                      }
                      const jsonData = JSON.stringify(data)
                      downfile(`${
                        titleFormValues.value.name || '新建指标'
                      } ${
                        titleFormValues.value.flowDefContent ? `(${titleFormValues.value.flowDefContent}` : ''
                      }.txt`, jsonData)
                    }}
                    className={styles.graph_icon}
                    name='icon-download'
                  />
                </ElTooltip>
                <ElTooltip
                  content={'上传到画布'}
                  placement='bottom'
                >
                  <Upfile
                    content={<Iconfont className={styles.graph_icon} name='icon-upload' />}
                    onChange={(value) => {
                      if (typeof value === 'string') {
                        graph.graph.dispose();
                        intGraph();
                        const data = JSON.parse(value);
                        try {
                          graph.fromJSON(data.formJSON);
                        } catch (error) {
                          console.log(error);
                          ElMessage.error('error: 无法识别，文件读取错误')
                        }
                      }
                    }}
                  />

                </ElTooltip>
                <ElTooltip
                  content={'预览'}
                  placement='bottom'
                >
								  <Iconfont
                    onClick={async () => {
                      const data = await graphFrom(2);
                      if (!data) return;
                      if (graph.isEmpty()) {
                        ElMessage.info('无内容')
                        return
                      }
                      viewDdmflow.request(data).then(() => {
                        toggleFooter(true);
                      });
                    }}
                    className={styles.graph_icon}
                    name='icon-preview' />
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
              onClick={() => toggleFooter()}
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
        <TitleForm
          onSubmit={(value) => {
            titleFormValues.value = value;
          }}
          intValue={titleFormValues.value}
          isShowForm={isShowForm.value}
          onClose={() => {
            isShowForm.value = false
          }}
        />
        <Drafts
          isShow={flowchartStore.isShowDrafts}
          onSelect={(value: DdmflowPageRes) => {
            router.push(`/flowchart/index/${value.rowId}`);
          }}
          getList={(page: number) => apis.获取草稿箱.request({page})}
          delegeDdmflow={apis.删除指标.request}
          onClose={() => {
            flowchartStore.isShowDrafts = false
          }}
        />
      </div>
    )
  }
})
