const pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");
const url = "samples/Informe-Epidemiologico-COVID-19-no-162-15-8-2020.pdf";

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
    let regex = /[A-Za-z’ÁáçóãÍíúéô *]+ (\d+|\d+.\d+) (\d+|\d+.\d+)/g;
    let pageFour = await extractText(url, 4);
    let extracteds = [];
    let cities = [];

    pageFour = pageFour.replace(/ +/g, " ");

    while ((match = regex.exec(pageFour)) != null) {
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

const extractStats = async () => {
  try {
    let values;
    const regex = /(\d+|\d+[.,]\d+) (\d+|\d+[.,]\d+) (\d+[.,]\d+%) (\d+|\d+[.,]\d+) (\d+[.,]\d+%) (\d+|\d+[.,]\d+) (\d+[.,]\d+%) (\d+|\d+[.,]\d+) (\d+[.,]\d+%)/g;
    let pageOne = await extractText(url, 1);

    pageOne = pageOne.replace(/ +/g, " ");

    while ((match = regex.exec(pageOne)) != null) {
      values = match[0].replace(/\./g, "").trim().split(" ");
    }

    const stats = {
      confirmedCases: Number(values[3]),
      suspiciousCases: Number(values[1]),
      deaths: Number(values[7]),
      discardedCases: Number(values[5]),
      totalCases: Number(values[0]),
    };

    console.log(stats);

    return stats;
  } catch (e) {
    console.log("(e) => ", e);
  }
};

const extractComorbidities = async () => {
  try {
    let pageTwo = await extractText(url, 2);
    let numbers = [],
      names = [];
    pageTwo = pageTwo.replace(/ +/g, " ").split("NÃO INFORMADO").slice(-1)[0];

    let regex = /\d+/gm;

    while ((match = regex.exec(pageTwo)) != null) {
      numbers.push(Number(match[0]));
    }

    regex = /[A-Za-záóçã]+/gm;
    while ((match = regex.exec(pageTwo)) != null) {
      names.push(match[0]);
    }

    let comorbidities = [];

    for (let i = 0; i < numbers.length; ++i) {
      if (names[i] == "Sem" || names[i] == "Doença") {
        comorbidities.push({
          comorbidity: names[i] + " " + names[i + 1],
          value: numbers[i],
        });
        names.splice(i, 1);
      } else {
        comorbidities.push({
          comorbidity: names[i],
          value: numbers[i],
        });
      }
    }

    comorbidities = comorbidities.reverse();

    console.log(comorbidities);

    return comorbidities;
  } catch (e) {
    console.log("(e) => ", e);
  }
};

const extractAgesRange = async () => {
  try {
    const regex = /\d+/gm;
    let pageTwo = await extractText(url, 2);
    let numbers = [],
      agesRange = [];
    let i = 0;
    pageTwo = pageTwo.replace(/ +/g, " ").split("NÃO INFORMADO").slice(-2)[0];

    while ((match = regex.exec(pageTwo)) != null && i < 18) {
      numbers.push(Number(match[0]));
      i++;
    }

    for (let i = 8; i > -1; i--) {
      agesRange.push({
        female: numbers[i],
        male: numbers[i + 9],
      });
    }

    console.log(agesRange);

    return agesRange;
  } catch (e) {
    console.log("(e) => ", e);
  }
};

extractCities();
extractComorbidities();
extractAgesRange();
extractStats();
