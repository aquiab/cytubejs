console.log('hola')
let updubs = 0
let downdubs = 0
$("#mainpage").append(`
  <div class="dubs-wrapper">
    <div id="updub" style="color: green;"> ${updubs} </div>
    <div id="downdub" style="color: red;"> ${downdubs} </div>
  </div>
`)
var ws = new WebSocket('wss://zip.cytu.be:8443/socket.io/?EIO=4&transport=websocket&sid=z-YAa_ZStSxSUgxTOcxS');
ws.onopen = function() {
  console.log('WebSocket connection established');
};
$('#updub').click(function() {
  updubs += 1
  $('#updub').html(updubs)
  var message = "dou";
  ws.send(message);
})
$('#downdub').click(function() {
  downdubs += 1
  $('#downdub').html(downdubs)
})