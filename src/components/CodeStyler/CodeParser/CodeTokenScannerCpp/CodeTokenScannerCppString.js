import CodeToken from '../CodeToken'

import CodeTokenScanner from '../CodeTokenScanner'

export default class CodeTokenScannerCppString extends CodeTokenScanner
{
	constructor()
	{
		super();
		this.token = CodeTokenScannerCppString.getToken();
	}

	static getToken() { return 'STRING'; }

	scan(source)
	{
		var strChar = source.charAt(0)
		if(strChar == '"' || strChar == '\'')
		{
			var index = 0;
			while(++index < source.length && (source.charAt(index) != strChar || source.charAt(index-1) == '\\'));
			return new CodeToken(this.token, source.substr(0, ++index), index); // found a string
		}
		return CodeToken.nullToken(); // no string found
	}

	unscan(token)
	{
		if (token.token == this.token)
			return token.content;
		return '';
	}
};
