<template>
  <div class="MyMission">
    <!-- 搜索框 -->
    <div class="myMission-header">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-select size="small"
                     v-model="pagination.demandOrTask"
                     filterable
                     placeholder="全部"
                     @change="handleTypesChage">
            <el-option v-for="item in options2"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"
                       :value-key="item.value" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select size="small"
                     v-model="pagination.isAll"
                     filterable
                     placeholder="全部"
                     @change="handleAllChage">
            <el-option v-for="item in options4"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"
                       :value-key="item.value" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input size="small"
                    v-model="pagination.demandName"
                    @input="changeInput"
                    placeholder="搜索或过滤结果">
            <template #prefix>
              <em class="el-input__icon el-icon-search" />
            </template>
          </el-input>
        </el-col>
        <el-button size="small"
                   type="primary"
                   @click="onRefresh">查询</el-button>
        <el-button size="small"
                   type="primary"
                   @click="handleAdd">新增</el-button>
      </el-row>
    </div>
    <div class="MyMission-body">
      <div class="m-item">
        <DraggableList ref="refOneItem"
                       color="#E0EDFF"
                       label="待评审"
                       :num="orderNum.one"
                       :types="1"
                       @eventPre="handlePre"
                       @eventNext="handleNext"
                       :pages="pagination">
          <div :ref="oneRef"
               class="list"
               :types="1">
            <DraggableItem :types="1"
                           v-for="item in listOne"
                           :item="item"
                           :key="item.id"
                           class="item"
                           color="#FFBA48"
                           @eventItem="handleItem" />
          </div>
        </DraggableList>
      </div>
      <div class="m-item">
        <DraggableList ref="refTwoItem"
                       color="#E0EDFF"
                       label="评审"
                       :num="orderNum.two"
                       :types="2"
                       @eventPre="handlePre"
                       @eventNext="handleNext"
                       :pages="pagination1">
          <div :ref="twoRef"
               class="list"
               :types="2">
            <DraggableItem :types="2"
                           v-for="item in listTwo"
                           :item="item"
                           :key="item.id"
                           class="item"
                           color="#C5DEFF"
                           @eventItem="handleItem" />
          </div>
        </DraggableList>
      </div>
      <div class="m-item">
        <DraggableList ref="refThreeItem"
                       color="#E0EDFF"
                       label="开发"
                       :num="orderNum.three"
                       :types="3"
                       @eventPre="handlePre"
                       @eventNext="handleNext"
                       :pages="pagination2">
          <div :ref="threeRef"
               class="list"
               :types="3">
            <DraggableItem :types="3"
                           v-for="item in listThree"
                           :item="item"
                           :key="item.id"
                           class="item"
                           color="#E0EAF2"
                           @eventItem="handleItem" />
          </div>
        </DraggableList>
      </div>
      <div class="m-item">
        <DraggableList ref="refFourItem"
                       color="#E0EDFF"
                       label="测试"
                       :num="orderNum.four"
                       :types="4"
                       @eventPre="handlePre"
                       @eventNext="handleNext"
                       :pages="pagination3">
          <div :ref="fourRef"
               class="list"
               :types="4">
            <DraggableItem :types="4"
                           v-for="item in listFour"
                           :item="item"
                           :key="item.id"
                           class="item"
                           color="#5FE1A9"
                           @eventItem="handleItem" />
          </div>
        </DraggableList>
      </div>
      <div class="m-item">
        <DraggableList ref="refFiveItem"
                       color="#E0EDFF"
                       label="待发布"
                       :num="orderNum.five"
                       :types="5"
                       @eventPre="handlePre"
                       @eventNext="handleNext"
                       :pages="pagination4">
          <div :ref="fiveRef"
               class="list"
               :types="5">
            <DraggableItem :types="5"
                           v-for="item in listFive"
                           :item="item"
                           :key="item.id"
                           class="item"
                           color="#FFAA97"
                           @eventItem="handleItem" />
          </div>
        </DraggableList>
      </div>
    </div>

    <el-dialog top="20px"
               custom-class="kanban-dialog"
               v-model="dialogVisible"
               title="需求详情"
               width="95%"
               :close-on-click-modal="false"
               @opened="opened"
               @close="close">
      <div class="dialog-con">
        <div class="c-head">
          <el-row :gutter="20">
            <el-col :span="18">
              <el-steps :active="4"
                        align-center>
                <el-step :title="item.changeDate"
                         v-for="(item, index) in demandReviewState"
                         :key="item.changeDate">
                  <template #icon>
                    <em v-if="demandReviewState.length === index + 1"
                        class="el-icon-check"></em>
                    <!-- {{item.stateName}} -->
                    <span v-else> {{ index + 1 }}</span>
                  </template>
                </el-step>
              </el-steps>
              <div class="form">
                <addDemand ref="refDemand"
                           :isLoading="isLoading"
                           @eventSubmit="handleSubmit"
                           @reightData="getReightData" />
              </div>
            </el-col>
            <el-col :span="6">
              <div class="feasibility">敬请期待</div>
              <div class="info">
                <el-button type="primary"
                           size="mini"
                           @click="handleShowTask">{{ isShowTack ? "取消" : "开始" }}任务分解</el-button>
                <el-button class="btn"
                           size="mini"
                           type="primary"
                           @click="handleLead">导出</el-button>
                <div class="devInformation">
                  <template v-if="isShowTack">
                    <MyForm ref="formRef"
                            :form="queryData"
                            status-icon
                            :list="fromData"
                            label-position="right"
                            label-width="auto">
                      <template #submit>
                        <div class="operation">
                          <el-button type="primary"
                                     size="small"
                                     @click="handleTaskSubmit">保存</el-button>
                        </div>
                      </template>
                    </MyForm>
                  </template>
                </div>
                <div class="col_task">
                  <template v-if="taskData.length > 0">
                    <MyTable border
                             :data="taskData"
                             :column="taskTableColumn"></MyTable>
                  </template>
                </div>

                <template v-if="reightData.length > 0">
                  <MyTable border
                           :data="reightData"
                           :column="tableColumn"></MyTable>
                </template>
                <div class="diskInformation">需求复盘信息敬请期待...</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>

    <!-- 任务详情 -->
    <el-dialog top="20px"
               custom-class="kanban-dialog"
               v-model="dialogTask"
               title="任务详情"
               width="95%"
               :close-on-click-modal="false">
      <div class="dialog-con">
        <el-row :gutter="20">
          <el-col :span="22">
            <MyTable border
                     :data="taskData"
                     :column="taskTableColumn"></MyTable>
          </el-col>
          <el-col :span="2">
            <el-button type="primary"
                       size="small"
                       @click="handleTarget">指标开发</el-button>
          </el-col>
        </el-row>
        <addDemand ref="refDemand"
                   :isLoading="isLoading"
                   @eventSubmit="handleSubmit"
                   @reightData="getReightData" />
      </div>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog top="20px"
               v-model="addDialogVisible"
               title="创建需求"
               width="95%"
               :close-on-click-modal="false">
      <addDemand ref="refDemandTemplate"
                 :isLoading="isLoading"
                 @eventSubmit="handleSubmit" />
    </el-dialog>
  </div>
