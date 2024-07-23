import { loadData } from "./data.js";
import { initScrollama } from "./scrollama.js";
import { createChart } from "./chart.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  const element = d3.select("figure").node();
  createChart(element);
  initScrollama();
});
