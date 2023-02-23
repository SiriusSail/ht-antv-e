
import { Shape } from '@antv/x6'
import { Options as GraphOptions } from '@antv/x6/lib/graph/options'

// 画布基本配置
export const graphDefaultOptions: GraphOptions.Manual = {
  grid: true,
  mousewheel: {
    enabled: true,
    zoomAtMousePosition: true,
    modifiers: 'ctrl',
    minScale: 0.5,
    maxScale: 3,
  },
  connecting: {
    router: 'manhattan',
    connector: {
      name: 'rounded',
      args: {
        radius: 8,
      },
    },
    anchor: 'center',
    connectionPoint: 'anchor',
    allowBlank: false,
    snap: {
      radius: 20,
    },
    createEdge () {
      return new Shape.Edge({
        attrs: {
          line: {
            stroke: '#A2B1C3',
            strokeWidth: 2,
            targetMarker: {
              name: 'block',
              width: 12,
              height: 8,
            },
          },
        },
        zIndex: 0,
      })
    },
    validateConnection ({ targetMagnet }) {
      return !!targetMagnet
    },
  },
  highlighting: {
    magnetAdsorbed: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#5F95FF',
          stroke: '#5F95FF',
        },
      },
    },
  },
  selecting: {
    enabled: true,
    rubberband: true,
    showNodeSelectionBox: true,
  },
  scroller: {
    enabled: true,
  },
  snapline: true,
  keyboard: true,
  clipboard: true,
};


export const stencilDefaultOptions = {
  title: '流程图',
  // target: graph,
  stencilGraphWidth: 220,
  stencilGraphHeight: 180,
  collapsable: true,
  groups: [
    {
      title: '基础流程图',
      name: 'group1',
    },
    {
      title: '系统设计图',
      name: 'group2',
      graphHeight: 250,
      layoutOptions: {
        rowHeight: 70,
      },
    },
  ],
  layoutOptions: {
    columns: 4,
    columnWidth: 50,
  },
}

export default {
  graphDefaultOptions,
  stencilDefaultOptions,
}

export const ports = {
  groups: {
    top: {
      position: 'top',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    right: {
      position: 'right',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    bottom: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    left: {
      position: 'left',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
  },
  items: [
    {
      group: 'top',
    },
    {
      group: 'right',
    },
    {
      group: 'bottom',
    },
    {
      group: 'left',
    },
  ],
}