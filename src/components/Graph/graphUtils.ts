
// 控制连接桩显示/隐藏
// eslint-disable-next-line no-undef
export const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
	for (let i = 0, len = ports.length; i < len; i += 1) {
		// eslint-disable-next-line no-param-reassign
		ports[i].style.visibility = show ? 'visible' : 'hidden'
	}
}

export default {}