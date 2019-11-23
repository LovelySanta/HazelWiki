import MarkdownToken from './MarkdownToken'

import MarkdownTokenScanner        from './MarkdownTokenScanner'        // Base scanner
import MarkdownTokenScannerHeader  from './MarkdownTokenScannerHeader'  // Header scanner
import MarkdownTokenScannerImage   from './MarkdownTokenScannerImage'   // Image scanner
import MarkdownTokenScannerLink    from './MarkdownTokenScannerLink'    // Link scanner
import MarkdownTokenScannerNewline from './MarkdownTokenScannerNewline' // Newline scanner

export default class MarkdownTokenizer {
	constructor() {
		this.scanners = [ // Scanner with highest priority must be on top
			new MarkdownTokenScannerHeader(),
			new MarkdownTokenScannerImage(),
			new MarkdownTokenScannerLink(),
			new MarkdownTokenScannerNewline(),
			new MarkdownTokenScanner()
		];
		this.scannersAmount = this.scanners.length;
	}

	tokenize(src) {
		this.tokens = this._createTokenArray(src);
		this._cleanTokenArray();
		console.log(this.tokens);
	}

	_createTokenArray(source) {
		if (source == null || source == '') {
			return [MarkdownToken.endOfFileToken()];
		} else {
			for (var scannerIndex = 0; scannerIndex < this.scannersAmount; scannerIndex++)
			{
				var token = this.scanners[scannerIndex].scan(source);
				if (!token.isNull()) {
					return [token].concat(this._createTokenArray(source.substr(token.length)));
				}
			}
			return [MarkdownToken.errorToken()];
		}
	}
s
	_cleanTokenArray() {
		var tokenIndex = this.tokens.length;
		while(--tokenIndex >= 0) {
			var token = this.tokens[tokenIndex];
			var removeToken = false;

			if (token.token == 'TXT' && token.length == 1) { // Remove empty string tokens
				removeToken = true;
			} else if (token.token == '\n' && this.tokens[tokenIndex-1].token == '\n') { // Merge newline tokens
				this.tokens[tokenIndex-1].length += token.length;
				removeToken = true;
			}

			if (removeToken) { this.tokens.splice(tokenIndex++, 1); }
		}
	}
};