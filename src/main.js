import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Sortable from 'sortablejs';
import './styles.css';

// This is checking if the page has loaded or not, then will call the the full video gallery
if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
  fullVideoGallery();
} else {
  document.addEventListener('DOMContentLoaded', fullVideoGallery);
}

function fullVideoGallery() {
  let resp;
  let status;
  let vidArr = [];
  // This is getting a channel ID
  let channelId = document.getElementById('vimeoshowcaseId').value;
  // Async function to call Vimeo API to get video response.
  (async () => {
    let url = `https://api.vimeo.com/me/albums/${channelId}/videos`;

    resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.ACCESS_TOKEN
      }
    }).then(
      function (response) {
        status = response.status; //=> number 100–599
        response.statusText; //=> String
        response.headers; //=> Headers
        response.url; //=> String

        return response.json();
      },
      function (error) {
        error.message; //=> String
      }
    );
    // We call get select after we get a status 200 response.
    getSelect();
  })();

  
  // This is the function that displays everything you see on the HTML.
  function getSelect() {
    // We check to see if we have a good response status
    if (status == '200') {
      // We set count to 0
      let count = 0;
      // While count is less then the length of the response keep running the loop.
      while (count < resp.total) {
        // If count is odd push response data to vidArr and get localID
        resp.data[count]['localId'] = count;
        vidArr.push(resp.data[count]);
        count++;
      }
      // We are declaring where we want to output the HTML down below.
      let o = document.getElementById('output');
      // This is where we write the HTML for the page.
      o.innerHTML += `<div class="container">
                          <div class="col-md-4">
                            <ul id="playlist" class="list-group" ondrop="drop(event)" ondragover="allowDrop(event)"></ul>
                          </div>
                      </div>`;

      //Variable to declare output to html
      let outputOne = document.getElementById('playlist');

      // We then repeat for the other Video Arrays
      if (vidArr.length > 0) {
        vidArr.forEach((a) => {
          outputOne.innerHTML += `<li class="list-group-item" ondragstart="drag(event)" draggable="true">${a.name}</li>`;
        });
      }
    }
  }
}
