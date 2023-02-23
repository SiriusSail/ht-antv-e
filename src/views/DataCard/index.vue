<template>
  <div class="DataCard">
    <div class="query-con">
      <Myform :form="query" :list="formList">
        <template #submit>
          <MyButton type="primary" @click="search">查询</MyButton>
        </template></Myform
      >
    </div>
    <el-row :gutter="20">
      <el-col
        :xs="12"
        :sm="8"
        :md="6"
        :lg="6"
        :xl="4"
        v-for="item in list"
        :key="item.rowId"
      >
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class="card-container" @click="href(item)">
            <div class="card-image">
              <el-image
                fit="fill"
                class="image"
                :src="item.thumbnail"
                lazy
              ></el-image>
            </div>
            <div class="card-title">
              {{ item.name }}
            </div>
            <div class="card-description">{{ item.description }}</div>
            <div class="card-datetime">
              {{ item.gmtCreate }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
      background
      v-model:currentPage="query.page"
      :page-size="query.limit"
      :page-sizes="[8, 20, 30, 40, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="query.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, reactive, toRefs } from "vue";
import Api from "@/api/DataCard";
import { ListReq, ListRes, DataItem } from "@/api/types/DataCard";
import Myform, { InputItem } from "@/components/Form/index.vue";
import { useRouter } from "vue-router";
type stateProps = {
  query: ListReq & { total: number };
  list: DataItem[];
  formList: InputItem[];
};
const router = useRouter();
const state = reactive<stateProps>({
  query: {
    total: 0,
    limit: 8,
    page: 1,
    name: "",
  },
  list: [],
  formList: [
    {
      col: { span: 8 },
      type: "text",
      name: "name",
      placeholder: "请输入关键字",
    },
    {
      col: { span: 4 },
      type: "slot",
      name: "submit",
    },
  ],
});
const handleSizeChange = (size: number) => {
  state.query.limit = size;
  getData();
};

const handleCurrentChange = (page: number) => {
  state.query.page = page;
  getData();
};
const search = () => {
  getData();
  state.query.name = "";
};
const getData = async () => {
  const res = await Api.getList({
    limit: state.query.limit,
    page: state.query.page,
    name: state.query.name,
  });
  state.list = res.result.records;
  state.query.total = res.result.total;
};
const href = (item: DataItem) => {
  const detail = router.resolve({
    path: "/flowchart/canvasPreview",
    query: { rowId: item.rowId },
  });
  window.open(detail.href, "_blank");
};

const { query, list, formList } = toRefs(state);

getData();
</script>
<style scoped lang="scss">
@mixin text-ellipsis {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //用省略号显示
  white-space: nowrap; //不换行
}
.DataCard {
  padding: 10px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 80px);
}
.el-card {
  margin-bottom: 20px;
}
.card-container {
  cursor: pointer;
  .card-image {
    height: 150px;
    // width: 150px;
    .image {
      width: 100%;
      height: 100%;
    }
  }
  .card-title {
    margin: 20px 20px 10px 20px;
    font-size: 16px;
    font-weight: 700;
    @include text-ellipsis;
  }
  .card-description {
    margin: 0 20px 10px 20px;
    @include text-ellipsis;
  }
  .card-datetime {
    margin: 0 20px 10px 20px;
    color: rgba(81, 90, 110, 0.6);
  }
}

.query-con {
  padding: 20px;
  padding-top: 20px;
  padding-bottom: 0px;
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
}
.el-pagination {
  text-align: center;
}
</style>
