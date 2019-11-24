import MarkdownToken from './MarkdownToken'

import MarkdownTokenScanner          from './MarkdownTokenScanner'
import MarkdownTokenScannerNewline   from './MarkdownTokenScannerNewline'

export default class MarkdownTokenScannerCodeBlock extends MarkdownTokenScanner {
	constructor() {
		super(null);

		// Token for this scanner
		this.token = this.getToken();
	}

	getToken() { return ["```","```"]; }
	getRegisterToken() { return this.getToken()[0]; }

	scan(source) {
		if (source.substring(0, this.token[0].length) == this.token[0]) {
			var tokenContent = [];
			var tokenContentAmount = 0;
			var tokenLength = this.token[0].length;  // Length of this token

			// Now scan the content of the code block
			var scanners = [
				new MarkdownTokenScannerNewline(),
				new MarkdownTokenScanner()
			];
			var scannersAmount = scanners.length;
			scanners[scannersAmount-1].registerScanner(scanners.slice(0, scannersAmount-1));
			scanners[scannersAmount-1].registerScanner(new MarkdownTokenScannerCodeBlock());

			while(tokenLength < source.length && source.substring(tokenLength, tokenLength + this.token[1].length) != this.token[1]) {
				var prevTokenLength = tokenLength;
				for (var scannerIndex = 0; scannerIndex < scannersAmount; scannerIndex++)
				{
					var token = scanners[scannerIndex].scan(source.substring(tokenLength, source.length));
					if (!token.isNull()) {
						tokenContent[tokenContentAmount++] = token;
						tokenLength += token.length;
						break;
					}
				}
				if (tokenLength == prevTokenLength) {
					console.error("Could not scan this!");
					console.error(source.substring(tokenLength, source.length));
					return MarkdownToken.errorToken();
				}
			}
			tokenLength += this.token[1].length;

			return new MarkdownToken(this.token.join(''), tokenContent, tokenLength);
		} else {
			return MarkdownToken.nullToken();
		}
	}
};