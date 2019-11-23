import MarkdownToken from './MarkdownToken'

import MarkdownTokenScanner        from './MarkdownTokenScanner'
import MarkdownTokenScannerImage   from './MarkdownTokenScannerImage'

export default class MarkdownTokenScannerLink extends MarkdownTokenScanner {
	constructor() {
		super(null);

		// Token for this scanner
		this.token = ['[','](',')'];
		MarkdownTokenScanner.registerToken(this.token[0]);
		MarkdownTokenScanner.registerToken(this.token[1]);
	}

	scan(source) {
		if (source.substring(0, this.token[0].length) == this.token[0]) {
			var tokenContent = []; // Content of this link token
			var tokenLength  = this.token[0].length;  // Length of this token

			// Scan the content of the link caption
			tokenContent[0] = [];
			var tokenContent0Amount = 0;
			var scanners = [
				new MarkdownTokenScannerImage(),
				new MarkdownTokenScanner()
			];
			var scannersAmount = scanners.length;
			for (var scannerIndex = 0; scannerIndex < scannersAmount; scannerIndex++)
			{
				var token = scanners[scannerIndex].scan(source.substring(tokenLength, source.length));
				if (!token.isNull()) {
					tokenContent[0][tokenContent0Amount++] = token;
					tokenLength += token.length;
				}
			}

			// Content of the link link
			tokenContent[1] = source.substring(source.indexOf(this.token[1]) + this.token[1].length, source.indexOf(this.token[2]));
			tokenLength += tokenContent[1].length + this.token[1].length + this.token[2].length;

			// Create a token for this link
			return new MarkdownToken(this.token[0], tokenContent, tokenLength);
		} else {
			return MarkdownToken.nullToken();
		}
	}
};