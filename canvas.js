function _transformed_canvas(base, transformer)
{
	var self = {
		_base: base,
		_f: transformer,
		clear: base.clear,
		draw_points: function( points, attribs ) {
			self._base.draw_points( points.transform( self._f ), attribs );
		},
		draw_poly_line: function( points ) {
			self._base.draw_poly_line( points.transform( self._f ), attribs );
		}
	};
	return self;
}

function _recording_canvas()
{
	var self = {
		_record: [],
		_frame: [],
		clear_recording: function() {
			self._record = [];
			self._frame = [];
		},
		next_frame: function() {
			self._record.push( self._frame );
			self._frame = [];
		},
		draw_points: function(points,attribs) {
			self._frame.push('draw_points');
			self._frame.push(points);
			self._frame.push(attribs);
		},
		draw_poly_line: function(points) {
			self._frame.push('draw_poly_line');
			self._frame.push(points);
			self._frame.push(attribs);
		},
		play_frame: function(base, i) {
			base.clear();
			var j = 0;
			while (j < self._record[i].length)
			{
				var op = self._record[i][j++];
				if (op === 'draw_points')
				{
					var points = self._record[i][j++];
					var attribs = self._record[i][j++];
					base.draw_points(points,attribs);
				}
				else if (op === 'draw_poly_line')
				{
					var points = self._record[i][j++];
					var attribs = self._record[i][j++];
					base.draw_points(points,attribs);
				}
				else
				{
					throw ('Unrecognized operation:' + op);
				}
			}
		}
	};
	return self;
}

function rememberer(f)
{
	var self = {
		_state: undefined,
		_func: f,
		next: function(x)
		{
			if (self._state !== undefined)
			{
				self._func(self._state, x);
			}
			self._state = x;
		}
	};
	return self.next;
}

function _svg_canvas(svg)
{
	var self = {
		_svg: svg,
		clear: function() {
			while (self._svg.firstChild) {
				self._svg.removeChild(self._svg.firstChild);
			}

		},
		draw_points: function( points, attribs ) {
			points.iterate_any_order( function(point) {
				var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
				circle.setAttribute('cx', point.float_x());
				circle.setAttribute('cy', point.float_y());
				circle.setAttribute('r', 2);
				for (name in attribs)
				{
					circle.setAttribute(name, attribs[name]);
				}
				self._svg.append(circle);
			});
		},
		draw_poly_line: function( points, attribs ) {
			points.iterate( rememberer( function(last, point) {
				var line = document.createElementNS('http://www.w3.org/2000/svg','line');
				line.setAttribute('x1', last.float_x());
				line.setAttribute('y1', last.float_y());
				line.setAttribute('x2', point.float_x());
				line.setAttribute('y2', point.float_y());
				for (name in attribs)
				{
					line.setAttribute(name, attribs[name]);
				}
				self._svg.append(line);
			}));
		},
		transform: function( transformer) {
			return _transformed_canvas(self, transformer);
		},
	};
	return self;
}

var canvas = {
	from_svg: _svg_canvas,
	recording: _recording_canvas
};

module.exports = canvas;

