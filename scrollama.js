// import { selectAll } from "d3-selection";
import { loadData, getData, parseDate } from "./data.js";
// import scrollama from "scrollama";

const main = d3.select("main");
const scrolly = main.select("#scrolly");
const figure = scrolly.select("figure");
const article = scrolly.select("article");
let step = article.selectAll(".step");

function setupScrollama() {
  let scroller = scrollama();

  function highlightPositiveData() {
    getData().then((data) => {
      const positiveData2020 = data.filter((d) => {
        const date = d.week;
        return (
          date &&
          d.sentiment_category === "positive" &&
          date.getFullYear() === 2020
        );
      });

      const positiveHtml = positiveData2020
        .slice(0, 3)
        .map(
          (d) => `
        <div>
          <div class="artist"><strong>Artist:</strong> ${d.artist}</div>
          <div class="title"><a href="${d.url}"><strong>Song:</strong> ${d.title}</a></div>
        </div>
      `
        )
        .join("");

      d3.selectAll(".highlighted-positive-data").html(positiveHtml);
      // });

      const negativeData2020 = data.filter((d) => {
        const date = d.week;
        return (
          date &&
          d.sentiment_category === "negative" &&
          date.getFullYear() === 2020
        );
      });

      const negativeHtml = negativeData2020
        .slice(0, 3)
        .map(
          (d) => `
        <div>
          <div class="artist"><strong>Artist:</strong> ${d.artist}</div>
          <div class="title"><a href="${d.url}"><strong>Song:</strong> ${d.title}</a></div>
        </div>
      `
        )
        .join("");

      d3.selectAll(".highlighted-negative-data").html(negativeHtml);
    });
  }

  function handleStepEnter(response) {
    console.log(response.index);

    // add color to current step only
    step.classed("is-active", function (d, i) {
      return i === response.index;
    });

    // let highlightElement = d3.selectAll(".highlight-2020");
    if (response.index === 2 || response.index === 3) {
      console.log(response.index);
      console.log("Highlighting all categories in 2020");
      d3.selectAll(".slightly-positive.highlight-2020").classed(
        "highlight",
        true
      );
      d3.selectAll(".slightly-negative.highlight-2020").classed(
        "highlight",
        true
      );
    } else {
      d3.selectAll(".slightly-positive.highlight-2020").classed(
        "highlight",
        false
      );
      d3.selectAll(".slightly-negative.highlight-2020").classed(
        "highlight",
        false
      );
    }

    if (
      response.index === 4 ||
      response.index === 5 ||
      response.index === 6 ||
      response.index === 7
    ) {
      console.log("Highlighting positive data in 2020");
      highlightPositiveData();
      d3.selectAll(".positive.highlight-2020").classed("highlight", true);
      d3.selectAll(".negative.highlight-2020").classed("highlight", true);
    } else {
      d3.selectAll(".positive.highlight-2020").classed("highlight", false);
      d3.selectAll(".negative.highlight-2020").classed("highlight", false);
    }
  }

  function handleResize() {
    const stepH = Math.floor(window.innerHeight * 0.75);
    d3.selectAll(".step").style("height", stepH + "px");

    const figureHeight = window.innerHeight / 2;
    const figureMarginTop = (window.innerHeight - figureHeight) / 2;

    d3.selectAll("figure")
      .style("height", figureHeight + "px")
      .style("top", figureMarginTop + "px");

    scroller.resize();
  }

  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.3,
      debug: false,
    })
    .onStepEnter(handleStepEnter);

  window.addEventListener("resize", handleResize);
  handleResize();
}

export function initScrollama() {
  loadData().then(() => {
    setupScrollama();
  });
}
