<template>
  <div class="xFlow">
    <div class="flow_group">
      <div id="myPaletteDiv" class="myPaletteDiv"></div>
      <div id="myDiagramDiv" class="myDiagramDiv"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  computed: {
    //定义一个模板
    $() {
      return go.GraphObject.make; // 定义一个模板
    },
    // 定义一个画布
    myDiagram() {
      return go.GraphObject.make(go.Diagram, "myDiagramDiv", {
        "undoManager.isEnabled": true, // 撤销和重做

        initialContentAlignment: go.Spot.Center,
        allowDrop: true,
        scrollsPageOnFocus: false, //滚动页焦点
        "draggingTool.dragsLink": true, //拖动工具拖动链接
        "draggingTool.isGridSnapEnabled": true, //拖动工具已启用网格捕捉
        "linkingTool.isUnconnectedLinkValid": false, //链接工具未连接链接有效
        "linkingTool.portGravity": 200, //链接工具端口重力
        "relinkingTool.isUnconnectedLinkValid": true, //重新连接工具未连接链接有效
        "relinkingTool.portGravity": 250, //重新连接工具端口重力
        "relinkingTool.fromHandleArchetype": go.GraphObject.make(
          go.Shape,
          "Diamond",
          {
            segmentIndex: 0,
            cursor: "pointer",
            desiredSize: new go.Size(8, 8),
            fill: "tomato",
            stroke: "darkred"
          }
        ),
        "relinkingTool.toHandleArchetype": go.GraphObject.make(
          go.Shape,
          "Diamond",
          {
            segmentIndex: -1,
            cursor: "pointer",
            desiredSize: new go.Size(8, 8),
            fill: "darkred",
            stroke: "tomato"
          }
        ),
        "linkReshapingTool.handleArchetype": go.GraphObject.make(
          go.Shape,
          "Diamond",
          {
            desiredSize: new go.Size(7, 7),
            fill: "lightblue",
            stroke: "deepskyblue"
          }
        ),
        // rotatingTool: go.GraphObject.make(TopRotatingTool),
        "rotatingTool.snapAngleMultiple": 15,
        "rotatingTool.snapAngleEpsilon": 15,
        "undoManager.isEnabled": true
      });
    }
  },
  methods: {
    // 初始化
    init() {
      let _this = this;
      const $ = this.$;
      const myDiagram = this.myDiagram;

      // 节点模板的助手定义

      let nodeStyle = () => {
        return [
          //节点。位置来自节点数据的“loc”属性，
          //按此转换。解析静态方法。
          //如果节点。位置改变，更新节点数据的loc属性，
          //使用点返回。stringify静态方法。
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            // 节点。位置在每个节点的中心
            locationSpot: go.Spot.Center
          }
        ];
      };

      //定义一个函数来创建一个通常透明的“端口”。
      //用“name”作为标语牌。
      //“align”用于确定端口相对于节点主体的位置，
      //“spot”用于控制链接如何与端口连接，以及端口是否连接
      //沿着节点的一侧延伸，
      //和boolean“output”和“input”参数控制用户是否可以从端口绘制链接。
      let makePort = (name, align, spot, output, input) => {
        let horizontal =
          align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        //端口基本上就是一个透明的矩形，它沿着节点的一侧延伸，
        //当鼠标经过它时，它就会变成彩色的
        return $(go.Shape, {
          fill: "transparent", // 在mouseEnter事件处理程序中更改为颜色
          strokeWidth: 0, // 没有中风
          width: horizontal ? NaN : 8, // 如果不是水平拉伸，也就是8宽
          height: !horizontal ? NaN : 8, // 如果不是垂直拉伸，只要8英尺
          alignment: align, // 将端口对准主形状
          stretch: horizontal
            ? go.GraphObject.Horizontal
            : go.GraphObject.Vertical,
          portId: name, // 声明此对象为“端口”
          fromSpot: spot, // 声明连接可能在此端口连接的位置
          fromLinkable: output, // 声明用户是否可以从这里绘制链接
          toSpot: spot, // 声明连接可能在此端口连接的位置
          toLinkable: input, // 声明用户是否可以在此处绘制链接
          cursor: "pointer", // 显示一个不同的光标来指示潜在的链接点
          mouseEnter: (e, port) => {
            // 连接端口参数的形状
            if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
          },
          mouseLeave: (e, port) => {
            port.fill = "transparent";
          }
        });
      };

      // 文本样式
      let textStyle = () => {
        return {
          font: "bold 11pt Helvetica, Arial, sans-serif",
          stroke: "whitesmoke"
        };
      };

      // 为常规节点定义节点模板

      myDiagram.nodeTemplateMap.add(
        "Step",
        $(
          go.Node,
          "Table",
          nodeStyle(),
          // 主要对象是一个面板，它围绕着一个矩形形状的文本块
          $(
            go.Panel,
            "Auto",
            $(
              go.Shape,
              "Rectangle",
              {
                fill: "#00A9C9",
                strokeWidth: 0
              },
              new go.Binding("figure", "figure")
            ),
            $(
              go.TextBlock,
              textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay()
            )
          ),
          // 四个命名端口，每边一个:
          makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
          makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
          makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
          makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "Condition",
        $(
          go.Node,
          "Table",
          nodeStyle(),
          // 主要对象是一个面板，它围绕着一个矩形形状的文本块
          $(
            go.Panel,
            "Auto",
            $(
              go.Shape,
              "Diamond",
              {
                fill: "#00A9C9",
                strokeWidth: 0
              },
              new go.Binding("figure", "figure")
            ),
            $(
              go.TextBlock,
              textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay()
            )
          ),
          // 四个命名端口，每边一个:
          makePort("T", go.Spot.Top, go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "Start",
        $(
          go.Node,
          "Table",
          nodeStyle(),
          $(
            go.Panel,
            "Auto",
            $(go.Shape, "Circle", {
              minSize: new go.Size(60, 60),
              fill: "#79C900",
              strokeWidth: 0
            }),
            $(
              go.TextBlock,
              "Start",
              textStyle(),
              { editable: true },
              new go.Binding("text")
            )
          ),
          // 三个命名端口，每边一个，除了底部，全部只输入:
          makePort("L", go.Spot.Left, go.Spot.Left, true, false),
          makePort("R", go.Spot.Right, go.Spot.Right, true, false),
          makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "End",
        $(
          go.Node,
          "Table",
          nodeStyle(),
          $(
            go.Panel,
            "Auto",
            $(go.Shape, "Circle", {
              minSize: new go.Size(60, 60),
              fill: "#DC3C00",
              strokeWidth: 0
            }),
            $(
              go.TextBlock,
              "End",
              textStyle(),
              { editable: true },
              new go.Binding("text")
            )
          ),
          // 三个命名端口，每边一个，除了底部，全部只输入:
          makePort("T", go.Spot.Top, go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, go.Spot.Left, false, true),
          makePort("R", go.Spot.Right, go.Spot.Right, false, true)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "Comment",
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          $(go.Shape, "File", {
            fill: "#42b983",
            strokeWidth: 0
          }),
          $(
            go.TextBlock,
            textStyle(),
            {
              margin: 5,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: true,
              font: "bold 12pt Helvetica, Arial, sans-serif"
            },
            new go.Binding("text").makeTwoWay()
          )
          // 没有端口，因为不允许连接到注释
        )
      );

      // 替换linkTemplateMap中的默认链接模板
      myDiagram.linkTemplate = $(
        go.Link, // 整个链接面板
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // 鼠标巧妙地移动:突出链接:
          mouseEnter: (e, link) => {
            link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
          },
          mouseLeave: (e, link) => {
            link.findObject("HIGHLIGHT").stroke = "transparent";
          }
        },
        new go.Binding("points").makeTwoWay(),
        $(
          go.Shape, // 高光形状，通常是透明的
          {
            isPanelMain: true,
            strokeWidth: 8,
            stroke: "transparent",
            name: "HIGHLIGHT"
          }
        ),
        $(
          go.Shape, // 链接路径形状
          {
            isPanelMain: true,
            stroke: "gray",
            strokeWidth: 2
          }
        ),
        $(
          go.Shape, // 箭头
          {
            toArrow: "standard",
            strokeWidth: 0,
            fill: "gray"
          }
        ),
        $(
          go.Panel,
          "Auto", // 链接标签，通常不可见
          {
            visible: false,
            name: "LABEL",
            segmentIndex: 2,
            segmentFraction: 0.5
          },
          new go.Binding("visible", "visible").makeTwoWay(),
          $(
            go.Shape,
            "RoundedRectangle", // 标签的形状
            {
              fill: "#F8F8F8",
              strokeWidth: 0
            }
          ),
          $(
            go.TextBlock,
            "Yes", // 标签
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#333333",
              editable: true
            },
            new go.Binding("text").makeTwoWay()
          )
        )
      );
      //线生成事件
      myDiagram.addDiagramListener("LinkDrawn", e => {
        showLinkLabel(e);
      });
      // 线连接事件
      myDiagram.addDiagramListener("LinkRelinked", e => {
        showLinkLabel(e);
      });
      myDiagram.addDiagramListener("ObjectDoubleClicked", e => {
        console.log(e);
      });
      // 如果来自“条件”节点，则使链接标签可见。
      // 这个侦听器由“LinkDrawn”和“LinkRelinked”DiagramEvents调用。
      let showLinkLabel = e => {
        let label = e.subject.findObject("LABEL");
        if (label !== null)
          label.visible = e.subject.fromNode.data.figure === "Diamond";
      };

      // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
      // 链接工具和链接工具使用的临时链接也是正交的
      myDiagram.toolManager.linkingTool.temporaryLink.routing =
        go.Link.Orthogonal;
      myDiagram.toolManager.relinkingTool.temporaryLink.routing =
        go.Link.Orthogonal;

      // 初始化页面左侧的调色板
      let myPalette = $(go.Palette, "myPaletteDiv", {
        scrollsPageOnFocus: false,
        nodeTemplateMap: myDiagram.nodeTemplateMap, // 共享myDiagram使用的模板
        model: new go.GraphLinksModel([
          // 指定调色板的内容
          {
            category: "Start",
            text: " 开始"
          },
          {
            category: "Step",
            text: "步骤"
          },
          {
            category: "Condition",
            text: "条件"
          },
          {
            category: "End",
            text: "结束"
          },
          {
            category: "Comment",
            text: "说明"
          }
        ])
      });
      // 初始化数据
      let load = () => {
        myDiagram.model = go.Model.fromJson({
          class: "go.GraphLinksModel",
          linkFromPortIdProperty: "fromPort",
          linkToPortIdProperty: "toPort",
          nodeDataArray: [
            {
              category: "Start",
              loc: "0 0",
              text: "初始化",
              key: 0
            },
            {
              category: "Condition",
              loc: "0 100",
              text: "条件",
              key: 1
            }
          ],
          linkDataArray: [{ from: 0, to: 1, fromPort: "B", toPort: "T" }]
        });
      };
      load(); //
    }
  }
};
</script>

<style lang="scss" scoped>
.xFlow {
  width: 100%;
  height: 100%;
}
.flow_group {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 1px solid #333;
}

/* 左侧 */
.myPaletteDiv {
  box-sizing: border-box;
  width: 150px;
  border-right: 1px solid #ccc;
  background-color: #eee;
}

/* 右侧 */
.myDiagramDiv {
  flex-grow: 1;
  box-sizing: border-box;
  background-color: #fff;
}
</style>