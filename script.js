"use strict"
const ctx = $('#display')[0].getContext('2d')
var tspan = $('#t')[0]
var img = $('#img')[0]
var xin = $('#xin')[0]
var yin = $('#yin')[0]
var xf, yf, xfl, yfl
var pxs = 1
var pxsd = $('#pxsd')[0]

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

	ctx.clearRect(0, 0, 480, 360)

	for (let y = 0; y < 360; y++) {
		let xo, yo
		try { xo = Math.round(xf(t, y)) } catch (e) { xf = xfl; break }
		try { yo = Math.round(yf(t, y)) } catch (e) { yf = yfl; break }

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

window.onload = () => {
	xin.oninput = () => { try { xfl = xf; xf = eval(`(t,y)=>(${xin.value || 0})`) } catch (e) { } }
	yin.oninput = () => { try { yfl = yf; yf = eval(`(t,y)=>(${yin.value || 0})`) } catch (e) { } }
	xin.oninput()
	yin.oninput()
	requestAnimationFrame(draw)
}