// TODO:
//
//   1/ Refactor "etherpadRequest" and "gistRequest" to "jsonRequest"?
//   2/ Instead of "var foo = function(arg) { ... } ;", use "function foo(arg) { ... };".
//

function gistCallback(response) {

  // TODO: These variables need to leave this scope.

  var meta = response.meta;
  var data = response.data;
  console.log('GitHub Callback: ' + meta);
  console.log('GitHub Callback: ' + data);
};


function gistContent(gistId) {

  // TODO: Return values here are a mess.  Needs error handling.

  var gitHubApiUrl   = 'https://api.github.com';
  var gitHubMimeType = 'application/json';

  // TODO: JSON-P callback seems unnecessary.
  // var gistUrl = gitHubApiUrl + '/gists/' + gistId + '?callback=gistCallback';

  var gistUrl = gitHubApiUrl + '/gists/' + gistId;

  var gitHubRequest = new XMLHttpRequest();

  gitHubRequest.open('GET', gistUrl, false);
  gitHubRequest.send(null);

  // Return the file content, or empty string if there was no file.
  // If the request status was not 200, return empty string.
  if (gitHubRequest.status == 200) {

    gist = eval('(' + gitHubRequest.responseText + ')');

    var content = '';
    for (var filename in gist.files) {
      // We can't know the name of the file in the gist, just take the first one.
      if (gist.files.hasOwnProperty(filename)) {
        content = gist.files[filename].content;
        // break for loop?
      };
    };
  };

  return content;

};


function etherpadRequest(url) {

  var request = new XMLHttpRequest();

  request.open('GET', url, false);     // false = not async
  request.send(null);                  // null  = no body needed

  console.log('Debug: ' + request.responseText);

  if (request.status == 200) {
    return eval('(' + request.responseText + ')');
  } else {
    return new Object;
  };

};


var createGistPad = function(gistId) {

  var padName    = gistId,                // Gist commit SHA1.
      padContent = gistContent(gistId);   // Gist commit content.

  var apiKey        = 'EVH6mE9T0LloynagajpPaXpRzPWKlUyJ',
      etherpadHost  = 'http://localhost:9001',
      authorName    = 'Michael',               // GitHub username?
      sessionExpiry = '1328979927',            // 1 day?

      // Gist commit content.
      // TODO: String properties cannot be accessed using dot-notation,
      //       e.g. DOES NOT WORK --> "data.files.'test-openssl.rb'.content
      //
      // padContent    = gistContent(gistId).data.files.'test-openssl.rb'.content,
      padContent    = escape(gistContent(gistId));

      // Gist commit SHA1. // TODO: Delete pads!
      padName       = gistId + Math.floor(Math.random() * 1000);

  // Create an author.  TODO: Check if exists.
  var url = etherpadHost + '/api/1/createAuthorIfNotExistsFor' +
            '?apikey='   + apiKey +
            '&name='     + authorName +
            '&authorMapper=7';

  // {code: 0, message:"ok", data: {authorID: "a.s8oes9dhwrvt0zif"}}
  var author = etherpadRequest(url).data.authorID;


  // Create a group.  TODO: Check if exists.
  var url = etherpadHost + '/api/1/createGroupIfNotExistsFor' +
            '?apikey='   + apiKey +
            '&groupMapper=7';

  // {code: 0, message:"ok", data: {groupID: "g.s8oes9dhwrvt0zif"}}
  var group = etherpadRequest(url).data.groupID;


  // Create the etherpad.  TODO: Check if exists.
  var url = etherpadHost + '/api/1/createGroupPad' +
            '?apikey='   + apiKey +
            '&groupID='  + group +
            '&padName='  + padName +
            '&text='     + padContent;

  // {code: 0, message:"ok", data: null}
  var pad = etherpadRequest(url).data.padID;


  // Create the session.  TODO: Check if exists?
  var url = etherpadHost   + '/api/1/createSession' +
            '?apikey='     + apiKey +
            '&groupID='    + group +
            '&authorID='   + author +
            '&validUntil=' + sessionExpiry;

  var session = etherpadRequest(url).data.sessionID;


  // Set the document cookie.
  document.cookie = 'sessionID=' + session;


  // Update the etherpad iframe to point to the new etherpad.
  var url = etherpadHost + '/p/' + pad;
  document.getElementById('etherpad').setAttribute('src', url);

}; // End createGistPad = function(gistId)


// Wire createGistPad() events to all gists.
var go = function() {

  //  gistImages = document.getElementsByClass('gist-paste');

  //  for (var img in gistImages) {
  //    img.onClick

  //  };

//  var gistId = '1718696';

}; // End go = function()

window.onload = go;
