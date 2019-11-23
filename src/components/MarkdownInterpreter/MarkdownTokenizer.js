import MarkdownToken from './MarkdownToken'

import MarkdownTokenScanner            from './MarkdownTokenScanner'            // Base scanner
import MarkdownTokenScannerHeader      from './MarkdownTokenScannerHeader'      // Header scanner
import MarkdownTokenScannerNewline     from './MarkdownTokenScannerNewline'     // Newline scanner

export default class MarkdownTokenizer {
	constructor() {
		this.scanners = [ // Scanner with highest priority must be on top
			new MarkdownTokenScannerHeader('#'), // Header scanner
			new MarkdownTokenScannerNewline('\n'), // Newline scanner
			new MarkdownTokenScanner('TXT') // Everything that is not detected by other scanners will be detected as text.
		];
		this.scannersAmount = this.scanners.length;
	}

	tokenize(src) {
		this.tokens = this._createTokenArray(src);
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
};