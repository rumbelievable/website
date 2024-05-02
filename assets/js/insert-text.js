var elementIdParam = document.getElementById("insert-text").getAttribute("elementId");
var filePathParam = document.getElementById("insert-text").getAttribute("filePath");
document.body.onload = addElement(elementIdParam, filePathParam);

// START - USE THIS ONCE APP IS LIVE ON WEB
function loadTextProd(filePath) {
    // If a file path is provided, fetch the text file
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(response);
        return response.text();
      })
}
// END - USE THIS ONCE APP IS LIVE ON WEB
function addElement(elementId, filePath) {
  const fs = require('fs');
  var filePath = "/Users/annierumbles/Desktop/projects/website_rumbelievable/txt/about.txt";

  let file_contents = fs.readFileSync(filePath);
  var text = file_contents.toString();

  const elem = document.getElementById(elementId);
  const data = document.createTextNode(text);

  elem.appendChild(data);
}
