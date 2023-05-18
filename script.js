var updubs = []
var downdubs = []
const UPDUB_COMMAND = "UPDUB"
const DOWNDUB_COMMAND = "DOWNDUB"

$(document).ready(function() {
	$(`span:contains(${UPDUB_COMMAND}), span:contains(${DOWNDUB_COMMAND})`).parent().hide();
});

$("#mainpage").append(`
  <div class="dubs-wrapper">
    <div id="updub" style="color: green;"> ${updubs.length} </div>
    <div id="downdub" style="color: red;"> ${downdubs.length} </div>
  </div>
`)

$("#messagebuffer").on('DOMSubtreeModified', function() {
	var lastMessageDiv = $("#messagebuffer").children().last()
	var lastMessageUser = lastMessageDiv.attr("class").split('-')[2]
	var lastMessageText = lastMessageDiv.children().last().html()
	if (lastMessageText === UPDUB_COMMAND) {
		updub(lastMessageUser)
		lastMessageDiv.css("display", "none");
	} else if (lastMessageText === DOWNDUB_COMMAND) {
		downdub(lastMessageUser)
		lastMessageDiv.css("display", "none");
	} 
});

$("#currenttitle").on('DOMSubtreeModified', function() {
	resetDubs()
});

$('#updub').click(function () {
	$('#chatline').val(UPDUB_COMMAND);
	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})
$('#downdub').click(function () {
	$('#chatline').val(DOWNDUB_COMMAND);
	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})

function updub(user) {
	updubs.includes(user) ? 
		updubs.splice(updubs.indexOf(user), 1) : updubs.push(user)
	downdubs.includes(user) && downdubs.splice(downdubs.indexOf(user), 1)
	refreshDubs()
}
function downdub(user) {
	downdubs.includes(user) ? 
		downdubs.splice(downdubs.indexOf(user), 1) : downdubs.push(user)
	updubs.includes(user) && updubs.splice(updubs.indexOf(user), 1)
	refreshDubs()
}

function resetDubs() {
	updubs = []
	downdubs = []
	refreshDubs()
}

function refreshDubs() {
	$('#downdub').html(downdubs.length)
	$('#updub').html(updubs.length)
}
