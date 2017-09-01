function _transformed_canvas(base, transformer)
{
	var self = {
		_base: base,
		_f: transformer,
		clear: base.clear,
		draw_points: function( points ) {
			self._base.draw_points( points.transform( self._f ) );
		},
		draw_poly_line: function( points ) {
			self._base.draw_poly_line( points.transform( self._f ) );
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
		draw_points: function( points ) {
			points.iterate_any_order( function(point) {
				var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
				circle.setAttribute('cx', point.float_x());
				circle.setAttribute('cy', point.float_y());
				circle.setAttribute('r', 2);
				self._svg.append(circle);
			});
		},
		draw_poly_line: function( points ) {
			points.iterate( rememberer( function(last, point) {
				var line = document.createElementNS('http://www.w3.org/2000/svg','line');
				line.setAttribute('x1', last.float_x());
				line.setAttribute('y1', last.float_y());
				line.setAttribute('x2', point.float_x());
				line.setAttribute('y2', point.float_y());
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
	from_svg: function(svg)
	{
		return _svg_canvas(svg);
	}

};

module.exports = canvas;

