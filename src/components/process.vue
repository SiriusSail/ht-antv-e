<template>
  <div class="process_col">
    <div class="process_col_bar">
      <div class="process_col_bar_outer"
           :style="{backgroundColor:botBgColor}">
        <div class="inner"
             :style="{width: sWidth+'%',backgroundColor:topBgColor}"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, toRefs } from "vue";
  export default defineComponent({
    props: {
      sWidth: {
        type: String,
        default: '0'
      },
      botBgColor: {
        type: String,
        default: ''
      },
      topBgColor: {
        type: String,
        default: ''
      },
    },
    setup (props) {
      const { sWidth, botBgColor, topBgColor } = toRefs(props)
      return {
        sWidth,
        botBgColor,
        topBgColor
      }
    }
  });
</script>
<style scoped lang="scss">
  .process_col {
    position: relative;
    line-height: 1;
    display: flex;
    align-items: center;
    .process_col_bar {
      padding-right: 0;
      margin-right: 0;
      flex-grow: 1;
      display: block;
      box-sizing: border-box;
      .process_col_bar_outer {
        height: 6px;
        border-radius: 100px;
        background-color: #c0ccda;
        overflow: hidden;
        position: relative;
        vertical-align: middle;
        .inner {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background-color: #67c23a;
          text-align: right;
          border-radius: 100 px;
          line-height: 1;
          white-space: nowrap;
          ::after {
            display: inline-block;
            content: '';
            height: 100%;
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>