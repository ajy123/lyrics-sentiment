let height = window.innerHeight / 1.5;
let width = window.innerWidth / 2;
let margin = { top: 20, right: 40, bottom: 30, left: 40 };
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
// fetchData();
// async function fetchData() {
//   const data = await getData();
//   const test = processData(data);
//   console.log({ test });
//   return processData(data);
// }

// // function to process data with timeParse and sentimentRange
// function processData(data) {
//   //   // sort the data by date
//   //   const sortedData = data.sort((a, b) => {
//   //     // Create date objects for comparison
//   //     const dateA = new Date(a.date);
//   //     const dateB = new Date(b.date);
//   //     // Compare the dates
//   //     return dateA - dateB;
//   //   });
//   //   console.log(sortedData);
//   // Prepare data for plotting
//   // Prepare data for plotting
//   const groupedData = d3.group(
//     data,
//     (d) => d.week,
//     (d) => d.sentiment_category
//   );

//   const formattedData = Array.from(groupedData, ([week, categories]) => {
//     const counts = Array.from(categories, ([category, items]) => ({
//       category,
//       count: items.length,
//     }));
//     return {
//       week,
//       ...Object.fromEntries(counts.map((d) => [d.category, d.count])),
//     };
//   });

//   const categories = [
//     "missing data",
//     "slightly negative",
//     "positive",
//     "slightly positive",
//     "negative",
//   ];
// }

