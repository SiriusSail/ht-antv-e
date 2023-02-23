import { defineComponent, onMounted, ref } from 'vue'
import { Node } from '@antv/x6'
import Graph from './graph'

export default defineComponent({
	props: {
		// eslint-disable-next-line vue/require-default-prop
		containerId: {
			type: String,
			required: true
		},
		stencilId: {
			type: String,
			required: false,
			default: ''
		},
    onSelectNode: Function,
    onCloseSelect: Function
	},
	setup(props, context) {
		let graph: Graph = {} as any;
		const addStenchilItems = (options: Node.Metadata[]) => {
			graph.addStencilItem(options)
		}
		const getGraphRef = () => graph;
		onMounted(() => {
			graph = new Graph({
				containerId: props.containerId,
				stencilId: props.stencilId
			})
      graph.graph.on('node:click', ({ e, x, y, node, view }) => {
		
        props.onSelectNode?.(node)
      })
      graph.graph.on('blank:click', ({ e, x, y }) => {
        props.onCloseSelect?.()
      })
		})
		return {
			addStenchilItems,
			getGraphRef,
		}

	},
	render: () => (
		<div>
		</div>
	)

})
