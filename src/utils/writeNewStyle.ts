// 写入新的css样式
export const writeNewStyle = (styleId: string, originalStyle: string, colors: { [x: string]: any }) => {
	Object.keys(colors).forEach((key) => {
		console.log(colors[key])
		// eslint-disable-next-line no-param-reassign
		originalStyle = originalStyle.replace(new RegExp(`(:|\\s+)${  key}`, 'g'), `$1${  colors[key]}`)
	})
	const themeColor = document.getElementById(styleId)
	console.log(originalStyle);
	if (!themeColor) {
		const style = document.createElement('style')
		style.id = styleId;
		style.innerText = originalStyle
		document.head.appendChild(style)
	}
	else {
		themeColor.innerText = originalStyle
	}
}

export const writeNewBackgroundStyle = (styleId: string, colors: string) => {
	const themeBackgroundColor = document.getElementById(styleId)
	const originalStyle = `body .background-color{background-color: ${colors}}`
	if (!themeBackgroundColor) {
		const style = document.createElement('style')
		style.id = styleId;
		style.innerText = originalStyle
		document.head.appendChild(style)
	}
	else {
		themeBackgroundColor.innerText = originalStyle
	}
}
export default  writeNewStyle
