
import { defineComponent, ref, PropType, watchEffect, onMounted } from 'vue'
import * as Element from 'element-plus'
import styles from '../index.module.scss'

const { ElTable, ElTableColumn, ElDialog, ElTooltip } = Element

export default  defineComponent({
  props: {
    label: {
      type: String,
      required: true,
      default: ''
    },
    name: {
      type: String,
      required: true,
      default: ''
    },
    width: {
      type: String,
      required: false,
      default: ''
    },
    value: {
      type: Array as PropType<any[]>,
      required: true,
      default: (): any[] => []
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    isSelection: {
      type: Boolean,
      required: false,
      default: false
    },
    expand: {
      type: Boolean,
      required: false,
      default: false
    },
    expandColumns: {
      type: Array as PropType<any[] | null>,
      required: false,
      default: null
    },
    columns: {
      type: Array as PropType<any[]>,
      required: true,
    },
    data: {
      type: Array as PropType<any[]>,
      required: true,
      default: (): any[] => []
    },
    onChange: {
      type: Function as PropType<(value: any[]) => void>,
      required: false,
      default: (): any[] => []
    },
  },
  emits: {
    'update:value': (val: any[]) => val
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup(props, { emit }) {
    const newvalue = ref(props.value);
    const dialogFormVisible = ref(false);
    const tableRef = ref();

    watchEffect(() => {
      emit('update:value', newvalue.value);
    })

    watchEffect(() => {
      tableRef.value?.clearSelection();
      props.value.filter((item) => item).forEach((row) => {
        const find = props.data.find((item) => item.id === row.id);
        tableRef.value?.toggleRowSelection(find, true);
      });
      newvalue.value = props.value;
    })

    onMounted(() => {
      tableRef.value?.clearSelection();
      props.value.filter((item) => item).forEach((row) => {
        const find = props.data.find((item) => item.id === row.id);
        tableRef.value?.toggleRowSelection(find, true);
      });
      newvalue.value = props.value;
    })

    const tableComponent = () => <ElTable
      ref={(e: any) => {
        tableRef.value = e;
      }}
      data={props.data}
      onSelect={(value: any[]) => {
        console.log(value);
        // if (value.length !== props.value.length) {
        props.onChange(value);
        // }
        newvalue.value = value;
      }}
      // onSelectionChange={
      //   (value : any[])=>{
      //     props.onChange(value);
      //     newvalue.value = value;
      //   }
      // }
      className={styles.tabel} border
    >

      {props.expand && <ElTableColumn
        v-slots={{
          default: (dataItem: { row: any }) => <div>
            {props.expandColumns?.map((item) => <p key={item.prop}>
              {item.label}: {dataItem.row[item.prop]}
            </p>)}
          </div>
        }}
      />}

      {props.columns?.map((item, index) => {
      // return
        if(item.defaultSlot) {
          return <ElTableColumn
            {
              ...item
            }
            v-slots={{
              default: (dataItem: { row: any }) =>item.defaultSlot(dataItem)
            }}
            key={item.prop}
          />
        }
        return <ElTableColumn
          {
            ...item
          }
          key={item.prop}
        />

      })
      }
      {props.isSelection && <ElTableColumn type='selection' fixed='right' width='35' key='selection' />}
    </ElTable>

    return () => <div>
      <div title='双击查看详情' onDblclick={() => {
        dialogFormVisible.value = true
      }}>
        {tableComponent()}
      </div>
      <ElDialog
        modelValue={dialogFormVisible.value}
        onClose={() => {dialogFormVisible.value = false}} title='详情'
        width='80%'
      >
        {tableComponent()}
      </ElDialog>
    </div>

  }})

// export default (props: PublicPropsType) => <ElFormItem label={props.label}>
// 	<ElInput v-model={props.value}></ElInput>
// </ElFormItem>
