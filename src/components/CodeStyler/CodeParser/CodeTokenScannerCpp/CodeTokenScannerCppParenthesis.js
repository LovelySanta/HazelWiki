import CodeToken from '../CodeToken'

import CodeTokenScanner from '../CodeTokenScanner'

export default class CodeTokenScannerCppParenthesis extends CodeTokenScanner
{
	constructor()
	{
		super();
		this.token = CodeTokenScannerCppParenthesis.getToken();
	}

	static getToken() { return '()'; }

	scan(source)
	{
		if(this.token.indexOf(source.charAt(0)) >= 0)
			return new CodeToken(this.token, source.charAt(0), 1); // ignore character found
		return CodeToken.nullToken(); // no character to ignore
	}

	unscan(token)
	{
		if (token.token == this.token)
			return token.content;
		return '';
	}
};
