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

  var etherpadKey    = 'EVH6mE9T0LloynagajpPaXpRzPWKlUyJ';
  var etherpadHost   = 'http://localhost:9001';
  var etherpadAuthor = 'Michael';

  var url = etherpadHost   + '/api/1/createAuthorIfNotExistsFor?apikey=' +
            etherpadKey    + '&name=' +
            etherpadAuthor + 'Michael&authorMapper=7';

  var request = new XMLHttpRequest();
  request.open('GET', url, false); // false = not async
  request.send(null); // null = no body needed

  if (request.status == 200) {
    console.log(request.responseText)

    var response = eval('(' + request.responseText + ')');
    var author = response.data.authorID;
  };
  // {code: 0, message:"ok", data: {authorID: "a.s8oes9dhwrvt0zif"}}


  // http://pad.domain/api/1/createGroupIfNotExistsFor?apikey=secret&groupMapper=7
  var url = etherpadHost   + '/api/1/createGroupIfNotExistsFor?apikey=' +
            etherpadKey    + '&groupMapper=7';


  var request = new XMLHttpRequest();
  request.open('GET', url, false); // false = not async
  request.send(null); // null = no body needed

  if (request.status == 200) {
    console.log(request.responseText);

    var response = eval('(' + request.responseText + ')');
    var group = response.data.groupID;
  };
  // {code: 0, message:"ok", data: {groupID: "g.s8oes9dhwrvt0zif"}}



  // http://pad.domain/api/1/createGroupPad?apikey=secret&groupID=g.s8oes9dhwrvt0zif&padName=samplePad&text=This is the first sentence in the pad
  var content = 'Test content for etherpad.';
  var padName = 'samplePad-2';
  var url = etherpadHost + '/api/1/createGroupPad' +
            '?apikey='   + etherpadKey +
            '&groupID='  + group +
            '&padName='  + padName +
            '&text='     + content;


  // TODO: Handle duplicate pads - listPad first, or delete.
  var request = new XMLHttpRequest();
  request.open('GET', url, false); // false = not async
  request.send(null); // null = no body needed

  if (request.status == 200) {
    console.log('DEBUG1: ' + request.responseText)

    var response = eval('(' + request.responseText + ')');
    var pad = response.data.padID;
    console.log('DEBUG2: ' + pad);
  };

  // {code: 0, message:"ok", data: null}

  // http://pad.domain/api/1/createSession?apikey=secret&amp;groupID=g.s8oes9dhwrvt0zif&amp;authorID=a.s8oes9dhwrvt0zif&amp;validUntil=1312201246
  var expiry = '1328979927';
  var url = etherpadHost   + '/api/1/createSession' +
            '?apikey='     + etherpadKey +
            '&groupID='    + group +
            '&authorID='   + author +
            '&validUntil=' + expiry;

  var request = new XMLHttpRequest();
  request.open('GET', url, false); // false = not async
  request.send(null); // null = no body needed

  if (request.status == 200) {
    console.log(request.responseText)

    var response = eval('(' + request.responseText + ')');
    var session = response.data.sessionID;
  };

  // List pads.
  // http://pad.domain/api/1/listPads?apikey=secret&groupID=g.s8oes9dhwrvt0zif
  var url = etherpadHost   + '/api/1/listPads' +
            '?apikey='     + etherpadKey +
            '&groupID='    + group;

  var request = new XMLHttpRequest();
  request.open('GET', url, false); // false = not async
  request.send(null); // null = no body needed

  if (request.status == 200) {
    console.log(request.responseText)

    var response = eval('(' + request.responseText + ')');
    var pads = response.data.padIDs;
    console.log(pads);
    for (i = 0 ; i < pads.length ; i++) {
      console.log('Pads ' + i + ":" + pads[i]);
    };
  };


  document.cookie = 'sessionID=' + session;
  console.log(document.cookie);

  // {"data":{"sessionID": "s.s8oes9dhwrvt0zif"}}

  var etherpad = document.getElementById('etherpad');
  var padurl = etherpadHost + '/p/' + pad;
  etherpad.setAttribute('src', padurl);

};

window.onload = go;
