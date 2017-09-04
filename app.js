var cx = require('./cx_test.js');
var col = require('./col_test.js');
var canvas = require('./canvas.js');
var convex = require('./convex.js');

function get_canvas(maximums)
{
	return canvas.from_svg( document.getElementById('diagram') ).transform(my_scale(maximums));
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

function my_scale(maximums)
{
	return function(z)
	{
		var offset = cx.fromInts(50, 450, 1);
		return z.multiply( cx.int(400) ).componentwise_divide(maximums).conjugate().add(offset);
	};
}

function draw_grid( canv, vertices )
{
	for (var i = 0; i <= 16; i++)
	{
		var z0 = vertices.k('aa').interpolate( vertices.k('ab'), i, 16 );
		var z1 = vertices.k('ba').interpolate( vertices.k('bb'), i, 16 );

		var colour = (i === 0 || i === 16) ? '#008' : 'rgba(0,0,0,0.4)';

		canv.draw_poly_line( col.from_array([z0, z1]), {'stroke-width':'0.5px','stroke':colour} );
	}
}

function draw_grid2( canv, vertices )
{
	for (var i = 0; i <= 16; i++)
	{
		var z0 = vertices.k('aa').interpolate( vertices.k('ba'), i, 16 );
		var z1 = vertices.k('ab').interpolate( vertices.k('bb'), i, 16 );

		var colour = (i === 0 || i === 16) ? '#008' : 'rgba(0,0,0,0.4)';

		canv.draw_poly_line( col.from_array([z0, z1]), {'stroke-width':'0.5px','stroke':colour} );
	}
}

function draw_shading( canv, vertices )
{
	var old_z0 = vertices.k('aa');
	var old_z1 = vertices.k('ba');
	for (var i = 1; i <= 16; i++)
	{
		var z0 = vertices.k('aa').interpolate( vertices.k('ab'), i, 16 );
		var z1 = vertices.k('ba').interpolate( vertices.k('bb'), i, 16 );

		canv.draw_polygon( col.from_array([old_z1, old_z0, z0, z1]), {'fill':'rgba(0,0,128,0.14)'});

		old_z0 = z0;
		old_z1 = z1;
	}
}

function collection_componentwise_max( collection )
{
	return collection.aggregate( function(a,b) {
		return a.componentwise_max(b);
	} );
}

function gen()
{
	var data = get_data();
	var list = data.without_names_any_order_as_list();
	var hull = convex( list );
	var maximums = collection_componentwise_max( list );

	var canv = get_canvas(maximums);
	canv.clear();
	canv.draw_polygon( hull, {fill:'#cfcfcf'} );
	
	draw_shading( canv, data );
	draw_grid( canv, data );
	draw_grid2( canv, data );

	canv.draw_points( list );
}

function app_main()
{
	document.getElementById('gen').onclick = gen;
}

window.onload = app_main;

