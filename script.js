var updubs = []
var downdubs = []
const UPDUB_COMMAND = "UPDUB"
const DOWNDUB_COMMAND = "DOWNDUB"

$(document).ready(function() {
	$(`span:contains(${UPDUB_COMMAND}), span:contains(${DOWNDUB_COMMAND})`).parent().hide();
});

$("#leftcontrols").append(`
  <span class="dubs-wrapper">
    <div class="dub-button btn btn-sm btn-default" id="updubButton"> 
		${updubs.length} 
	</div>
    <div class="dub-button btn btn-sm btn-default" id="downdubButton"> 
		${downdubs.length} 
	</div>
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

$('#updubButton').click(function () {
	$('#chatline').val(UPDUB_COMMAND);
	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})
$('#downdubButton').click(function () {
	$('#chatline').val(DOWNDUB_COMMAND);
	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})

function updub(user) {
	updubs.includes(user) ? 
		updubs.splice(updubs.indexOf(user), 1) : updubs.push(user)
	if (downdubs.includes(user)) {
		downdubs.splice(downdubs.indexOf(user), 1)
		$('#downdubButton').toggleClass("pressed")
	}
	$('#updubButton').toggleClass("pressed")
	refreshDubs()
}
function downdub(user) {
	downdubs.includes(user) ? 
		downdubs.splice(downdubs.indexOf(user), 1) : downdubs.push(user)
	if (updubs.includes(user)) {
		updubs.splice(updubs.indexOf(user), 1)
		$('#updubButton').toggleClass("pressed")
	}
	$('#downdubButton').toggleClass("pressed")
	refreshDubs()
}

function resetDubs() {
	updubs = []
	downdubs = []
	refreshDubs()
	$('#downdubButton').removeClass("pressed")
	$('#updubButton').removeClass("pressed")
}

function refreshDubs() {
	$('#downdubButton').html(downdubs.length)
	$('#updubButton').html(updubs.length)

}
