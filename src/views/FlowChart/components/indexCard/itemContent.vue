<template>
  <div class="content-box">
    <div class="table_title">
      <div>属性编辑</div>
      <em class="icon-share iconfont" />
    </div>
    <div class="content-inner">
      <el-form label-width="80px">
        <el-form-item label="名称">
          <el-input
            v-model="info.options.title"
            placeholder="请输入名称"
            @blur="handleDraft"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="info.options.content"
            type="textarea"
            placeholder="请输入描述"
            @blur="handleDraft"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="info.options.type=='动态'" label="指标">
          <el-select
            v-model="info.options.quota"
            style="width:230.4px;"
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
        <el-form-item v-show="info.options.type=='动态'" label="值">
          <el-select
            v-model="info.options.y"
            style="width:230.4px;"
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
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  PropType,
  watch,
} from "vue";
import * as Element from "element-plus";
import { Node, Cell } from "@antv/x6";
import http, { optionsItem } from "./api";

const { ElMessage, ElMessageBox, ElForm, ElFormItem, ElInput } = Element;

type DraftDataProp = {
  info: { shape: string; options: any };
};

export default defineComponent({
  components: {
    ElMessage,
    ElMessageBox,
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
  emits: ["on-close", "on-change"],
  setup(props) {
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
    })

    const draftData = reactive<DraftDataProp>({
      info: {
        shape: '',
        options: {
          title: '',
          content: '',
          quota: '',
          y: '',
          type: ''
        }
      }
    });

    const handleDraft = () => {
      // console.log(444)
      //  context.emit("on-close");
    };

    // 根据选择指标,获取用户可操作字段
    const handleField = (val:string) => {
      state.xList.data = [];
      const cur = state.quotaList.data.find((item)=> item.row_id === val)
      const {fields} = cur;
      fields.forEach((now) => {
        state.xList.data.push({name: now.fieldName, value: now.fieldName});
      })
    }

    const changeQuota = (val:string) => {
      handleField(val);
    }

    // 根据领域获取指标
    const getQuotaOptions = () => {
      http.ApiGetQuota().then((res) =>{
        const {result} = res;
        state.quotaList.data = result;
      })
    }

    watch(
      () => props.selectNode,
      (now) => {
        // console.log("Text2", now);
        if(!now) {
          draftData.info = {
            shape: '',
            options: {
              title: '',
              content: '',
              quota: '',
              y: '',
              type: '',
            }
          }
          return;
        }
        if(now.shape === 'echart-shape') return;
        draftData.info.shape = now.shape;
        draftData.info.options = now.attrs.option;
        // console.log('draftData', draftData.info)
      }
    );

    onMounted(() => {
      getQuotaOptions();
    });
    return {
      handleDraft,
      changeQuota,
      ...toRefs(draftData),
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss" scoped>
.content-inner {
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