</template>
<script lang="ts">
  import {
    defineComponent,
    ref,
    reactive,
    toRefs,
    onMounted,
    watch,
    nextTick,
  } from "vue";
  import Sortable from "sortablejs";
  import Echart from "@/components/Echart/index.vue";
  import DraggableList from "../component/draggable-list.vue";
  import DraggableItem from "../component/draggable-item.vue";
  import addDemand from "../component/addDemand.vue";
  import hwTableMixins from "@/mixins/hwTableMixins";
  import Service from "../api/index";
  import { dwonloadFile, debounces } from "@/utils/func";
  import { ElMessage } from "element-plus/lib/components/message";
  import { useRouter, useRoute } from "vue-router";
  import MyForm from "@/components/Form/index.vue";
  import MyTable, { Colum } from "@/components/table/index.vue";
  import useStore from "../component/store";
  // 公共type
  type commonType = {
    value: string;
    label: string;
  };

  // statetype
  type stateType = {
    options1: commonType[];
    options2: commonType[];
    options3: commonType[];
    options4: commonType[];
    listOne: any[];
    listTwo: any[];
    listThree: any[];
    listFour: any[];
    listFive: any[];
    listSix: any[];
    dialogVisible: boolean;
    isLoading: boolean;
    dialogTask: boolean;
    addDialogVisible: boolean;
    isShowTack: boolean;
    pagination: any;
    pagination1: any;
    pagination2: any;
    pagination3: any;
    pagination4: any;
    pagination5: any;
    orderNum: any;
    rowId: string;
    demandState: string;
    detailTiem: any;
    queryData: {
      demandDeveloper: string;
      demandDeveloperId: string;
      demandName: string;
      demandVersion: string;
      parentId: string;
    };
    fromData: any[];
    reightData: any[];
    taskData: any[];
    demandReviewState: any[];
    tableColumn: Colum[];
    taskTableColumn: Colum[];
  };
  export default defineComponent({
    components: {
      DraggableList,
      DraggableItem,
      Echart,
      addDemand,
      MyForm,
      MyTable,
    },
    setup () {
      /****************************************** 初始化数据 **************************************************/
      const route = useRoute(); //获取路由传的值
      const router = useRouter(); //路由跳转
      const store = useStore();
      const formRef = ref<any>(null);
      const { comState, delField } = hwTableMixins();
      let selectList: any[] = [];
      const state = reactive<stateType>({
        rowId: "",
        demandState: "",
        detailTiem: {},
        queryData: {
          demandDeveloper: "",
          demandDeveloperId: "",
          demandName: "",
          demandVersion: "",
          parentId: "",
        },
        fromData: [
          {
            type: "select",
            label: "任务开发人",
            name: "demandDeveloper",
            placeholder: "请选择开发人名称",
            select: selectList,
            labelWidth: "100px",
            rules: {
              required: true,
              message: "请选择开发人名称",
              trigger: "blur",
            },
          },
          {
            type: "text",
            label: "任务名称",
            name: "demandName",
            placeholder: "请输入任务名称",
            labelWidth: "100px",
            rules: { required: true, message: "请输入任务名称", trigger: "blur" },
          },
          {
            type: "text",
            label: "任务版本",
            name: "demandVersion",
            placeholder: "请输入任务版本",
            labelWidth: "100px",
            rules: { required: true, message: "请输入任务版本", trigger: "blur" },
          },
          { name: "submit", type: "slot", labelWidth: "0px" },
        ],
        orderNum: {},
        options1: [
          { value: "gmt_create", label: "创建时间" },
          { value: "gmt_modified", label: "更新时间" },
        ],
        options2: [
          { value: "", label: "全部" },
          { value: "1", label: "需求" },
          { value: "2", label: "任务" },
        ],
        options4: [
          { value: "1", label: "全部" },
          { value: "0", label: "个人" },
        ],
        options3: [
          { value: "desc", label: "降序" },
          { value: "asc", label: "升序" },
        ],
        pagination: {
          ...comState.pagination,
          orderField: "gmt_create",
          demandOrTask: "",
          demandName: "",
          order: "desc",
          isAll: "0",
        },
        pagination1: {
          ...comState.pagination,
          orderField: "gmt_create",
          demandOrTask: "",
          demandName: "",
          order: "desc",
        },
        pagination2: {
          ...comState.pagination,
          orderField: "gmt_create",
          demandOrTask: "",
          demandName: "",
          order: "desc",
        },
        pagination3: {
          ...comState.pagination,
          orderField: "gmt_create",
          demandOrTask: "",
          demandName: "",
          order: "desc",
        },
        pagination4: {
          ...comState.pagination,
          orderField: "gmt_create",
          demandOrTask: "",
          demandName: "",
          order: "desc",
        },
        pagination5: {
          ...comState.pagination,
          orderField: "gmt_create",
          demandOrTask: "",
          demandName: "",
          order: "desc",
        },
        listOne: [],
        listTwo: [],
        listThree: [],
        listFour: [],
        listFive: [],
        listSix: [],
        reightData: [],
        taskData: [],
        demandReviewState: [],
        tableColumn: [
          { label: "序号", prop: "serialNumber", showOverflowTooltip: true },
          { label: "检查内容", prop: "checkContent", showOverflowTooltip: true },
          {
            label: "自查结论",
            prop: "selfCheckContent",
            showOverflowTooltip: true,
          },
          {
            label: "整改事项描述",
            prop: "rectificatExplain",
            showOverflowTooltip: true,
          },
        ],
        taskTableColumn: [
          {
            label: "任务开发人",
            prop: "demandDeveloper",
            showOverflowTooltip: true,
          },
          { label: "任务名称", prop: "demandName", showOverflowTooltip: true },
          { label: "任务版本", prop: "demandVersion", showOverflowTooltip: true },
        ],
        dialogVisible: false,
        isLoading: false,
        dialogTask: false,
        addDialogVisible: false,
        isShowTack: false,
      });
      const echartRef = ref();
      const refOneItem = ref<any>(null);
      const refTwoItem = ref<any>(null);
      const refThreeItem = ref<any>(null);
      const refFourItem = ref<any>(null);
      const refFiveItem = ref<any>(null);
      const refSixItem = ref<any>(null);
      const refDemandTemplate = ref<any>(null);
      const refDemand = ref<any>(null);
      // dom列表
      const oneElList = ref<HTMLElement[]>([]);
      const twoElList = ref<HTMLElement[]>([]);
      const threeElList = ref<HTMLElement[]>([]);
      const fourElList = ref<HTMLElement[]>([]);
      const fiveElList = ref<HTMLElement[]>([]);
      const sixElList = ref<HTMLElement[]>([]);

      const oneRef = (e: any) => {
        oneElList.value.push(e);
      };
      const twoRef = (e: any) => {
        twoElList.value.push(e);
      };
      const threeRef = (e: any) => {
        threeElList.value.push(e);
      };
      const fourRef = (e: any) => {
        fourElList.value.push(e);
      };
      const fiveRef = (e: any) => {
        fiveElList.value.push(e);
      };
      const sixRef = (e: any) => {
        sixElList.value.push(e);
      };

      const option = {
        legend: {
          show: false,
        },
        radar: {
          indicator: [
            { name: "质量", max: 6500, axisLabel: { show: true, fontSize: 8 } },
            { name: "进度", max: 16000 },
            { name: "成本", max: 30000 },
          ],
          axisName: {
            fontSize: 10,
          },
          radius: "90%",
          center: ["40%", "70%"],
        },

        series: [
          {
            type: "radar",
            symbol: "none",
            label: {
              fontSize: 8,
              show: true,
              formatter (params: any) {
                return params.value;
              },
            },
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: "a",
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: "b",
              },
              {
                value: [1000, 5000, 7879, 1213, 42000, 21000],
                name: "c",
              },
            ],
          },
        ],
      };

      /****************************************** vue生命周期 **************************************************/

      onMounted(() => {
        oneElList.value.forEach((ele) => {
          editType(ele);
        });
        twoElList.value.forEach((ele) => {
          editType(ele);
        });
        threeElList.value.forEach((ele) => {
          editType(ele);
        });
        fourElList.value.forEach((ele) => {
          editType(ele);
        });
        fiveElList.value.forEach((ele) => {
          editType(ele);
        });
        sixElList.value.forEach((ele) => {
          editType(ele);
        });
      });

      /****************************************** 自定义事件 **************************************************/
      const handleShowTask = () => {
        state.queryData = {
          demandDeveloper: "",
          demandDeveloperId: "",
          demandName: "",
          demandVersion: "",
          parentId: "",
        };
        state.queryData.parentId = state.rowId;
        state.isShowTack = !state.isShowTack;
      };
      //保存数据
      const handleTaskSubmit = () => {
        formRef.value?.validate(async (valid: any) => {
          if (valid) {
            const qs: any = JSON.parse(JSON.stringify(state.queryData));
            qs.demandDeveloperId = state.queryData.demandDeveloper.split("@@")[0];
            qs.demandDeveloper = state.queryData.demandDeveloper.split("@@")[1];
            qs.demandItemDTOs = [];
            const res = await Service.addDemand("post", qs);
            if (res.success) {
              state.isShowTack = false;
              state.taskData = [];
              getRightList(parseInt(state.demandState));
              initData();
            }
          }
        });
      };
      // tabble刷新
      const onRefresh = () => {
        initData();
      };

      //新增
      const handleAdd = async () => {
        state.addDialogVisible = true;
        state.isLoading = true;
        const res = await Service.getDemandTemplate();

        refDemandTemplate.value?.update(res.result);
        state.isLoading = false;
      };
      //点击item
      const handleItem = async (props: any) => {
        state.rowId = props.item.rowId;
        state.demandState = props.item.demandState;
        state.detailTiem = props.item;
        if (props.item.parentId) {
          state.dialogTask = true;
          state.isLoading = true;
          state.taskData = [];
          state.taskData = [...state.taskData, props.item];
          const res = await Service.detail({ demandId: props.item.parentId });
          nextTick(() => {
            refDemand.value?.update(res.result, props.item, "edit");
          });

          state.isLoading = false;
        } else {
          state.dialogVisible = true;
          state.isLoading = true;
          state.taskData = [];
          const res = await Service.detail({ demandId: props.item.rowId });
          nextTick(() => {
            refDemand.value?.update(res.result, props.item, "edit");
          });

          state.isLoading = false;
          getUserList();
          getDemandReviewState(state.rowId);
          getRightList(parseInt(props.item.demandState));
        }
      };
      // 输入后获取映射到右边
      const getReightData = (data: any) => {
        state.reightData = data;
      };
      // 指标开发
      const handleTarget = () => {
        router.push("/flowchart/index");
      };

      //新增提交
      const handleSubmit = async (data: any) => {
        const qs: any = {
          demandName: data.detailData.demandName,
          demandField: data.detailData.demandField,
          demandItemDTOs: data.tableData,
        };
        let res = null;
        if (data.type === "save") {
          res = await Service.addDemand("post", qs);
          state.addDialogVisible = false;
        } else {
          qs.rowId = state.rowId;
          res = await Service.addDemand("put", qs);
          state.dialogVisible = false;
        }
        if (res.success)
          ElMessage.success({
            message: "操作成功",
            type: "success",
          });
        initData();
      };

      //初始化弹出层
      const opened = () => {
        // nextTick(() => {
        //   echartRef.value.echartInit()
        // });
      };
      //关闭弹出层
      const close = () => {
        // echartRef.value.dispose()
      };
      //上一页
      const handlePre = (types: number) => {
        switch (types) {
          case 1:
            state.pagination.page--;
            break;
          case 2:
            state.pagination1.page--;
            break;
          case 3:
            state.pagination2.page--;
            break;
          case 4:
            state.pagination3.page--;
            break;
          case 5:
            state.pagination4.page--;
            break;
          default:
            state.pagination5.page--;
            break;
        }
        getList(types);
      };
      //下一页
      const handleNext = (types: any) => {
        switch (types) {
          case 1:
            state.pagination.page++;
            break;
          case 2:
            state.pagination1.page++;
            break;
          case 3:
            state.pagination2.page++;
            break;
          case 4:
            state.pagination3.page++;
            break;
          case 5:
            state.pagination4.page++;
            break;
          default:
            state.pagination5.page++;
            break;
        }
        getList(types);
      };
      // 第一个下拉
      const handleTypeChage = (value: any) => {
        state.pagination.orderField = value;
        state.pagination1.orderField = value;
        state.pagination2.orderField = value;
        state.pagination3.orderField = value;
        state.pagination4.orderField = value;
        state.pagination5.orderField = value;
        // initData();
      };
      // 第二个下拉
      const handleOrderChage = (value: any) => {
        state.pagination.order = value;
        state.pagination1.order = value;
        state.pagination2.order = value;
        state.pagination3.order = value;
        state.pagination4.order = value;
        state.pagination5.order = value;
        // initData();
      };
      // 第三个下拉
      const handleTypesChage = (value: any) => {
        state.pagination.demandOrTask = value;
        state.pagination1.demandOrTask = value;
        state.pagination2.demandOrTask = value;
        state.pagination3.demandOrTask = value;
        state.pagination4.demandOrTask = value;
        state.pagination5.demandOrTask = value;
        // initData();
      };
      // 第四个下拉
      const handleAllChage = (value: any) => {
        state.pagination.isAll = value;
        state.pagination1.isAll = value;
        state.pagination2.isAll = value;
        state.pagination3.isAll = value;
        state.pagination4.isAll = value;
        state.pagination5.isAll = value;
        // initData();
      };
      // changeInput
      const changeInput = debounces((value: any) => {
        state.pagination.demandName = value;
        state.pagination1.demandName = value;
        state.pagination2.demandName = value;
        state.pagination3.demandName = value;
        state.pagination4.demandName = value;
        state.pagination5.demandName = value;
        // initData();
      }, 500);

      //导入导出
      const handleLead = async () => {
        dwonloadFile(
          1,
          `/ddm-iic/dem/demand/exportExcel?demandId=${state.detailTiem.rowId}&demandName=${state.detailTiem.demandName}`
        );
      };

      /****************************************** 自定义方法 **************************************************/
      const initData = () => {
        getList(1);
        getList(2);
        getList(3);
        getList(4);
        getList(5);
        // getList(6);
      };

      //修改状态
      const editType = (ele: any) => {
        new Sortable(ele, {
          group: { name: "dragId", pull: true, put: true },
          sort: false,
          animation: 150,
          // 拖拽结束触发
          onEnd: function (/**Event*/ evt) {
            // const fromIndex = evt.from.getAttribute("types");
            const toIndex = evt.to.getAttribute("types");
            const cid = evt.item.getAttribute("cid");
            editStates(cid, toIndex);
            // same properties as onEnd
          },
        });
      };
      // 修改状态
      const editStates = async (cid: string, fromIndex: string) => {
        const data = { demandId: cid, demandState: fromIndex };
        await Service.editStates(data);
        initData();
      };

      // 获取用户列表
      const getUserList = async () => {
        const res = await Service.getUserList();
        selectList = [];
        res.result.map((item: any) => {
          let obj: any = { label: "", value: "" };
          obj.label = `${item.login_name}`;
          obj.value = `${item.row_id}@@${item.login_name}`;
          selectList.push(obj);
        });
        state.fromData[0].select = selectList;
      };
      // 获取用户列表
      const getDemandReviewState = async (demandId: string) => {
        const res = await Service.getReviewState({ demandId: demandId });
        state.demandReviewState = res.result;
      };

      // 获取看板列表数据
      const getList = async (demandState?: number) => {
        let isMessage: boolean = false;
        let res: any = {};
        switch (demandState) {
          case 1:
            state.pagination.demandState = demandState;
            res = await Service.getList(delField(state.pagination));
            if (res.result.records.length === 0 && state.pagination.page > 1) {
              isMessage = true;
              break;
            }
            state.listOne = res.result.records;
            state.taskData = res.result.records;
            state.pagination.total = res.result.total;
            state.pagination.pages = res.result.pages;
            state.orderNum.one = res.result.total;
            refOneItem.value.update(res.result.total);
            break;
          case 2:
            state.pagination1.demandState = demandState;
            res = await Service.getList(delField(state.pagination1));
            if (res.result.records.length === 0 && state.pagination1.page > 1) {
              isMessage = true;
              break;
            }
            state.listTwo = res.result.records;
            state.taskData = res.result.records;
            state.pagination1.total = res.result.total;
            state.pagination1.pages = res.result.pages;
            state.orderNum.two = res.result.total;
            refTwoItem.value.update(res.result.total);
            break;
          case 3:
            state.pagination2.demandState = demandState;
            res = await Service.getList(delField(state.pagination2));
            if (res.result.records.length === 0 && state.pagination2.page > 1) {
              isMessage = true;
              break;
            }
            state.listThree = res.result.records;
            state.taskData = res.result.records;
            state.pagination2.total = res.result.total;
            state.pagination2.pages = res.result.pages;
            state.orderNum.three = res.result.total;
            refThreeItem.value.update(res.result.total);
            break;
          case 4:
            state.pagination3.demandState = demandState;
            res = await Service.getList(delField(state.pagination3));
            if (res.result.records.length === 0 && state.pagination3.page > 1) {
              isMessage = true;
              break;
            }
            state.listFour = res.result.records;
            state.taskData = res.result.records;
            state.pagination3.total = res.result.total;
            state.pagination3.pages = res.result.pages;
            state.orderNum.four = res.result.total;
            refFourItem.value.update(res.result.total);
            break;
          case 5:
            state.pagination4.demandState = demandState;
            res = await Service.getList(delField(state.pagination4));
            if (res.result.records.length === 0 && state.pagination4.page > 1) {
              isMessage = true;
              break;
            }
            state.listFive = res.result.records;
            state.taskData = res.result.records;
            state.pagination4.total = res.result.total;
            state.pagination4.pages = res.result.pages;
            state.orderNum.five = res.result.total;
            refFiveItem.value.update(res.result.total);
            break;
          default:
            state.pagination5.demandState = demandState;
            res = await Service.getList(delField(state.pagination5));
            if (res.result.records.length === 0 && state.pagination5.page > 1) {
              isMessage = true;
              break;
            }
            state.listSix = res.result.records;
            state.taskData = res.result.records;
            state.pagination5.total = res.result.total;
            state.pagination5.pages = res.result.pages;
            state.orderNum.six = res.result.total;
            refSixItem.value.update(res.result.total);
            break;
        }

        if (isMessage) {
          ElMessage.success({
            message: "没有更多了",
            type: "warning",
          });
        }
      };
      // 获取弹出层类型数据
      const getRightList = async (demandState?: number) => {
        const res = await Service.getList(
          delField({
            demandOrTask: 2,
            demandState: demandState,
            orderField: "gmt_create",
            order: "desc",
            rowId: state.rowId,
            ...comState.pagination,
          })
        );
        state.taskData = res.result.records;
      };

      //监听路由
      watch(
        () => route,
        () => {
          if (route.path.toLowerCase() !== "/demandmanage/kanban") return;

          state.pagination.demandName = route.query.searchWord;
          state.pagination1.demandName = route.query.searchWord;
          state.pagination2.demandName = route.query.searchWord;
          state.pagination3.demandName = route.query.searchWord;
          state.pagination4.demandName = route.query.searchWord;
          state.pagination5.demandName = route.query.searchWord;

          if (store.createRequire) {
            store.createRequire = false;
            handleAdd();
          }
          initData();
        },
        {
          deep: true,
          immediate: true,
        }
      );

      return {
        refOneItem,
        refTwoItem,
        refThreeItem,
        refFourItem,
        refFiveItem,
        refSixItem,
        refDemandTemplate,
        refDemand,
        handleAdd,
        handleTaskSubmit,
        handleShowTask,
        oneRef,
        twoRef,
        threeRef,
        handleTarget,
        fourRef,
        fiveRef,
        sixRef,
        echartRef,
        onRefresh,
        option,
        opened,
        close,
        handleNext,
        handlePre,
        handleTypesChage,
        handleAllChage,
        handleOrderChage,
        handleTypeChage,
        changeInput,
        handleItem,
        handleLead,
        handleSubmit,
        getReightData,
        formRef,
        ...toRefs(state),
      };
    },
  });
