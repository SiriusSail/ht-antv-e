import * as Element from "element-plus";
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus/lib/components/message'
import styles from "./index.module.scss";
import imgURL from "../images/logo.png";
import Service from '../../../views/Login/api/index'
import useRolesStore from '@/store/role'

const {
  ElAvatar,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} = Element;
export default () => {
  const router = useRouter();
  const data: any = useRolesStore()
  data.getUserInfo()
  function navFn () {
    for (let index = 0; index < data.userInfo.roles.length; index++) {
      const item = data.userInfo.roles[index];
      if (item === 'leader') {
        data.rulePath = 'leader'
        break;
      } else if (item === 'development') {
        data.rulePath = 'development'
        break;
      } else if (item === 'requirement') {
        data.rulePath = 'requirement'
        break;
      } else if (item === 'management') {
        data.rulePath = 'management'
        break;
      }
    }
  }
  setTimeout(() => {
    if (data.userInfo?.roles?.length > 0 && data.rulePath === '') {
      navFn()
    }
  }, 200)
  const sysItem = data.routers.filter((item: any) => {
    return item.path === '/sys'
  })
  const handlePersonal = () => {
    router.push("/personal");
  }
  const handleSetup = () => {
    // console.log(router)
    router.push("/sys");
  }
  const handleHome = (val: any) => {
    let nwePath = ''
    switch (val) {
      case 'development':
        data.rulePath = 'development'
        nwePath = "/indicatorsOfDevelopment"
        break;
      case 'leader':
        data.rulePath = 'leader'
        nwePath = "/digitalMarketing"
        break;
      case 'requirement':
        data.rulePath = 'requirement'
        nwePath = "/demandManage"
        break;
      case 'management':
        data.rulePath = 'management'
        nwePath = "/managementAndOperation"
        break;
      default:
        data.rulePath = ''
        nwePath = ""
        break;
    }
    if (nwePath) {
      router.push(nwePath);
    } else {
      for (let index = 0; index < data.userInfo.roles.length; index++) {
        const item = data.userInfo.roles[index];
        if (item === 'leader') {
          data.rulePath = 'leader'
          nwePath = "/digitalMarketing"
          break
        } else if (item === 'development') {
          data.rulePath = 'development'
          nwePath = "/indicatorsOfDevelopment"
          break
        } else if (item === 'requirement') {
          data.rulePath = 'requirement'
          nwePath = "/demandManage"
          break
        } else if (item === 'management') {
          data.rulePath = 'management'
          nwePath = "/managementAndOperation"
          break
        }
      }
      if (nwePath) {
        router.push(nwePath);
      } else {
        ElMessage({
          message: '请联系管理员设置权限',
          type: 'warning',
        })
      }
    }
  }
  const handleLogout = async () => {
    // const res = await Service.logout()
    // if (res.success)
    ElMessage.success({
      message: '退出成功',
      type: 'success',
    })
    // router.push("/login"); config.headers['cas-token'] = sessionStorage.getItem('token');
    // http://10.64.23.23/#/home
    window.location.href = `/ddm-iic/logout/cas?cas-token=${sessionStorage.getItem('token')}`
  }

  return (
    <div className={styles.background}>
      <img onClick={() => handleHome(data.rulePath)} className={styles.logo} src={imgURL} alt='' />

      <div className={styles.avatar}>
        <ElDropdown
          placement='bottom'
          v-slots={{
            dropdown: () => (
              <ElDropdownMenu>
                {
                  data.userInfo.roles?.map((item) => {
                    return item === 'leader' ? <ElDropdownItem onClick={() => handleHome(item)}>数字经营</ElDropdownItem> : (item === 'requirement' ? <ElDropdownItem onClick={() => handleHome(item)}>数据需求</ElDropdownItem> : (item === 'development' ? <ElDropdownItem onClick={() => handleHome(item)}>指标开发</ElDropdownItem> : (item === 'management' ? <ElDropdownItem onClick={() => handleHome(item)}>管理/运营</ElDropdownItem> : '')))
                  })
                }
                <ElDropdownItem onClick={handlePersonal}>个人中心</ElDropdownItem>
                {
                  sysItem.length > 0 ? <ElDropdownItem onClick={handleSetup}>系统设置</ElDropdownItem> : ''
                }
                <ElDropdownItem onClick={handleLogout}>退出</ElDropdownItem>
              </ElDropdownMenu>
            ),
          }}
        >
          <ElAvatar
            size={40}
            src='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
          ></ElAvatar>
        </ElDropdown>
      </div>
    </div>
  )
};
