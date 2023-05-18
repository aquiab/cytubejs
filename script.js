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
    console.log($("#messagebuffer").last())
});

function updub() {
	updubs.includes(currentUser) ? 
		updubs.splice(updubs.indexOf(currentUser), 1) : updubs.push(currentUser)
	downdubs.includes(currentUser) && downdubs.splice(downdubs.indexOf(currentUser), 1)
}
function downdub() {
	downdubs.includes(currentUser) ? 
		downdubs.splice(downdubs.indexOf(currentUser), 1) : downdubs.push(currentUser)
	updubs.includes(currentUser) && updubs.splice(updubs.indexOf(currentUser), 1)
}

$('#updub').click(function () {
	updub()
	$('#chatline').val('updub');
	$('#updub').html(updubs.length)
	$('#downdub').html(downdubs.length)
	

	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})
$('#downdub').click(function () {
	downdub()
	$('#chatline').val('downdub');
	$('#downdub').html(downdubs.length)
	$('#updub').html(updubs.length)

	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})