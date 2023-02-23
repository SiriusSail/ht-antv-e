import { defineComponent, ref } from 'vue'
import { ElMenu, ElMenuItem } from 'element-plus'
import styles from './components.module.scss'

export default defineComponent({
  setup() {
    const modail = ref<string>('脚本')
    const handleOpen = (key: string, keyPath: string) => {
      console.log(key, keyPath)
    }
    const handleClose = (key: string, keyPath: string) => {
      console.log(key, keyPath)
    }
    const menuList = [
      {
        icon: 'el-icon-menu',
        title: '数据源'
      },
      {
        icon: 'el-icon-menu',
        title: '数据资产'
      },
      {
        icon: 'el-icon-menu',
        title: '数据卡片'
      },
      {
        icon: 'el-icon-menu',
        title: '开发模版'
      },
      {
        icon: 'el-icon-menu',
        title: '数据开发'
      },
      {
        icon: 'el-icon-menu',
        title: '指标卡片'
      },
      {
        icon: 'el-icon-menu',
        title: '数据分析'
      },
      {
        icon: 'el-icon-menu',
        title: '工具市场'
      },
    ]
    return () => <ElMenu
      onChange={console.log}
      defaultActive='1'
      className={`${styles['el-menu-vertical-sidebar']} background-color`}
      onSelect={handleOpen}
    >
      <div className={styles['sub-menu-flex']}>
        <div className={styles['sub-menu-flex-tr']}>
          {menuList.map((item, index) => <ElMenuItem v-slots={{
            title: item.title
          }} index={`${index}`} className={`${styles['el-sub-menu-sidebar']} el-menu-item`}>
            <em className={item.icon}></em>
          </ElMenuItem>)}
        </div>

        <div className={styles['sub-menu-flex-tr']}>
          <ElMenuItem index='4' className={styles['el-sub-menu-sidebar-2']}>
            <em className='el-icon-setting'></em>
          </ElMenuItem>
          <ElMenuItem index='4' className={styles['el-sub-menu-sidebar-2']}>
            <em className='el-icon-setting'></em>
          </ElMenuItem>
          <ElMenuItem index='4' className={styles['el-sub-menu-sidebar-2']}>
            <em className='el-icon-setting'></em>
          </ElMenuItem>
          <ElMenuItem index='4' className={styles['el-sub-menu-sidebar-2']}>
            <em className='el-icon-setting'></em>
          </ElMenuItem>
        </div>
      </div>
    </ElMenu>
  }
})
