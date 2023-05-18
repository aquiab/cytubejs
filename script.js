var currentUser
var previousLastMessageUser
var updubs = []
var downdubs = []
const UPDUB_COMMAND = "UPDUB"
const DOWNDUB_COMMAND = "DOWNDUB"

$(document).ready(function() {
	$(`span:contains(${UPDUB_COMMAND}), span:contains(${DOWNDUB_COMMAND})`).parent().hide()
	if ($('#welcome').length) currentUser = $("#welcome").text().split(',')[1].trim()
	
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
	console.log(`lastMessageUser: ${lastMessageUser}`)
	console.log(`previousLastMessageUser: ${previousLastMessageUser}`)
	if (previousLastMessageUser === lastMessageUser) {
		lastMessageDiv.append(`<span><strong class="username">${lastMessageUser}: </strong></span>`)
	}
	previousLastMessageUser = lastMessageUser

	if (lastMessageText === UPDUB_COMMAND) {
		console.log(`lastMessageUser: ${lastMessageUser}`)
		console.log(`currentUser: ${currentUser}`)
		if (lastMessageUser === currentUser) {
			$('#updubButton').toggleClass("pressed")
			$('#downdubButton').removeClass("pressed")
		}
		updub(lastMessageUser)
		lastMessageDiv.css("display", "none");
	} else if (lastMessageText === DOWNDUB_COMMAND) {
		console.log(`lastMessageUser: ${lastMessageUser}`)
		console.log(`currentUser: ${currentUser}`)
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
	$('#chatline').val(UPDUB_COMMAND);
	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})
$('#downdubButton').click(function () {
	if ($('#guestlogin').is(':visible')) return
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
