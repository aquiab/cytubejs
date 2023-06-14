var currentUser
var previousLastMessageUser
var previousLastMessageText
var lastVisibleUser
var updubs = []
var downdubs = []
const UPDUB_COMMAND = "UPDUB"
const DOWNDUB_COMMAND = "DOWNDUB"
const NO_VIDEO_PLAYING = "Nothing Playing"

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

socket.on("chatMsg", ({ msg, username }) => {
	console.log(msg)
	console.log(username)
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
}) 

$("#messagebuffer").on('DOMSubtreeModified', function(e) {
	if(e.target.id !== "#messagebuffer") return
	var lastMessageDiv = $("#messagebuffer").children().last()
	var lastMessageUser = lastMessageDiv.attr("class").split('-')[2]
	var lastMessageText = lastMessageDiv.children().last().html()

	var isChatMessage = lastMessageDiv.attr("class").split('-')[0] === "chat"
	if (!isChatMessage || $("#messagebuffer").children().length > 100) return
	
	if (lastVisibleUser !== lastMessageUser && 
		isMessageHidden(previousLastMessageText) && 
		previousLastMessageUser === lastMessageUser) {
		$(this).off('DOMSubtreeModified');
		$(`<span><strong class="username">${lastMessageUser}: </strong></span>`).insertAfter(lastMessageDiv.find(".timestamp"))
 		$(this).on('DOMSubtreeModified', arguments.callee);
	} else if (lastVisibleUser === lastMessageUser && 
			   isMessageHidden(previousLastMessageText) && 
			  previousLastMessageUser !== lastMessageUser) {
		lastMessageDiv.find(".username").css("display", "none");
	}
	previousLastMessageUser = lastMessageUser
	previousLastMessageText = lastMessageText

	if (isMessageHidden(lastMessageText)) lastMessageDiv.css("display", "none")
	else lastVisibleUser = lastMessageUser

	if (lastMessageText === UPDUB_COMMAND) {
		if (lastMessageUser === currentUser) {
			$('#updubButton').toggleClass("pressed")
			$('#downdubButton').removeClass("pressed")
		}
		updub(lastMessageUser)
	} else if (lastMessageText === DOWNDUB_COMMAND) {
		if (lastMessageUser === currentUser) {
			$('#downdubButton').toggleClass("pressed")
			$('#updubButton').removeClass("pressed")
		}
		downdub(lastMessageUser)
	}
});

$("#currenttitle").on('DOMSubtreeModified', function() {
	enableOrDisableButtons()
	resetDubs()
});

$('#updubButton').click(function () {
	if ($('#guestlogin').is(':visible') || $("#currenttitle").text() === NO_VIDEO_PLAYING) return
	$('#chatline').val(UPDUB_COMMAND);
	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})
$('#downdubButton').click(function () {
	if ($('#guestlogin').is(':visible') || $("#currenttitle").text() === NO_VIDEO_PLAYING) return
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

function enableOrDisableButtons() {
	if ($("#currenttitle").text() === NO_VIDEO_PLAYING) {
		$('#downdubButton').addClass("disabled")
		$('#updubButton').addClass("disabled")
	} else {
		$('#downdubButton').removeClass("disabled")
		$('#updubButton').removeClass("disabled")
	}
}

const isMessageHidden = (message) => message === UPDUB_COMMAND || message === DOWNDUB_COMMAND