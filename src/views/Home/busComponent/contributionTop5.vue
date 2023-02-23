<template>
  <div class="contribution_ranking">
    <div class="ranking_tabs">
      <div class="ranking_title"
           @click="href('/empowerment')">
        贡献TOP5
      </div>
      <el-tabs v-model="state.activeName"
               @tab-click="handleClick">
        <el-tab-pane :label="state.month + '月榜'"
                     name="1">
          <div class="ranking_con">
            <div class="ranking_list">
              <div v-for="(item, index) in state.ranking_list_domain_curMouth"
                   :key="index"
                   class="item">
                <img class="img"
                     v-if="index < 3"
                     :src="state.ranking_img[index]"
                     alt="" />
                <div v-else
                     class="img">{{ index + 1 }}</div>
                <el-tooltip v-if="item.name"
                            effect="dark"
                            :content="item.name"
                            placement="top-start">
                  <div class="label">{{ item.name }}</div>
                </el-tooltip>

                <div class="num">{{ item.value }}</div>
                <em class="icon-rise iconfont"
                    v-if="item.direction == 1" />
                <em class="icon-decline iconfont"
                    v-if="item.direction == -1" />
                <em class="el-icon-minus iconfont"
                    v-if="item.rankChange == 0" />
              </div>
            </div>
            <div class="hr" />
            <div class="ranking_list">
              <div v-for="(item, index) in state.ranking_list_domain_curMouths"
                   :key="index"
                   class="item">
                <img class="img"
                     v-if="index < 3"
                     :src="state.ranking_img[index]"
                     alt="" />
                <div v-else
                     class="img">{{ index + 1 }}</div>
                <el-tooltip v-if="item.createUsername"
                            effect="dark"
                            :content="item.createUsername"
                            placement="top-start">
                  <div class="label">{{ item.createUsername }}</div>
                </el-tooltip>
                <div class="num">{{ item.summaryPoints }}</div>
                <em class="icon-rise iconfont"
                    v-if="item.rankChange == 0" />
                <em class="icon-decline iconfont"
                    v-if="item.rankChange == 1" />
                <em class="el-icon-minus iconfont"
                    v-if="item.rankChange == 2" />
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="总榜"
                     name="2">
          <div class="ranking_con">
            <div class="ranking_list">
              <div v-for="(item, index) in state.ranking_list_domain_curUser"
                   :key="index"
                   class="item">
                <img class="img"
                     v-if="index < 3"
                     :src="state.ranking_img[index]"
                     alt="" />
                <div v-else
                     class="img">{{ index + 1 }}</div>

                <el-tooltip v-if="item.name"
                            effect="dark"
                            :content="item.name"
                            placement="top-start">
                  <div class="label">{{ item.name }}</div>
                </el-tooltip>
                <div class="num">{{ item.value }}</div>
              </div>
            </div>
            <div class="hr" />
            <div class="ranking_list">
              <div v-for="(item, index) in state.ranking_list_domain_curUsers"
                   :key="index"
                   class="item">
                <img class="img"
                     v-if="index < 3"
                     :src="state.ranking_img[index]"
                     alt="" />
                <div v-else
                     class="img">{{ index + 1 }}</div>
                <el-tooltip v-if="item.createUsername"
                            effect="dark"
                            :content="item.createUsername"
                            placement="top-start">
                  <div class="label">{{ item.createUsername }}</div>
                </el-tooltip>
                <div class="num">{{ item.summaryPoints }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script lang="ts" setup>
  import { defineComponent, ref, reactive, toRefs, computed, onMounted, onDeactivated } from "vue";
  import { useRouter } from "vue-router";
  import { RankingList, PointsTop5 } from "../api/index";
  import numberone from "@/assets/images/numberone.svg";
  import numbertwo from "@/assets/images/numbertwo.svg";
  import numberthree from "@/assets/images/numberthree.svg";

  const router = useRouter();
  const state = reactive({
    ranking_img: [numberone, numbertwo, numberthree],
    activeName: "1",
    month: "",
    ranking_list_domain_curMouth: [],
    ranking_list_domain_curMouths: [],
    ranking_list_domain_curUser: [],
    ranking_list_domain_curUsers: []
  });
  const href = (url: string) => {
    router.push(url);
  };


  // 领域排行榜
  const getRankingList = () => {
    RankingList({ opType: state.activeName }).then((res: any) => {
      if (state.activeName === "1") {
        if (res.result.domain.length > 0) {
          let len = res.result.domain.length;
          for (let i = 0; i < 5 - len; i++) {
            res.result.domain.push({ name: '' });
          }
          state.ranking_list_domain_curMouth = res.result.domain;
        } else {
          state.ranking_list_domain_curMouth = [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }];
        }
      } else {
        if (res.result.domain.length > 0) {
          let len = res.result.domain.length;
          for (let i = 0; i < 5 - len; i++) {
            res.result.domain.push({ name: '' });
          }
          state.ranking_list_domain_curUser = res.result.domain;
        } else {
          state.ranking_list_domain_curUser = [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }];
        }
      }
    });
  };
  // 用户排行榜
  const getPointsTop5 = () => {
    PointsTop5().then((res: any) => {
      if (res.result.current.length > 0) {
        let len = res.result.current.length;
        for (let i = 0; i < 5 - len; i++) {
          res.result.current.push({ createUsername: '' });
        }
        state.ranking_list_domain_curMouths = res.result.current;
      } else {
        state.ranking_list_domain_curMouths = [{ createUsername: '' }, { createUsername: '' }, { createUsername: '' }, { createUsername: '' }, { createUsername: '' }];
      }

      state.month = res.result.month;
      if (res.result.summary.length > 0) {
        let len = res.result.summary.length;
        for (let i = 0; i < 5 - len; i++) {
          res.result.summary.push({ createUsername: '' });
        }
        state.ranking_list_domain_curUsers = res.result.summary;
      } else {
        state.ranking_list_domain_curUsers = [{ createUsername: '' }, { createUsername: '' }, { createUsername: '' }, { createUsername: '' }, { createUsername: '' }];
      }
    });
  };
  const handleClick = () => {
    getRankingList();
  };

  // DOM加载完毕
  onMounted(() => {
    getRankingList();
    getPointsTop5();
  });

