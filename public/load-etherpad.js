// TODO: debug() -> console.log with timestamp/prefix?
// TODO: Etherpad request() function: author, group, pad.
// TODO: Load gist (check for duplicate pads).
// TODO: JSON-P callback style.

var go = function(){

  // ----------------------- Add / delete text handling. ---------------------

  // Add function.
  var p_appender = function(s, e){

    p_counter += 1;

    var t = document.createTextNode(s);
    var p = document.createElement('p');

    p.setAttribute('id', 'auto-added-' + p_counter);
    p.appendChild(t);

    e.appendChild(p);

  };

  // Delete function.
  var p_deleter = function(){

    if ( p_counter == 0 ) {
      return;
    };

    var p = document.getElementById('auto-added-' + p_counter);
    p.parentNode.removeChild(p);
    p_counter -= 1;

  };

  // Add button.
  add = document.getElementById('add_p');
  add.onclick = (function(){
    p_appender(m, d);
  });

  // Delete button.
  del = document.getElementById('del_p');
  del.onclick = (function(){
    p_deleter();
  });

  // Initialize the global p counter, a string and container.
  var p_counter = 0;
  var m = 'Paragraph text from JavaScript.'
  var d = document.getElementById('p-container');

  // ----------------------- iFrame changes ---------------------

  // Wikipedia button.
  document.getElementById('wikipedia').onclick = (function(){
    document.getElementById('etherpad').setAttribute('src', 'http://www.wikipedia.org');
  });

  // Example.org button.
  document.getElementById('example-org').onclick = (function(){
    document.getElementById('etherpad').setAttribute('src', 'http://www.example.org');
  });

  // ----------------------- Etherpad changes ---------------------

  var etherpadRequest = function(url) {
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

  var apiKey       = 'EVH6mE9T0LloynagajpPaXpRzPWKlUyJ',
      etherpadHost = 'http://localhost:9001',
      authorName   = 'Michael',                     // GitHub username?
      padName      = 'samplePad-7',                 // Gist commit SHA1?
      padContent   = 'Test content for etherpad.',  // Gist commit content.
      sessionExpiry = '1328979927';                 // 1 day?

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


/*

  // Create a list of etherpads in this group.
  var url = etherpadHost   + '/api/1/listPads' +
            '?apikey='     + etherpadKey +
            '&groupID='    + group;

  var padIDs = etherpadRequest(url).data.padIDs;

*/


};

window.onload = go;
