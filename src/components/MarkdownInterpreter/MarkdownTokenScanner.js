import MarkdownToken from './MarkdownToken'

export default class MarkdownTokenScanner {
	/* Abstract base class, this class cannot scan for specific tokens,
	 * Instead, it will detect everything that specific scanners cannot
	 * detect themselves.
	 */
	constructor() {
		this.token = 'TXT';
	}

	scan(source) {
		var sourceLength = source.length;
		
		var tokens = MarkdownTokenScanner.getRegisteredTokens();
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
		return new MarkdownToken(this.token, source.substring(0, textIndex), textIndex);
	}

	static registeredTokens = [];
	static getRegisteredTokens() {return this.registeredTokens; }
	static registerToken(token) {
		if (Array.isArray(token)) {
			MarkdownTokenScanner.registerToken(token[0]);
		} else if (!this.registeredTokens.includes(token)) {
			this.registeredTokens = this.registeredTokens.concat(token);
		}
	}
};