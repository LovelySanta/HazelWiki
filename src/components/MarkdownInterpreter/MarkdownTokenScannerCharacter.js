import MarkdownTokenScanner from './MarkdownTokenScanner'
import MarkdownToken from './MarkdownToken'

export default class MarkdownTokenScannerCharacter extends MarkdownTokenScanner {
	/* This class can scan for a single character,
	 * with multiple appearances after each other.
	 */
	constructor(tokenCharacter) {
		super(null);
		MarkdownTokenScanner.registerToken(tokenCharacter);
		this.token = tokenCharacter;
	}

	scan(source) {
		if (source.charAt(0) == this.token) {
			var headerIndex = 0
			while(source.charAt(++headerIndex) == this.token);
			// we found a header
			return new MarkdownToken(this.token, headerIndex, headerIndex);
		} else {
			return MarkdownToken.nullToken();
		}
	}
};