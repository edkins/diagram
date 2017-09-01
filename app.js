var cx = require('./cx_test.js');
var col = require('./col_test.js');
var canvas = require('./canvas.js');
var convex = require('./convex.js');

function my_scale(z)
{
	return z.multiply( cx.half() );
}

var current_frame = 0;
var record = canvas.recording()
function gen()
{
	current_frame++;
	var canv = canvas.from_svg( document.getElementById('diagram') );

	record.play_frame(canv, current_frame);
}

function app_main()
{
	document.getElementById('gen').onclick = gen;
//	draw_diagram();

	var list = col.list()
		.add_to_end( cx.parse('70','20') )
		.add_to_end( cx.parse('130','20') )
		.add_to_end( cx.parse('50','150') )
		.add_to_end( cx.parse('70','180') )
		.add_to_end( cx.parse('130','180') )
		.add_to_end( cx.parse('150','150') )
		.add_to_end( cx.parse('20','70') )
		.add_to_end( cx.parse('20','130') )
		.add_to_end( cx.parse('150','50') )
		.add_to_end( cx.parse('180','70') )
		.add_to_end( cx.parse('180','130') )
		.add_to_end( cx.parse('50','50') )
		.build_list();

	var canv = canvas.from_svg( document.getElementById('diagram') );

	convex( list, record );
	record.play_frame(canv, 0);
}

window.onload = app_main;

