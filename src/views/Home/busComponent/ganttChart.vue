<template>
  <div class="ganttChart">
    <div id="gantt_here" style="width: 100%; height: 300px"></div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { getDemDemand } from "../api/index";
import dayjs from "dayjs";
const tasks = {
  data: [],
};
const init = () => {
  gantt.plugins({
    tooltip: true,
  });
  //自定义tooltip
  gantt.templates.tooltip_text = function (start: Date, end: Date, task: any) {
    const t = gantt;
    const output = `<b>任务：</b>${
      task.text
    }<br/><b>开始时间：</b>${t.templates.tooltip_date_format(
      start
    )}<br/><b>结束时间：</b>${task.show_end_date}`;
    return output;
  };

  gantt.config.duration_unit = "day";
  gantt.config.scale_unit = "day";
  gantt.config.readonly = true; // 开启只读模式
  gantt.config.scale_unit = "day";
  gantt.config.step = 1;
  gantt.config.date_scale = "%d";
  gantt.config.xml_date = "%Y-%m-%d";

  gantt.config.columns = [
    {
      name: "text",
      label: "编号",
      width: 50,
      template: function (obj: any) {
        return `${getNumberDiv(obj.id)}`; // 通过 template 回调可以指定返回内容值
      },
    },
    {
      name: "text",
      label: "全部任务",
      width: 140,
      template: function (obj: any) {
        return `${getStateDiv(obj.state)}${obj.text}`; // 通过 template 回调可以指定返回内容值
      },
    },
  ];
  gantt.templates.task_class = function (start, end, item) {
    if (item.state == 1) {
      return "success";
    } else if (item.state == 2) {
      return "warning";
    } else {
      return "fail";
    }
  };
};
gantt.templates.task_text = (start, end, task) => {
  return `<span class="task_text" style='text-align:left;'>${task.name}</span>`;
};

const getNumberDiv = (id: number) => {
  return ` <div class="number-sapn">${id}</div>`;
};
const getStateDiv = (state: number) => {
  if (state == 1) {
    return `<div class="success state">
      <em class="icon el-icon-circle-check"></em>完成
    </div>`;
  } else if (state == 2) {
    return `<div class="warning state">
      <em class="icon el-icon-remove-outline"></em>进行中
    </div>`;
  } else {
    return `<div class="fail state">
      <em class="icon el-icon-circle-close"></em>失败
    </div>`;
  }
};

onMounted(() => {
  init();
  // gantt.init("gantt_here");
  // gantt.parse(tasks);
  getDailyCase();
});
function timeDiff(sTime: any, eTime: any) {
  let startTime = new Date(sTime);
  let endTime = new Date(eTime);
  let leftHour = 0;
  if (endTime.getTime() > startTime.getTime()) {
    let msDiff = endTime.getTime() - startTime.getTime();
    leftHour = Math.floor(msDiff / (1000 * 3600));
  }
  return leftHour;
}
function passTime(startTime: any, endTime: any, demandState: any) {
  let sTime = new Date(startTime).getTime();
  let nowTime = Date.now(); //当前时间
  let eTime = new Date(endTime).getTime();
  let status = 1; // 默认完成
  let passHour = 0;
  //计算时间相差多少天
  let differDay = Math.floor((eTime - nowTime) / 1000 / 60 / 60 / 24);
  //当前时间比结束时间大则进度条走完100
  if (nowTime >= eTime) {
    passHour = 1;
  }
  if (demandState == 5) {
    return {
      num: passHour * (1.0 / timeDiff(startTime, endTime)),
      status: 1,
    };
  } else if (nowTime >= eTime && demandState != 5) {
    status = 2;
  }
  if (differDay <= 3 && differDay >= 0) {
    status = 3;
  }

  //当前时间比开始时间大计算进度条位置
  if (nowTime > sTime) {
    let msDiff = nowTime - sTime;
    passHour = Math.ceil(msDiff / (1000 * 3600));
  }
  return {
    num: passHour * (1.0 / timeDiff(startTime, endTime)),
    status,
  };
}

