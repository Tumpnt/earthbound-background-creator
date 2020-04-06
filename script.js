"use strict"
const ctx = $('#display')[0].getContext('2d')
var tspan = $('#t')[0]
var img = $('#img')[0]
var xin = $('#xin')[0]
var yin = $('#yin')[0]
var xf
var yf
var pxs = 1

function pxSize(inc) {
	pxs += inc ? 1 : -1
	canvas.style.width = 480 * pxs
	canvas.style.height = 360 * pxs
}
var mod = (x, y) => (x % y + y) % y

function draw() {
	let t = performance.now()

	ctx.clearRect(0, 0, 480, 360)
	ctx.fillRect(0, 0, 480, 360)

	for (let y = 0; y < img.height; y++) {
		let xo, yo
		try {
			xo = Math.round(xf(t, y))
			yo = Math.round(yf(t, y))
		} catch (e) { xf = yf = () => 0 }
		for (let w = 0; w < 480; w += img.width)
			ctx.drawImage(
				img,
				0,
				mod(yo + y, img.height),
				img.width,
				1,
				mod(xo, img.width) - w,
				y,
				img.width,
				1
			)
	}
	tspan.innerHTML = Math.floor(t)
	requestAnimationFrame(draw)
}

window.onload = () => {
	xin.oninput = () => { try { xf = eval(`(t,y)=>(${xin.value || 0})`) } catch (e) { } }
	yin.oninput = () => { try { yf = eval(`(t,y)=>(${yin.value || 0})`) } catch (e) { } }
	xin.oninput()
	yin.oninput()
	requestAnimationFrame(draw)
}