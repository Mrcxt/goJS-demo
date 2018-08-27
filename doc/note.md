## 初次接触

因为工作的原因，需要实现一个自定义交互的流程图组件，经过比较也是选择了 goJS 。goJS 不依赖任何框架，因此他可以与其他库（JQuery、Vue、React）实现完美封装。

## 使用入门

### 创建画布 （Diagram）

首先需要创建一个 html 元素，这边是我们的画布了。

```html
<div id="myDiagramDiv" style="margin:auto;width:300px; height:300px; background-color:#ddd;"></div>
```

```js
// [1]
var $ = go.GraphObject.make;

// [2]
var myDiagram = $(go.Diagram, "myDiagramDiv", {
  //模型图的中心位置所在坐标
  initialContentAlignment: go.Spot.Center,

  //允许用户操作图表的时候使用Ctrl-Z撤销和Ctrl-Y重做快捷键
  "undoManager.isEnabled": true,

  //不运行用户改变图表的规模
  allowZoom: false,

  //画布上面是否出现网格
  "grid.visible": true,

  //允许在画布上面双击的时候创建节点
  "clickCreatingTool.archetypeNodeData": { text: "Node" },

  //允许使用ctrl+c、ctrl+v复制粘贴
  "commandHandler.copiesTree": true,

  //允许使用delete键删除节点
  "commandHandler.deletesTree": true,

  // 允许拖动移动和复制
  "draggingTool.dragsTree": true
});
```

**注释**

1. gojs 有两种使用方法, 一种是使用原本的 go 对象, 第二种则是构造器方式创建, 即使用 `go.GraphObject.make` 对象创建,我们将该对象赋值给 $, 当然为了避免冲突也可以是其他符号
2. `$(go.Diagram, [selector], [options])`, 该方法会执行 canvas 画布的初始化操作, 同时也提供了丰富的配置项使用, 详情参考[Class Diagram](https://gojs.net/latest/api/symbols/Diagram.html)

## 创建模型数据（Model）

```js
var myModel = $(go.Model); //创建Model对象
// model中的数据每一个js对象都代表着一个相应的模型图中的元素
myModel.nodeDataArray = [
  { key: "工厂" },
  { key: "车间" },
  { key: "工人" },
  { key: "岗位" }
];
myDiagram.model = myModel; //将模型数据绑定到画布图上
```
