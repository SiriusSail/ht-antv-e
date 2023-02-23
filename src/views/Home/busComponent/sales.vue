<template>
  <div class="col_sales">
    <div class="left">
      <div>二三级</div>
      <div>（55项）</div>
    </div>
    <div class="right">
      <div class="title">
        <div class="title_left">一级（6项）</div>
        <div class="title_right">
          <span @click="handleSearch('零售量')">零售量+</span>
          <span @click="handleSearch('市占率')">市占率+</span>
          <span @click="handleSearch('批售量')"> 批售量+</span>
          <span @click="handleSearch('营业收入')">营业收入+</span>
          <span @click="handleSearch('利润总额')">利润总额+</span>
          <span @click="handleSearch('客户满意度')"> 客户满意度</span>
        </div>
      </div>
      <el-card class="body"
               body-style="padding:0;display: flex;justify-content: flex-start;border: 1px solid #E0EAF2;">
        <div class="body_left">业务指标</div>
        <div class="body_right">
          <div class="body_right__title">
            <img src="@/assets/images/dt.svg"
                 alt="">
          </div>
          <!-- 市场到线索start---上一下二 -->
          <div class="body_right__bottom">
            <div class="common_two">
              <div class="common bg1 color3 two_item"
                   @click="handleSearch('有效线索量')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="two_item__text">有效线索量</div>
              </div>
              <div class="common bg1 color3 two_item__w"
                   @click="handleSearch('舆情声量')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="two_item__w__text">舆情声量</div>
              </div>
              <div class="common bg1 color3 two_item__w"
                   @click="handleSearch('舆情关注度')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="two_item__w__text">舆情关注度</div>
              </div>
            </div>
            <!-- 线索到订单-总客流量start---上一下二 -->
            <div class="common_two">
              <div class="common bg1 color3 two_item"
                   @click="handleSearch('总客流量')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="two_item__text">
                  <p>总客</p>
                  <p>流量</p>
                </div>
              </div>
              <div class="common bg1 color3 two_item__w"
                   @click="handleSearch('邀约到店率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="two_item__w__text">邀约到店率</div>
              </div>
              <div class="common bg1 color3 two_item__w"
                   @click="handleSearch('首客流量')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="two_item__w__text">首客流量</div>
              </div>
            </div>
            <!-- 线索到订单-潜客量start---上一下三 -->
            <div class="common_three">
              <div class="common bg1 color3 three_item"
                   @click="handleSearch('潜客量')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="three_item__text">潜客量</div>
              </div>
              <div class="common bg1 color3 three_item__w"
                   @click="handleSearch('人均接待时长')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="three_item__w__text">人均接待时长</div>
              </div>
              <div class="common bg1 color3 three_item__w"
                   @click="handleSearch('试乘试驾率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="three_item__w__text">试乘试驾率</div>
              </div>
              <div class="common bg1 color3 three_item__w"
                   @click="handleSearch('留档率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="three_item__w__text">留档率</div>
              </div>
            </div>
            <!-- 线索到订单-订单数---上一下二 -->
            <div class="common_two">
              <div class="common bg1 color3 two_item"
                   @click="handleSearch('订单数')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="two_item__text">
                  <p>订单</p>
                  <p>数</p>
                </div>
              </div>
              <div class="common bg1 color3 two_item__w"
                   @click="handleSearch('战败率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="two_item__w__text">战败率</div>
              </div>
              <div class="common bg1 color3 two_item__w"
                   @click="handleSearch('成交率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="two_item__w__text">成交率</div>
              </div>
            </div>

            <!-- 线索到订单-启票订单满足率start---上一下四 -->
            <div class="common_four">
              <div class="common bg1 color3 four_item"
                   @click="handleSearch('启票订单满足率')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="four_item__text">启票订单满足率</div>
              </div>
              <div class="common bg1 color3 four_item__w"
                   @click="handleSearch('需求设计变动率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="four_item__w__text">需求设计变动率</div>
              </div>
              <div class="common bg1 color3 four_item__w"
                   @click="handleSearch('常规订单占比')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="four_item__w__text">常规订单占比</div>
              </div>
              <div class="common bg1 color3 four_item__w"
                   @click="handleSearch('常规订单执行率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="four_item__w__text">常规订单执行率</div>
              </div>
              <div class="common bg1 color3 four_item__w"
                   @click="handleSearch('OTD时长')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="four_item__w__text">OTD时长</div>
              </div>
            </div>
            <!-- 线索到订单-社会库存量start---上一下三 -->
            <div class="common_three">
              <div class="common bg1 color3 three_item"
                   @click="handleSearch('社会库存量')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="three_item__text">社会库存量</div>
              </div>
              <div class="common bg1 color3 three_item__w"
                   @click="handleSearch('在库库存量')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="three_item__w__text">在库库存量</div>
              </div>
              <div class="common bg1 color3 three_item__w"
                   @click="handleSearch('现金车占比')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="three_item__w__text">现金车占比</div>
              </div>
              <div class="common bg1 color3 three_item__w"
                   @click="handleSearch('库龄及车型占比')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="three_item__w__text">库龄及车型占比</div>
              </div>
            </div>
            <!-- 线索到订单-订单数---上一下二 -->
            <div class="common_one">
              <div class="common bg1 color3 one_item"
                   @click="handleSearch('销售满意度')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="one_item__text">
                  <p>销售</p>
                  <p>满意度</p>
                </div>
              </div>
              <div class="common bg1 color3 one_item__w"
                   @click="handleSearch('销售万台车客诉量')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="one_item__w__text">销售万台车客诉量</div>
              </div>
            </div>
            <!-- 线索到订单-服务满意度start---上一下四 -->
            <div class="common_four">
              <div class="common bg1 color3 four_item"
                   @click="handleSearch('服务满意度')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="four_item__text">服务满意度</div>
              </div>
              <div class="common bg1 color3 four_item__w"
                   @click="handleSearch('服务万台车客诉量')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="four_item__w__text">服务万台车客诉量</div>
              </div>
              <div class="common bg1 color3 four_item__w"
                   @click="handleSearch('一次恢复率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="four_item__w__text">一次恢复率</div>
              </div>
              <div class="common bg1 color3 four_item__w"
                   @click="handleSearch('售后准时完工率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="four_item__w__text">售后准时完工率</div>
              </div>
              <div class="common bg1 color3 four_item__w"
                   @click="handleSearch('客户保持率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="four_item__w__text">客户保持率</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <div class="fotter">
        <el-card body-style="padding:0;display: flex;justify-content: flex-start;border: 1px solid #E0EAF2;">
          <div class="fotter_left">能力指标</div>
          <div class="fotter_right">
            <!-- 渠道能力 -->
            <div class="ditch bg1">
              <div class="common bg2 ditch_num"
                   @click="handleSearch('渠道数量')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="ditch_num__text">渠道数量</div>
              </div>
              <div class="common bg2 mean_num mean_num__w"
                   @click="handleSearch('单店平均销量')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="mean_num__w___text">
                  <p>单店</p>
                  <p>平均</p>
                  <p>销量</p>
                </div>
              </div>
              <div class="common bg2 fraction"
                   @click="handleSearch('渠道覆盖率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="common__text">渠道覆盖率</div>
              </div>
              <div class="common bg2 add_num"
                   @click="handleSearch('渠道新增量')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="common__text">渠道新增量</div>
              </div>
              <div class="common bg2 obsolete"
                   @click="handleSearch('渠道淘汰率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="common__text">渠道淘汰率</div>
              </div>
              <div class="common bg2 counselor"
                   @click="handleSearch('渠道顾问人均销量')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="common__text">渠道顾问人均销量</div>
              </div>
              <div class="common bg2 capacity"
                   @click="handleSearch('单店运营能力')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="common__text">单店运营能力</div>
              </div>
              <div class="ditch_title">渠道能力</div>
            </div>
            <!-- 产品能力 -->
            <div class="ditch bg1 product">
              <div class="common bg2 mean_num"
                   @click="handleSearch('经典产品销量')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="mean_num__text">
                  <p>经典</p>
                  <p>产品</p>
                  <p>销量</p>
                </div>
              </div>
              <div class="common bg2 mean_num"
                   @click="handleSearch('市占率排名')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="mean_num__text">
                  <p>市占</p>
                  <p>率排</p>
                  <p>名</p>
                </div>
              </div>
              <div class="common bg2 mean_num"
                   @click="handleSearch('产品销售结构比')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="mean_num__text fz13">
                  <p>产品</p>
                  <p>销售</p>
                  <p>结构</p>
                  <p>比</p>
                </div>
              </div>
              <div class="common bg2 mean_num"
                   @click="handleSearch('产品细分市场市占率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="mean_num__text fz13">
                  <p>产品</p>
                  <p>细分</p>
                  <p>市场</p>
                  <p>市占率</p>
                </div>
              </div>
              <div class="ditch_title">产品能力</div>
            </div>
            <!-- 体系能力 -->
            <div class="ditch bg1 system">
              <div class="common bg2 add_num item_common"
                   @click="handleSearch('营销体系成熟度')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="item_common__text">营销体系成熟度</div>
              </div>
              <div class="common bg2 add_num item_common"
                   @click="handleSearch('数字化营销成熟度')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="item_common__text">数字化营销成熟度</div>
              </div>
              <div class="ditch_title">体系能力</div>
            </div>
          </div>
        </el-card>
        <el-card body-style="padding:0;display: flex;justify-content: flex-start;border: 1px solid #E0EAF2;">
          <div class="fotter_left">经营结果指标</div>
          <div class="fotter_right">
            <!-- 整车销售收入 -->
            <div class="ditch bg1 cat_item">
              <div class="common bg2 cat_item__w"
                   @click="handleSearch('整车销售收入')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="cat_item__text">整车销售收入</div>
              </div>
              <div class="common bg2 cat_item__w"
                   @click="handleSearch('产品成交均价')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="cat_item__text">产品成交均价</div>
              </div>
            </div>
            <!-- 整车销售利润 -->
            <div class="ditch bg1 sales_item">
              <div class="common bg2 sales_item__w"
                   @click="handleSearch('整车销售利润')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="sales_item__text">整车销售利润</div>
              </div>
              <div class="common bg2 cat_item__w"
                   @click="handleSearch('固定市场费用')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="cat_item__text">固定市场费用</div>
              </div>
              <div class="common bg2 cat_item__w"
                   @click="handleSearch('商务资源占比')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="cat_item__text">商务资源占比</div>
              </div>
              <div class="common bg2 cat_item__w"
                   @click="handleSearch('增购占比')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="cat_item__text">增购占比</div>
              </div>
              <div class="common bg2 cat_item__w"
                   @click="handleSearch('本品牌换购占比')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="cat_item__text">本品牌换购占比</div>
              </div>
              <div class="common bg2 cat_item__w"
                   @click="handleSearch('金融个贷渗透率')">
                <Iconfont name="icon-Three"
                          className="color2 fz12" />
                <div class="cat_item__text">金融个贷渗透率</div>
              </div>
            </div>
            <!-- 备件备品销售收入 -->
            <div class="ditch bg1 prepare_item">
              <div class="common bg2 prepare_item__w"
                   @click="handleSearch('备件备品销售收入')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="prepare_item__text">备件备品销售收入</div>
              </div>
              <div class="common bg2 prepare_item__w"
                   @click="handleSearch('备件备品利润')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="prepare_item__text">备件备品利润</div>
              </div>
              <div class="common bg2 prepare_item__w"
                   @click="handleSearch('组织及人才需求计划执行率')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="prepare_item__text">组织及人才需求计划执行率</div>
              </div>
              <div class="common bg2 prepare_item__w"
                   @click="handleSearch('从业人数')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="prepare_item__text">从业人数</div>
              </div>
              <div class="common bg2 prepare_item__w"
                   @click="handleSearch('运行费用控制率')">
                <Iconfont name="icon-Second"
                          className="color2 fz12" />
                <div class="prepare_item__text">运行费用控制率</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div class="tips">
        <div>注：1、“
          <Iconfont name="icon-Second"
                    className="color2 fz12 iconfont" />”为二级指标、“
          <Iconfont name="icon-Three"
                    className="color2 fz12 iconfont" />”三级指标；
        </div>
        <div class="tips_two">2、“数字化营销成熟度“ 暂为观察项。</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { defineComponent } from "vue";
  import { useRouter } from "vue-router";
  import Iconfont from '@/components/Iconfont/index'

  const router = useRouter();
  const handleSearch = (key) => {
    router.push(`/indexOnline/index?key=${key}&domain=all`);
  };
