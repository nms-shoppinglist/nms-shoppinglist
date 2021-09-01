var CLIENT_ID = '410548615107-mqq58336vm2fa1p4jnpqlrm41g8kc1nd.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAzkJfttP23KM-pryTqJEIqXqxg7Dlf_nk';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly"

  }).then(function() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;

  }, function(error) {
    console.log(JSON.stringify(error, null, 2));

  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listAllCrafting();

  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';

  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function tableRow(cells) {
  var table = document.getElementById('crafting');
  var tr = document.createElement("tr");

  while (cells.length > 0) {
    var td = document.createElement("td");
    td.innerHTML = cells.shift();
    tr.appendChild(td);
  }

  table.appendChild(tr);
}

function listAllCrafting() {
  var headings = ["<b>Item</b>", "<b>Value</b>"];
  tableRow(headings);

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1G78EQt5x8kOqEQDvBr-vU18vw3go2YpqjN9ej1GKjTc',
    range: 'crafting!A2:H',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      for (var i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        var cells = [row[0], row[1]];
        tableRpw(cells);
      }
    } else {
      console.error('No data found.');
    }
  }, function(response) {
    console.error('Error: ' + response.result.error.message);
  });
}
