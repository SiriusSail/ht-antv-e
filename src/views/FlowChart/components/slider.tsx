import { defineComponent, ref, watchEffect, PropType } from 'vue'
import * as Element from 'element-plus'
import Iconfont from '@/components/Iconfont'
import styles from './components.module.scss'

const { ElSlider } = Element;

type onChage = (value:number) => void

export default defineComponent({
  props: {
    value: {
      type: Number,
      required: true,
      default: 1
    },
    changeEvent: {
      type: Function as PropType<onChage>
    }
  },
  emits: {
    'update:value': (val: number) => val
  },
  setup(props, { emit }) {
    const modail = ref(props.value);

    watchEffect(() => {
      modail.value = props.value
    })
    watchEffect(() => {
      emit('update:value', modail.value)
      props.changeEvent?.(modail.value)
    })

    const ideaModailValue = (type: 'add' | 'minus') => {
      const t = parseFloat((modail.value % 0.2).toFixed(2));
      if (type === 'add') {
        modail.value = parseFloat((modail.value + (t > 0 ? t :  0.2)).toFixed(2));
      } else {
        modail.value =  parseFloat((modail.value - (t || 0.2)).toFixed(2));
      }
    }

    return () =>
    // console.log(modail.value)
			 <div className='flex-row' style={{alignItems: 'center'}}>
        <div>
          <Iconfont onClick={() => ideaModailValue('minus')} name='icon-lessen' />
        </div>
        <div className='flex-1' style={{margin: '0 10px'}}>
          <ElSlider v-model={modail.value} step={0.01} min={0.8} max={2} />
        </div>
        <div>
          <Iconfont onClick={() => ideaModailValue('add')} name='icon-enlarge' />
        </div>
      </div>
  }
})
