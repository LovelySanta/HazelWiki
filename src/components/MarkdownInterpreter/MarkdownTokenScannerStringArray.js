import MarkdownTokenScanner from './MarkdownTokenScanner'
import MarkdownToken from './MarkdownToken'

export default class MarkdownTokenScannerStringArray extends MarkdownTokenScanner {
	constructor(tokenStringArray) {
		super(null);
		MarkdownTokenScanner.registerToken(tokenStringArray);
		this.token = tokenStringArray;
	}

	scan(source) {
		var token = this.token[0];
		var tokenLength = token.length;
		if (source.substring(0, tokenLength) == token) {
			// Found the first token, now find the indexes of the others
			var tokenContent = []
			var tokenContentStartIndex = tokenLength;
			var tokenContentEndIndex   = tokenContentStartIndex;
			for(var tokenIndex = 1; tokenIndex < this.token.length; tokenIndex++)
			{
				// next token to search for
				token = this.token[tokenIndex];
				tokenLength = token.length;

				// search for the token
				while(source.substring(++tokenContentEndIndex, tokenContentEndIndex + token.length) != token);

				// concatenate the content
				tokenContent = tokenContent.concat([source.substring(tokenContentStartIndex, tokenContentEndIndex)]);
				tokenContentStartIndex = tokenContentEndIndex + tokenLength;
				tokenContentEndIndex   = tokenContentStartIndex;
			}

			// Finaly return the token
			return new MarkdownToken(this.token.join(''), tokenContent, tokenContentStartIndex);
		} else {
			return MarkdownToken.nullToken();
		}
	}
};