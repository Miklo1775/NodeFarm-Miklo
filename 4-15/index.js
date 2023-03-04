//fs module will give us access to writing and reading data to the file system
const fs = require("fs");
const http = require("http");
const url = require("url");
////////////////////////////////////////////////////////////////////////////
//Files

//reading files synchronously -- blocking
//starting from the root folder . and then moving into the txt folder /txt
//fs.readFileSync('folder/filePath', 'character encoding')
// const txtIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(txtIn);

// const txtOut = `This is what we know about the avocado ${txtIn}.\nCreated on ${Date.now()}`;

//here we are going to output our txtOut string to a new file called output.txt.
//syntax is: fs.writeFileSync("./path/filename.extension", WhateverWeWantInTheFile)
// fs.writeFileSync("./txt/output.txt", txtOut);
// console.log("File written!");

/* Synchronous vs Asynchronous Code (blocking vs non blocking */

//Synchronous:

//Synchronous is pretty much each statement being processed one after another.
//Can be a problem with long operations.
//Blocking code is that lines of code can't be executed until the previous line has been executed.

//Asynchronous:
//We offload code to to be processed in the background.
//We use a callback function is called to handle the result.
//During that time, the rest of the code can be ran with the heavier operation happening in the background.
//Non-blocking

//Asynchronous nature:
//A nodejs process: one single thread--or a set of instructions happening in the processor. The thread is where our code is executed in the CPU.
//Remember, nodejs is single threaded.
//Users are accessing the same thread.
//So in Synchronous, if one user is using the thread, the other users will have to wait until the current user is done using the thread.
//Our job as a developer to avoid these situations.

//Note on callback functions:
//Callback hell:
//when one callback function depends on the one before, and the one after depends on the one before, etc.
//The triangle shape indicates a problem.
//We can use promises or Async/Await to avoid this problem
// console.log("ASYNCHRONOUS WAY");
/* Reading and Writing Files Asynchronously NON-blocking */
//In async, we dont have to specify the character encoding. The second param will be use as the callback fn.
//the first param in the callback is the err, and the second is the data
//Below, we are reading the contents of the start.txt file which has the variable name of another file.
//That is then being used to read abother file which will then be outputted to the console.
//Below code also demonstrates how one function depends on the other function.
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR!");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written!");
//       });
//     });
//   });
// });

// console.log("Will read file!"); //this will console log first because node is reading the start.txt in the background.
//As we can see, it doesn't block any of the code

////////////////////////////////////////////////////////////////////////////
//SERVER

/* Creating a Simple Web Server */
//reading the file synchronously so that its not being read over and over in our event loopG

const replaceTemplate = (temp, product) => {
  let output = temp.replaceAll("{%PRODUCTNAME%}", product.productName);
  output = output.replaceAll("{%IMAGE%}", product.image);
  output = output.replaceAll("{%PRICE%}", product.price);
  output = output.replaceAll("{%FROM%}", product.from);
  output = output.replaceAll("{%NUTRIENTS%}", product.nutrients);
  output = output.replaceAll("{%QUANTITY%}", product.quantity);
  output = output.replaceAll("{%DESCRIPTION%}", product.description);
  output = output.replaceAll("{%ID%}", product.id);

  if (!product.organic) {
    output = output.replaceAll("{%NOT_ORGANIC%}", "not-organic");
  }
  return output;
};
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8",
  (err, data) => {}
);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8",
  (err, data) => {}
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8",
  (err, data) => {}
);

const data = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  "utf-8",
  (err, data) => {}
);
const dataObj = JSON.parse(data);

//createServer method takes to params: req, res
//So whenever a request hits this server, the callback will be executed.
const server = http.createServer((req, res) => {
  // console.log(req);//returns a huge object
  console.log(req.url);

  const pathName = req.url;
  /* ROUTING */
  //Basically means implementing different actions for different URLs

  if (pathName === "/" || pathName === "/overview") {
    //Overview Page
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHTML = dataObj
      .map((el) => {
        return replaceTemplate(tempCard, el);
      })
      .join("");
    const output = tempOverview.replaceAll("{%PRODUCT_CARDS%}", cardsHTML);
    console.log(cardsHTML);
    res.end(output);
    // res.end("hi");
  } else if (pathName === "/product") {
    //product page
    res.end("This is the product page.");
  } else if (pathName === "/api") {
    /* Simple API */
    //API Page
    //   //JSON.parse() converts the json into a javascript object
    //   const productData = JSON.parse(data);
    //   // console.log(productData);
    //   res.writeHead(200, { "Content-type": "application/json" });
    //   res.end(data);
    // });
    //specifying that we are sending back a json file
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    //Not Found Page
    //a http header is basically information about the response we are sending back.
    //headers must be sent out before the response
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
  // res.end("Hello from the server");
});

//.listen takes 2 params: (portNumber, hostaddress, callback)
//Code below is starting up the server and will be ready for incoming requests.
//the callback is optional and will be ran when the server is started.
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
