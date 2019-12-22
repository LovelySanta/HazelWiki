import CodeToken from '../CodeToken'

import CodeTokenScanner from '../CodeTokenScanner'

export default class CodeTokenScannerCppParenthesis extends CodeTokenScanner
{
	constructor()
	{
		super();
		this.token = CodeTokenScannerCppParenthesis.getToken();
	}

	static getToken() { return 'PARENTHESIS'; }

	scan(source)
	{
		if("(){}[]".indexOf(source.charAt(0)) >= 0)
			return new CodeToken(this.token, source.charAt(0), 1); // found a parenthesis
		return CodeToken.nullToken(); // no parenthesis found
	}

	unscan(token)
	{
		if (token.token == this.token)
			return token.content;
		return '';
	}
};
