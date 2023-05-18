var updubs = []
var downdubs = []
$("#mainpage").append(`
  <div class="dubs-wrapper">
    <div id="updub" style="color: green;"> ${updubs.length} </div>
    <div id="downdub" style="color: red;"> ${downdubs.length} </div>
  </div>
`)

$(document).ready(function() {
	$("#messagebuffer:contains('updub')").find("div").css("display", "none")
	$("#messagebuffer:contains('downdub')").find("div").css("display", "none")
});

$("body").on('DOMSubtreeModified', "#messagebuffer", function() {
	var lastMessageDiv = $("#messagebuffer").children().last()
	var lastMessageUser = lastMessageDiv.attr("class").split('-')[2]
	var lastMessageText = lastMessageDiv.children().last().html()
	if (lastMessageText === "updub") {
		updub(lastMessageUser)
		lastMessageDiv.css("display", "none");
	} else if (lastMessageText === "downdub") {
		downdub(lastMessageUser)
		lastMessageDiv.css("display", "none");
	} 
});

function updub(user) {
	console.log(user)
	updubs.includes(user) ? 
		updubs.splice(updubs.indexOf(user), 1) : updubs.push(user)
	downdubs.includes(user) && downdubs.splice(downdubs.indexOf(user), 1)
	$('#downdub').html(downdubs.length)
	$('#updub').html(updubs.length)
}
function downdub(user) {
	console.log(user)
	downdubs.includes(user) ? 
		downdubs.splice(downdubs.indexOf(user), 1) : downdubs.push(user)
	updubs.includes(user) && updubs.splice(updubs.indexOf(user), 1)
	$('#downdub').html(downdubs.length)
	$('#updub').html(updubs.length)
}

$('#updub').click(function () {
	$('#chatline').val('updub');
	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})
$('#downdub').click(function () {
	$('#chatline').val('downdub');
	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})