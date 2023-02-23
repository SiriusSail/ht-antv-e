// 类型卡片
import { Nodes, Relations } from "../api/index";

import dbSvg from "@/assets/images/db.svg";
import apiSvg from "@/assets/images/api.svg";
import cardSvg from "@/assets/images/tj.svg";
import baobiaoSvg from "@/assets/images/baobiao.svg";
const assetSvg = "/admin/flowChart/icon/asset.svg";
const atomSvg = "/admin/flowChart/icon/atom.svg";
const constant = "/admin/flowChart/icon/constant.svg";
const business = "/admin/flowChart/icon/business.svg";
//
const tooltip = {
  formatter(params: any) {
    return params.data.label.formatter || params.data.name;
  },
};
const width = 80; //统一宽度
class RenderTypeCard {
  //渲染长方形形
  renderRect(node: Nodes, path?: string) {
    return {
      name: node.nodeId,
      value: 10,
      symbolSize: [15, 15],
      label: {
        width: width,
        formatter: node.nodeName,
        position: "bottom",
        color: "#000",
      },
      // itemStyle: {
      //   color: color,
      // },
      tooltip: tooltip,
      // symbol: "rect",
      symbol: "image://" + path,
    };
  }

  /**
   * 目标类型 ：0.数仓、1.数据源、3.原子指标、4.衍生指标、5.业务指标、6.复合指标、7.自定义指标、8.数据卡片、9.API、10.报表
   *
   * 数仓 - 数据源图形
   * 数据源 - 菱形
   * 3.原子指标 #34c6cd 、4.衍生指标 5dc8cd、5.业务指标 01939a 6.复合指标466fd5 、7.自定义指标 6c8ad5  圆形 不同颜色
   * 指标卡片 椭圆
   * API 长方形
   * 报表  长方形
   */
  //类型判断渲染卡片
  selectRander(node: Nodes) {
    if (node.noteType === 0) {
      return this.renderRect(node, dbSvg);
    } else if (node.noteType === 1) {
      return this.renderRect(node, assetSvg);
    } else if (node.noteType === 3) {
      return this.renderRect(node, atomSvg);
    } else if (node.noteType === 4) {
      return this.renderRect(node, constant);
    } else if (node.noteType === 5) {
      return this.renderRect(node, business);
    } else if (node.noteType === 6) {
      return this.renderRect(node, business);
    } else if (node.noteType === 7) {
      return this.renderRect(node, business);
    } else if (node.noteType === 8) {
      return this.renderRect(node, cardSvg);
    } else if (node.noteType === 9) {
      return this.renderRect(node, apiSvg);
    } else if (node.noteType === 10) {
      return this.renderRect(node, baobiaoSvg);
    } else {
      return this.renderRect(node, assetSvg);
    }
  }

  // 渲染
  getLinks(link: Relations) {
    return {
      source: link.fromId,
      target: link.toId,
      tooltip: {
        show: false,
        // formatter(params: any) {
        //   console.log(params);
        //   return "{b}";
        // },
      },
    };
  }
}

export default RenderTypeCard;
