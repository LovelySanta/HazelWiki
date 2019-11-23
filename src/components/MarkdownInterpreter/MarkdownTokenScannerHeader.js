import MarkdownTokenScanner from './MarkdownTokenScanner'

import MarkdownToken from './MarkdownToken'

export default class MarkdownTokenScannerHeader extends MarkdownTokenScanner {
	constructor() {
		super();
		
		this.token = MarkdownTokenScannerHeader.getToken();
		MarkdownTokenScanner.registerToken(this.token);
	}

	scan(source) {
		var headerIndex = 0
		if (source.charAt(headerIndex) == this.token) {
			while(source.charAt(++headerIndex) == this.token);
			// we found a header
			return new MarkdownToken(this.token, headerIndex, headerIndex);
		} else {
			return MarkdownToken.nullToken();
		}
	}

	static getToken() { return '#' }
};