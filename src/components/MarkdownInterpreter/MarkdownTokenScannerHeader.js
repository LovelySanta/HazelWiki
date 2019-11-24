import MarkdownToken from './MarkdownToken'

import MarkdownTokenScanner from './MarkdownTokenScanner'
import MarkdownTokenScannerNewline from './MarkdownTokenScannerNewline';

export default class MarkdownTokenScannerHeader extends MarkdownTokenScanner {
	constructor() {
		super(null);

		// Token for this scanner
		this.token = this.getToken();
	}

	getToken() { return '#'; }
	getRegisterToken() { return this.getToken(); }

	scan(source) {
		if (source.charAt(0) == this.token) {
			var tokenContent = []; // Content of this header token
			var tokenLength  = 0;  // Length of this token

			var headerIndex = 0
			while(source.charAt(++headerIndex) == this.token);  // group all the headers together
			tokenContent[0] = headerIndex; // Header count
			tokenLength    += headerIndex;

			// Now scan the content of the header
			var scanners = [
				new MarkdownTokenScanner()
			];
			var scannersAmount = scanners.length;
			scanners[scannersAmount-1].registerScanner(new MarkdownTokenScannerNewline());

			for (var scannerIndex = 0; scannerIndex < scannersAmount; scannerIndex++)
			{
				var token = scanners[scannerIndex].scan(source.substr(headerIndex));
				if (!token.isNull()) {
					tokenContent[1] = token;
					tokenLength    += token.length;
					break;
				}
			}

			return new MarkdownToken(this.token, tokenContent, tokenLength);
		} else {
			return MarkdownToken.nullToken();
		}
	}
};