console.log('hola')
const mainpage = document.getElementById("mainpage")
const dubsDiv = document.createElement('div')
const upDubsButton = document.createElement('div')
const downDubsButton = document.createElement('div')
upDubsButton.innerHTML += '1'
downDubsButton.innerHTML += '1'

upDubsButton.style.backgroundColor = 'green'
downDubsButton.style.backgroundColor = 'red'

dubsDiv.appendChild(upDubsButton)
dubsDiv.appendChild(downDubsButton)
mainpage.appendChild(dubsDiv)
$("#mainpage").css('margin-top', '-72px');
