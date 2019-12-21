import CodeToken from '../CodeToken'

import CodeTokenScanner from '../CodeTokenScanner'

export default class CodeTokenScannerCppComment extends CodeTokenScanner
{
	constructor()
	{
		super();
		this.token = CodeTokenScannerCppComment.getToken();
	}

	static getToken() { return 'COMMENT'; }

	scan(source)
	{
		if(source.charAt(0) == '/')
		{
			if(source.charAt(1) == '/') // single line comment
			{
				var index = 1
				while(++index < source.length && source.charAt(index) != '\n');
				return new CodeToken(this.token, source.substr(0, index), index);
			}
			else if(source.charAt(1) == '*') // multiline comment
			{
				var index = 1
				while(++index < source.length-1 && source.substr(index, 2) != "*/");
				return new CodeToken(this.token, source.substr(0, index+2), index+2);
			}
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
