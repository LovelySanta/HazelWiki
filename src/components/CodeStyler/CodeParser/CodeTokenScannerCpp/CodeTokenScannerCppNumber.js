import CodeToken from '../CodeToken'

import CodeTokenScanner from '../CodeTokenScanner'

export default class CodeTokenScannerCppNumber extends CodeTokenScanner
{
	/* Abstract base class, this class cannot scan for specific tokens,
	 * Instead, it will detect everything that specific scanners cannot
	 * detect themselves.
	 */
	constructor()
	{
		super();
		this.token = CodeTokenScannerCppNumber.getToken();
	}

	static getToken() { return 'NUMBER'; }

	scan(source)
	{
		var index = 0;
		var char = source.charAt(index);
		if(char == '0')
		{
			var isFloatNumber = false;
			if(source.charAt(++index).toLowerCase() == '.')
			{
				// Floating number
				isFloatNumber = true
				char = source.charAt(index);
			}
			else if(source.charAt(index).toLowerCase() == 'x')
			{
				// Hexadecimal number
				while(++index < source.length && "0123456789abcdef".indexOf(source.charAt(index).toLowerCase()) >= 0);
			}
			else if("1234567".indexOf(source.charAt(index)) >= 0)
			{
				// Octal number
				++index;
				while(++index < source.length && "01234567".indexOf(source.charAt(index)) >= 0);
			}

			if(!isFloatNumber)
			{
				var literal = source.charAt(index).toLowerCase();
				if(literal == 'u') // unsigned
				{
					literal = source.charAt(++index).toLowerCase();
					if(literal == 'l') // long
						++index;
				}
				else if(literal == 'l') // unsigned
				{
					literal = source.charAt(++index).toLowerCase();
					if(literal == 'u') // long
						++index;
				}

				return new CodeToken(this.token, source.substr(0, index), index); // number found
			}
		}

		if(".123456789".indexOf(char) >= 0)
		{
			// Decimal number
			while(++index < source.length && "0123456789".indexOf(source.charAt(index)) >= 0);

			var decimalPoint = (char == '.');
			if((!decimalPoint) && source.charAt(index) == '.') // decimal point
			{
				decimalPoint = true;
				while(++index < source.length && "0123456789".indexOf(source.charAt(index)) >= 0);
			}

			var scientificNotation = false;
			if(source.charAt(index).toLowerCase() == 'e') // scientific notation
			{
				scientificNotation = true;
				if(source.charAt(index+1) == "-") ++index;
				while(++index < source.length && "0123456789".indexOf(source.charAt(index)) >= 0);
			}

			var literal = source.charAt(index).toLowerCase();
			if( (!decimalPoint) && (!scientificNotation) )
			{
				// Integer number
				if(literal == 'u') // unsigned literal
				{
					literal = source.charAt(++index).toLowerCase();
					if(literal == 'l') // long literal
						++index;
				}
				else if(literal == 'l') // unsigned literal
				{
					literal = source.charAt(++index).toLowerCase();
					if(literal == 'u') // long literal
						++index;
				}
			}
			else
			{
				// Foating number
				if(literal == 'l') // long double literal
					++index;
				else if(literal == 'f') // float literal
					++index;
			}

			return new CodeToken(this.token, source.substr(0, index), index); // number found
		}

		return CodeToken.nullToken(); // no number
	}

	unscan(token)
	{
		if (token.token == this.token)
			return token.content;
		return '';
	}
};
