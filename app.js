var cx = require('./cx_test.js');
var col = require('./col_test.js');
var canvas = require('./canvas.js');
var convex = require('./convex.js');

function get_canvas()
{
	return canvas.from_svg( document.getElementById('diagram') ).transform(my_scale);
}

function get_data()
{
	return col.from_array( ['aa','ab','ba','bb'] )
		.as_names( function(name) {
			var value_x = document.getElementById(name+'x').value;
			var value_y = document.getElementById(name+'y').value;
			return cx.parse( value_x, value_y );
		} );
}

function my_scale(z)
{
	var offset = cx.fromInts(50, 450, 1);
	return z.multiply( cx.int(50) ).conjugate().add(offset);
}

function draw_grid( canv, vertices )
{
	for (var i = 0; i <= 16; i++)
	{
		var z0 = vertices.k('aa').interpolate( vertices.k('ab'), i, 16 );
		var z1 = vertices.k('ba').interpolate( vertices.k('bb'), i, 16 );

		canv.draw_poly_line( col.from_array([z0, z1]) );
	}
}

function draw_grid2( canv, vertices )
{
	for (var i = 0; i <= 16; i++)
	{
		var z0 = vertices.k('aa').interpolate( vertices.k('ba'), i, 16 );
		var z1 = vertices.k('ab').interpolate( vertices.k('bb'), i, 16 );

		canv.draw_poly_line( col.from_array([z0, z1]) );
	}
}

function gen()
{
	var data = get_data();
	var list = data.without_names_any_order_as_list();
	var hull = convex( list );

	var canv = get_canvas();
	canv.clear();
	canv.draw_polygon( hull, {fill:'#ddd'} );
	
	draw_grid( canv, get_data() );
	draw_grid2( canv, get_data() );

	canv.draw_points( list );
}

function app_main()
{
	document.getElementById('gen').onclick = gen;
}

window.onload = app_main;

