import { getData } from "./data.js";
console.log(getData);
export function createChart(element) {
  getData().then((data) => {
    console.log(data);

    const margin = { top: 20, right: 30, bottom: 0, left: 50 },
      width =
        element.getBoundingClientRect().width / 2.25 -
        margin.left -
        margin.right,
      height =
        element.getBoundingClientRect().height / 2.25 -
        margin.top -
        margin.bottom;

    const sentimentCategories = [
      "positive",
      "slightly positive",
      "slightly negative",
      "negative",
    ];

    const nestedData = d3.rollup(
      data,
      (v) => v.length,
      (d) => d.week,
      (d) => d.sentiment_category
    );

    const formattedData = [];
    nestedData.forEach((categories, week) => {
      categories.forEach((count, category) => {
        formattedData.push({ week, category, count });
      });
    });

    const groupedData = d3.group(formattedData, (d) => d.category);
    console.log({ groupedData });
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(formattedData, (d) => d.week))
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(formattedData, (d) => d.count)])
      .range([height, 0]);

    const xAxis = (g) =>
      g
        .call(d3.axisBottom(xScale))
        .call((g) => g.selectAll(".domain").remove());
    const yAxis = (g) =>
      g
        .call(d3.axisLeft(yScale))
        .call((g) => g.selectAll(".domain").remove())
        .call((g) => g.selectAll(".tick line").attr("stroke", "#ddd"));

    const svg = d3
      .select(".chart")
      .selectAll("svg")
      .data(sentimentCategories)
      .enter()
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top * 2 + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);
    svg.append("g").call(yAxis);

    sentimentCategories.forEach((category, i) => {
      const currentData = groupedData.get(category) || [];
      d3.select(svg.nodes()[i])
        .append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("class", "category")
        .attr("text-anchor", "middle")
        .text(category);

      d3.select(svg.nodes()[i])
        .selectAll("circle")
        .data(currentData)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.week))
        .attr("cy", (d) => yScale(d.count))
        .attr("r", 2)
        .attr("fill", "steelblue")
        .attr("class", (d) => {
          let classes = category.replace(/\s+/g, "-").toLowerCase();
          if (d.week.getFullYear() === 2020) classes += " highlight-2020";
          return classes;
        });
    });
  });
}