</script>
<style scoped lang="scss">
  .MyMission {
    padding: 20px 0;
    // padding: 20px;
    .list {
      min-height: 400px;
    }
    .el-input__icon {
      color: #20a0ff;
      font-size: 16px;
    }
    .container {
      display: flex;
    }
    .MyMission-body {
      margin-top: 20px;
      display: flex;
      .m-item {
        padding: 0 2px;
        width: 20%;
        // min-width: 270px;
      }
    }
    .item {
      &:not(:first-child) {
        margin-top: 8px;
      }
    }

    :deep(.kanban-dialog) {
      .el-dialog__body {
        padding-top: 10px;
        padding-bottom: 20px;
      }
    }
    .dialog-con {
      .feasibility {
        text-align: center;
        width: 290px;
        height: 200px;
        line-height: 200px;
        margin-top: -20px;
      }
      .form {
        margin-top: 10px;
        min-height: 400px;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 10px;
      }
      .info {
        height: 100%;
        // border: 1px solid #ccc;
        border-radius: 8px;
        padding: 10px;
      }
      .col_task {
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .devInformation {
        margin-top: 16px;
        margin-bottom: 16px;
        padding: 20px 10px 0px 10px;
        border: 1px solid #ccc;
      }
      .diskInformation {
        height: 80px;
        margin-top: 16px;
        border: 1px solid #ccc;
        text-align: center;
        line-height: 80px;
      }
    }
    .operation {
      width: 100%;
      text-align: center;
    }
  }
</style>
