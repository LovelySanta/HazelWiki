import MarkdownToken from './MarkdownToken'

export default class MarkdownTokenScanner {
	/* Abstract base class, this class cannot scan for specific tokens,
	 * Instead, it will detect everything that specific scanners cannot
	 * detect themselves.
	 */
	constructor() {
		// Token for this scanner
		this.token = this.getToken();
	}

	getToken() { return 'TXT'; }
	getRegisterToken() { return null; }

	scan(source) {
		var sourceLength = source.length;
		
		var tokens = this.getRegisteredTokens();
		var tokensLength = tokens.length;
		
		var textIndex = -1;
		var foundToken = false;
		while((!foundToken) && sourceLength > textIndex++) {
			for(var tokenIndex = 0; tokenIndex < tokensLength; tokenIndex++) {
				var token = tokens[tokenIndex];
				if (source.substring(textIndex, textIndex + token.length) === token) {
					foundToken = true;
					break;
				}
			}
		}
		if (textIndex > 0) {
			return new MarkdownToken(this.token, source.substring(0, textIndex), source.substring(0, textIndex).length);
		}
		return MarkdownToken.nullToken();
	}

	registeredTokens = [];
	getRegisteredTokens() {return this.registeredTokens; }
	registerToken(token) {
		if (Array.isArray(token)) {
			token.forEach((t) => {
				this.registerToken(t);
			});
		} else if (!this.registeredTokens.includes(token)) {
			this.registeredTokens = this.registeredTokens.concat(token);
		}
	}
	registerScanner(scanner) {
		if (Array.isArray(scanner)) {
			scanner.forEach((s) => {
				this.registerScanner(s);
			});
		} else {
			this.registerToken(scanner.getRegisterToken())
		}
	}
};