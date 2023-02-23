import axios from 'axios'
import ElMessage from "element-plus/lib/components/message/src/message";
import ElMessageBox from "element-plus/lib/components/message-box/src/message-box.type";

type ExpandVueComponentCustomProperties = {
  /**
   * 兼容报错，这个属性并不存在
   */
  state: any;
  /**
   * 兼容报错，这个属性并不存在
   */
  props: any;
  /**
   * 兼容报错，这个属性并不存在
   */
  context: any;
  /**
   * 兼容报错，这个属性并不存在
   */
  setState: any;
  /**
   * 兼容报错，这个属性并不存在
   */
  forceUpdate: any;
  /**
   * 兼容报错，这个属性并不存在
   */
  render: any;

}
declare module '@vue/runtime-core' {
  // 为vue globalProperties 扩充类型
  export interface ComponentCustomProperties extends ExpandVueComponentCustomProperties {
    $http: typeof axios;
    $message: ElMessage.Message;
    $messageBox: ElMessageBox.IElMessageBox;
  }
}
