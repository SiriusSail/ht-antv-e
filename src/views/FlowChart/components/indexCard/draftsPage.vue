<template>
  <div class="drafts_wrap" :class="{ drafts_wrap_hide: showFlag }">
    <div v-show="!showFlag" class="drafts_inner">
      <idv class="shrink-box" @click="handleDraft">
        <span></span>
        <span></span>
        <span></span>
      </idv>
      <h3 class="drafts_title">草稿箱</h3>
      <ul>
        <li v-for="option in info.records" :key="option.id" class="drafts_item">
          <span @click="clickItem(option)">{{ option.name }}</span>
          <em class="drafts_icon" @click="beforeDel(option.rowId)">删除</em>
        </li>
      </ul>
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
import http, { PageItem, DraftsProp, DraftsItem } from "./api";

const { ElMessage, ElMessageBox } = Element;

type DraftDataProp = {
  info: DraftsProp;
};

export default defineComponent({
  props: {
    showFlag: {
      type: Boolean,
      default: true,
    },
    onClose: {
      type: Function as PropType<() => void>,
      default: (): undefined => undefined,
    },
    onChange: {
      type: Function as PropType<(value: DraftsItem) => void>,
      default: (): undefined => undefined,
    },
  },
  emits: ["on-close", "on-change"],
  setup(props, context) {
    const draftsParam: PageItem = { limit: 20, page: 1 };
    const draftData = reactive<DraftDataProp>({
      info: {
        current: 1,
        hitCount: false,
        optimizeCountSql: true,
        records: [],
        orders: [],
        pages: 2,
        searchCount: true,
        size: 10,
        total: 15,
      },
    });

    const handleDraft = () => {
      context.emit("on-close");
      props.onClose?.();
    };

    // 获取草稿箱列表
    const getDraftsList = () => {
      http.ApiGetDraftsList(draftsParam).then((res) => {
        const { result } = res;
        draftData.info = result;
      });
    };

    const clickItem = (cur: DraftsItem) => {
      context.emit("on-change", cur);
      props.onChange?.(cur);
    };

    // 删除
    const delItem = async (id: string) => {
      await http.ApiDelDrafts([id]);
      ElMessage.success("草稿删除成功");
      draftsParam.limit = 20;
      // draftsParam.page = draftData.info.pages;
      getDraftsList();
    };

    const beforeDel = (id: string) => {
      ElMessageBox.confirm("确认删除吗？")
        .then(() => {
          delItem(id);
        })
        .catch(() => {
          console.log("cancel");
        });
    };

    watch(
      () => props.showFlag,
      (now) => {
        if (now === false) getDraftsList();
      }
    );

    onMounted(() => {
      // getDraftsList();
    });
    return {
      handleDraft,
      ...toRefs(draftData),
      clickItem,
      beforeDel,
    };
  },
});
</script>
<style lang="scss" scoped>
.drafts_wrap {
  width: 220px;
  position: absolute;
  height: 100%;
  top: 0px;
  left: 0px;
  background: #fff;
  transition: all 0.3s;
  ul {
    padding: 5px;
    padding-top: 0;
  }
}
.drafts_inner {
  height: inherit;
}
.drafts_wrap_hide {
  width: 0;
}
.shrink-box {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 25px;
  cursor: pointer;
  z-index: 1;
  span {
    display: block;
    width: 100%;
    height: 2px;
    margin-top: 4px;
    width: 25px;
    background: #e5e5e5;
  }
}
.drafts_title {
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
}
.drafts_item {
  display: flex;
  padding: 5px 0;
  justify-content: space-between;
  align-items: center;
  color: #333;
  cursor: pointer;
  .drafts_icon {
    color: #bfc7d2;
    cursor: pointer;
    font-style: normal;
    font-size: 13px;
  }
  span {
    display: inline-block;
    width: 160px;
    word-break: break-all;
  }
}
</style>
