import MarkdownTokenScanner from './MarkdownTokenScanner'
import MarkdownToken from './MarkdownToken'

export default class MarkdownTokenScannerNewline extends MarkdownTokenScanner {
	constructor() {
		super();
		
		this.token = MarkdownTokenScannerNewline.getToken();
		MarkdownTokenScanner.registerToken(this.token);
	}

	scan(source) {
		var newlineIndex = 0
		if (source.charAt(newlineIndex) == this.token) {
			while(source.charAt(++newlineIndex) == this.token);
			// we found new line character(s)
			return new MarkdownToken(this.token, newlineIndex, newlineIndex);
		} else {
			return MarkdownToken.nullToken();
		}
	}

	static getToken() { return '\n' }
};