# sesau-al-scraper
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repo contains a simple scraper made with Node.js to fetch new daily data about COVID-19 from SESAU/AL reports.

## Installation

Use the [npm](https://www.npmjs.com/) package manager to install the dependencies.

```bash
npm install
```

## Usage
Put the downloaded report inside the `samples` folder and change the `url` variable in the `index.js` file to match the downloaded report name. Then, execute: 

```bash
npm run dev
```

or

```bash
node src/bin/index.js
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
