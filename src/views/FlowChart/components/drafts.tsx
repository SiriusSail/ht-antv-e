import { defineComponent, ref, watchEffect, PropType } from 'vue'
import * as Element from 'element-plus'
import styles from './components.module.scss'
import './components.deep.scss'
import Iconfont from '@/components/Iconfont'
import axiosApiHooks from '@/hooks/axiosApiHooks';
import {Pages, DdmflowPageRes} from '../apis'

const {
  ElMessageBox,
  ElDrawer,
  ElPagination,
  ElDescriptions,
  ElDescriptionsItem,
  ElButton,
} = Element;

type isShow = boolean;
type OnSelect =  (value:  any) =>void
type OnClose =  () =>void
type GetList = (page: number) => Promise<{ result: Pages<DdmflowPageRes>; }>
type DelegeDdmflow = (rowId: string) => Promise<{ result: any; }>
export default defineComponent({
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    onSelect: {
      type: Function as PropType<OnSelect>,
      required: true,
    },
    onClose: {
      type: Function as PropType<OnClose>,
      required: true,
    },
    getList: {
      type: Function as PropType<GetList>,
      required: true,
    },
    delegeDdmflow: {
      type: Function as PropType<DelegeDdmflow>,
      required: true,
    },
  },
  setup(props) {
    const currentPage = ref(1);

    const ddmflowList = axiosApiHooks((page: number) => props.getList(page))({
      needInit: false
    })
    const deleteDdmflow = axiosApiHooks((rowId: string) => props.delegeDdmflow(rowId))({
      needInit: false
    })

    const updataList = () => {
      ddmflowList.request(currentPage.value);
    }

    watchEffect(() => {
      if (props.isShow) {
        updataList();
      }
    })

    return () => <div>
      <ElDrawer
        v-model={props.isShow}
        direction='rtl'
        size='50%'
        onClose={props.onClose}
        title='草稿箱'>
        <div className={styles.drafts}>
          <div className={styles.drafts_content}>
            <ElDescriptions
              v-loading={ddmflowList.loading}
              column={1}>
              {
                ddmflowList.data.records?.length > 0
                  ? ddmflowList.data.records.map((item) => <ElDescriptionsItem
                    v-slots={{
                      label: () => <ElButton
                        type='text'
                        onClick={() => {
                          props.onSelect(item);
                          props.onClose()
                        }}>
                        {item.name}
                      </ElButton>
                    }}
                  >
                    <span>
                      <span className={styles.drafts_title}>{`${item.gmtCreate}`}</span>
                      <Iconfont onClick={() => {
                        ElMessageBox.confirm(
                          `是否删除 ${item.name} 数据源`,
                          '提示',
                          {
                            confirmButtonText: '确定删除',
                            cancelButtonText: '取消',
                            type: 'warning',
                          }
                        )
                          .then(() => {
                            deleteDdmflow.request(item.rowId).then((res) => {
                              updataList();
                            })
                          })
                      }} className={styles.icon} name='icon-lajitong'></Iconfont>
                    </span>
                  </ElDescriptionsItem>) :
                  !ddmflowList.loading && <ElDescriptionsItem>草稿箱是空的</ElDescriptionsItem>
              }
            </ElDescriptions>
          </div>
          <div className={styles.drafts_foot}>
            <ElPagination
              background
              default-current-page={1}
              onCurrentChange={(page: number) => {
                currentPage.value = page;
                updataList();
              }}
              layout='prev, pager, next'
              page-size={ddmflowList.data.size}
              hide-on-single-page={false}
              total={ddmflowList.data.total || 0}>
            </ElPagination>
          </div>
        </div>
      </ElDrawer>
    </div>
  }
})
