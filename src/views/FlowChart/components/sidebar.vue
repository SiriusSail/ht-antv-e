<template>
  <el-menu
    :default-active='index'
    class="el-menu-vertical-sidebar background-color"
    @select="onSelect"
  >
    <div class='sub-menu-flex'>
      <div class='sub-menu-flex-tr'>
        <el-menu-item
          index="1"
          class='el-sub-menu-sidebar'
        >
          <Iconfont name='icon-a-dataassets' />
          <template #title>数据源</template>
        </el-menu-item>
        <el-menu-item
          index="2"
          class='el-sub-menu-sidebar'
        >
          <Iconfont name='icon-a-dataassets' />
          <template #title>数据资产</template>
        </el-menu-item>
        <el-menu-item
          index="3"
          class='el-sub-menu-sidebar'
        >
          <Iconfont name='icon-datacard' />
          <template #title>数据卡片</template>
        </el-menu-item>
        <el-menu-item
          index="5"
          class='el-sub-menu-sidebar'
        >
          <Iconfont name='icon-a-dataexploit' />
          <template #title>数据开发</template>
        </el-menu-item>
        <el-menu-item
          index="6"
          class='el-sub-menu-sidebar'
        >
          <Iconfont name='icon-a-indexcard' />
          <template #title>指标卡片</template>
        </el-menu-item>
        <el-menu-item
          index="4"
          class='el-sub-menu-sidebar'
        >
          <Iconfont name='icon-a-datatemplate' />
          <template #title>开发模版</template>
        </el-menu-item>
        <el-menu-item
          index="8"
          class='el-sub-menu-sidebar'
        >
          <Iconfont name='icon-a-toolmarket' />
          <template #title>工具市场</template>
        </el-menu-item>
      </div>

      <div class='sub-menu-flex-tr'>
        <el-menu-item
          index="13"
          class='el-sub-menu-sidebar-2'
        >
          <ElTooltip
            effect='light'
            content='草稿箱'
            placement='bottom'
          >
            <Iconfont class={{styles.graph_icon}} name='icon-drafts' />
          </ElTooltip>
        </el-menu-item>
        <el-menu-item
          index="9"
          class='el-sub-menu-sidebar-2'
        >
          <Iconfont name='icon-task' />
        </el-menu-item>
        <el-menu-item
          index="10"
          class='el-sub-menu-sidebar-2'
        >
          <Iconfont name='icon-enable' />
        </el-menu-item>
        <el-menu-item
          index="11"
          class='el-sub-menu-sidebar-2'
        >
          <Iconfont name='icon-install' />
        </el-menu-item>
        <el-menu-item
          index="12"
          class='el-sub-menu-sidebar-2'
        >
          <Iconfont name='icon-help' />
        </el-menu-item>
      </div>
    </div>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import * as Element from 'element-plus'
import Iconfont from '@/components/Iconfont/index'
import styles from '@/views/FlowChart/index.module.scss'

const { ElTooltip } = Element;

export default defineComponent({
  components: {
    Iconfont
  },
  props: {
    value: {
      type: Object as PropType<Ref<string>>,
      required: true,
    },
    onChange: {
      type: Function as PropType<(newIndex: string, oldIndex?:string) => Promise<any> | void>,
      required: false,
      default: null
    }
  },
  setup(props) {
    const router = useRouter();
    let oldIndex = `${props.value?.value  }`;
    const onSelect = async (e: string) => {
      await props.onChange?.(e, oldIndex)
      let url = '';
      switch (e) {
        case '1':
          url = '/flowchart/data-source';
          break;
        case '2':
          url = '/flowchart/data-assets';
          break;
        case '3':
          url = '/flowchart/data-card';
          break;
        case '5':
          url = '/flowchart/index';
          break;
        case '6':
          url = '/flowchart/index-card';
          break;
        default:
         // url = '/flowchart/index'
      }
      if (url && router.currentRoute.value.fullPath !== url) {
        router.push(url)
      }
      oldIndex = props.value.value;

    }
    const index = computed(() => props.value || '1')
    return {
      index,
      onSelect,
    }
  },
})
</script>

<style lang="scss" scoped>
.el-menu-vertical-sidebar:not(.el-menu--collapse) {
  width: 80px;
  height: 100%;
  .sub-menu-flex {
    display: flex;
    padding-bottom: 40px;
    height: 100%;
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
  }
  .sub-menu-flex-tr {
    width: 100%;
  }

  /* background-color: ; */
  .el-sub-menu-sidebar {
    color: #fff;
    line-height: 28px;
    white-space: inherit;
    text-align: center;
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
  }
  .el-sub-menu-sidebar-2 {
    color: #fff;
    line-height: 28px;
    text-align: center;
    padding: 0 !important;
    height: 28px;
  }
  .is-active {
    background-color: #20A0FF;
  }
}
</style>