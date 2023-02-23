type Props ={
  content: any;
  onChange?: (value:  string | ArrayBuffer) =>void
}

export default ({
  content,
  onChange = () => undefined
}: Props) => {
  let inputRef: HTMLInputElement = null;
  const change = () => {
    const resultFile = inputRef.files[0]
    if (resultFile) {
      // 使用 FileReader 来读取文件
      const reader = new FileReader()

      // 读取纯文本文件,且编码格式为 utf-8
      reader.readAsText(resultFile, 'UTF-8')

      // 读取文件,会触发 onload 异步事件,可使用回调函数 来获取最终的值.
      reader.onload = (e) => {
        const fileContent = e.target.result
        console.log(1111);
        // 若为回调函数,则触发回调事件
        onChange?.(fileContent)
      }
    }
  }
  return <div style={{
    position: 'relative',
    height: '100%',
    width: '100%'
  }}>
    <input
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        cursor: 'pointer',
        opacity: 0,
        zIndex: 2
      }}
      ref={(e) => {
        inputRef = e;
      }}
      type='file'
      onChange={change}
    />
    {content}
  </div>
}
