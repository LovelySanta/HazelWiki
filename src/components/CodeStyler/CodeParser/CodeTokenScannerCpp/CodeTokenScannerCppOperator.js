import CodeToken from '../CodeToken'

import CodeTokenScanner from '../CodeTokenScanner'

export default class CodeTokenScannerCppOperator extends CodeTokenScanner
{
	constructor()
	{
		super();
		this.token = CodeTokenScannerCppOperator.getToken();
		this.types = [
			// Assignment
			'=', '-=', '+=', '*=', '/=',
			'--', '++',
			// Operator
			'+', '-', '*', '/', '**'
		];
	}

	static getToken() { return 'OPERATOR'; }

	scan(source)
	{
		for (var index = 0; index < this.types.length; ++index) {
			var type = this.types[index];
			if(source.substr(0, type.length).toLowerCase() == type)
				return new CodeToken(this.token, source.substr(0, type.length), type.length); // found a type token
		}
		return CodeToken.nullToken(); // no character to ignore
	}

	unscan(token)
	{
		if (token.token == this.token)
			return token.content;
		return '';
	}
};
