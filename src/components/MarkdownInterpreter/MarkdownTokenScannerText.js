import MarkdownTokenScanner       from './MarkdownTokenScanner'       // Base scanner

import MarkdownToken from './MarkdownToken'

export default class MarkdownTokenScannerText extends MarkdownTokenScanner {
	constructor() {
		super();
		this.token = MarkdownTokenScannerText.getToken();
	}

	scan(source) {
		var sourceLength = source.length;

		var tokens = MarkdownTokenScannerText.getOtherTokens();
		var tokensLength = tokens.length;

		var textIndex = 0;
		var foundToken = false;
		while((!foundToken) && sourceLength > textIndex++) {
			for(var tokenIndex = 0; tokenIndex < tokensLength; tokenIndex++) {
				var token = tokens[tokenIndex];
				if (source.substring(textIndex, textIndex + token.length) == token) {
					foundToken = true;
					break;
				}
			}
		}
		return new MarkdownToken(this.token, source.substring(0, textIndex).trim(), textIndex);
	}

	static getOtherTokens() { return MarkdownTokenScanner.getRegisteredTokens(); }
	static getToken() { return 'TEXT' }
};