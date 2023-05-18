var currentUser
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
		if (lastMessageUser === currentUser) {
			$('#updubButton').toggleClass("pressed")
			$('#downdubButton').removeClass("pressed")
		}
		updub(lastMessageUser)
		lastMessageDiv.css("display", "none");
	} else if (lastMessageText === DOWNDUB_COMMAND) {
		if (lastMessageUser === currentUser) {
			$('#downdubButton').toggleClass("pressed")
			$('#updubButton').removeClass("pressed")
		}
		downdub(lastMessageUser)
		lastMessageDiv.css("display", "none");
	} 
});

$("#currenttitle").on('DOMSubtreeModified', function() {
	resetDubs()
});

$('#updubButton').click(function () {
	if ($('#guestlogin').is(':visible')) return
	if (!currentUser) setCurrentUser()
	$('#chatline').val(UPDUB_COMMAND);
	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})
$('#downdubButton').click(function () {
	if ($('#guestlogin').is(':visible')) return
	if (!currentUser) setCurrentUser()
	$('#chatline').val(DOWNDUB_COMMAND);
	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})

function setCurrentUser() {
	var lastMessageDiv = $("#messagebuffer").children().last()
	currentUser = lastMessageDiv.attr("class").split('-')[2]
}

function updub(user) {
	updubs.includes(user) ? 
		updubs.splice(updubs.indexOf(user), 1) : updubs.push(user)
	if (downdubs.includes(user)) {
		downdubs.splice(downdubs.indexOf(user), 1)
	}
	refreshDubs()
}
function downdub(user) {
	downdubs.includes(user) ? 
		downdubs.splice(downdubs.indexOf(user), 1) : downdubs.push(user)
	if (updubs.includes(user)) {
		updubs.splice(updubs.indexOf(user), 1)
	}
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
