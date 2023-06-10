let currentUser
let previousLastMessageUser
let previousLastMessageText
let lastVisibleUser
let updubs = []
let downdubs = []
const UPDUB_COMMAND = "UPDUB"
const DOWNDUB_COMMAND = "DOWNDUB"
const NO_VIDEO_PLAYING = "Nothing Playing"

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("leftcontrols").append(`
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
	$(`span:contains(${UPDUB_COMMAND}), span:contains(${DOWNDUB_COMMAND})`).parent().style.display = "none"
	if (document.getElementById("welcome").length) currentUser = document.getElementById("welcome").innerText.split(',')[1].trim()
	let lastMessageDiv = document.getElementById("messagebuffer").children().last()
	if (lastMessageDiv) {
		lastVisibleUser = lastMessageDiv.attr("class").split('-')[2]
	}
	enableOrDisableButtons()
});

document.getElementById("messagebuffer").addEventListener('DOMSubtreeModified', (e) => {
	let lastMessageDiv = document.getElementById("messagebuffer").children().last()
	let lastMessageUser = lastMessageDiv.attr("class").split('-')[2]
	let lastMessageText = lastMessageDiv.children().last().innerHTML

	let isChatMessage = lastMessageDiv.attr("class").split('-')[0] === "chat"
	if (!isChatMessage || document.getElementById("messagebuffer").children().length > 100) return
	
	if (lastVisibleUser !== lastMessageUser && 
		isMessageHidden(previousLastMessageText) && 
		previousLastMessageUser === lastMessageUser) {
		this.off('DOMSubtreeModified');
		$(`<span><strong class="username">${lastMessageUser}: </strong></span>`).insertAfter(lastMessageDiv.find(".timestamp"))
 		this.on('DOMSubtreeModified', arguments.callee);
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
			document.getElementById("updubButton").classList.toggle("pressed")
			document.getElementById("downdubButton").classList.remove("pressed")
		}
		updub(lastMessageUser)
	} else if (lastMessageText === DOWNDUB_COMMAND) {
		if (lastMessageUser === currentUser) {
			document.getElementById("downdubButton").classList.toggle("pressed")
			document.getElementById("updubButton").classList.remove("pressed")
		}
		downdub(lastMessageUser)
	}
});

document.getElementById("currenttitle").addEventListener('DOMSubtreeModified', (e) => {
	enableOrDisableButtons()
	resetDubs()
});

document.getElementById("updubButton").click(function () {
	if (document.getElementById("guestlogin").is(':visible') || document.getElementById("currenttitle").innerText === NO_VIDEO_PLAYING) return
	document.getElementById("chatline").value = UPDUB_COMMAND;
	let e = $.Event('keydown');
	e.keyCode = 13; 
	document.getElementById("chatline").trigger(e);
})
document.getElementById("downdubButton").click(function () {
	if (document.getElementById("guestlogin").is(':visible') || document.getElementById("currenttitle").innerText === NO_VIDEO_PLAYING) return
	document.getElementById("chatline").value = DOWNDUB_COMMAND;
	let e = $.Event('keydown');
	e.keyCode = 13; 
	document.getElementById("chatline").trigger(e);
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
	document.getElementById("downdubButton").classList.remove("pressed")
	document.getElementById("updubButton").classList.remove("pressed")
}

function refreshDubs() {
	document.getElementById("downdubButton").innerHTML = downdubs.length
	document.getElementById("updubButton").innerHTML = updubs.length
}

function enableOrDisableButtons() {
	if (document.getElementById("currenttitle").innerText === NO_VIDEO_PLAYING) {
		document.getElementById("downdubButton").classList.add("disabled")
		document.getElementById("updubButton").classList.add("disabled")
	} else {
		document.getElementById("downdubButton").classList.remove("disabled")
		document.getElementById("updubButton").classList.remove("disabled")
	}
}

const isMessageHidden = (message) => message === UPDUB_COMMAND || message === DOWNDUB_COMMAND