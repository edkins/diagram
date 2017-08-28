var bigInt = require('big-integer');

/*
 * Only call after normalization. Generally cx.fromInts(a,b,d) should be used.
 */
function _cx(a,b,d)
{
	if (d.lesserOrEquals(0))
	{
		throw '_cx: must be called with d>0';
	}
	var self = {
		a: a,
		b: b,
		d: d,
		equals: function(other)
		{
			return self.a.multiply(other.d).equals( other.a.multiply(self.d) ) &&
				self.b.multiply(other.d).equals( other.b.multiply(self.d) );
		},
		toString: function()
		{
			return '(' + self.a + ',' + self.b + ')/' + self.d;
		},
		add: function(other)
		{
			return cx.fromInts(
				self.a.multiply(other.d).add( other.a.multiply(self.d) ),
				self.b.multiply(other.d).add( other.b.multiply(self.d) ),
				self.d.multiply(other.d)
			);
		},
		subtract: function(other)
		{
			return cx.fromInts(
				self.a.multiply(other.d).subtract( other.a.multiply(self.d) ),
				self.b.multiply(other.d).subtract( other.b.multiply(self.d) ),
				self.d.multiply(other.d)
			);
		},
		multiply: function(other)
		{
			return cx.fromInts(
				self.a.multiply(other.a).subtract( self.b.multiply(other.b) ),
				self.a.multiply(other.b).add( self.b.multiply(other.a) ),
				self.d.multiply(other.d)
			);
		},
		divide: function(other)
		{
			var ccdd = other.a.square().add( other.b.square() );
			return cx.fromInts(
				self.a.multiply(other.a).add( self.b.multiply(other.b) ).multiply(other.d),
				self.b.multiply(other.a).subtract( self.a.multiply(other.b) ).multiply(other.d),
				ccdd.multiply( self.d )
			);
		}
	};
	return self;
}

cx = {
	zero: function()
	{
		return cx.fromInts(0,0,1);
	},
	one: function()
	{
		return cx.fromInts(1,0,1);
	},
	i: function()
	{
		return cx.fromInts(0,1,1);
	},
	int: function(n)
	{
		return cx.fromInts(n,0,1);
	},
	half: function()
	{
		return cx.fromInts(1,0,2);
	},
	fromInts: function(a,b,d)
	{
		a = bigInt(a);
		b = bigInt(b);
		d = bigInt(d);
		if (d.equals(0))
		{
			throw 'cxFromInts: division by zero: (' + a + ',' + b + ',0)';
		}
		if (d.lesser(0))
		{
			a = a.multiply(-1);
			b = b.multiply(-1);
			d = d.multiply(-1);
		}
		var g = bigInt.gcd(a, bigInt.gcd(b, d));
		return _cx(a.divide(g), b.divide(g), d.divide(g));
	}

};
