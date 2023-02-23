import {  onMounted, onBeforeMount, onBeforeUnmount } from "vue";

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

// usexxx api
function useResize() {
  const resizeHandler = ()=> {
    console.log(111)
  }

  onBeforeMount(()=>{

    window.addEventListener('resize', resizeHandler)
  })
  onBeforeUnmount(()=>{
    window.removeEventListener('resize', resizeHandler)
  })
}

export default useResize
