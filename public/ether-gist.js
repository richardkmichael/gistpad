// TODO:
//
//   1/ Refactor "etherpadRequest" and "gistRequest" to "jsonRequest"?
//   3/ Handle GitHub being down..
//   4/ Handle collaboration ==> ??
//   5/ Clean out old etherpads ==> session expiry?
//   6/ Delete pads!

function debugObject(object) {
  console.log('Debug Object: ' + typeof Object);
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      console.log('Debug Object: (prop) ' + prop + ' = ' + object[prop]);
    };
  };
};

function gistCallback(response) {

  // TODO: These variables need to leave this scope.
  var meta = response.meta;
  var data = response.data;
};

function gistContent(gistId) {

  // TODO: Return values here need error handling.

  var gitHubApiUrl   = 'https://api.github.com';
  var gitHubMimeType = 'application/json';

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
        break; // Break because we want the first element.
      };
    };
  };

  console.debug('In gistContent');
  console.debug('In gistContent: ' + content);
  return content;

};

function etherpadRequest(url) {
  // Returns an object, eval'd from the response JSON.

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

function createGroupPad(group, padName, padContent) {
  //  TODO: Set etherpad code content type for syntax highlighting.

  var url = etherpadHost + '/api/1/createGroupPad' +
            '?apikey='   + apiKey +
            '&groupID='  + group +
            '&padName='  + padName +
            '&text='     + padContent;

  // {code: 0, message:"ok", data: null}
  // var pad = etherpadRequest(url).data.padID;
  var pad = etherpadRequest(url);
  debugObject(pad); // DEBUG.


  if (pad.code == 0 && pad.message == 'ok') {

    return pad.data.padID;        // Pad was created. TODO: API says this should be null.

  } else if (pad.code == 1 && pad.message == 'padName does already exist') {

    return group + '$' + padName;  // Pad already exists. API says name format is 'GROUPID$PADNAME'.
    // return padName;             // Pad already exists. API says name format is 'GROUPID$PADNAME'.

  } else {

    return null;
  };

};

function createAuthor(authorName) {

  // Create an author.  TODO: Check if exists.
  var url = etherpadHost + '/api/1/createAuthorIfNotExistsFor' +
            '?apikey='   + apiKey +
            '&name='     + authorName +
            '&authorMapper=7';

  // {code: 0, message:"ok", data: {authorID: "a.s8oes9dhwrvt0zif"}}
  // var author = etherpadRequest(url).data.authorID;
  return etherpadRequest(url).data.authorID;

};

function createGroup() {

  // Create a group.  TODO: Check if exists.
  var url = etherpadHost + '/api/1/createGroupIfNotExistsFor' +
            '?apikey='   + apiKey +
            '&groupMapper=7';

  // {code: 0, message:"ok", data: {groupID: "g.s8oes9dhwrvt0zif"}}
  // var group = etherpadRequest(url).data.groupID;
  return etherpadRequest(url).data.groupID;
};

function createSession(group, author, expiry) {

  // Create the session.  TODO: Check if exists?
  var url = etherpadHost   + '/api/1/createSession' +
            '?apikey='     + apiKey +
            '&groupID='    + group +
            '&authorID='   + author +
            '&validUntil=' + sessionExpiry;

  // var session = etherpadRequest(url).data.sessionID;
  return etherpadRequest(url).data.sessionID;
};

function createGistPad(gistId) {

  var padName    = gistId,                       // Gist commit SHA1.
      padContent = escape(gistContent(gistId)),  // Gist content, escaped.
      author     = createAuthor(authorName),
      group      = createGroup(),
      groupPad   = createGroupPad(group, padName, padContent),
      session    = createSession(group, author, sessionExpiry);

  // Set the document cookie.
  document.cookie = 'sessionID=' + session;

  // Update the etherpad iframe to point to the new etherpad.
  var url = etherpadHost + '/p/' + groupPad;
  document.getElementById('etherpad').setAttribute('src', url);

}; // End createGistPad = function(gistId)

var apiKey        = 'EVH6mE9T0LloynagajpPaXpRzPWKlUyJ',
    etherpadHost  = 'http://localhost:9001',
    authorName    = 'Michael',               // TODO: GitHub username?
    sessionExpiry = '1328979927';            // 1 day?
