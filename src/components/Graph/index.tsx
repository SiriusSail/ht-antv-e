import { defineComponent, onMounted, ref } from 'vue'
import { Node } from '@antv/x6'
import Graph from './graph'

export type GraphRef = {
  addStenchilItems: (options: Node.Metadata[]) => void;
  getGraph: (options: Graph) => void;
}

export default (props: {
  containerId: string;
  stencilId?: string;
  onSelectNode: (data: Node) => void;
  onCloseSelect?: () => void;
  graphRef?: (data: GraphRef) => void
}) => {
  let graph: Graph = {} as any;
  // const addStenchilItems = (options: Node.Metadata[]) => {
  //   graph.addStencilItem(options,)
  // }
  const init = () => {
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
  }
  return <div></div>
}