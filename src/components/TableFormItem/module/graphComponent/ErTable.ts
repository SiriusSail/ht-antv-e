import { Node, Graph, Shape } from '@antv/x6'

const LINE_HEIGHT = 24
const NODE_WIDTH = 200

export const transformMetadata = (data: {
  data: any[];
  title: string;
}[]): Node.Metadata[] => {
  const newMetaData = data.map((item, i) => {
    let id = item.title;
    const d = Object.keys(item.data[0]).find((item2) => /^journey_[\s\S]*_source$/.test(item2))
    if (d) {
      const [, n] = d.split('journey_');
      const [newb] = n.split('_source');
      id = newb
    }
    return {
      id,
      shape: 'er-table',
      label: item.title,
      position: {
        x: 24 + (NODE_WIDTH + 50) * (i),
        y: 50
      },
      initData: item,
      ports: item.data.map((portsItem) => ({
        id: `${id}:${portsItem.columnName}`,
        group: "list",
        attrs: {
          name: {
            text: `${portsItem.columnChName} (${portsItem.columnName})`
          },
          type: {
            text: portsItem.columnType
          }
        }
      }))
    }
  })
  return newMetaData
}

Graph.registerPortLayout(
  'erPortPosition',
  (portsPositionArgs) => portsPositionArgs.map((_, index) => ({
    position: {
      x: 0,
      y: (index + 1) * LINE_HEIGHT,
    },
    angle: 0,
  })),
  true,
)

/**
 * 创建基础模型
 * @name string 模型名称
 * @config Node.Config 模型配置按照x6 基础node 节点来
*/

export class ErTable extends Shape.Rect {

  constructor(metadata: any) {
    super({
      ...metadata,
      width: NODE_WIDTH,
      height: LINE_HEIGHT,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
      ],
      attrs: {
        initData: metadata.initData,
        rect: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#5F95FF',
        },
        label: {
          fontWeight: 'bold',
          fill: '#ffffff',
          fontSize: 12,
          text: metadata.label
        },
      },
      ports: {
        groups: {
          list: {
            markup: [
              {
                tagName: 'rect',
                selector: 'body',
              },
              {
                tagName: 'text',
                selector: 'name',
              },
              {
                tagName: 'text',
                selector: 'type',
              },
            ],
            attrs: {
              body: {
                width: NODE_WIDTH,
                height: LINE_HEIGHT,
                strokeWidth: 1,
                stroke: '#5F95FF',
                fill: '#EFF4FF',
                magnet: true,
              },
              name: {
                ref: 'body',
                refX: 6,
                refY: 6,
                fontSize: 10,
              },
              type: {
                ref: 'body',
                refY: 6,
                refX: NODE_WIDTH - 6,
                fontSize: 10,
                textAnchor: 'end'
              },
            },
            position: 'erPortPosition',
          },
        },
        items: metadata.ports
      },
    })
  }

}

Graph.registerNode('er-table', ErTable, true)
export default {
}

