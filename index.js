const axios = require('axios');
const moment = require('moment');
const createGeoJson = require('./build');
const headers = require('./config.js');

const viewId = 0;

function createRequest(startDate, endDate) {
  const obj = {
    reportRequests:
    [
      {
        viewId,
        dateRanges: [
          { startDate, endDate },
        ],
        metrics: [
          { expression: 'ga:users' },
        ],
        dimensions: [
          { name: 'ga:latitude' },
          { name: 'ga:longitude' },
          { name: 'ga:date' },
        ],
        orderBys:
        [
          { fieldName: 'ga:date', sortOrder: 'ascending' },
        ],
      },
    ],
  };
  console.log(JSON.stringify(obj));
  return obj;
}

const startOfYear = date => moment(date).startOf('year').format('YYYY-MM-DD');
const endOfMonth = date => moment(date).endOf('month').format('YYYY-MM-DD');

const addOneMonth = prevDate => moment(prevDate).add(1, 'M').format('YYYY-MM-DD');

let startDate = startOfYear();

for (let month = 1; month <= 12; month += 1) {
  const endDate = endOfMonth(startDate);
  console.log(startDate, endDate);
  const obj = createRequest(startDate, endDate);
  startDate = addOneMonth(startDate);

  axios.post('https://content-analyticsreporting.googleapis.com/v4/reports:batchGet?alt=json', obj, { headers })
    .then((res) => {
      console.log(`${res.status} ${res.statusText}`);
      createGeoJson(res.data, endDate);
    })
    .catch(error => console.log(error));
}
