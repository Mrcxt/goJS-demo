<template>
  <div id="myDiagramDiv" class="xFlow"></div>
</template>

<script>
import "./../assets/go.js";
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
        "undoManager.isEnabled": true
      });
      // 创建模型 -- Model
      // let myModel = $(go.Model);
      let myModel = $(go.GraphLinksModel);
      // let myModel = $(go.TreeModel);
      myModel.nodeDataArray = [
        { name: "甲甲甲甲甲", source: "logo.png", key: "A" },
        { name: "乙乙乙乙乙", source: "logo.png", key: "B" },
        { name: "丙丙丙丙丙", source: "logo.png", key: "C" }
      ];
      myModel.linkDataArray = [{ from: "A", to: "B" }, { from: "B", to: "C" }];
      myDiagram.model = myModel;

      // 创建节点 -- Node
      myDiagram.nodeTemplate = $(
        go.Node,
        "Horizontal",
        {
          locationSpot: go.Spot.Center,
          background: "44CCFF"
        },
        new go.Binding("location", "loc"),
        $(go.Shape, "RoundedRectangle", new go.Binding("figure", "fig")),
        $(
          go.TextBlock,
          "Default text",
          {
            margin: 10,
            stroke: "white",
            font: "bold 16px sans-serif"
          },
          new go.Binding("text", "key")
        ),
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
