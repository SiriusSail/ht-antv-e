<template>
  <div class="icon-panel">
    <el-input
      v-model="key"
      placeholder="搜索图标"
      @input="search"
    >
      <el-button icon="el-icon-search" @click="search()"></el-button>
    </el-input>
    <br>
    <br>
    <el-scrollbar height="260px">
      <div class="col_item">
        <section>
          <iconfont
            v-for="ic in iconfontNameArr"
            :key="ic"
            class-name="icon-items"
            :name="ic"
            @click="selected(ic)"
          >
          </iconfont>
        </section>
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent, reactive, toRefs, onMounted } from "vue";
import Iconfont, { iconfontNameArr } from "@/components/Iconfont";

export default defineComponent({
  name: "Icon",
  components: {
    Iconfont,
  },

  props: {
    msg: {
      type: String,
      required: false,
      default: "",
    },
  },
  emits: ["success"],
  setup: (props, { emit }) => {
    const state = reactive({
      data: [""],
      key: "",
    });
    const count = ref(0);

    const search = () => {
      state.data = iconfontNameArr;
    };
    const selected = (icon: any) => {
      emit("success", icon);
    };
    onMounted(() => {
      state.data = iconfontNameArr;
    });

    return { count, ...toRefs(state), search, selected, iconfontNameArr };
  },
});
</script>

<style lang="scss" scoped>
.col_item {
  padding-bottom: 20px;
}
.icon-panel {
  padding: 10px;
  user-select: none;
}

.icon-items {
  display: inline-block;
  padding: 4px;
  border: 1px solid #efefef;
  margin: 2px;
  color: #6f7180;
  border-radius: 3px;
  transition: all 0.3s;
  overflow: hidden;
  &:hover {
    background: #1daaef;
    color: white;
  }

  i {
    font-size: 18px;
  }
}
</style>
