import MarkdownToken from './MarkdownToken'

import MarkdownTokenScanner        from './MarkdownTokenScanner'
import MarkdownTokenScannerNewline from './MarkdownTokenScannerNewline'

export default class MarkdownTokenScannerHeader extends MarkdownTokenScanner {
	constructor() {
		super(null);

		// Token for this scanner
		this.token = '#';
		MarkdownTokenScanner.registerToken(this.token);

		// Sub scanners
		this.scanners = [
			new MarkdownTokenScannerNewline('\n'),
			new MarkdownTokenScanner()
		];
		this.scannersAmount = this.scanners.length;
	}

	scan(source) {
		if (source.charAt(0) == this.token) {
			var tokenContent = []; // Content of this header token
			var tokenLength  = 0;  // Length of this token

			var headerIndex = 0
			while(source.charAt(++headerIndex) == this.token);  // group all the headers together
			tokenContent[0] = headerIndex; // Header count
			tokenLength    += headerIndex;

			// Now scan the content of the header
			for (var scannerIndex = 0; scannerIndex < this.scannersAmount; scannerIndex++)
			{
				var token = this.scanners[scannerIndex].scan(source.substr(headerIndex));
				if (!token.isNull()) {
					tokenContent[1] = token;
					tokenLength    += token.length;
				}
			}

			return new MarkdownToken(this.token, tokenContent, tokenLength);
		} else {
			return MarkdownToken.nullToken();
		}
	}
};