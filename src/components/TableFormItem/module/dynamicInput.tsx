
import { defineComponent, ref, watch, watchEffect, PropType } from 'vue'
import Iconfont from '@/components/Iconfont'
import styles from '../index.module.scss'
import Components from './index'

// eslint-disable-next-line no-lone-blocks
{/* <DynamicInput
onChange={(value: any) => {
  attributeList.value = value
}}
value={attributeList.value}
nameConfig={[
  {
    type: 'input',
    lable: '属性名称',
    name: 'attributeName',
  },
  {
    type: 'input',
    lable: '属性值',
    name: 'attributeValue',
  }
]} /> */}

type NameConfig = {
  type: string;
  lable: string;
  name: string;
  config?: any; // 表单配置
}
type ValueType = {
  [key: string]: string;
}

export default defineComponent({
  props: {
    nameConfig: {
      type: Array as PropType<NameConfig[]>,
      required: true,
    },
    value: {
      type: Array as PropType<ValueType[]>,
      required: false,
      default: () => []
    },
    onChange: {
      type: Function as PropType<(value: ValueType[]) => void >,
      required: false,
      default: () => null,
    },
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup(props) {
    const newvalue = ref(props.value);

    watchEffect(() => {
      newvalue.value = props.value
    })
    watch(newvalue.value, () => {
      props.onChange([...newvalue.value])
    })

    const addValue = () => {
      const valueItem: any = {};
      props.nameConfig.forEach((item) => {
        console.log(item)
        valueItem[item.name] = '';
      })
      newvalue.value.push(valueItem)

    }

    const removeValue = (index: number) => {
      newvalue.value.splice(index, 1)
    }

    const ideaValue = ({
      index,
      name,
      value
    }: {
      index: number;
      name: string;
      value: string;
    }) => {
      newvalue.value[index][name] = value;
    }

    return () => <div>
      {newvalue.value.map((valueItem, index) => <div
        className={styles.dynamic_input_item_content}
      >
        {props.nameConfig.map((item) => {
          const FormItem = Components[item.type];
          return <div
            key={item.name + index}
            label-class-name={styles.label_class_name}
          >{
              <div className={styles.dynamic_input_item}>
                <FormItem
                  {...item.config}
                  className={styles.dynamic_form_item}
                  label={item.lable}
                  value={props.value[index][item.name]}
                  onInput={(value: string) => ideaValue({index, name: item.name, value})}
                  label-width='80px'
                />
              </div>
            }
          </div>
        })}
        <div label-class-name={styles.label_class_name}>
          <Iconfont
            name='icon-jian'
            onClick={() => removeValue(index)}
            className={styles.tabel_jian} />
        </div>
      </div>)}
      <div className={styles.dynamic_input_item_content}>
        {props.nameConfig.map((item) => {
          const FormItem = Components[item.type];
          return <div
            key={item.name}
            label-class-name={styles.label_class_name}
          >{
              <div className={styles.dynamic_input_item}>
                <FormItem
                  {...item.config}
                  className={styles.dynamic_form_item}
                  label={item.lable}
                  disabled={true}
                  onInput={console.log}
                  label-width='80px'
                />
              </div>
            }</div>
        })}
        <div label-class-name={styles.label_class_name}>
          <Iconfont
            onClick={addValue}
            name='icon-jia'
            className={styles.tabel_jia} />
        </div>
      </div>
    </div>
  }})

// export default (props: PublicPropsType) => <ElFormItem label={props.label}>
// 	<ElInput v-model={props.value}></ElInput>
// </ElFormItem>
