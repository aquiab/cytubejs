var updubs = []
var downdubs = []
var currentUser = $('#welcome').html().split(',')[1]
$("#mainpage").append(`
  <div class="dubs-wrapper">
    <div id="updub" style="color: green;"> ${updubs} </div>
    <div id="downdub" style="color: red;"> ${downdubs} </div>
  </div>
`);

function vote() {
	updubs.includes(currentUser) ? 
		updubs.splice(updubs.indexOf(currentUser), 1) : updubs.push(currentUser)

}

$('#updub').click(function () {
	vote()
	$('#chatline').val('updub');
	$('#updub').html(updubs.length)

	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})
$('#downdub').click(function () {
	$('#downdub').html(downdubs)
})