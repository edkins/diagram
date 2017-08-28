function same_point(a,b)
{
	return a[0] === b[0] && a[1] === b[1];
}

function remove_duplicate_points(points)
{
	var result = [];
	for (var i = 0; i < points.length; i++)
	{
		var found = false;
		for (var j = 0; j < result.length; j++)
		{
			if (same_point(result[j], points[i]))
			{
				found = true;
			}
		}
		if (!found)
		{
			result.append(points[i]);
		}
	}
	return result;
}

// Return an angle in the range (-pi,pi]
// This is the same as what atan2 returns.
function normalize_angle(angle)
{
	var two_pi = 2 * Math.PI;
	return angle - Math.ceil(angle / two_pi - 0.5) * two_pi;
}

// Represents a plane with a cut starting at a particular point.
// When asking for the angle_of(x,y), it will return
// a value in the range (a-pi, a+pi]
// which will differ from atan2(y-oy,x-ox) by a multiple of 2pi.
function cut_plane(ox, oy, a)
{
	var self = {
		angle_of: function(x,y)
		{
			var angle = Math.atan2(y-oy,x-oy);
			return a + normalize_angle( angle - a );
		}
	};
	return self;
}

function convex_hull(points)
{
	var self = {
		_points: remove_duplicate_points(points)

	};
	return self;
};

function test()
{
	if (normalize_angle(0) != 0) return 'aa';
	if (normalize_angle(Math.PI) != Math.PI) return 'ab';
	if (normalize_angle(Math.PI + 0.001) != 0.001 - Math.PI) return 'ac';
	if (normalize_angle(4 * Math.PI) != 0) return 'ad';
	if (normalize_angle(-5 * Math.PI) != Math.PI) return 'ae';
}

console.log(test());

