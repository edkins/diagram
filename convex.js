var col = require('./col_test.js');

// Returns -1 if a is to the left of b
// If they have the same real component, returns -1 if a is below b
function leftmost( a, b )
{
	var z = a.subtract(b);
	var re = z.real_sign();
	var im = z.imag_sign();

	if (re !== 0) return re;
	return im;
}

function _convex_hull( points, canvas )
{
	point = points.min_by(leftmost);

	canvas.draw_points( points, {} );

	canvas.draw_points( col.singleton(point), {r: 10});

	canvas.next_frame();
}

module.exports = _convex_hull;

