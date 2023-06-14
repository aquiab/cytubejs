var currentUser
var previousLastMessageUser
var previousLastMessageText
var lastVisibleUser
var updubs = []
var downdubs = []
const UPDUB_COMMAND = "UPDUB"
const DOWNDUB_COMMAND = "DOWNDUB"
const NO_VIDEO_PLAYING = "Nothing Playing"

const isMessageHidden = (message) => message === UPDUB_COMMAND || message === DOWNDUB_COMMAND
const isVotingNotPossible = () => (($('#guestlogin').is(':visible') || $("#currenttitle").text() === NO_VIDEO_PLAYING))

$(document).ready(function() {
	$("#leftcontrols").append(`
  	<span class="dubs-wrapper">
    	<div class="dub-button btn btn-sm btn-default" id="updubButton"> 
			${updubs.length} 
		</div>
    	<div class="dub-button btn btn-sm btn-default" id="downdubButton"> 
			${downdubs.length} 
		</div>
  	</div>
  	</span>
	`)
	$(`span:contains(${UPDUB_COMMAND}), span:contains(${DOWNDUB_COMMAND})`).parent().hide()
    if ($('#welcome').length) currentUser = $("#welcome").text().split(',')[1].trim()
	var lastMessageDiv = $("#messagebuffer").children().last()
	if (lastMessageDiv) {
		lastVisibleUser = lastMessageDiv.attr("class").split('-')[2]
	}
	enableOrDisableButtons()
});

socket.on("login", ({ success, name }) => {
	if (success) currentUser = name
})

socket.on("chatMsg", ({ msg, username }) => {
	console.log(msg)
	console.log(username)
    handleStylingMessages(msg, username)
    if (!isVotingNotPossible()) handleDubbing(msg, username)
})

socket.on("changeMedia", () => {
    enableOrDisableButtons()
	resetDubs()
})

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
	}
}
function downdub(user) {
	downdubs.includes(user) ? 
		downdubs.splice(downdubs.indexOf(user), 1) : downdubs.push(user)
	if (updubs.includes(user)) {
		updubs.splice(updubs.indexOf(user), 1)
	}
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

function handleDubbing(msg, username) {
	if (msg === UPDUB_COMMAND) {
		if (username === currentUser) {
			$('#updubButton').toggleClass("pressed")
			$('#downdubButton').removeClass("pressed")
		}
		updub(username)
	} else if (msg === DOWNDUB_COMMAND) {
		if (username === currentUser) {
			$('#downdubButton').toggleClass("pressed")
			$('#updubButton').removeClass("pressed")
		}
		downdub(username)
	}
    refreshDubs()
}

function handleStylingMessages(msg, username) {
	var lastMessageDiv = $("#messagebuffer").children().last()

	if (lastVisibleUser !== username && 
		isMessageHidden(previousLastMessageText) && 
		previousLastMessageUser === username) {
		$(`<span><strong class="username">${username}: </strong></span>`).insertAfter(lastMessageDiv.find(".timestamp"))
	} else if (lastVisibleUser === username && 
			   isMessageHidden(previousLastMessageText) && 
			  previousLastMessageUser !== username) {
		lastMessageDiv.find(".username").css("display", "none");
	}
	previousLastMessageUser = username
	previousLastMessageText = msg

	if (isMessageHidden(msg)) lastMessageDiv.css("display", "none")
	else lastVisibleUser = username
}

function enableOrDisableButtons() {
	if (isVotingNotPossible()) {
		$('#downdubButton').addClass("disabled")
		$('#updubButton').addClass("disabled")
	} else {
		$('#downdubButton').removeClass("disabled")
		$('#updubButton').removeClass("disabled")
	}
}
