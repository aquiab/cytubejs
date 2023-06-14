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

const isDubsList = msg => msg && msg.includes('"updubs":') && msg.includes('"downdubs":')
const isMessageHidden = msg => msg === UPDUB_COMMAND || msg === DOWNDUB_COMMAND || isDubsList(msg)
const isVotingNotPossible = () => (($('#guestlogin').is(':visible') || $("#currenttitle").text() === NO_VIDEO_PLAYING))
const isNewUserLogin = (msg, user) => (user === SERVER_USER && msg.includes("joined"))
const shouldSendDubsMessage = () => $('#userlist').children().first().find("strong").text() === currentUser

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
	$(`span:contains(${UPDUB_COMMAND}), span:contains(${DOWNDUB_COMMAND}), 
	span:contains("updubs":), span:contains("downdubs":)`).parent().hide()
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
    handleStylingMessages(msg, user)
    if (!isVotingNotPossible()) handleDubbing(msg, user)
	if (isNewUserLogin(msg, user) && shouldSendDubsMessage()) sendMessage(`{
		"updubs": [${updubs.map(user => '"' + user + '"').join(',')}], 
		"downdubs": [${downdubs.map(user => '"' + user + '"').join(',')}]
	}`)
	if (isDubsList(msg) && user !== currentUser) {
		handleDubsJsonMessage(msg)
	}
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

function dub(user, dubs, oppositeDubs) {
	dubs.includes(user) ? 
		dubs.splice(dubs.indexOf(user), 1) : dubs.push(user)
	if (oppositeDubs.includes(user)) {
		oppositeDubs.splice(oppositeDubs.indexOf(user), 1)
	}
}

const updub = (user) => dub(user, updubs, downdubs)
const downdub = (user) => dub(user, downdubs, updubs)

function resetDubs() {
	updubs = []
	downdubs = []
	refreshDubs()
}

function refreshDubs() {
	$('#updubButton').toggleClass("pressed", updubs.includes(currentUser))
	$('#downdubButton').toggleClass("pressed", downdubs.includes(currentUser))
	$('#downdubButton').html(downdubs.length)
	$('#updubButton').html(updubs.length)
}

function handleDubbing(msg, user) {
	if (msg === UPDUB_COMMAND) updub(user)
	else if (msg === DOWNDUB_COMMAND) downdub(user)
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

function handleDubsJsonMessage(msg) {
	const dubsParsed = JSON.parse(msg)
	updubs = dubsParsed.updubs
	downdubs = dubsParsed.downdubs
	refreshDubs()
}

function enableOrDisableButtons() {
	$('#downdubButton').toggleClass("disabled", isVotingNotPossible())
	$('#updubButton').toggleClass("disabled", isVotingNotPossible())
}