</script>

<style scoped lang="scss">
  .contribution_ranking {
    flex: 1;
    :deep(.el-tabs__nav) {
      margin-left: 120px;
    }
    .ranking_tabs {
      position: relative;
      padding: 20px;
      .ranking_title {
        position: absolute;
        left: 20px;
        top: 20px;
        font-weight: 700;
        font-size: 14px;
      }
    }
    .ranking_con {
      display: flex;
      position: relative;
      .hr {
        position: absolute;
        left: 50%;
        top: 0;
        height: 100%;
        width: 2px;
        background-color: #e5e5e5;
      }
      .ranking_list {
        flex: 1;
        .item {
          height: 50px;
          display: flex;
          align-items: center;
          flex-direction: row;
          border-bottom: 2px solid #e5e5e5;
          .img {
            width: 22px;
            height: 22px;
            line-height: 22px;
            text-align: center;
          }
          &:last-child {
            border-bottom: none;
          }
          .label {
            padding-left: 10px;
            font-size: 14px;
            height: 22px;
            line-height: 22px;
            width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .num {
            height: 22px;
            line-height: 22px;
            padding-left: 10px;
            font-size: 14px;
          }
          .icon-rise {
            font-size: 24px;
            color: #1ec435;
          }
          .icon-decline {
            font-size: 24px;
            color: #f53535;
          }
          .el-icon-minus {
            font-size: 24px;
            color: #f1a644;
          }
        }
        &:not(:first-child) {
          margin-left: 40px;
        }
      }
    }
  }
</style>
