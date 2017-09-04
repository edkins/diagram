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

function gen()
{
	var list = get_data().without_names_any_order_as_list();
	var canv = get_canvas();
	var hull = convex( list );

	canv.draw_polygon( hull, {fill:'#ddd'} );
	canv.draw_points( list );
}

function app_main()
{
	document.getElementById('gen').onclick = gen;
}

window.onload = app_main;

