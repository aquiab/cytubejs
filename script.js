var updubs = []
var downdubs = []
var currentUser = $('#welcome').html().split(',')[1]
$("#mainpage").append(`
  <div class="dubs-wrapper">
    <div id="updub" style="color: green;"> ${updubs.length} </div>
    <div id="downdub" style="color: red;"> ${downdubs.length} </div>
  </div>
`)

$("body").on('DOMSubtreeModified', "#messagebuffer", function() {
	var lastMessageDiv = $("#messagebuffer").children().last()
	var lastMessageUser = lastMessageDiv.attr("class").split('-')[2]
	var lastMessageText = lastMessageDiv.children().last().html()
	if (lastMessageText === "updub") updub(lastMessageUser)
	else if (lastMessageText === "downdub") downdub(lastMessageUser)
});

function updub(user) {
	console.log(user)
	updubs.includes(user) ? 
		updubs.splice(updubs.indexOf(user), 1) : updubs.push(user)
	downdubs.includes(user) && downdubs.splice(downdubs.indexOf(user), 1)
}
function downdub(user) {
	console.log(user)
	downdubs.includes(user) ? 
		downdubs.splice(downdubs.indexOf(user), 1) : downdubs.push(user)
	updubs.includes(user) && updubs.splice(updubs.indexOf(user), 1)
}

$('#updub').click(function () {
	$('#chatline').val('updub');
	$('#updub').html(updubs.length)
	$('#downdub').html(downdubs.length)
	

	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})
$('#downdub').click(function () {
	$('#chatline').val('downdub');
	$('#downdub').html(downdubs.length)
	$('#updub').html(updubs.length)

	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})