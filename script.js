"use strict"
var ctx = $('#display')[0].getContext('2d')
var tspan = $('#t')[0]
var xin = $('#xin')[0]
var yin = $('#yin')[0]
var img = new Image()
var xf, yf, xfl, yfl
var pxs = 1
var pxsd = $('#pxsd')[0]
var clear = $('#clear')[0]
var xe = $('#xe')[0]
var ye = $('#ye')[0]

var mod = (x, y, s = 1) => (x % y + y * s) % y

function pxSize(inc) {
	let n = pxs + inc
	if (n > 0) {
		pxs = n
		ctx.canvas.style.width = 480 * pxs
		ctx.canvas.style.height = 360 * pxs
		pxsd.innerHTML = pxs
	}
}

function draw() {
	let t = performance.now()

	if (clear.checked) ctx.clearRect(0, 0, 480, 360)

	for (let y = 0; y < 360; y++) {
		let xo, yo
		try { xo = Math.round(xf(t, y)) } catch (e) { xf = xfl; xin.style.backgroundColor = '#fa0'; xe.innerHTML = e; break }
		try { yo = Math.round(yf(t, y)) } catch (e) { yf = yfl; yin.style.backgroundColor = '#fa0'; ye.innerHTML = e; break }

		for (let w = -img.width; w < 480; w += img.width)
			ctx.drawImage(
				img,
				0,
				mod(yo + y, img.height),
				img.width,
				1,
				mod(xo, img.width) + w,
				y,
				img.width,
				1
			)
	}
	tspan.innerHTML = Math.floor(t)
	requestAnimationFrame(draw)
}

function readImage() {
	if (this.files && this.files[0]) {
		var FR = new FileReader()
		FR.onload = function (e) {
			function imgLoad() {
				img.removeEventListener("load", imgLoad)
				requestAnimationFrame(draw)
			}
			img.addEventListener("load", imgLoad)
			img.src = e.target.result
		}
		FR.readAsDataURL(this.files[0])
	}
}

window.onload = () => {
	xin.oninput = () => { xfl = xf; try { xf = eval(`(t,y)=>(${xin.value || 0})`); xin.style.backgroundColor = ''; xe.innerHTML = 'Working!' } catch (e) { xin.style.backgroundColor = '#f55'; xe.innerHTML = e} }
	yin.oninput = () => { yfl = yf; try { yf = eval(`(t,y)=>(${yin.value || 0})`); yin.style.backgroundColor = ''; ye.innerHTML = 'Working!' } catch (e) { yin.style.backgroundColor = '#f55'; ye.innerHTML = e} }
	xin.oninput()
	yin.oninput()
	$('#img')[0].addEventListener("change", readImage, false)
}