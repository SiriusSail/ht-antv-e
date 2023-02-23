<template>
  <div class="IndexCard">
    <el-row :gutter="20">
      <el-col :span="24" v-for="(item, index) in optionList" :key="index">
        <p class="grid-name">{{ item.name }}</p>
        <div class="row-item">
          <el-row :gutter="20">
            <el-col :span="12" v-for="itemc in item.options" :key="itemc.rowId">
              <div class="grid-content">
                <Echart
                  :init="false"
                  :ref="getEchart"
                  :option="itemc.attrs.option"
                ></Echart>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-empty description="该指标无卡片" v-if="empty"></el-empty>
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
import Myform, { InputItem, SelectItem } from "@/components/Form/index.vue";
import Api, { CardItem } from "../api/index";
import Echart from "@/components/Echart/index.vue";

// import Graph from '@/components/Graph'

// import Graph from "@/components/Graph/graph";

type StateProps = {
  form: any;
  list: (InputItem | SelectItem)[];
  option: any;
  optionList: CardItem[];
  echartDom: any[];
  empty: Boolean;
};

export default defineComponent({
  components: {
    Myform,
    Echart,
  },
  setup() {
    const state = reactive<StateProps>({
      form: {
        indexCard: [],
      },
      list: [
        {
          name: "indexCard",
          label: "引用指标",
          type: "select",
          select: [],
          multiple: true,
          col: {
            span: 24,
          },
        },
      ],
      option: {},
      optionList: [],
      echartDom: [],
      empty: false,
      // echartContent:
    });

    //获取指标卡片详情
    const request = async (rowId: string) => {
      state.echartDom = [];
      let optionList: any[] = [];
      const res = await Api.getCardDetail(rowId);
      if (res.code == 200) {
        res.result.forEach((item, index) => {
          item.options = JSON.parse(item.cardContent);
        });

        state.optionList = res.result;

        nextTick(() => {
          if (state.optionList.length > 0) {
            state.echartDom.forEach((item) => {
              item.echartInit();
            });
          }
        });
      } else {
        Api.ElMessage.error(res.message);
      }
      if (state.optionList.length <= 0) {
        state.empty = true;
      } else {
        state.empty = false;
      }
    };

    const getEchart = (el: any) => {
      state.echartDom.push(el);
    };

    return { getEchart, request, ...toRefs(state) };
  },
});
</script>
<style scoped lang="scss">
.grid-content {
  height: 300px;
  padding: 10px;
  border: 1px #ccc solid;
  border-radius: 4px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.row-item {
}
.grid-name {
  font-size: 18px;
  font-weight: 800;
  color: #333;
}
</style>
