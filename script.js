"use strict"
const fullarea = $('#fullarea')[0].getContext('2d')
const display = $('#display')[0].getContext('2d')

function newTileImage(pallete, image, bpp) {
	let tile = $('<canvas width="8" height="8"></canvas>')[0].getContext('2d')
	for (let y = 0; y < 4 * bpp; y++)
		for (let x = 0; x < 16 / bpp; x++) {
			let color = (image[y] >> (x * bpp)) % (1 << bpp)
			if (!color) continue
			tile.fillStyle = pallete[color]
			let p = x + (y * 16 / bpp)
			tile.fillRect(p % 8, p >> 3, 1, 1)
		}
	return tile
}
var palletes = [
	[, '#000', '#fff', '#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#000', '#000', '#000', '#000', '#000', '#000', '#000'],
	[, '#800', '#080', '#008'],
	[, '#000']
]

var tilemap = [
	newTileImage(palletes[0], [
		0x1100, 0x3322, 0x1100, 0x3322,
		0x5544, 0x7766, 0x5544, 0x7766,
		0x9988, 0xbbaa, 0x9988, 0xbbaa,
		0xddcc, 0xffee, 0xddcc, 0xffee,
	], 4),
	newTileImage(palletes[1], [
		0xffff, 0xffff, 0xffff, 0xffff,
		0xffff, 0xffff, 0xffff, 0xffff
	], 2),
	newTileImage(palletes[2], [
		0b0011110000000000,
		0b0000110001000010,
		0b0100001000110000,
		0b0000000000111100,
	], 1),
	newTileImage(palletes[2], [
		0b0110000000000000,
		0b0100100001010000,
		0b0100001001111100,
		0b0000000001000010,
	], 1),
]

fullarea.clearRect(0, 0, 512, 512)

for (let y = 0; y < 64; y++) {
	for (let x = 0; x < 64; x++) {
		fullarea.drawImage(
			tilemap[(x + y) % 4].canvas,
			x * 8,
			y * 8
		)
	}
}

function draw() {
	let now = performance.now() / 300

	display.clearRect(0, 0, 480, 360)

	for (let y = 0; y < 360; y++) {
		let xo = Math.floor(Math.sin((now/4) + y / 64) * 64 * (y%2?1:-1))
		let yo = Math.floor(Math.sin(y / 32) * 8-y)
		for (let w = 0;w<2;w++)
			display.drawImage(
				fullarea.canvas,
				0,
				((yo+y)%512+512)%512,
				512,
				1,
				(xo%512-512)%512+(w*512),
				y,
				512,
				1
			)
	}
	requestAnimationFrame(draw)
}
requestAnimationFrame(draw)
function toYUV(R, G, B) {
	let Y = 0.257 * R + 0.504 * G + 0.098 * B
	let U = -0.148 * R - 0.291 * G + 0.439 * B
	let V = 0.439 * R - 0.368 * G - 0.071 * B
	return [Y, U, V]
}
function toRGB(Y, U, V) {
	let R, G, B
	R = G = B = 1.164 * Y
	R += 1.596 * V
	G -= 0.392 * U - 0.813 * V
	B += 2.017 * U
	return [R, G, B]
}