import CodeToken from '../CodeToken'

import CodeTokenScanner from '../CodeTokenScanner'

export default class CodeTokenScannerCppTypes extends CodeTokenScanner
{
	constructor()
	{
		super();
		this.token = CodeTokenScannerCppTypes.getToken();
		this.types = [
			// Prefixes
			'long', 'short',
			'signed', 'unsigned',
			// Types
			'int', 'float', 'double',
			'char', 'string',
			'bool',
			'void'
		];
	}

	static getToken() { return 'TYPE'; }

	scan(source)
	{
		for (var index = 0; index < this.types.length; ++index) {
			var type = this.types[index];
			if(source.substr(0, type.length).toLowerCase() == type && "abcdefghijklmnopqrstuvwxyz_0123456789".indexOf(source.charAt(type.length).toLowerCase()) < 0)
				return new CodeToken(this.token, source.substr(0, type.length), type.length); // found a type token
		}
		return CodeToken.nullToken(); // no type found
	}

	unscan(token)
	{
		if (token.token == this.token)
			return token.content;
		return '';
	}
};
