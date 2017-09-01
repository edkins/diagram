var cx = require('./cx_test.js');
var col = require('./col_test.js');
var canvas = require('./canvas.js');
var convex = require('./convex.js');

function my_scale(z)
{
	return z.multiply( cx.half() );
}

function app_main()
{
	console.log(cx.parse('1.2','2.4').toString());
//	draw_diagram();

	var list = col.list()
		.add_to_end( cx.parse('100','100') )
		.add_to_end( cx.parse('200','200') )
		.add_to_end( cx.parse('150','50') )
		.build_list();

	var canv = canvas.from_svg( document.getElementById('diagram') );

	var record = canvas.recording()

	convex( list, record );
	record.play_frame(canv, 0);
}

window.onload = app_main;

