import * as d3 from 'd3';
import { size } from './Diagrams.js';
import { graph1_data_cleaning } from './graphDataCleaning.js';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

export function SankeyDiagram_Overview()
{
  const margin = { top: 20, right: 10, bottom: 30, left: 10 };
  const width = size.width - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;
  const afterCleanData_Graph1 = graph1_data_cleaning();

  // Initialize nodes and links and prepare the categories for the sankey diagram
  const nodes = [];
  const links = [];
  const categories = ['brand', 'transmission', 'engine_capacity', 'mileage', 'age', 'price'];
  const nodeMap = new Map();

  // Create nodes for 'brand', 'transmission', 'engine_capacity', 'mileage', 'age', 'price'
  categories.forEach((category, i) =>
  {
    const categoryNodes = Array.from(new Set(afterCleanData_Graph1.map(d => d[category]))).sort();
    categoryNodes.forEach((name, j) =>
    {
      const nodeName = `${ category }-${ name }`;
      nodes.push({
        name: nodeName,
        layer: i,
        value: afterCleanData_Graph1.filter(d => d[category] === name).length,
        x0: i * width / categories.length,
        y0: j * height / categoryNodes.length,
        x1: (i + 1) * width / categories.length,
        y1: (j + 1) * height / categoryNodes.length
      });
      nodeMap.set(nodeName, nodes.length - 1);
    });
  });


  // Create links between nodes
  afterCleanData_Graph1.forEach(d =>
  {
    for (let i = 0; i < categories.length - 1; i++)
    {
      const sourceName = `${ categories[i] }-${ d[categories[i]] }`;
      const targetName = `${ categories[i + 1] }-${ d[categories[i + 1]] }`;

      const sourceIndex = nodeMap.get(sourceName);
      const targetIndex = nodeMap.get(targetName);

      if (sourceIndex !== undefined && targetIndex !== undefined)
      {
        links.push({
          source: sourceIndex,
          target: targetIndex,
          value: 1
        });
      }
    }
  });


  // Create sankey diagram
  const sankeyDiagram = sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 1], [width - 1, height - 5]])
    .nodeSort((a, b) =>
    {

      if (a.layer === 1 || a.layer === 4 || a.layer === 5)
      {
        return d3.ascending(a.value, b.value);
      }
      return null;
    });

  // Create sankey data
  const sankeyData = sankeyDiagram({
    nodes: nodes.map(d => Object.assign({}, d)),
    links: links.map(d => Object.assign({}, d))
  });

  // Create SVG
  const svg = d3.select("#Graph1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${ margin.left },${ margin.top })`);

  // 定义颜色过渡方案
  // 修改颜色过渡方案
  const colorTransitions = {
    "brand": ["#2d85c4", "#ae1aed"],
    "transmission": ["#1ae843", "#ff8800"],
    "engine_capacity": ["#ff8800", "#de0b5f"],
    "mileage": ["#de0b5f", "#ff8800"],
    "age": ["#ff8800", "#de0b5f"],
    "price": ["#de0b5f", "#ff8800"]
  };




  const defs = svg.append("defs");


  const createGradient = (id, colors) =>
  {
    const gradient = defs.append("linearGradient")
      .attr("id", id)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", colors[0]);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", colors[1]);
  };


  const getColor = (source) =>
  {

    const category = source.split('-')[0];
    const gradientId = `${ category }-gradient`;


    if (!defs.select(`#${ gradientId }`).node())
    {
      const colors = colorTransitions[category];
      if (colors) createGradient(gradientId, colors);
    }

    return `url(#${ gradientId })`;
  };



  // Connect links
  svg.append("g")
    .attr("fill", "none")
    .selectAll("path")
    .data(sankeyData.links)
    .enter()
    .append("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke", d => getColor(d.source.name))
    .attr("stroke-width", d => Math.max(1, d.width))
    .style("opacity", 0.6)
    .transition()
    .duration(500);

  // add nodes
  const nodeGroup = svg.append("g");

  // add node rectangles
  const nodeRects = nodeGroup.selectAll("rect")
    .data(sankeyData.nodes)
    .enter()
    .append("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => d3.scaleOrdinal(d3.schemeCategory10)(d.name))
    .attr("stroke", "#E0E0E5");

  // Add node labels
  nodeGroup.append("g")
    .style("font", "12px sans-serif")
    .selectAll("text")
    .data(sankeyData.nodes)
    .enter()
    .append("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d =>
    {
      if (d.name.split('-')[2] !== undefined)
      {
        return d.name.split('-')[1] + '-' + d.name.split('-')[2];
      }
      else
      {
        return d.name.split('-')[1];
      }
    })
    .attr("stroke", "#E0E0E5");
  // Add color legend
  const legend = svg.append("g")
    .attr("transform", `translate(0, ${ height + 10 })`);

  // 修改图例数据
  const legendData = [
    { category: 'brand', color: colorTransitions["brand"][0] },
    { category: 'transmission', color: colorTransitions["transmission"][0] },
    { category: 'engine_capacity', color: colorTransitions["engine_capacity"][0] },
    { category: 'mileage', color: colorTransitions["mileage"][0] },
    { category: 'age', color: colorTransitions["age"][0] },
    { category: 'price', color: colorTransitions["price"][0] }
  ];
  const legendItem = legend.selectAll("g")
    .data(legendData)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${ i * 130 }, 0)`);

  legendItem.append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", d => d.color);

  legendItem.append("text")
    .attr("x", 25)
    .attr("y", 10)
    .attr("dy", "0.35em")
    .style("font", "12px sans-serif")
    .style("font-weight", "bold")
    .text(d => d.category.charAt(0).toUpperCase() + d.category.slice(1));

  // Add filter functionality
  nodeRects.on("click", function (event, d)
  {
    const selectedNode = d;
    const isActive = d3.select(this).classed("active");

    // Reset all nodes and links
    nodeRects.classed("active", false).attr("opacity", 1);
    svg.selectAll("path").attr("stroke", d => getColor(d.source.name)).attr("opacity", 0.6);
    window.dispatchEvent(new CustomEvent('nodeSelected', { detail: { category: null, value: null } }));

    if (!isActive)
    {
      // Highlight selected node and related links
      d3.select(this).classed("active", true).attr("opacity", 1);
      svg.selectAll("path")
        .transition()
        .duration(500)
        .attr("stroke", d => (d.source === selectedNode || d.target === selectedNode) ? getColor(d.source.name) : "#bab5af")
        .attr("opacity", d => (d.source === selectedNode || d.target === selectedNode) ? 0.6 : 0.1);
      nodeRects.attr("opacity", d => (d === selectedNode || sankeyData.links.some(link => link.source === selectedNode && link.target === d || link.source === d && link.target === selectedNode)) ? 1 : 0.1);

      // Send selected node data to another JS file
      const event = new CustomEvent('nodeSelected', { detail: { category: selectedNode.name.split('-')[0], value: selectedNode.name.split('-')[1] } });
      window.dispatchEvent(event);
    }
  });
}
