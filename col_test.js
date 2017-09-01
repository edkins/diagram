
function _array_list_builder()
{
	var self = {
		data: [],
		add_to_end: function(value)
		{
			self.data.push(value);
			return self;
		},
		build_list: function()
		{
			return _frozen_array_list(self.data);
		}
	};
	return self;
}

function _frozen_array_list(data)
{
	var self = {
		_data: data,
		iterate_any_order: function( f )
		{
			self.iterate( f );
		},
		iterate: function( f )
		{
			for (var i = 0; i < self._data.length; i++)
			{
				f( self._data[i] );
			}
		},
		transform: function(f)
		{
			var result = col.list();
			self.iterate( function(x) {
				result.add_to_end( f(x) );
			} );
			return result.build_list();
		},
		min_by: function(comparator)
		{
			var result = self._data[0];
			for (var i = 1; i < self._data.length; i++)
			{
				if (comparator(self._data[i], result) < 0)
				{
					result = self._data[i];
				}
			}
			return result;
		},
		stringify: function(separator, f)
		{
			var result = '';
			var first = true;
			for (var i = 0; i < self._data.length; i++)
			{
				if (!first)
				{
					result += separator;
				}
				first = false;
				result += f(self._data[i]);
			}
			return result;
		},
		toString: function()
		{
			return self.stringify( ',', function(v) {
				return v.toString();
			} );
		}
	}
	return self;
}

function _obj_named_builder()
{
	var self = {
		data: {},
		add_named: function(key, value)
		{
			if (key in self.data)
			{
				throw 'obj_collection.with: already contains key: ' + key;
			}
			self.data[key] = value;
			return self;
		},
		build_named: function()
		{
			return _frozen_obj_named(self.data);
		}
	};
	return self;
}

function _frozen_obj_named(data)
{
	var self = {
		_data: data,
		without_names_any_order_as_list: function()
		{
			var builder = col.list();
			for (var key in self._data)
			{
				builder.add_to_end(self._data[key]);
			}
			return builder.build_list();
		},
		k: function(key)
		{
			if (!(key in self._data))
			{
				throw 'No such key: ' + k;
			}
			return self._data[key];
		},
		stringify: function(separator, f)
		{
			var result = '';
			var first = true;
			for (var key in self._data)
			{
				if (!first)
				{
					result += separator;
				}
				first = false;
				result += f(key, self._data[key]);
			}
			return result;
		},
		toString: function()
		{
			return self.stringify( ',', function(k,v) {
				return k + ':' + v.toString();
			} );
		}
	};
	return self;
}

function _singleton(x)
{
	var self = {
		_x: x,
		iterate: function(f) { f(self._x); },
		iterate_any_order: function(f) { f(self._x); }
	};
	return self;
}

col = {
	named: _obj_named_builder,
	list: _array_list_builder,
	singleton: _singleton
};

module.exports = col;

