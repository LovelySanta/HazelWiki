import MarkdownToken from './MarkdownToken'

export default class MarkdownTokenScanner {
	// Abstract base class, this class cannot scan for tokens
	// hence why it always return a nulltoken.
	constructor() {}

	static registeredTokens = [];
	static getRegisteredTokens() { return this.registeredTokens; }
	static registerToken(token) {
		if (!this.registeredTokens.includes(token)) {
			this.registeredTokens = this.registeredTokens.concat(token);
		}
	}
		

	scan(source) { return MarkdownToken.nullToken(); }
};