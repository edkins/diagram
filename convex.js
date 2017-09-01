var col = require('./col_test.js');
var cx = require('./cx_test.js');

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

// Given the angle between the points is less than 180 degrees,
// return -1 if a is the anticlockwise point, and 1 if b is.
// If they line up exactly (with an angle of 0 degrees) then
// return -1 if a is the furthest, and 1 if b is.
// Return 0 if the points are identical.
// Throws error if they're placed on opposite sides of the origin
function most_anticlockwise( origin )
{
	return function (a, b )
	{
		if (a.equals( b ))
		{
			return 0;
		}
		if (a.equals( origin ))
		{
			return 1;
		}
		if (b.equals( origin ))
		{
			return -1;
		}

		var z = a.subtract(origin).divide(b.subtract(origin));

		if (z.imag_sign() > 0) return -1;
		if (z.imag_sign() < 0) return 1;

		if (z.real_sign() <= 0) throw ('Opposite sides of the origin:'+b.toString() + ','+origin.toString()+','+a.toString());

		return -z.subtract( cx.one() ).real_sign();
	}
}

function _convex_hull( points, canvas )
{
	first_point = points.min_by(leftmost);

	current_point = first_point;
	result = col.list();

	do
	{
		result.add_to_end(current_point);
		next_point = points.min_by(most_anticlockwise(current_point));

		canvas.draw_points( points, {} );
		canvas.draw_poly_line( result.build_list(), {} );
		canvas.draw_points( col.singleton(current_point), {r: 10});
		canvas.draw_points( col.singleton(next_point), {fill: 'red'});
		canvas.next_frame();

		current_point = next_point;
	} while( !current_point.equals(first_point) );
}

module.exports = _convex_hull;

