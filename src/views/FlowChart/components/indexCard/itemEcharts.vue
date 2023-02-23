<template>
  <div class="content-box">
    <div class="table_title">
      <div>属性编辑</div>
      <em class="icon-share iconfont" />
    </div>
    <div class="echarts-inner">
      <el-form label-width="80px">
        <el-form-item label="名称">
          <el-input
            v-model="info.options.title.text"
            style="width:210.4px;"
            placeholder="请输入名称"
            @input="handleDraft"
          ></el-input>
        </el-form-item>

        <el-form-item
          v-show="showTableType.includes(info.options.curType)"
          label="表类型"
        >
          <el-select
            v-model="info.options.tableType"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in tableTypeList.data"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="指标">
          <el-select
            v-model="info.options.quota"
            filterable
            placeholder="请选择"
            @change="changeQuota"
          >
            <el-option
              v-for="item in quotaList.data"
              :key="item.row_id"
              :label="item.name"
              :value="item.row_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-show="showX.includes(info.options.curType)"
          label="x轴"
        >
          <el-select
            v-model="info.options.x"
            placeholder="请选择"
          >
            <el-option
              v-for="item in xList.data"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <div v-show="showY.includes(info.options.curType)">
          <!-- 仪表盘显示为值 -->
          <el-form-item
            :label="info.options.curType==='gauge-basic'?'值':'y轴'"
          >
            <el-select
              v-model="info.options.y"
              :multiple="info.options.tableType=='横'"
              placeholder="请选择"
              @change="(val:string) => changeXSymbol(val, 'y')"
            >
              <el-option
                v-for="item in yList.data"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div v-show="showSymbol.includes(info.options.curType)">
          <el-form-item
            v-show="info.options.tableType!=='横'"
            label="图例"
          >
            <el-select
              v-model="info.options.symbol"
              placeholder="请选择"
              @change="(val:string) => changeXSymbol(val, 'symbol')"
            >
              <el-option
                v-for="item in symbolList.data"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- 复合图情况 才有折线和柱状选择-->
        <div v-show="info.options.curType==='bar-mixed-line'">
          <el-form-item label="折线">
            <el-select
              v-model="info.options.lineColumn"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in barAndLineList.data"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="柱状">
            <el-select
              v-model="info.options.barColumn"
              multiple
              placeholder="请选择"
              @change="getChartData"
            >
              <el-option
                v-for="item in barAndLineList.data"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  inject,
  reactive,
  watch,
  toRefs,
  PropType,
} from "vue";
import { Cell } from "@antv/x6";
// import * as echarts from "echarts";
import fromDraftsPage from "./store";
import http, {ChartProp} from "./api";
// import itemContentVue from "./itemContent.vue";

// type EChartsOption = echarts.EChartsOption;

const { ElForm, ElFormItem, ElInput } = Element;

type paramProp = {
  info: { shape: string; options: any };
};

