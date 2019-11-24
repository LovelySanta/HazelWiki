import MarkdownToken from './MarkdownToken'

import MarkdownTokenScanner        from './MarkdownTokenScanner'          // Base scanner
import MarkdownTokenScannerNewline from './MarkdownTokenScannerNewline';  // Newline scanner
import MarkdownTokenScannerCode    from './MarkdownTokenScannerCode';     // Code scanner
import MarkdownTokenScannerImage   from './MarkdownTokenScannerImage';    // Image scanner
import MarkdownTokenScannerLink    from './MarkdownTokenScannerLink';     // Link scanner
import MarkdownTokenScannerHeader  from './MarkdownTokenScannerHeader';   // Header scanner

export default class MarkdownTokenizer {
	constructor() {
		this.scanner = new MarkdownTokenScanner();
		this.scanner.addScanner(new MarkdownTokenScannerNewline());
		this.scanner.addScanner(new MarkdownTokenScannerCode());
		this.scanner.addScanner(new MarkdownTokenScannerImage());
		this.scanner.addScanner(new MarkdownTokenScannerLink());
		this.scanner.addScanner(new MarkdownTokenScannerHeader());
	}

	tokenize(src)
	{
		// Compiles a source into an array of tokens
		var token = this.scanner.scan(src);
		if (token.isEnd()) { return [token]; }
		return [token].concat(this.tokenize(src.substr(token.length)));
	}

	mergeTokens(tokenArray)
	{
		// Merges similar tokens next to each other together
		var tokenIndex = 0;
		while(tokenIndex < tokenArray.length-1)
		{
			var token = tokenArray[tokenIndex++];
			var removeToken = false; // will remove the next token

			if (token.token == MarkdownTokenScanner.getToken() && tokenArray[tokenIndex].token == token.token)
			{
				token.content = token.content.concat(tokenArray[tokenIndex].content);
				token.length += tokenArray[tokenIndex].length;
				removeToken = true; // merges text together
			}
			else if (token.token == MarkdownTokenScannerNewline.getToken() && tokenArray[tokenIndex].token == token.token)
			{
				token.length += tokenArray[tokenIndex].length;
				removeToken = true; // merges newlines together
			}
			else if (token.token == MarkdownTokenScannerHeader.getToken())
			{
				if (tokenArray[tokenIndex].token == token.token)
				{
					token.length += tokenArray[tokenIndex].length;
					removeToken = true; // merges headers together
				}
				else if (tokenArray[tokenIndex].token == MarkdownTokenScanner.getToken() && tokenArray[tokenIndex].content == ' ')
				{
					removeToken = true; // removes leading spaces in a header
				}
			}

			if (removeToken)
			{
				tokenArray.splice(tokenIndex--, 1);
			}
		}
		return tokenArray;
	}
};