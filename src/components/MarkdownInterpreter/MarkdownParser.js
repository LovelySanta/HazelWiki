import MarkdownToken from './MarkdownToken'
import MarkdownTokenizer from './MarkdownTokenizer'

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
		this.tokenizer = new MarkdownTokenizer(true);
		this.codeScanner = new MarkdownTokenizer(false);

		this.src = '';
		this.tokenArray = [];
		this.elementArray = [];
	}

	setSrc(src)
	{
		this.src = src;
	}

	createTokens()
	{
		this.tokenArray = this.tokenizer.tokenize(this.src);
	}

	cleanupTokens()
	{
		// Clean up tokens before creating elements
		this.untokenizeCodeTokens();
		this.removeTokens();
		this.mergeTokens();
	}

	untokenizeCodeTokens()
	{
		// Untokenzize code blocks
		var tokenIndex = 0;
		while(tokenIndex < this.tokenArray.length-1)
		{
			var token = this.tokenArray[tokenIndex++];
			if (token.token == MarkdownTokenScannerCode.getToken() && (token.length == 1 || token.length == 3))
			{
				// Extract the start and end of the code part
				var startIndex = tokenIndex--;
				//console.log(startIndex)
				while(++tokenIndex < this.tokenArray.length-1 && (this.tokenArray[tokenIndex].token != token.token || this.tokenArray[tokenIndex].length < token.length));
				var endIndex = tokenIndex++;

				// Convert the code to text
				var txt = this.codeScanner.tokenize(this.tokenizer.untokenize(this.tokenArray.slice(startIndex, endIndex))).slice(0, -1);
				this.tokenArray.splice(startIndex, endIndex-startIndex, ...txt);
				//console.log(this.tokenArray);
				tokenIndex = startIndex + txt.length + 1;
			}
		}
	}

	removeTokens()
	{
		// Removes unneeded tokens
		var tokenIndex = 0;
		while(tokenIndex < this.tokenArray.length)
		{
			var token = this.tokenArray[tokenIndex++];
			var removeToken = false; // will remove this token

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
				var nextToken = this.tokenArray[tokenIndex];
				if (nextToken.token == MarkdownTokenScanner.getToken() && nextToken.content === " ")
					this.tokenArray.splice(tokenIndex--, 1); // remove space after header token
			}

			if (removeToken)
				this.tokenArray.splice(--tokenIndex, 1);
		}
	}

	mergeTokens()
	{
		// Merges similar tokens next to each other together
		var tokenIndex = 0;
		while(tokenIndex < this.tokenArray.length-1)
		{
			var token = this.tokenArray[tokenIndex++];
			var removeToken = false; // will remove this token
			var nextToken = this.tokenArray[tokenIndex];

			if (token.token === MarkdownTokenScanner.getToken() && nextToken.token === token.token)
			{
				nextToken.content = token.content.concat(nextToken.content);
				nextToken.length += token.length;
				removeToken = true; // merges text together
			}
			else if (token.token === MarkdownTokenScannerNewline.getToken() && nextToken.token === token.token)
			{
				nextToken.length += token.length;
				removeToken = true; // merges newlines together
			}
			else if (token.token === MarkdownTokenScannerHeader.getToken() && nextToken.token === token.token)
			{
				nextToken.length += token.length;
				removeToken = true; // merges headers together
			}

			if (removeToken)
				this.tokenArray.splice(--tokenIndex, 1);
		}
	}

	createElements()
	{
		// Strips the tokens into main chunks to create into elements
		var tokenIndex = -1;
		while(++tokenIndex < this.tokenArray.length-1)
		{
			var token = this.tokenArray[tokenIndex];
			if(token.token == MarkdownTokenScannerHeader.getToken()) // Header
			{
				console.log("header");
				var newlineIndex = tokenIndex;
				while(++newlineIndex < this.tokenArray.length-1 && this.tokenArray[newlineIndex].token != MarkdownTokenScannerNewline.getToken());
				
				var headerElement = MarkdownParserElement.createHeaderElement(token.length, this.createElementContent(this.tokenArray.slice(tokenIndex+1, newlineIndex)));
				this.elementArray = this.elementArray.concat(headerElement);
				tokenIndex = newlineIndex;
			}
			else if(token.token == MarkdownTokenScanner.getToken() || // TODO: convert this to just an else statement
					token.token == MarkdownTokenScannerItalic.getToken() ||
					token.token == MarkdownTokenScannerBold.getToken() ||
					token.token == MarkdownTokenScannerImage.getToken().join('')||
					token.token == MarkdownTokenScannerLink.getToken().join('')) // Paragraph
			{
				console.log("paragraph");
				var newlineIndex = tokenIndex
				while(++newlineIndex < this.tokenArray.length-1 && !(this.tokenArray[newlineIndex].token == MarkdownTokenScannerNewline.getToken() && this.tokenArray[newlineIndex].length >= 2));

				var paragraphElement = MarkdownParserElement.createParagraphElement(this.createElementContent(this.tokenArray.slice(tokenIndex, newlineIndex)))
				this.elementArray = this.elementArray.concat(paragraphElement);
				tokenIndex = newlineIndex+1;
			}
		}
	}

	createElementContent(tokenArray)
	{
		console.log(tokenArray)
		var token = tokenArray[0];

		// Newline
		if(token.token == MarkdownTokenScannerNewline.getToken())
		{
			var element = MarkdownParserElement.createNewlineElement(token.length)
			if (tokenArray.length == 1) { return element; }
			return [element].concat(this.createElementContent(tokenArray.slice(1)));
		}

		// Regular text
		if(token.token == MarkdownTokenScanner.getToken())
		{
			var element = MarkdownParserElement.createTextElement(token.content);
			if (tokenArray.length == 1) { return element; }
			return [element].concat(this.createElementContent(tokenArray.slice(1)));
		}

		// Bold text
		if(token.token == MarkdownTokenScannerBold.getToken())
		{
			var tokenIndex = 0;
			while(++tokenIndex < tokenArray.length && tokenArray[tokenIndex].token != MarkdownTokenScannerBold.getToken());

			var boldElement = MarkdownParserElement.createBoldElement(this.createElementContent(tokenArray.slice(1, tokenIndex)))
			if (tokenIndex == tokenArray.length-1) { return boldElement; }
			return [boldElement].concat(this.createElementContent(tokenArray.slice(tokenIndex+1)));
		}

		// Italic text
		if(token.token == MarkdownTokenScannerItalic.getToken())
		{
			var tokenIndex = 0;
			while(++tokenIndex < tokenArray.length && tokenArray[tokenIndex].token != MarkdownTokenScannerItalic.getToken());

			var italicElement = MarkdownParserElement.createItalicElement(this.createElementContent(tokenArray.slice(1, tokenIndex)))
			if (tokenIndex == tokenArray.length-1) { return italicElement; }
			return [italicElement].concat(this.createElementContent(tokenArray.slice(tokenIndex+1)));
		}

		// Image
		if(token.token == MarkdownTokenScannerImage.getToken().join(''))
		{
			var linkTokenIndex = 0;
			while(++linkTokenIndex < tokenArray.length && tokenArray[linkTokenIndex].token != MarkdownTokenScannerImage.getToken().join(''));
			var linkElement = this.createElementContent(tokenArray.slice(1, linkTokenIndex))

			var captionTokenIndex = linkTokenIndex;
			while(++captionTokenIndex < tokenArray.length && tokenArray[captionTokenIndex].token != MarkdownTokenScannerImage.getToken().join(''));
			var captionElement = this.createElementContent(tokenArray.slice(linkTokenIndex+1, captionTokenIndex))

			var imageElement = MarkdownParserElement.createImageElement(linkElement, captionElement)
			if (captionTokenIndex == tokenArray.length-1) { return imageElement; }
			return [imageElement].concat(this.createElementContent(tokenArray.slice(captionTokenIndex+1)));
		}

		// Link
		if(token.token == MarkdownTokenScannerLink.getToken().join(''))
		{
			var linkTokenIndex = 0;
			while(++linkTokenIndex < tokenArray.length && tokenArray[linkTokenIndex].token != MarkdownTokenScannerLink.getToken().join(''));
			var linkElement = this.createElementContent(tokenArray.slice(1, linkTokenIndex))

			var captionTokenIndex = linkTokenIndex;
			while(++captionTokenIndex < tokenArray.length && tokenArray[captionTokenIndex].token != MarkdownTokenScannerLink.getToken().join(''));
			var captionElement = this.createElementContent(tokenArray.slice(linkTokenIndex+1, captionTokenIndex))

			var linkingElement = MarkdownParserElement.createLinkElement(linkElement, captionElement)
			if (captionTokenIndex == tokenArray.length-1) { return linkingElement; }
			return [linkingElement].concat(this.createElementContent(tokenArray.slice(captionTokenIndex+1)));
		}

	}

	getElements() { return this.elementArray; }

	logTokens()   { console.log(this.tokenArray  ); }
	logElements() { console.log(this.elementArray); }
};