// TODO:
//
//   1/ Refactor "etherpadRequest" and "gistRequest" to "jsonRequest"?
//   2/ Handle GitHub being down..
//   3/ Handle collaboration ==> ??
//   4/ Clean out old etherpads ==> session expiry?
//   5/ Delete pads!
//   6/ username = GitHub username.
//   7/ Session expiration.
//   8/ escape() is non-standard (but widly adopted).  What to do?
//   9/ "use strict"; should be in a function which wraps the script.

"use strict";

function debugObject(object) {

  console.log('Debug Object: ' + typeof Object);

  // TODO: Recursion on objects.
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      console.log('Debug Object: (prop) ' + prop + ' = ' + object[prop]);
    }
  }

}

function gistCallback(response) {

  // TODO: These need to be available outside this scope.
  var meta = response.meta;
  var data = response.data;
}

function gistContent(gistId) {

  // TODO: Return values here need error handling.

  var gitHubApiUrl   = 'https://api.github.com';
  var gitHubMimeType = 'application/json';

  var gistUrl = gitHubApiUrl + '/gists/' + gistId;

  var gitHubRequest = new XMLHttpRequest();

  gitHubRequest.open('GET', gistUrl, false);
  gitHubRequest.send(null);

  // Return the file content; empty string if there was no file or request failed.
  var content = '';

  if (gitHubRequest.status === 200) {

    var gist = JSON.parse(gitHubRequest.responseText); // eval('(' + gitHubRequest.responseText + ')');

    // We can't know the name of the file(s) in the gist, so use the first one.
    for (var filename in gist.files) {

      if (gist.files.hasOwnProperty(filename)) {
        content = gist.files[filename].content;
        break; // Break because we want the first element.
      }

    }
  }

  return content;

}

function etherpadRequest(url) {
  // Returns an object, eval'd from the response JSON.

  var request = new XMLHttpRequest();

  request.open('GET', url, false);     // false = not async
  request.send(null);                  // null  = no body needed

  if (request.status === 200) {
    return JSON.parse(request.responseText); // eval('(' + request.responseText + ')');
  } else {
    return {}; // new Object();
  }

}

function createGroupPad(group, padName, padContent) {

  //  TODO: Set etherpad code content type for syntax highlighting.

  var url = etherpadHost + '/api/1/createGroupPad' +
            '?apikey='   + apiKey +
            '&groupID='  + group +
            '&padName='  + padName +
            '&text='     + padContent;

  var pad = etherpadRequest(url);

  if (pad.code === 0 && pad.message === 'ok') {

    return pad.data.padID;        // Pad created. TODO: API says this should be null!

  } else if (pad.code === 1 && pad.message === 'padName does already exist') {

    return group + '$' + padName; // Pad exists. API says name format is 'GROUPID$PADNAME'.

  } else {

    return null;
  }

}

function createAuthor(authorName) {

  // TODO: Check if author exists.

  var url = etherpadHost + '/api/1/createAuthorIfNotExistsFor' +
            '?apikey='   + apiKey +
            '&name='     + authorName +
            '&authorMapper=7';

  return etherpadRequest(url).data.authorID;

}

function createGroup() {

  // TODO: Check if group exists.

  var url = etherpadHost + '/api/1/createGroupIfNotExistsFor' +
            '?apikey='   + apiKey +
            '&groupMapper=7';

  return etherpadRequest(url).data.groupID;

}

function createSession(group, author, expiry) {

  // TODO: Check if the session exists?

  var url = etherpadHost   + '/api/1/createSession' +
            '?apikey='     + apiKey +
            '&groupID='    + group +
            '&authorID='   + author +
            '&validUntil=' + sessionExpiry;

  return etherpadRequest(url).data.sessionID;

}

function createGistPad(gistId) {

  var padName    = gistId,                       // Gist commit SHA1.
      padContent = escape(gistContent(gistId)),  // Gist content, escaped.

      author     = createAuthor(authorName),
      group      = createGroup(),
      groupPad   = createGroupPad(group, padName, padContent),
      session    = createSession(group, author, sessionExpiry);

  // Set the document cookie.
  document.cookie = 'sessionID=' + session;

  var url = etherpadHost + '/p/' + groupPad;

  // Update the etherpad iframe to point to the new etherpad.
  document.getElementById('etherpad').setAttribute('src', url);

  // Update the document with a dedicated link.
  var a = document.createElement('a');
  a.setAttribute('href', url);
  a.innerText = url;

  document.getElementById('etherpad-link').appendChild(a);
}

var apiKey        = 'EVH6mE9T0LloynagajpPaXpRzPWKlUyJ',
    etherpadHost  = 'http://localhost:9001',
    authorName    = 'Michael',
    sessionExpiry = '1328979927';


// use strict
