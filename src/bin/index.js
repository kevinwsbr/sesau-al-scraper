const pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");
const url = "samples/Informe-Epidemiológico-COVID-19-nº-127-11-7-2020.pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.js";

const extractText = async (url, pageNumber) => {
  try {
    const pdf = await pdfjsLib.getDocument(url).promise;
    const page = await pdf.getPage(pageNumber);
    const tokenizedText = await page.getTextContent();
    const pageText = tokenizedText.items.map((token) => token.str).join(" ");
    return pageText;
  } catch (e) {
    console.log("(e) => ", e);
  }
};

const extractCities = async () => {
  try {
    let regex = /[A-Za-z’ÁáçóãÍíúéô *]+ \d+ \d+/g;
    let pageThree = await extractText(url, 3);
    let extracteds = [];
    let cities = [];

    pageThree = pageThree.replace(/ +/g, " ");

    while ((match = regex.exec(pageThree)) != null) {
      extracteds.push(
        match[0].replace("BITOS CONFIRMADOS", "").replace(/[.*]/g, "").trim()
      );
    }

    extracteds.forEach((line) => {
      let nameRegex = /[A-Za-z’ÁáçóãÍíúéô *]+/g;
      let valuesRegex = /\d+ \d+/;

      let cityName = nameRegex.exec(line)[0].trim();

      let values = valuesRegex
        .exec(line)[0]
        .split(" ")
        .map((e) => {
          return Number(e);
        });

      cities.push({
        name: cityName,
        confirmedCases: values[0],
        deaths: values[1],
      });
    });

    cities.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    console.log(cities);

    return cities;
  } catch (e) {
    console.log("(e) => ", e);
  }
};

extractCities();