</script>
<style lang="scss" scoped>
  .col_sales {
    overflow: hidden;
    background-image: url('@/assets/images/background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin: auto;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
    .left {
      width: 70px;
      font-size: 14px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
    .right {
      display: flex;
      flex-direction: column;
      width: 700px;
      .title {
        font-size: 18px;
        font-weight: bold;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .title_left {
          font-size: 12px;
          width: 80px;
        }
        .title_right {
          color: #333333;
          background-color: #dfecff;
          text-align: center;
          padding: 5px 20px;
          border-radius: 2px;
          width: 100%;
          cursor: pointer;
        }
      }
      .body {
        margin-top: 2px;
        .body_left {
          width: 30px;
          height: 240px;
          display: flex;
          align-items: center;
          text-align: center;
          font-size: 13px;
          letter-spacing: 5px;
          font-weight: bold;
        }
        .body_right {
          width: 100%;
          .body_right__title {
            height: 30px;
            width: 100%;
            img {
              height: 100%;
              width: 100%;
            }
          }
          .body_right__bottom {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            .common_one {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              width: 52px;
              .one_item {
                width: 52px;
                height: 70px;
                text-align: center;
              }
              .one_item__w {
                width: 52px;
                height: 120px;
                text-align: center;
                font-size: 14px;
                .one_item__w__text {
                  margin-top: 10px;
                }
              }
            }
            .common_two {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              width: 52px;
              .two_item {
                width: 52px;
                height: 70px;
                text-align: center;
              }
              .two_item__w {
                width: 25px;
                height: 120px;
                text-align: center;
                font-size: 13px;
              }
            }
            .common_three {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              width: 77px;
              .three_item {
                width: 77px;
                height: 70px;
                text-align: center;
                .three_item__text {
                  margin-top: 10px;
                }
              }
              .three_item__w {
                width: 25px;
                height: 120px;
                text-align: center;
                font-size: 12px;
                .three_item__w__text {
                  margin-top: 10px;
                }
              }
            }
            .common_four {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              width: 120px;
              .four_item {
                width: 120px;
                height: 70px;
                text-align: center;
                .four_item__text {
                  margin-top: 10px;
                }
              }
              .four_item__w {
                width: 25px;
                height: 120px;
                text-align: center;
                font-size: 12px;
                .four_item__w__text {
                  margin-top: 20px;
                }
              }
            }
          }
        }
      }
      .fotter {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 2px;
        .fotter_left {
          width: 30px;
          height: 250px;
          letter-spacing: 5px;
          display: flex;
          align-items: center;
          text-align: center;
          font-size: 13px;
          font-weight: bold;
        }
        .fotter_right {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 5px;
          .ditch {
            padding: 0 5px 5px 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            width: 143px;
            .ditch_num {
              width: 90px;
              height: 90px;
              font-size: 15px;
              text-align: center;
              .ditch_num__text {
                margin-top: 20px;
              }
            }

            .mean_num {
              width: 40px;
              height: 110px;
              text-align: center;
              .mean_num__text {
                margin-top: 10px;
              }
            }
            .mean_num__w {
              height: 90px;
              font-size: 13px;
              .mean_num__w___text {
                margin-top: 8px;
              }
            }
            .fraction,
            .add_num,
            .obsolete,
            .counselor,
            .capacity {
              width: 25px;
              height: 130px;
              font-size: 12px;
              text-align: center;
              .common__text {
                margin-top: 10px;
                writing-mode: vertical-lr;
                margin-left: 3px;
              }
            }
            .ditch_title {
              width: 100%;
              font-size: 13px;
              font-weight: bold;
              margin-top: 4px;
              text-align: center;
            }
          }
          .product {
            width: 95px;
            margin-left: 3px;
          }
          .system {
            width: 62px;
            margin-left: 3px;
            .item_common {
              width: 25px;
              height: 225px;
              .item_common__text {
                margin-top: 30px;
                writing-mode: vertical-lr;
                margin-left: 2px;
                font-size: 15px;
              }
            }
          }
          .cat_item {
            width: 35px;
            .cat_item__w {
              width: 25px;
              height: 120px;
              font-size: 12px;
              text-align: center;
            }
            .cat_item__text {
              writing-mode: vertical-lr;
              margin-top: 10px;
              margin-left: 3px;
            }
          }
          .sales_item {
            width: 135px;
            .sales_item__w {
              width: 135px;
              height: 120px;
              text-align: center;
              .sales_item__text {
                margin-top: 30px;
              }
            }
            .cat_item__w {
              width: 22px;
              height: 120px;
              font-size: 12px;
              text-align: center;
            }
            .cat_item__text {
              writing-mode: vertical-lr;
              margin-top: 10px;
              margin-left: 2px;
            }
          }
          .prepare_item {
            width: 145px;
            .prepare_item__w {
              width: 25px;
              height: 245px;
              font-size: 13px;
              text-align: center;
              .prepare_item__text {
                writing-mode: vertical-lr;
                margin-top: 10px;
                margin-left: 3px;
              }
            }
          }
        }
      }
      .tips {
        font-size: 12px;
        color: red;
        margin-top: 3px;
        .tips_two {
          text-indent: 2em;
        }
      }
    }

    .common {
      margin-top: 5px;
      border-radius: 3px;
      cursor: pointer;
    }
    .iconfont {
      display: inline-block;
    }

    // 颜色
    .bg1 {
      background-color: #e0edff;
    }
    .bg2 {
      background-color: #ffffff;
    }
    // 字体
    .fz13 {
      font-size: 13px;
    }
    .fz12 {
      font-size: 12px;
    }
    // 字体颜色
    .color1 {
      color: #ffffff;
    }
    .color2 {
      color: #20a0ff;
    }
    .color3 {
      color: #666666;
    }
  }
</style>
