<template>
  <el-dialog
    v-model="visibleSign"
    title="修改名称"
    :close-on-click-modal="false"
    @close="closeMode"
  >
    <el-form label-width="80px">
      <el-form-item label="名称">
        <el-input
          v-model="info.title"
          placeholder="请输入名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="info.des"
          type="textarea"
          placeholder="请输入描述"
        ></el-input>
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeMode">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  watch,
  PropType,
} from "vue";
import * as Element from "element-plus";

const { ElForm, ElFormItem, ElInput, ElButton, ElDialog } = Element;

type DraftDataProp = {
  info:{title:string, des:string}
}
type dataType = {title:string, des:string}

export default defineComponent({
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object as PropType<dataType>,
      default: () => {},
    },
  },
  emits: ["on-close", "on-change"],
  setup(props, context) {
    // 显示弹窗标识
    const visibleSign = ref(false);
    const draftData = reactive<DraftDataProp>({
      info: {
        title: '',
        des: ''
      }
    });

    // 关闭弹窗
    const closeMode = () => {
      context.emit("on-close");
      draftData.info.title = '';
      draftData.info.des = '';
    };

    // 确定
    const confirm = () => {
      context.emit("on-change", draftData);
      closeMode();
    };

    // 监听
    watch(
      () => props.visible,
      (now) => {
        visibleSign.value = now;
        draftData.info.title = props.data.title;
        draftData.info.des = props.data.des;
      }
    );

    onMounted(() => {
      // getDraftsList();
    });

    return {
      confirm,
      ...toRefs(draftData),
      closeMode,
      visibleSign
    };
  },
});
</script>
<style lang="scss" scoped>
.content-box {
  padding: 4px;
}
</style>
