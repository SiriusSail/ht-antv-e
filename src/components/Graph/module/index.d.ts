import TabelFrom from './tabelForm'

export default interface GraphForm extends TabelFrom  {
  // 初始化表单
  initFrom : () => void;

  // 序列化表单
  format : () => any[];
}