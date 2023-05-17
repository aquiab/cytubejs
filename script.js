console.log('hola')
let updubs = 0
let downdubs = 0
$("#mainpage").append(`
  <div class="dubs-wrapper">
    <div id="updub" style="color: green;"> ${updubs} </div>
    <div id="downdub" style="color: red;"> ${downdubs} </div>
  </div>
`);
$('#updub').attr('onclick', () => { updubs += 1 });
$('#downdub').attr('onclick', () => { downdubs += 1 });