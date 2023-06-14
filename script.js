var currentUser
var previousLastMessageUser
var previousLastMessageText
var lastVisibleUser
var updubs = []
var downdubs = []
const UPDUB_COMMAND = "UPDUB"
const DOWNDUB_COMMAND = "DOWNDUB"
const NO_VIDEO_PLAYING = "Nothing Playing"
const SERVER_USER = "[server]"

const isMessageHidden = (msg) => msg === UPDUB_COMMAND || msg === DOWNDUB_COMMAND
const isVotingNotPossible = () => (($('#guestlogin').is(':visible') || $("#currenttitle").text() === NO_VIDEO_PLAYING))
const isNewUserLogin = (msg, user) => (user === SERVER_USER && msg.includes("joined"))

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
    enableOrDisableButtons()
})

socket.on("chatMsg", ({ msg, username: user }) => {
	console.log(msg)
	console.log(user)
    handleStylingMessages(msg, user)
    if (!isVotingNotPossible()) handleDubbing(msg, user)
	if (isNewUserLogin(msg, user)) sendMessage(updubs)
})

socket.on("changeMedia", () => {
    enableOrDisableButtons()
	resetDubs()
})

$('#updubButton').click(() => sendMessage(UPDUB_COMMAND))
$('#downdubButton').click(() => sendMessage(DOWNDUB_COMMAND))

function sendMessage(msg) {
	$('#chatline').val(msg);
	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
}

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

function handleDubbing(msg, user) {
	if (msg === UPDUB_COMMAND) {
		if (user === currentUser) {
			$('#updubButton').toggleClass("pressed")
			$('#downdubButton').removeClass("pressed")
		}
		updub(user)
	} else if (msg === DOWNDUB_COMMAND) {
		if (user === currentUser) {
			$('#downdubButton').toggleClass("pressed")
			$('#updubButton').removeClass("pressed")
		}
		downdub(user)
	}
    refreshDubs()
}

function handleStylingMessages(msg, user) {
	var lastMessageDiv = $("#messagebuffer").children().last()

	if (lastVisibleUser !== user && 
		isMessageHidden(previousLastMessageText) && 
		previousLastMessageUser === user) {
		$(`<span><strong class="username">${user}: </strong></span>`).insertAfter(lastMessageDiv.find(".timestamp"))
	} else if (lastVisibleUser === user && 
			   isMessageHidden(previousLastMessageText) && 
			  previousLastMessageUser !== user) {
		lastMessageDiv.find(".username").css("display", "none");
	}
	previousLastMessageUser = user
	previousLastMessageText = msg

	if (isMessageHidden(msg)) lastMessageDiv.css("display", "none")
	else lastVisibleUser = user
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
