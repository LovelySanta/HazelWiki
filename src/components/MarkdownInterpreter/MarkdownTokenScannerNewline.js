import MarkdownToken from './MarkdownToken'

import MarkdownTokenScanner from './MarkdownTokenScanner'

export default class MarkdownTokenScannerNewline extends MarkdownTokenScanner {
	constructor() {
		super(null);
		this.token = '\n';
		MarkdownTokenScanner.registerToken(this.token);
	}

	scan(source) {
		if (source.charAt(0) == this.token) {
			var headerIndex = 0
			while(source.charAt(headerIndex++) == this.token); // group all the newlines together
			return new MarkdownToken(this.token, headerIndex, headerIndex);
		} else {
			return MarkdownToken.nullToken();
		}
	}
};