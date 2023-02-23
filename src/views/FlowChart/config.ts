const files = import.meta.globEager("../../components/Graph/images/*.webp")
const images: any = {};

Object.keys(files).forEach((key) => {
  if (Object.prototype.hasOwnProperty.call(files, key)) {
    images[key.replace(/(\.\.\/\.\.\/components\/Graph\/images\/|\.webp)/g, '')] = files[key].default
  }
});

export const chartConfig = [
  {
    title: '折线图',
    options: [
      {
        shape: 'echart-shape',
        id: 'line-simple',
        attrs: {
          // image: '',
          option: {
            curType: 'line-simple',
            title: {
              text: '基础折线图'
            },
            legend: {
              data: ['Email']
            },
            xAxis: {
              type: 'category',
              data: []
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: 'Email',
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
              }
            ]

          }
        }
      },
      {
        shape: 'echart-shape',
        id: 'line-smooth',
        attrs: {
          option: {
            curType: 'line-smooth',
            title: {
              text: '平滑折线图'
            },
            legend: {
              data: ['Direct']
            },
            xAxis: {
              type: 'category',
              data: []
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: 'Direct',
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
              }
            ]
          }
        },
      }
    ]
  },
  {
    title: '柱状图',
    options: [
      {
        shape: 'echart-shape',
        id: 'bar-simple',
        attrs: {
          option: {
            curType: 'bar-simple',
            title: {
              text: '简单柱状图'
            },
            legend: {
              data: ['Wetland']
            },
            xAxis: {
              type: 'category',
              data: []
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: 'Wetland',
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
              }
            ]
          }
        },
      },
      {
        shape: 'echart-shape',
        id: 'bar-dataset-simple',
        attrs: {
          option: {
            curType: 'bar-dataset-simple',
            title: {
              text: '简单数据集'
            },
            legend: {
              data: ['2021']
            },
            tooltip: {},
            dataset: {
              source: [
                ['Matcha Latte', 43.3, 85.8, 93.7],
                ['Milk Tea', 83.1, 73.4, 55.1],
              ]
            },
            xAxis: { type: 'category' },
            yAxis: {
              type: 'value'
            },
            series: [{ name: '2015', type: 'bar' }, { name: '2016', type: 'bar' }, {name: '2017', type: 'bar' }]
          }
        }
      },
      {
        shape: 'echart-shape',
        id: 'bar-negative-value',
        attrs: {
          option: {
            curType: 'bar-negative-value',
            title: {
              text: '交错正负轴标签'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              top: 80,
              bottom: 30
            },
            xAxis: {
              type: 'value',
              position: 'top',
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
            yAxis: {
              type: 'category',
              axisLine: { show: false },
              axisLabel: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
              data: [
                'ten',
                'nine',
                'eight',
                'seven',
                'six',
                'five',
                'four',
                'three',
                'two',
                'one'
              ]
            },
            series: [
              {
                name: 'Cost',
                type: 'bar',
                stack: 'Total',
                label: {
                  show: true,
                  formatter: '{b}'
                },
                data: [
                  { value: -0.07, label: {position: 'right'} },
                  { value: -0.09, label: {position: 'right'} },
                  0.2,
                  0.44,
                  { value: -0.23, label: {position: 'right'} },
                  0.08,
                  { value: -0.17, label: {position: 'right'} },
                  0.47,
                  { value: -0.36, label: {position: 'right'} },
                  0.18
                ]
              }
            ]
          }
        },
      },
      {
        shape: 'echart-shape',
        id: 'bar-strip-type',
        attrs: {
          option: {
            curType: 'bar-strip-type',
            title: {
              text: '条形图'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['2011']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: ['Brazil', 'Indonesia']
            },
            series: [
              {
                name: '2011',
                type: 'bar',
                data: [342, 563]
              }
            ]
          }
        },
      },
    ]
  },
  {
    title: '饼状图',
    options: [
      {
        shape: 'echart-shape',
        id: 'pie-simple',
        attrs: {
          option: {
            curType: 'pie-simple',
            title: {
              text: '基础饼状图'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              left: 'center',
              top: 20,
            },
            series: [
              {
                name: '',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: 580, name: 'Email' }
                ]
              }
            ]
          }
        },
      },
      {
        shape: 'echart-shape',
        id: 'pie-border-radius',
        attrs: {
          option: {
            curType: 'pie-border-radius',
            title: {
              text: '环形饼状图'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: 25,
              left: 'center'
            },
            grid: {
              top: 80,
            },
            series: [
              {
                name: '',
                type: 'pie',
                radius: ['40%', '70%'],
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                data: [
                  { value: 580, name: 'Email' }
                ]
              }
            ]
          }
        }
      },
      {
        shape: 'echart-shape',
        id: 'pie-nightingale',
        attrs: {
          option: {
            curType: 'pie-nightingale',
            title: {
              text: '玫瑰图'
            },
            legend: {
              top: 'top'
            },
            series: [
              {
                name: '',
                type: 'pie',
                radius: [50, 120],
                center: ['50%', '50%'],
                roseType: 'area',
                itemStyle: {
                  borderRadius: 8
                },
                data: [
                  { value: 40, name: 'rose 1' }
                ]
              }
            ]
          }
        },
      },
    ]
  },
  {
    title: '雷达图',
    options: [
      {
        shape: 'echart-shape',
        id: 'radar-simple',
        attrs: {
          option: {
            curType: 'radar-simple',
            title: {
              text: '雷达图'
            },
            legend: {
              data: ['Budget'],
              top: 10,
            },
            radar: {
              // shape: 'circle',
              indicator: [
                { name: 'Sales', max: 6500 },
                { name: 'Administration', max: 16000 },
                { name: 'Information Technology', max: 30000 }
              ]
            },
            series: [
              {
                name: '',
                type: 'radar',
                data: [
                  {
                    value: [4200, 3000, 20000, 35000, 50000, 18000],
                    name: 'Budget'
                  }
                ]
              }
            ]
          }
        }
      },
    ]
  },
  {
    title: '复合图',
    options: [
      {
        shape: 'echart-shape',
        id: 'bar-mixed-line',
        attrs: {
          option: {
            curType: 'bar-mixed-line',
            title: {
              text: '复合图'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            legend: {
              data: ['Evaporation']
            },
            xAxis: [
              {
                type: 'category',
                data: ['Mon', 'Tue'],
                axisPointer: {
                  type: 'shadow'
                }
              }
            ],
            yAxis: [
              {},
              {}
            ],
            series: [
              {
                name: 'Evaporation',
                type: 'bar',
                data: [
                  2.0
                ]
              },
              {
                name: 'Precipitation',
                type: 'bar',
                data: [
                  26.4
                ]
              },
              {
                name: 'Temperature',
                type: 'line',
                yAxisIndex: 1,
                data: [6.3]
              }
            ]
          }
        }
      }
    ]
  },
  {
    title: '散点图',
    options: [
      {
        shape: 'echart-shape',
        id: 'scatter-basic',
        attrs: {
          option: {
            curType: 'scatter-basic',
            title: {
              text: '散点图'
            },
            xAxis: { gridIndex: 0 },
            yAxis: { gridIndex: 0 },
            series: [
              {
                symbolSize: 20,
                data: [
                  [13.4, 6.81],
                  [5.02, 5.68]
                ],
                type: 'scatter'
              }
            ]
          }
        }
      }
    ]
  },
  {
    title: '仪表盘',
    options: [
      {
        shape: 'echart-shape',
        id: 'gauge-basic',
        attrs: {
          option: {
            curType: 'gauge-basic',
            title: {
              text: '仪表盘'
            },
            tooltip: {
              formatter: '{a} <br/>{b} : {c}'
            },
            series: [
              {
                type: 'gauge',
                min: 0,
                max: 100,
                data: [
                  {
                    value: 50,
                    name: 'SCORE'
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  },
  {
    title: '文本',
    options: [
      {
        shape: 'customText',
        id: 'static-text',
        attrs: {
          label: {
            text: '静态',
          },
          body: {
            stroke: '#CDEAFF',
            fill: '#CDEAFF',
          },
          image: {
            'xlink:href': '/admin/flowChart/icon/static_text.svg',
          },
        },
      },
      {
        shape: 'customText',
        id: 'dynamic-text',
        attrs: {
          label: {
            text: '动态',
          },
          body: {
            stroke: '#CDEAFF',
            fill: '#CDEAFF',
          },
          image: {
            'xlink:href': '/admin/flowChart/icon/dynamic_text.svg',
          },
        }
      }
    ]
  }
].map((item) => ({
  ...item,
  options: item.options.map((item2) => ({
    ...item2,
    attrs: {
      ...item2.attrs,
      //  image: images[item2.id]
      // eslint-disable-next-line no-nested-ternary
      image: item2.id === 'static-text' ? {'xlink:href': '/admin/flowChart/icon/static_text.svg'} : item2.id === 'dynamic-text' ? {'xlink:href': '/admin/flowChart/icon/static_text.svg'} : images[item2.id]
    }
  }))
}))

console.log('默认指标', chartConfig)

export default {};

export const initGraphData = []
