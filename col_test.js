
function _array_set_builder()
{
	var self = {
		data: [],
		contains: function(obj)  // requires elements to have .equals() method
		{
			for (var i = 0; i < self.data.length; i++)
			{
				if (self.data[i].equals(obj))
				{
					return true;
				}
			}
			return false;
		},
		add_if_not_present: function(obj)
		{
			if (!self.contains(obj))
			{
				self.data.push(obj);
			}
			return self;
		},
		build_set: function()
		{
			return _frozen_array_set(self.data);
		}
	};
	return self;
}

function _frozen_array_set(data)
{
	var self = {
		_data: Array.from(data),
		iterate_any_order: function(f)
		{
			for (var i = 0; i < self._data.length; i++)
			{
				f(self._data[i]);
			}
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
	};
	return self;
}

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
		without_names_without_duplicates_as_set: function()
		{
			var builder = col.set();
			for (var key in self._data)
			{
				builder.add_if_not_present(self._data[key]);
			}
			return builder.build_set();
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

col = {
	named: function()
	{
		return _obj_named_builder();
	},
	set: function()
	{
		return _array_set_builder();
	},
	list: function()
	{
		return _array_list_builder();
	}
};

