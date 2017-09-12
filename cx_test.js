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
		},
		conjugate: function()
		{
			return cx.fromInts( self.a, self.b.multiply(-1), self.d );
		},
		interpolate: function(other, i, max)
		{
			var j = max - i;
			return cx.fromInts(
				self.a.multiply(j).multiply(other.d).add(other.a.multiply(i).multiply(self.d)),
				self.b.multiply(j).multiply(other.d).add(other.b.multiply(i).multiply(self.d)),
				self.d.multiply(max).multiply(other.d)
			);
		},
		componentwise_divide: function(other)
		{
			return cx.fromInts(
				self.a.multiply( other.d ).multiply( other.b ),
				self.b.multiply( other.d ).multiply( other.a ),
				self.d.multiply( other.a ).multiply( other.b )
			);
		},
		componentwise_max: function(other)
		{
			return cx.fromInts(
				bigInt.max(self.a.multiply(other.d), other.a.multiply(self.d) ),
				bigInt.max(self.b.multiply(other.d), other.b.multiply(self.d) ),
				self.d.multiply(other.d)
			);

		},
		left_of: function(other)
		{
			return self.subtract(other).real_sign() < 0;
		},
		right_of: function(other)
		{
			return self.subtract(other).real_sign() > 0;
		},
		below: function(other)
		{
			return self.subtract(other).imag_sign() < 0;
		},
		above: function(other)
		{
			return self.subtract(other).imag_sign() > 0;
		},
		// Can return imprecise results if d is too large
		float_x: function()
		{
			return a.toJSNumber() / d.toJSNumber();
		},
		float_y: function()
		{
			return b.toJSNumber() / d.toJSNumber();
		},
		real_sign: function()
		{
			return a.compare(0) * d.compare(0);
		},
		imag_sign: function()
		{
			return b.compare(0) * d.compare(0);
		}
	};
	return self;
}

/*
 * Returns [bigInt numerator, bigInt denominator]
 * where denominator >= 1 is a power of 10
 */
function _parse_decimal(string)
{
	if (/^-?[0-9]+$/.test(string))
	{
		return [bigInt(string),bigInt(1)]
	}
	else
	{
		var match = /^(-?)([0-9]*)\.([0-9]*)$/.exec(string);
		if (match == null)
		{
			throw 'Cannot parse number ' + string;
		}
		var minus = bigInt(1);
		if (match[1] === '-')
		{
			minus = bigInt(-1);
		}
		var intPart = match[2];
		var decimalPart = match[3];
		var denom = bigInt(10).pow(decimalPart.length)
		return [bigInt(intPart).multiply(denom).add(decimalPart).multiply(minus), denom]
	}
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
	},
	parse: function(astring, bstring)
	{
		var a = _parse_decimal(astring);
		var b = _parse_decimal(bstring);
		return cx.fromInts(a[0].multiply(b[1]), b[0].multiply(a[1]), a[1].multiply(b[1]))
	},
	random: function(limit)
	{
		var a = Math.floor( Math.random() * limit );
		var b = Math.floor( Math.random() * limit );
		return cx.fromInts( a, b, 1 );
	}
};

module.exports = cx;