const getDailyCase = () => {
  getDemDemand({ page: 1, limit: 500 }).then((res: any) => {
    const list = [];
    if (res.result.records.length > 0) {
      res.result.records.map((item) => {
        const obj = {
          id: 0,
          text: "",
          start_date: "",
          end_date: "",
          show_end_date: "",
          name: "",
          color: "",
          progress: 0,
          state: 2,
        };
        if (item.begin && item.deadline) {
          let dateTime = new Date(item.deadline);
          dateTime = +dateTime + 24 * 60 * 60 * 1000;
          dateTime = new Date(dateTime);
          dateTime = dayjs(dateTime).format("YYYY-MM-DD");
          let resutls = passTime(item.begin, dateTime, item.demandState);
          obj.id = item.id;
          obj.text = item.demandName;
          obj.start_date = item.begin;
          obj.end_date = dateTime;
          obj.show_end_date = item.deadline;
          obj.progress = resutls.num;
          obj.name = item.demandDeveloper || item.demandName;
          if (resutls.num >= 1) {
            obj.progress = 1;
            if (resutls.status == 1) {
              obj["color"] = "#67c23a";
              obj.state = 1;
            } else if (resutls.status == 2) {
              obj.state = 2;
              obj["color"] = "#f56c6c"; //红色  当前时间超过且状态demandState：5的时候显示的颜色
            } else if (resutls.status == 3) {
              obj.state = 2;
              obj["color"] = "#e6a23c"; //橘色 小于3天的时候显示的颜色
            }
          } else {
            if (resutls.status == 1) {
              obj["color"] = "#67c23a";
              obj.state = 1;
            } else if (resutls.status == 2) {
              obj.state = 2;
              obj["color"] = "#f56c6c"; //红色  当前时间超过且状态demandState：5的时候显示的颜色
            } else if (resutls.status == 3) {
              obj.state = 2;
              obj["color"] = "#e6a23c"; //橘色 小于3天的时候显示的颜色
            }
          }
          list.push(obj);
        }
      });
    }
    tasks.data = list;
    gantt.init("gantt_here");
    gantt.parse(tasks);
  });
};
</script>
<style lang="scss">
.ganttChart {
  .gantt_task_line {
    height: 16px !important;
    line-height: 16px !important;
    margin-top: 8px;
    border: none !important;
  }
  /* 里程碑 */
  .gantt_task_line.gantt_milestone {
    width: 30px !important;
    height: 30px !important;
    border: none !important;
    background-color: inherit !important;
    background-size: cover;
  }
  /* 里程碑icon */
  .gantt_task_line.gantt_milestone .gantt_task_content {
    margin-top: -8px;
    transform: rotate(0deg) !important;
    background-image: url("iconURL") !important;
  }
  /* 左侧悬浮单元格背景色 */
  .gantt_grid_data .gantt_row.odd:hover,
  .gantt_grid_data .gantt_row:hover {
    background-color: aquamarine !important;
  }
  /* 选中一列背景色 */
  .gantt_grid_data .gantt_row.gantt_selected,
  .gantt_grid_data .gantt_row.odd.gantt_selected,
  .gantt_task_row.gantt_selected {
    background-color: aquamarine !important;
  }
  /* 选中一列每个单元格右border颜色 */
  .gantt_task_row.gantt_selected .gantt_task_cell {
    border-right-color: aquamarine !important;
  }

  /* 任务名前的logo */
  .gantt_tree_icon.gantt_file,
  .gantt_tree_icon.gantt_folder_open,
  .gantt_tree_icon.gantt_folder_closed {
    width: 10px;
    background-image: none;
  }
  .gantt_tree_content {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 标记线 */
  .gantt_marker {
    background-color: brown;
    opacity: 0.4;
  }
  .ganttChart {
    width: 100%;
  }

  .weekend {
    background: #f4f7f4;
  }

  .gantt_selected .weekend {
    background: aquamarine;
  }
  .state {
    margin-right: 4px;
    color: #666;
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 3px;
    height: 24px;
    display: inline-block;
    line-height: 20px;
    .icon {
      padding-right: 4px;
    }
  }
  .success {
    background-color: rgb(230, 252, 249);
    .icon {
      color: rgb(111, 212, 201);
    }
  }
  .warning {
    background-color: rgb(255, 244, 225);
    .icon {
      color: rgb(233, 199, 112);
    }
  }
  .fail {
    background-color: rgb(255, 232, 235);
    .icon {
      color: rgb(209, 124, 140);
    }
  }

  .number-sapn {
    padding: 2px 10px;
    background-color: rgb(224, 254, 248);
    color: rgb(132, 223, 207);
    display: inline-block;
    font-size: 12px;
    border-radius: 4px;
    line-height: 14px;
  }
  .task_text {
    color: #333;
    text-align: left;
  }
}
</style>
