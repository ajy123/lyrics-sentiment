console.log("small multiples");
// let height = window.innerHeight / 1.5;
// let width = window.innerWidth / 2;
// let margin = { top: 20, right: 40, bottom: 30, left: 40 };

const element = d3.select("figure").node();
const parseTime = d3.timeParse("%Y-%m-%d");

function getData() {
  return d3
    .csv("temp_w_missing_data.csv")
    .then(function (d) {
      // Here we can process data
      data = d; // Assign the data to the global variable
      const sortedData = d.sort((a, b) => {
        // Create date objects for comparison
        const dateA = new Date(a.week);
        const dateB = new Date(b.week);
        // Compare the dates
        return dateA - dateB;
      });
      return sortedData;
    })
    .catch(function (error) {
      // Handle error...
      console.error(error);
    });
}

getData().then(() => {
  const parseDate = d3.timeParse("%Y-%m-%d");
  data.forEach((d) => {
    d.week = parseDate(d.week);
    d.sentiment = +d.sentiment || null;
  });

  const margin = { top: 20, right: 30, bottom: 0, left: 50 },
    width =
      element.getBoundingClientRect().width / 2.25 - margin.left - margin.right,
    height =
      element.getBoundingClientRect().height / 2.25 -
      margin.top -
      margin.bottom;

  const numCharts = 4;
  const sentimentCategories = [
    "positive",
    "slightly positive",
    "slightly negative",
    "negative",
  ];

  //   const groupedData = d3.group(data, (d) => d.sentiment_category);
  //   console.log(groupedData);

  // Group data by week and sentiment category and count the occurrences
  const nestedData = d3.rollup(
    data,
    (v) => v.length,
    (d) => d.week,
    (d) => d.sentiment_category
  );
  // Flatten nested data
  const formattedData = [];
  nestedData.forEach((categories, week) => {
    categories.forEach((count, category) => {
      formattedData.push({ week, category, count });
    });
  });
  const groupedData = d3.group(formattedData, (d) => d.category);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(formattedData, (d) => d.week))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(formattedData, (d) => d.count)])
    .range([height, 0]);

  const xAxis = (g) =>
    g.call(d3.axisBottom(xScale)).call((g) => g.selectAll(".domain").remove());
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
      .text((d) => d);
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

  // .attr("width", width)
  // .attr("height", height)
  // .append("g")
  // .attr("transform", `translate(${margin.left},${margin.top})`);

  //   const subSvg = svg
  //     .selectAll(".subSvg")
  //     .data(sentimentCategories)
  //     .enter()
  //     .append("g")
  //     .attr("class", "subSvg")
  //     .attr(
  //       "transform",
  //       (d, i) =>
  //         `translate(${((i % 2) * width) / numCharts}, ${
  //           (Math.floor(i / 2) * height) / numCharts
  //         })`
  //     );

  //   subSvg
  //     .append("g")
  //     .attr(
  //       "transform",
  //       (d, i) => `translate(${(i % 2) * width},${height - margin.bottom})`
  //     )
  //     .call(d3.axisBottom(x).ticks(2));
  //   // .attr("transform", `translate(0,${height / 2})`)
  //   // .call(xAxis);
  //   subSvg.append("g").call(yAxis);

  //   subSvg
  //     .append("text")
  //     .attr("x", width / 2)
  //     .attr("y", -10)
  //     .attr("text-anchor", "middle")
  //     .text((d) => d);

  //   subSvg.each(function (category) {
  //     d3.select(this)
  //       .selectAll("circle")
  //       .data(groupedData.get(category) || [])
  //       .enter()
  //       .append("circle")
  //       .attr("cx", (d) => x(d.week))
  //       .attr("cy", (d) => y(d.streams))
  //       .attr("r", 2)
  //       .attr("fill", "steelblue")
  //       .on("click", function (event, d) {
  //         d3.select("#details").html(`
  //         <p>Artist: ${d.artist}</p>
  //         <p>Title: ${d.title}</p>
  //         <p>Category: ${d.sentiment_category}</p>
  //         <p><a href="${d.url}" target="_blank">Play <span>&#9654;</span></a></p>
  //       `);
  //       });
  //   });
});
