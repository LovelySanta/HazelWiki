import MarkdownToken from './MarkdownToken'

import MarkdownTokenScanner		from './MarkdownTokenScanner'

export default class MarkdownTokenScannerCode extends MarkdownTokenScanner {
	constructor() {
		super(null);

		// Token for this scanner
		this.token = ["`","`"];
		MarkdownTokenScanner.registerToken(this.token[0]);
	}

	scan(source) {
		if (source.substring(0, this.token[0].length) == this.token[0]) {
			var tokenContent = source.substring(this.token[0].length, source.indexOf(this.token[1], this.token[0].length));
			return new MarkdownToken(this.token.join(''), tokenContent, this.token[0].length + tokenContent.length + this.token[1].length);
		} else {
			return MarkdownToken.nullToken();
		}
	}
};