getData().then(() => {
  // Prepare data for plotting
  //   const groupedData = d3.group(
  //     data,
  //     (d) => d.week,
  //     (d) => d.sentiment_category
  //   );

  //   const formattedData = Array.from(groupedData, ([week, categories]) => {
  //     const counts = Array.from(categories, ([category, items]) => ({
  //       category,
  //       count: items.length,
  //     }));
  //     return {
  //       week,
  //       ...Object.fromEntries(counts.map((d) => [d.category, d.count])),
  //     };
  //   });

  const categories = [
    "missing data",
    "slightly negative",
    "positive",
    "slightly positive",
    "negative",
  ];

  const svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // setup xAxis - by weekly date
  // setup yAxis - count how many sentiment category

  //   //   const x = d3
  //   //     .scaleUtc()
  //   //     .domain(d3.extent(data, (d) => parseTime(d.week)))
  //   //     .range([margin.left, width - margin.right])
  //   //     .nice();

  //   //   const y = d3
  //   //     .scaleLinear()
  //   //     .domain([0.8, -0.8])
  //   //     .rangeRound([margin.top, height - margin.bottom]);

  //   const x = d3
  //     .scaleUtc()
  //     .domain(d3.extent(data, (d) => parseTime(d.week)))
  //     .rangeRound([margin.left, width - margin.right]);

  //   const y = d3
  //     .scaleLinear()
  //     .domain([
  //       0,
  //       d3.max(formattedData, (d) => {
  //         return categories.reduce(
  //           (acc, category) => Math.max(acc, d[category] || 0),
  //           0
  //         );
  //       }),
  //     ])
  //     .rangeRound([height - margin.bottom, margin.top]);

  //   const parseDate = d3.timeParse("%Y-%m-%d");
  //   formattedData.forEach((d) => {
  //     d.week = parseDate(d.week);
  //   });

  //   const xAxis = (g) =>
  //     g
  //       .attr("transform", `translate(0,${height - margin.bottom})`)
  //       .call(d3.axisBottom(x))
  //       .call((g) => g.selectAll(".domain").remove());

  //   const yAxis = (g) =>
  //     g
  //       .attr("transform", `translate(${margin.left},0)`)
  //       .call(d3.axisLeft(y))
  //       .call((g) =>
  //         g
  //           .selectAll(".tick line")
  //           .clone()
  //           .attr("stroke-opacity", 0.1)
  //           .attr("x2", width - margin.right - margin.left)
  //       )
  //       .call((g) => g.selectAll(".domain").remove());

  //   svg.append("g").call(xAxis);
  //   svg.append("g").call(yAxis);

  //   const line = d3
  //     .line()
  //     .x((d) => x(d.week))
  //     .y((d) => y(d.count));

  const color = d3
    .scaleOrdinal()
    .domain([
      "negative",
      "slightly negative",
      "positive",
      "slightly positive",
      "missing data",
    ])
    .range(["#fb8500", "#ffb703", "#023047", "#219ebc", "gray"]);
  //   categories.forEach((category) => {
  //     const categoryData = formattedData.map((d) => ({
  //       week: d.week,
  //       count: d[category] || 0,
  //     }));

  //     // test out line chart
  //     //     svg
  //     //       .append("path")
  //     //       .datum(categoryData)
  //     //       .attr("fill", "none")
  //     //       .attr("class", "line " + category.replace(/\s+/g, ""))
  //     //       .attr("stroke", function () {
  //     //         // Add a color scale or define colors manually
  //     //         if (category === "missing data") {
  //     //           return "red";
  //     //         } else if (category == "positive") {
  //     //           return "#8ecae6";
  //     //         } else if (category == "slightly positive") {
  //     //           return "#219ebc";
  //     //         } else {
  //     //           return "steelblue";
  //     //         }
  //     //       })
  //     //       .attr("stroke-width", 1.5)
  //     //       .attr("d", line);
  //   }); // define categories

  // test out scatter plot
  // Prepare data for plotting
  const nestedData = d3.rollup(
    data,
    (v) => v.length,
    (d) => d.week,
    (d) => d.sentiment_category
  );
  const formattedData = Array.from(nestedData, ([week, categories]) => {
    return Array.from(categories, ([category, count]) => ({
      week,
      category,
      count,
    }));
  }).flat();

  const parseDate = d3.timeParse("%Y-%m-%d");
  formattedData.forEach((d) => {
    d.week = parseDate(d.week);
  });

  // Scales and axes
  const x = d3
    .scaleTime()
    .domain(d3.extent(formattedData, (d) => d.week))
    .rangeRound([margin.left, width - margin.right]);
  const y = d3
    .scaleLinear()
    .domain([
      0, 100,
      //d3.max(formattedData, (d) => d3.max(d.entries, (e) => e.count)),
    ])
    .rangeRound([height - margin.bottom, margin.top]);

  const xAxis = (g) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .call((g) => g.selectAll(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", width - margin.right)
          .attr("y", margin.bottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text("Weekly →")
      );

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("stroke-opacity", 0.1)
          .attr("x2", width - margin.right - margin.left)
      )
      .call((g) => g.selectAll(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -margin.left)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ count")
      );

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);

  svg
    .selectAll("circle")
    .data(formattedData)
    .enter()
    .append("circle")
    .attr("class", (d) => d.category.replace(/\s+/g, ""))
    .attr("cx", (d) => +x(d.week))
    .attr("cy", (d) => +y(d.count))
    .attr("opacity", 0.5)
    .attr("r", 5)
    .attr("fill", (d) => color(d.category));

  // Toggle "missing data" category
  d3.select("#toggleMissingData").on("change", function () {
    const isChecked = this.checked;
    svg.selectAll(".missingdata").classed("hidden", !isChecked);
  });

  // Toggle "postive" category
  d3.select("#togglePositiveData").on("change", function () {
    const isChecked = this.checked;
    svg.selectAll(".positive").classed("hidden", !isChecked);
  });

  // Toggle "slightly positive" category
  d3.select("#toggleSlightlyPositiveData").on("change", function () {
    const isChecked = this.checked;
    svg.selectAll(".slightlypositive").classed("hidden", !isChecked);
  });

  // Toggle "slightly negative" category
  d3.select("#toggleSlightlyNegativeData").on("change", function () {
    const isChecked = this.checked;
    svg.selectAll(".slightlynegative").classed("hidden", !isChecked);
  });

  // Toggle "negative" category
  d3.select("#toggleNegativeData").on("change", function () {
    const isChecked = this.checked;
    svg.selectAll(".negative").classed("hidden", !isChecked);
  });

  // document.addEventListener("DOMContentLoaded", () => {
  //   const categories = [
  //     { id: "togglePositiveData", class: "positive", color: "green" },
  //     {
  //       id: "toggleSlightlyPositiveData",
  //       class: "slightlypositive",
  //       color: "yellow",
  //     },
  //     {
  //       id: "toggleSlightlyNegativeData",
  //       class: "slightlynegative",
  //       color: "orange",
  //     },
  //     { id: "toggleNegativeData", class: "negative", color: "red" },
  //     { id: "toggleMissingData", class: "missingdata", color: "gray" },
  //   ];

  //   categories.forEach((category) => {
  //     const checkbox = document.getElementById(category.id);
  //     const label = checkbox.nextElementSibling;
  //     console.log(checkbox);
  //     // Initial label color
  //     if (checkbox.checked) {
  //       label.style.color = category.color;
  //     }

  //     // Event listener for toggling visibility and updating label color
  //     checkbox.addEventListener("change", function () {
  //       const isChecked = this.checked;
  //       console.log(category.class);
  //       svg.selectAll(`.${category.class}`).classed("hidden", !isChecked);
  //       label.style.color = isChecked ? category.color : "";
  //     });
  //   });
  // });
});

// positive: 8ecae6
// slightly positive: 219ebc
// neutral: 023047
// slightly negative: ffb703
// negative: fb8500

// use the sentiment score
// show the total number -- sentiment score
// show example of the ones
// there isnt much varition
// most music hits in the middle
// plot with the sentiment value

// each dot is a playlist
