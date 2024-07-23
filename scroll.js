// using d3 for convenience
var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();
const parseDate = d3.timeParse("%Y-%m-%d");
async function getData() {
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

// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  var stepH = Math.floor(window.innerHeight * 0.75);
  step.style("height", stepH + "px");

  var figureHeight = window.innerHeight / 2;
  var figureMarginTop = (window.innerHeight - figureHeight) / 2;

  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }

  // update graphic based on step
  //   figure.select("p").text(response.index + 1);
  if (response.index === 3) {
    console.log("Highlighting all categories in 2020");
    d3.selectAll(".highlight-2020").classed("highlight", true);
    // console.log(elements); // Log selected elements
    // elements
  } else {
    d3.selectAll(".highlight-2020").classed("highlight", false);
  }
  if (response.index === 4) {
    console.log("index is four");
    highilightPositiveData();
    d3.selectAll(".positive.highlight-2020").classed("highlight", true);
  } else {
    d3.selectAll(".positive.highlight-2020").classed("highlight", false);
  }
}

// to dos:
// 3. show the positive song adj token and topic
// 4. refactor to ES6

function highilightPositiveData() {
  getData().then(() => {
    const positiveData2020 = data.filter(
      (d) =>
        d.sentiment_category === "positive" &&
        parseDate(d.week).getFullYear() === 2020
    );
    const negativeData2020 = data.filter(
      (d) =>
        d.sentiment_category === "negative" &&
        parseDate(d.week).getFullYear() === 2020
    );

    // Show positive data information in HTML
    const html = positiveData2020
      .slice(0, 3)
      .map(
        (d) => `
    <div>
      <div class="artist"><strong>Artist:</strong> ${d.artist}</div>
      <div class="title"><a href="${d.url}""><strong>Song:</strong> ${d.title} </a></div>
    </div>
  `
      )
      .join("");

    d3.select(".highlighted-data").html(html);
  });
}

function clearHighlights() {}

function init() {
  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();

  // 2. setup the scroller passing options
  // 		this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.33,
      debug: false,
    })
    .onStepEnter(handleStepEnter);
}

// kick things off
init();
