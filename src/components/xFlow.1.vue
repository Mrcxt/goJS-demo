<template>
  <div id="myDiagramDiv" class="xFlow"></div>
</template>

<script>
export default {
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      // 创建画布 -- Diagram
      let $ = go.GraphObject.make;
      let myDiagram = $(go.Diagram, "myDiagramDiv", {
        "undoManager.isEnabled": true,
        layout: $(go.TreeLayout, { angle: 90, layerSpacing: 35 })
      });

      // 创建节点 -- Node
      myDiagram.nodeTemplate = $(
        go.Node,
        "Vertical",
        {
          locationSpot: go.Spot.Center,
          background: "#34c84a"
        },
        new go.Binding("location", "loc"),
        // 创建图形
        $(
          go.Shape,
          "RoundedRectangle",
          {
            background: "#fff",
            margin: 10,
            stroke: "red"
          },
          new go.Binding("figure", "fig")
        ),
        // 创建文本
        $(
          go.TextBlock,
          "Default text",
          {
            margin: 10,
            stroke: "white",
            font: "bold 16px sans-serif"
          },
          new go.Binding("text", "name")
        ),
        // 创建图像
        $(
          go.Picture,
          {
            margin: 10,
            width: 50,
            height: 50,
            background: "red"
          },
          new go.Binding("source")
        )
      );

      // 创建连接模板 --
      myDiagram.linkTemplate = $(
        go.Link,
        {
          routing: go.Link.Orthogonal,
          corner: 5
        },
        $(go.Shape, { strokeWidth: 3, stroke: "#555" })
      );

      // 创建模型 -- Model
      // let myModel = $(go.Model);
      // let myModel = $(go.GraphLinksModel);
      let myModel = $(go.TreeModel);
      myModel.nodeDataArray = [
        // Model / GraphLinkModel
        // { name: "甲甲甲甲甲", source: "logo.png", key: "A" },
        // { name: "乙乙乙乙乙", source: "logo.png", key: "B" },
        // { name: "丙丙丙丙丙", source: "logo.png", key: "C" }
        // treeModel
        { key: "1", name: "Don Meow", source: "logo.png" },
        { key: "2", parent: "1", name: "Demeter", source: "logo.png" },
        { key: "3", parent: "1", name: "Copricat", source: "logo.png" },
        { key: "4", parent: "3", name: "Jellylorum", source: "logo.png" },
        { key: "5", parent: "3", name: "Alonzo", source: "logo.png" },
        { key: "6", parent: "2", name: "Munkustrap", source: "logo.png" }
      ];
      // myModel.linkDataArray = [{ from: "A", to: "B" }, { from: "B", to: "C" }];
      myDiagram.model = myModel;
    }
  }
};
</script>

<style lang="scss">
.xFlow {
  width: 100%;
  height: 100%;
}
#myDiagramDiv {
  background-color: #dae4e4;
}
</style>
