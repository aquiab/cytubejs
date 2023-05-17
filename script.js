let updubs = 0
let downdubs = 0
$("#mainpage").append(`
  <div class="dubs-wrapper">
    <div id="updub" style="color: green;"> ${updubs} </div>
    <div id="downdub" style="color: red;"> ${downdubs} </div>
  </div>
`);
$('#updub').click(function () {
	updubs += 1
	$('#chatline').val('updub');
	$('#updub').html(updubs)

	var e = $.Event('keydown');
	e.keyCode = 13; // Enter key
	$('#chatline').trigger(e);
})
$('#downdub').click(function () {
	downdubs += 1
	$('#downdub').html(downdubs)
})