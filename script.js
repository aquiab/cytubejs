console.log('hola')
let updubs = 0
let downdubs = 0
$("#mainpage").append(`
  <div class="dubs-wrapper">
    <div id="updub" style="color: green;"> ${updubs} </div>
    <div id="downdub" style="color: red;"> ${downdubs} </div>
  </div>
`);
$('#updub').click(function() {
  updubs += 1
  $('#updub').html(updubs)
})
$('#downdub').click(function() {
  downdubs += 1
  $('#downdub').html(downdubs)
})