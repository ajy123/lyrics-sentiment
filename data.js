export const parseDate = d3.timeParse("%Y-%m-%d");
// export const testDataJs = "testDatajsExpore";

let data = null;

export async function loadData() {
  if (data === null) {
    try {
      console.log("Loading data...");
      const rawData = await d3.csv("temp_w_missing_data.csv");
      data = rawData.sort((a, b) => new Date(a.week) - new Date(b.week));
      data.forEach((d) => {
        d.week = parseDate(d.week);
        d.sentiment = +d.sentiment || null;
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }
  return data;
}

export async function getData() {
  return await data;
}

// export async function getData() {
//   try {
//     console.log("getDataFunction in data.js");
//     const data = await d3.csv("temp_w_missing_data.csv");
//     const sortedData = data.sort((a, b) => new Date(a.week) - new Date(b.week));
//     sortedData.forEach((d) => {
//       d.week = parseDate(d.week);
//       d.sentiment = +d.sentiment || null;
//     });
//     return sortedData;
//   } catch (error) {
//     console.error(error);
//   }
// }
