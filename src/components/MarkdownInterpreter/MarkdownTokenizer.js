import MarkdownToken from './MarkdownToken'

import MarkdownTokenScanner        from './MarkdownTokenScanner'        // Base scanner
import MarkdownTokenScannerNewline from './MarkdownTokenScannerNewline' // Newline scanner
import MarkdownTokenScannerCode    from './MarkdownTokenScannerCode'    // Code scanner
import MarkdownTokenScannerImage   from './MarkdownTokenScannerImage'   // Image scanner
import MarkdownTokenScannerLink    from './MarkdownTokenScannerLink'    // Link scanner
import MarkdownTokenScannerHeader  from './MarkdownTokenScannerHeader'  // Header scanner
import MarkdownTokenScannerBold    from './MarkdownTokenScannerBold'    // Bold scanner
import MarkdownTokenScannerItalic  from './MarkdownTokenScannerItalic'  // Italic scanner

export default class MarkdownTokenizer {
	constructor(addScanners) {
		this.scanner = new MarkdownTokenScanner();

		if (addScanners)
		{
			this.scanner.addScanner(new MarkdownTokenScannerCode());
			this.scanner.addScanner(new MarkdownTokenScannerNewline());
			this.scanner.addScanner(new MarkdownTokenScannerImage());
			this.scanner.addScanner(new MarkdownTokenScannerLink());
			this.scanner.addScanner(new MarkdownTokenScannerHeader());
			this.scanner.addScanner(new MarkdownTokenScannerBold());
			this.scanner.addScanner(new MarkdownTokenScannerItalic());
		}
	}

	tokenize(src)
	{
		// Compiles a source into an array of tokens
		var token = this.scanner.scan(src);
		if (token.isEnd()) { return token; }
		return [token].concat(this.tokenize(src.substr(token.length)));
	}

	untokenize(tokenArray)
	{
		// Uncompiles an array of tokens back to the source and some post processing
		var src = this.untokenizeRecursive(tokenArray);

		src = src.replace(/\n\n/g, '\n');

		return src;
	}

	untokenizeRecursive(tokenArray)
	{
		// Uncompiles an array of tokens back to the source recursivly
		if (tokenArray.length <= 1) { return this.scanner.unscan(tokenArray[0]); }
		return this.scanner.unscan(tokenArray[0]).concat(this.untokenizeRecursive(tokenArray.slice(1)))
	}
};