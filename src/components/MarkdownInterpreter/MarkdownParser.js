import MarkdownToken from './MarkdownToken'

import MarkdownTokenScanner        from './MarkdownTokenScanner'        // Base scanner
import MarkdownTokenScannerNewline from './MarkdownTokenScannerNewline' // Newline scanner
import MarkdownTokenScannerCode    from './MarkdownTokenScannerCode'    // Code scanner
import MarkdownTokenScannerImage   from './MarkdownTokenScannerImage'   // Image scanner
import MarkdownTokenScannerLink    from './MarkdownTokenScannerLink'    // Link scanner
import MarkdownTokenScannerHeader  from './MarkdownTokenScannerHeader'  // Header scanner
import MarkdownTokenScannerBold    from './MarkdownTokenScannerBold'    // Bold scanner
import MarkdownTokenScannerItalic  from './MarkdownTokenScannerItalic'  // Italic scanner

import MarkdownParserElement from './MarkdownParserElement'

export default class MarkdownParser
{
	constructor()
	{
		this.tokenArray = [];
		this.elementArray = [];
	}

	setTokens(tokenArray)
	{
		this.tokenArray = tokenArray;
	}

	cleanTokens()
	{
		// Removes unneeded tokens
		var tokenIndex = 0;
		while(tokenIndex < this.tokenArray.length)
		{
			var token = this.tokenArray[tokenIndex];
			var removeToken = false; // will remove the next token

			if (token.token == MarkdownTokenScanner.getToken() && token.content === "\r")
			{
				removeToken = true; // remove \r token
			}
			else if (token.isEnd())
			{
				removeToken = true; // remove EOF token
			}
			else if (token.token == MarkdownTokenScannerHeader.getToken())
			{
				var nextToken = this.tokenArray[tokenIndex + 1];
				if (nextToken.token == MarkdownTokenScanner.getToken() && nextToken.content === " ")
				{
					this.tokenArray.splice(tokenIndex+1, 1);
				}
			}

			if (removeToken)
			{
				this.tokenArray.splice(tokenIndex, 1);
			}
			else
			{
				++tokenIndex;
			}
		}
	}

	compressTokens()
	{
		// Merges similar tokens next to each other together
		var tokenIndex = 0;
		while(tokenIndex < this.tokenArray.length-1)
		{
			var token = this.tokenArray[tokenIndex++];
			var removeToken = false; // will remove the next token

			if (token.token == MarkdownTokenScanner.getToken() && this.tokenArray[tokenIndex].token == token.token)
			{
				token.content = token.content.concat(this.tokenArray[tokenIndex].content);
				token.length += this.tokenArray[tokenIndex].length;
				removeToken = true; // merges text together
			}
			else if (token.token == MarkdownTokenScannerNewline.getToken() && this.tokenArray[tokenIndex].token == token.token)
			{
				token.length += this.tokenArray[tokenIndex].length;
				removeToken = true; // merges newlines together
			}
			else if (token.token == MarkdownTokenScannerHeader.getToken() && this.tokenArray[tokenIndex].token == token.token)
			{
				token.length += this.tokenArray[tokenIndex].length;
				removeToken = true; // merges headers together
			}

			if (removeToken)
			{
				this.tokenArray.splice(tokenIndex--, 1);
			}
		}
	}

	parseTokens()
	{
		// Strips the tokens into main chunks to create into elements
		var tokenIndex = 0;
		while(tokenIndex < this.tokenArray.length-1)
		{
			var token = this.tokenArray[tokenIndex];
			if(token.token == MarkdownTokenScannerHeader.getToken())
			{
				var newlineIndex = tokenIndex;
				while(++newlineIndex < this.tokenArray.length-1 && this.tokenArray[newlineIndex].token != MarkdownTokenScannerNewline.getToken());
				this.elementArray = this.elementArray.concat(this.createContentElement(this.tokenArray.slice(tokenIndex, newlineIndex)));
				tokenIndex = newlineIndex;
			}
			else
			{
				tokenIndex++; // prevent crashing temporary
			}
		}
	}

	createContentElement(tokenArray)
	{
		var token = tokenArray[0];
		if(token.token == MarkdownTokenScanner.getToken())
		{
			var element = MarkdownParserElement.createTextElement(token.content);
			if (tokenArray.length == 1)
			{
				return element;
			}
			return [element].concat(this.createContentElement(tokenArray.slice(1)));
		}

		if(token.token == MarkdownTokenScannerBold.getToken())
		{
			var tokenIndex = 0;
			while(++tokenIndex < tokenArray.length && tokenArray[tokenIndex].token != MarkdownTokenScannerBoldc.getToken());

			var boldElement = MarkdownParserElement.createBoldElement(this.createContentElement(tokenArray.slice(1, tokenIndex)))
			if (tokenIndex == tokenArray.length) { return boldElement; }
			return [boldElement].concat(this.createContentElement(tokenArray.slice(tokenIndex+1)));
		}

		if(token.token == MarkdownTokenScannerItalic.getToken())
		{
			var tokenIndex = 0;
			while(++tokenIndex < tokenArray.length && tokenArray[tokenIndex].token != MarkdownTokenScannerItalic.getToken());

			var ItalicElement = MarkdownParserElement.createItalicElement(this.createContentElement(tokenArray.slice(1, tokenIndex)))
			if (tokenIndex == tokenArray.length) { return ItalicElement; }
			return [ItalicElement].concat(this.createContentElement(tokenArray.slice(tokenIndex+1)));
		}

		if(token.token == MarkdownTokenScannerHeader.getToken())
		{
			return MarkdownParserElement.createHeaderElement(token.length, this.createContentElement(tokenArray.slice(1)));
		}

	}

	logTokens()   { console.log(this.tokenArray  ); }
	logElements() { console.log(this.elementArray); }
};