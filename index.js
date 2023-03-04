//fs module will give us access to writing and reading data to the file system
const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');
////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////
//SERVER

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8',
  (err, data) => {}
);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8',
  (err, data) => {}
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8',
  (err, data) => {}
);

const data = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  'utf-8',
  (err, data) => {}
);
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

console.log(slugs);

console.log(slugify('Fresh Avocados', { lower: true }));

const server = http.createServer((req, res) => {
  // console.log(req);//returns a huge object
  const { query, pathname } = url.parse(req.url, true);

  /* ROUTING */

  if (pathname === '/' || pathname === '/overview') {
    //Overview Page
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHTML = dataObj
      .map((el) => {
        return replaceTemplate(tempCard, el);
      })
      .join('');
    const output = tempOverview.replaceAll('{%PRODUCT_CARDS%}', cardsHTML);
    res.end(output);
    // res.end("hi");
  } else if (pathname === '/product') {
    //product page
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  } else if (pathname === '/api') {
    //specifying that we are sending back a json file
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  } else {
    //Not Found Page

    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
  // res.end("Hello from the server");
});

//.listen takes 2 params: (portNumber, hostaddress, callback)

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
