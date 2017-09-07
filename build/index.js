const fs = require('fs');
const moment = require('moment');

function createGeoJson(data, endDate) {
  const records = data.reports[0].data.rows;
  const features = [];

  // If the record is in the future
  if (moment.max(endDate, moment()) === endDate) {
    console.error('You cannot create the future records.');
    return 1;
  }

  // If no records at all
  if (!records) {
    console.error(`Can not find ${endDate} record`);
    return 1;
  }

  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    const a = record.dimensions[1];
    const b = record.dimensions[0];
    const date = record.dimensions[2];
    const user = +record.metrics[0].values[0];

    const temp = {
      type: 'Feature',
      properties: {
        user,
        date,
      },
      geometry: {
        coordinates: [+a, +b],
        type: 'Point',
      },
    };

    features.push(temp);
  }

  const geojson = { features, type: 'FeatureCollection' };

  const text = JSON.stringify(geojson);

  // Output file
  const date = moment(endDate).format('2017-MM');
  fs.writeFile(`build/data/${date}.geojson`, text, (err) => {
    if (err) throw err;
    console.log(`Successfully created: build/data/${date}.geojson`);
  });

  return 0;
}

module.exports = createGeoJson;
