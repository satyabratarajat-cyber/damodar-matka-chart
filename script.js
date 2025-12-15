const fs = require('fs');
const path = require('path');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);

  const filePath = path.join(process.cwd(), 'data.json');

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
