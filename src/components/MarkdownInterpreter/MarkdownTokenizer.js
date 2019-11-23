import MarkdownToken from './MarkdownToken'

import MarkdownTokenScanner       from './MarkdownTokenScanner'       // Base scanner
import MarkdownTokenScannerHeader from './MarkdownTokenScannerHeader' // Header scanner
import MarkdownTokenScannerText   from './MarkdownTokenScannerText'   // Text scanner

export default class MarkdownTokenizer {
	constructor() {
		this.scanners = [
			new MarkdownTokenScannerHeader(),
			new MarkdownTokenScannerText()
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