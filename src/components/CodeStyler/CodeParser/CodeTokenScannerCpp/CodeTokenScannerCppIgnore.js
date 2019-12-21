import CodeToken from '../CodeToken'

import CodeTokenScanner from '../CodeTokenScanner'

export default class CodeTokenScannerCppIgnore extends CodeTokenScanner
{
	constructor()
	{
		super();
		this.token = CodeTokenScannerCppIgnore.getToken();
		this.ignoredCharacters = " \t\n"
	}

	static getToken() { return 'IGNORE'; }

	scan(source)
	{
		var index = 0;
		if(this.ignoredCharacters.indexOf(source.charAt(index)) >= 0)
		{
			while(++index < source.length && this.ignoredCharacters.indexOf(source.charAt(index).toLowerCase()) >= 0);
			return new CodeToken(this.token, source.substr(0, index), index); // ignore character found
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