export default defineComponent({
  components: {
    ElForm,
    ElFormItem,
    ElInput,
  },
  props: {
    selectNode: {
      type: Object as PropType<Cell>,
      default: () => {},
    },
  },
  setup(props) {
    const pageStore = inject<{
      selectNode: {
        value: Cell;
      };
    }>("pageStore");
    const store = fromDraftsPage();
    const state = reactive({
      quotaList: {
        data: [{
          code: '',
          name: '',
          row_id: '',
          fields: []
        }]
      },
      xList: {
        data: [{
          name: '',
          value: '',
        }]
      },
      yList: {
        data: [{
          name: '',
          value: ''
        }]
      },
      barAndLineList: {
        data: [{
          name: '',
          value: ''
        }]
      },
      originYList: {
        data: [{
          name: '',
          value: ''
        }]
      },
      symbolList: {
        data: [{
          name: '',
          value: ''
        }]
      },
      originSymbolList: {
        data: [{
          name: '',
          value: ''
        }]
      },
      // 1.横轴情况，不显示图例，y为多选（必须是数字类型），却x和y互斥
      // 2.纵轴情况，显示所有，y为单选（必须是数字类型），x和y及图例互斥
      tableTypeList: {
        data: [{
          name: '横',
          value: '横'
        }, {
          name: '纵',
          value: '纵'
        }]
      },
    });

    const param = reactive<paramProp>({
      info: {
        shape: "",
        options: {
          title: {
            text: "",
          },
          quota: "", // 指标
          x: "",  // x轴
          y: "",  // y轴
          symbol: '',  // 图例
          echartType: "", // 图表类型
          tableType: "", // 横，纵
          curType: "",   // 当前具体图标类型
          barColumn: [],  // 柱状
          lineColumn: []   // 折线
        },
      },
    });

    const showY = ref(['line-simple', 'line-smooth', 'bar-simple', 'bar-dataset-simple', 'bar-negative-value', 'bar-strip-type',
      'pie-simple', 'pie-border-radius', 'pie-nightingale', 'radar-simple', 'scatter-basic', 'gauge-basic']);
    const showSymbol = ref(['line-simple', 'line-smooth', 'bar-simple', 'bar-dataset-simple', 'bar-negative-value', 'bar-strip-type',
      'pie-simple', 'pie-border-radius', 'pie-nightingale', 'radar-simple', 'scatter-basic']);
    const showTableType = ['line-simple', 'line-smooth', 'bar-simple', 'bar-dataset-simple', 'bar-negative-value', 'bar-strip-type',
      'pie-simple', 'pie-border-radius', 'pie-nightingale', 'radar-simple', 'bar-mixed-line', 'scatter-basic'];
    const showX = ['line-simple', 'line-smooth', 'bar-simple', 'bar-dataset-simple', 'bar-negative-value', 'bar-strip-type',
      'pie-simple', 'pie-border-radius', 'pie-nightingale', 'radar-simple', 'bar-mixed-line', 'scatter-basic'];

    // 改变名称
    const handleDraft = (d: string) => {
      const cur = pageStore?.selectNode.value;
      const op = JSON.parse(JSON.stringify(cur.attrs.option));
      op.title.text = d;
      pageStore?.selectNode.value?.attr("option", op);
    };


    // 获取指标
    const getQuotaOptions = () => {
      http.ApiGetQuota().then((res) =>{
        const {result} = res;
        state.quotaList.data = result;
      })
    }

    // 是否来自草稿箱
    const handleRest = () => {
      setTimeout(() => {
        store.isDrafts = false;
      }, 1000);
    }

    // 重置y轴，多选还是单选
    const resetY = (val:string) => {
      if(store.isDrafts) {
        handleRest();
        return;
      }
      if(val === '横') {
        param.info.options.y = [];
      }else{
        param.info.options.y = '';
      }
    }

    // 重置x轴
    const resetX = () => {
      if(store.isDrafts) return;
      param.info.options.x = '';

    }

    // 重置图例
    const resetSymbol = () => {
      if(store.isDrafts) return;
      param.info.options.symbol = '';
    }

    // 根据选择指标,获取用户可操作字段
    const handleField = (val:string) => {
      state.xList.data = [];
      state.yList.data = [];
      state.originYList.data = [];
      state.symbolList.data = [];
      state.barAndLineList.data = [];
      state.originSymbolList.data = [];
      const cur = state.quotaList.data.find((item)=> item.row_id === val)
      const {fields} = cur;
      fields.forEach((now) => {
        state.xList.data.push({name: now.fieldName, value: now.fieldName});
        state.barAndLineList.data.push({name: now.fieldName, value: now.fieldName});
        state.originSymbolList.data.push({name: now.fieldName, value: now.fieldName});
        if(now.fieldType === 'int' || now.fieldType === 'bigint' || now.fieldType === 'decimal') {
          state.originYList.data.push({name: now.fieldName, value: now.fieldName});
        }

        // 如果是仪表盘(只显示名称，指标，y轴)，需要赋值y轴
        if(param.info.options.curType === 'gauge-basic') {
          state.yList.data = state.originYList.data;
        }
      })
    }

    const changeQuota = (val:string) => {
      resetX();
      resetY(param.info.options.tableType);
      resetSymbol();
      handleField(val);
    }

    // 获取图表数据
    const getChartData = () => {
      let query:ChartProp
      let temCurType:string
      // 应后端要求特殊处理的情况
      if(param.info.options.curType === 'bar-simple' || param.info.options.curType === 'bar-strip-type') {
        temCurType = 'bar-simple';
      } else if(param.info.options.curType === 'pie-simple' ||
        param.info.options.curType === 'pie-border-radius' ||
        param.info.options.curType === 'pie-nightingale'
      ) {
        temCurType = 'pie-simple';
      }else {
        temCurType = param.info.options.curType;
      }

      if(param.info.options.tableType === '横') {
        // 复合图情况
        if(param.info.options.curType === 'bar-mixed-line') {
          query = {
            quota: param.info.options.quota,
            x: param.info.options.x,
            y: param.info.options.y,
            lineColumn: param.info.options.lineColumn,
            barColumn: param.info.options.barColumn,
            curType: temCurType,
          }
        } else {
          query = {
            quota: param.info.options.quota,
            x: param.info.options.x,
            y: param.info.options.y,
            curType: temCurType,
          }
        }
      // 仪表盘情况
      }else if(param.info.options.curType === 'gauge-basic') {
        query = {
          quota: param.info.options.quota,
          y: param.info.options.y,
          curType: temCurType,
        }
      }else if(param.info.options.tableType === '纵') {
        // 复合图情况
        if(param.info.options.curType === 'bar-mixed-line') {
          query = {
            quota: param.info.options.quota,
            x: param.info.options.x,
            y: param.info.options.y,
            lineColumn: param.info.options.lineColumn,
            barColumn: param.info.options.barColumn,
            symbol: param.info.options.symbol,
            curType: temCurType,
          }
        } else {
          query = {
            quota: param.info.options.quota,
            x: param.info.options.x,
            y: param.info.options.y,
            symbol: param.info.options.symbol,
            curType: temCurType,
          }
        }
      }

      http.ApiGetChartData(query).then((res) =>{
        const {result} = res;
        const cur = pageStore?.selectNode.value;
        const op = JSON.parse(JSON.stringify(cur.attrs.option));
        let temSymbol = []
        if(param.info.options.tableType === '横') {
          temSymbol = param.info.options.y;
        }else{
          temSymbol.push(param.info.options.symbol)
        }
        op.symbol = temSymbol;
        if(op.curType === 'line-simple' ||
           op.curType === 'line-smooth' ||
           op.curType === 'bar-simple'
        ) {
          op.legend.data = result.legend;
          op.xAxis.data = result.xData;
          op.series = result.series;
        } else if(op.curType === 'bar-dataset-simple') {
          op.legend.data = result.legend;
          op.dataset.source = result.source;
          op.series = result.series;
        } else if(op.curType === 'bar-negative-value') {
          op.yAxis.data = result.xData;
          op.series = result.series;
        } else if(op.curType === 'bar-strip-type') {
          op.legend.data = result.legend;
          op.yAxis.data = result.xData;
          op.series = result.series;
        } else if(op.curType === 'pie-simple' ||
          op.curType === 'pie-border-radius' ||
          op.curType === 'pie-nightingale'
        ) {
          // 饼状图
          op.series[0].data = result.data;
        } else if(op.curType === 'radar-simple') {
          // 雷达图
          op.legend.data = result.legend;
          op.radar.indicator = result.indicator;
          op.series[0].data = result.data;
        } else if(op.curType === 'bar-mixed-line') {
          // 复合图
          op.legend.data = result.legend;
          op.xAxis[0].data = result.xData;
          op.series = result.series;
        }else if(op.curType === 'scatter-basic') {
          // 散点图
          op.series = result.data;
        } else if(op.curType === 'gauge-basic') {
          // 仪表盘
          op.series[0].data = result.data;
          op.series[0].min = result.min;
          op.series[0].max = result.max;
        }
        pageStore?.selectNode.value?.attr("option", op);
      })
    }

    const getDataByColumn = () => {
      const query = {
        quota: param.info.options.quota,
        symbol: param.info.options.symbol,
      }
      http.ApiGetDataByColumn(query).then((res) =>{
        state.barAndLineList.data = res.result.map((item:string|number) => ({name: item, value: item}))
      })
    }

    // y,legend变化查询图表数据
    const changeXSymbol = (val:string, type:string) => {
      if((param.info.options.tableType === '横' && type === 'y') ||
         (param.info.options.curType === 'gauge-basic' && type === 'y') ||
         (param.info.options.tableType === '纵' && type === 'symbol')
      ) {
        getChartData();
      }

      // 如果是复合图的情况，获取折线，柱状选择信息
      if(param.info.options.curType === 'bar-mixed-line' && type === 'symbol' && param.info.options.tableType === '纵') {
        getDataByColumn();
      }
    }

    // 监听横还是纵情况
    watch(() => param.info.options.tableType, (newVal) => {
      resetY(newVal);

      // 复合图，横轴只有x,折线,柱状,  纵轴有x,y,图例,折线,柱状
      const barMixedLine = 'bar-mixed-line'
      if(newVal === '横') {
        showY.value = showY.value.filter((item) => item !== barMixedLine);
        showSymbol.value = showSymbol.value.filter((item) => item !== barMixedLine);
      } else if(newVal === '纵') {
        if(!showY.value.includes(barMixedLine)) {
          showY.value.push(barMixedLine);
          showSymbol.value.push(barMixedLine);
        }
      }
    })

    // 监听x轴
    watch(() => param.info.options.x, (newVal) => {
      // eslint-disable-next-line no-useless-return
      if(!newVal) return;
      resetY(param.info.options.tableType);
      resetSymbol();
      state.yList.data = state.originYList.data.filter((item) => item.value !== newVal);
    })

    // 监听y轴
    watch(() => param.info.options.y, (newVal) => {
      // eslint-disable-next-line no-useless-return
      if(!newVal || !newVal.length) return;
      resetSymbol();
      if(param.info.options.tableType === '纵') {
        state.symbolList.data = state.xList.data.filter((item) => param.info.options.x !== item.value && item.value !== newVal);
      }
    })

    watch(
      () => props.selectNode,
      (now) => {
        if(!now) {
          param.info = {
            shape: "",
            options: {
              title: {
                text: "",
              },
              quota: "",
              x: "",
              y: "",
              symbol: [],
              curType: "",
              echartType: "",
              tableType: "",
              barColumn: [],
              lineColumn: []
            },
          }
          return;
        }

        if(now.shape === 'text-shape') return;
        param.info.shape = now.shape;
        param.info.options = now.attrs.option;
        param.info.options.echartType = (now.attrs.option.series as any)[0].type;
        if(now.attrs.option.quota) {
          setTimeout(() => {
            changeQuota((now.attrs.option.quota) as string);
          }, 500);
        }
      }
    );

    onMounted(() => {
      getQuotaOptions();
    });

    return {
      handleDraft,
      changeQuota,
      changeXSymbol,
      getChartData,
      showTableType,
      showX,
      showY,
      showSymbol,
      ...toRefs(param),
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss" scoped>
.echarts-inner {
  padding: 4px;
}

.table_title {
  position: relative;
  height: 50px;
  background: #ecf4ff;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  line-height: 10px;
  .icon-share {
    position: absolute;
    right: 3px;
    top: 20px;
    font-size: 26px;
  }
}
</style>
