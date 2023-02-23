<template>
  <!-- 指标模型 -->
  <div class="IndexModel">
    <div id="mode-container"></div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  onMounted,
  nextTick,
} from "vue";
import IndexMode from "@/components/FlowChart/indexModel/index";
import { Colum } from "@/components/table/index.vue";
import Api, {
  DataSources,
  InputFields,
  Modifications,
  Detailprocess,
  Detailrights,
  DetailoutputFields,
} from "../api/index";

export default defineComponent({
  setup() {
    const indexMode = new IndexMode();
    const state = reactive({});
    const nodeData = {
      dataSource: <DataSources[]>[],
      inputFields: <InputFields[]>[],
      modifications: <Modifications[]>[],
      process: <Detailprocess>{},
      rights: <Detailrights[]>[],
      outputFields: <DetailoutputFields[]>[],
    }; //节点数据

    //判断type 返回图片或者文本公式
    const returnRander = (data: Detailprocess) => {
      if (data.processType === 1) {
        return indexMode.renderImg({
          id: "node4",
          x: 450, // Number，必选，节点位置的 x 值
          y: 57, // Number，必选，节点位置的 y 值
          width: 200, // Number，可选，节点大小的 width 值
          height: 270, // Number，可选，节点大小的 height 值
          data: data,
        });
      } else {
        return indexMode.renderFormula({
          id: "node4",
          x: 450, // Number，必选，节点位置的 x 值
          y: 57, // Number，必选，节点位置的 y 值
          width: 200, // Number，可选，节点大小的 width 值
          height: 270, // Number，可选，节点大小的 height 值
          data: data,
        });
      }
    };

    // 初始化
    const newFlowChart = () => {
      indexMode.newIndexMode(document.getElementById("mode-container")!);
      //渲染数据
      const renderData = {
        // 节点
        nodes: [
          indexMode.renderTable({
            id: "node1",
            x: 5, // Number，必选，节点位置的 x 值
            y: 10, // Number，必选，节点位置的 y 值
            width: 101, // Number，可选，节点大小的 width 值
            height: 50, // Number，可选，节点大小的 height 值
            data: {
              tableColumn: <Colum[]>[
                {
                  label: "数据源",
                  prop: "sourceName",
                  width: "100px",
                  resizable: false,
                },
                // {
                //   label: "状态",
                //   prop: "state",
                //   width: "50px",
                //   resizable: false,
                // },
              ],
              tableData: nodeData.dataSource,
            },
          }),
          indexMode.renderTable({
            id: "node2",
            x: 150, // Number，必选，节点位置的 x 值
            y: 10, // Number，必选，节点位置的 y 值
            width: 241, // Number，可选，节点大小的 width 值
            height: 200, // Number，可选，节点大小的 height 值
            data: {
              height: "200px",
              tableColumn: <Colum[]>[
                {
                  label: "维度",
                  align: "center",
                  prop: "dimension",
                  width: "80px",
                  resizable: false,
                  showOverflowTooltip: true,
                },
                {
                  label: "描述",
                  prop: "desc",
                  width: "80px",
                  resizable: false,
                  showOverflowTooltip: true,
                },
                {
                  label: "是否变量",
                  prop: "isVariable",
                  width: "80px",
                  resizable: false,
                  formatter(row: any) {
                    if (row.isVariable) {
                      return "是";
                    } else {
                      return "否";
                    }
                  },
                  showOverflowTooltip: true,
                },
              ],
              tableData: nodeData.inputFields,
            },
          }),
          indexMode.renderTable({
            id: "node3",
            x: 150, // Number，必选，节点位置的 x 值
            y: 280, // Number，必选，节点位置的 y 值
            width: 241, // Number，可选，节点大小的 width 值
            height: 200, // Number，可选，节点大小的 height 值
            data: {
              tableColumn: <Colum[]>[
                {
                  label: "维度",
                  prop: "dimension",
                  width: "120",
                  resizable: false,
                  showOverflowTooltip: true,
                },
                {
                  label: "描述",
                  prop: "modification",
                  width: "120px",
                  resizable: false,
                  showOverflowTooltip: true,
                },
              ],
              tableData: nodeData.modifications,
            },
          }),
          returnRander(nodeData.process),
          indexMode.renderTable({
            id: "node5",
            x: 700, // Number，必选，节点位置的 x 值
            y: 10, // Number，必选，节点位置的 y 值
            width: 301, // Number，可选，节点大小的 width 值
            height: 100, // Number，可选，节点大小的 height 值
            data: {
              tableColumn: <Colum[]>[
                {
                  label: "角色/人",
                  prop: "role",
                  width: "75px",
                  resizable: false,
                  showOverflowTooltip: true,
                },
                {
                  label: "机构/领域",
                  prop: "dept",
                  width: "75px",
                  resizable: false,
                  showOverflowTooltip: true,
                },
                {
                  label: "权限规则",
                  prop: "rightRule",
                  width: "75px",
                  resizable: false,
                  showOverflowTooltip: true,
                },
                {
                  label: "有效规则",
                  prop: "effectiveRule",
                  width: "75px",
                  resizable: false,
                  showOverflowTooltip: true,
                },
              ],
              tableData: nodeData.rights,
            },
          }),
          indexMode.renderTable({
            id: "node6",
            x: 700, // Number，必选，节点位置的 x 值
            y: 260, // Number，必选，节点位置的 y 值
            width: 351, // Number，可选，节点大小的 width 值
            height: 24 * nodeData.outputFields.length, // Number，可选，节点大小的 height 值
            data: {
              tableColumn: <Colum[]>[
                {
                  label: "字段名",
                  prop: "name",
                  width: "135px",
                  resizable: false,
                  showOverflowTooltip: true,
                },
                {
                  label: "类型",
                  prop: "paramType",
                  width: "135px",
                  resizable: false,
                  showOverflowTooltip: true,
                },
                {
                  label: "单位",
                  prop: "aliasName",
                  width: "80px",
                  resizable: false,
                  showOverflowTooltip: true,
                },
              ],
              tableData: nodeData.outputFields,
            },
          }),
        ],
        // 边
        edges: [
          indexMode.renderEdge({
            source: "node1",
            target: "node2",
          }),
          indexMode.renderEdge({
            source: "node3",
            target: "node2",
          }),
          indexMode.renderEdge({
            source: "node2",
            target: "node4",
          }),
          indexMode.renderEdge({
            source: "node4",
            target: "node5",
          }),
          indexMode.renderEdge({
            source: "node4",
            target: "node6",
          }),
        ],
      };

      indexMode.fromJSON(renderData);
    };
    let modeHeight = ref("500px");
    // 获取模型数据
    const requset = async (rowId: string) => {
      const res = await Api.getDetail(rowId);
      if (res.code == 200) {
        nodeData.dataSource = res.result.inputs.nodes[0].dataSources.nodes;
        nodeData.inputFields = res.result.inputs.nodes[0].inputFields.nodes;
        nodeData.modifications = res.result.inputs.nodes[0].modifications.nodes;
        nodeData.process = res.result.process.nodes[0];
        nodeData.rights = res.result.rights.nodes;
        nodeData.outputFields = res.result.outputFields.nodes;
        modeHeight.value = 500 + nodeData.outputFields.length * 27 + "px";
        nextTick(() => {
          indexMode.dispose();
          newFlowChart();
        });
      } else {
        Api.ElMessage.error(res.message);
        nextTick(() => {
          indexMode.dispose();
        });
      }
    };

    return { modeHeight, requset, newFlowChart, ...toRefs(state) };
  },
});
</script>
<style scoped lang="scss">
.IndexModel {
  width: 100%;
}
#mode-container {
  width: 100%;
  height: v-bind(modeHeight);
}
.IndexModel {
  :deep(.DataTable) {
    font-size: 8px;
    .labelheader {
      font-size: 8px;
      padding: 2px 0px;
      font-weight: 500;
    }
    .cellClass {
      padding: 2px 0px;
    }
  }
}
</style>
