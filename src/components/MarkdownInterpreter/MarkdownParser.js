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
		// tokenizer is used to create tokens
		this.tokenizer = new MarkdownTokenizer();
		this.tokenizer.addScanner(new MarkdownTokenScannerCode());
		this.tokenizer.addScanner(new MarkdownTokenScannerNewline());
		this.tokenizer.addScanner(new MarkdownTokenScannerImage());
		this.tokenizer.addScanner(new MarkdownTokenScannerLink());
		this.tokenizer.addScanner(new MarkdownTokenScannerHeader());
		this.tokenizer.addScanner(new MarkdownTokenScannerBold());
		this.tokenizer.addScanner(new MarkdownTokenScannerItalic());

		// codeScanner is used to convert src to text only (used for code and code block)
		this.codeScanner = new MarkdownTokenizer();
		this.codeBlockScanner = new MarkdownTokenizer();
		this.codeBlockScanner.addScanner(new MarkdownTokenScannerNewline());

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
			if (token.token == MarkdownTokenScannerCode.getToken())
			{
				// Extract the start and end of the code part
				var startIndex = tokenIndex--;
				while(++tokenIndex < this.tokenArray.length-1 && (this.tokenArray[tokenIndex].token != token.token || this.tokenArray[tokenIndex].length < token.length));
				var endIndex = tokenIndex++;

				// Convert the inside of code to text tokens only
				var src = this.tokenizer.untokenize(this.tokenArray.slice(startIndex, endIndex))
				var tokenArray = []
				if (token.length == 1)
				{
					tokenArray = this.codeScanner.tokenize(src).slice(0, -1);
					
				}
				else if (token.length == 3)
				{
					tokenArray = this.codeBlockScanner.tokenize(src).slice(0, -1);
				}

				// replace the tokens with the newly created tokens
				this.tokenArray.splice(startIndex, endIndex-startIndex, ...tokenArray);
				tokenIndex = startIndex + tokenArray.length + 1;
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

	isPagragraphToken(token)
	{
		return token.token == MarkdownTokenScanner.getToken() ||                     // Regular text
			token.token == MarkdownTokenScannerItalic.getToken() ||                  // Italic text
			token.token == MarkdownTokenScannerBold.getToken() ||                    // Bold text
			token.token == MarkdownTokenScannerImage.getToken().join('') ||          // Image
			token.token == MarkdownTokenScannerLink.getToken().join('') ||           // Link
			(token.token == MarkdownTokenScannerCode.getToken() && token.length < 3) // Inline code
	}

	createElements()
	{
		// Strips the tokens into main chunks to create into elements
		var tokenIndex = -1;
		while(++tokenIndex < this.tokenArray.length)
		{
			var token = this.tokenArray[tokenIndex];
			if(token.token == MarkdownTokenScannerHeader.getToken()) // Header
			{
				var newlineIndex = tokenIndex;
				while(++newlineIndex < this.tokenArray.length-1 && this.tokenArray[newlineIndex].token != MarkdownTokenScannerNewline.getToken());
				
				var headerElement = MarkdownParserElement.createHeaderElement(token.length, this.createElementContent(this.tokenArray.slice(tokenIndex+1, newlineIndex)));
				this.elementArray = this.elementArray.concat(headerElement);
				tokenIndex = newlineIndex;
			}
			else if(this.isPagragraphToken(token)) // Paragraph
			{
				var newlineIndex = tokenIndex
				while(++newlineIndex < this.tokenArray.length-1 && !(this.tokenArray[newlineIndex].token == MarkdownTokenScannerNewline.getToken() && this.tokenArray[newlineIndex].length >= 2));

				var paragraphContent = this.createElementContent(this.tokenArray.slice(tokenIndex, newlineIndex));
				var paragraphElement;
				if(newlineIndex-tokenIndex < 2)
					paragraphElement = MarkdownParserElement.createParagraphElement([paragraphContent]);
				else
					paragraphElement = MarkdownParserElement.createParagraphElement(paragraphContent);
				this.elementArray = this.elementArray.concat(paragraphElement);
				tokenIndex = newlineIndex;
			}
			else if(token.token == MarkdownTokenScannerCode.getToken() && token.length >= 3)
			{
				var codeBlockEnd = tokenIndex;
				while(++codeBlockEnd < this.tokenArray.length-1 && this.tokenArray[codeBlockEnd].token !== token.token);
				var codeBlockContent = this.tokenArray.slice(tokenIndex+1, codeBlockEnd)

				var codeLanguage = null;
				if(codeBlockContent[0].token == MarkdownTokenScanner.getToken()) { codeLanguage = codeBlockContent.splice(0,1)[0].content; }
				while(codeBlockContent[0].token == MarkdownTokenScannerNewline.getToken()) { codeBlockContent.splice(0,1); }
				while(codeBlockContent[codeBlockContent.length-1].token == MarkdownTokenScannerNewline.getToken()) { codeBlockContent.splice(-1); }

				var codeBlockElement = MarkdownParserElement.createCodeBlockElement(codeLanguage, this.createElementContent(codeBlockContent));
				this.elementArray = this.elementArray.concat(codeBlockElement);
				tokenIndex = codeBlockEnd;

				if(tokenIndex < this.tokenArray.length-1 && this.tokenArray[tokenIndex+1].token == MarkdownTokenScannerNewline.getToken()) { tokenIndex++; }
			}
			else
			{
				console.log("unhandled token:")
				console.log(token.token)
			}
		}
	}

	createElementContent(tokenArray)
	{
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
			while(++tokenIndex < tokenArray.length && tokenArray[tokenIndex].token != token.token);

			var boldElement = MarkdownParserElement.createBoldElement(this.createElementContent(tokenArray.slice(1, tokenIndex)))
			if (tokenIndex == tokenArray.length-1) { return boldElement; }
			return [boldElement].concat(this.createElementContent(tokenArray.slice(tokenIndex+1)));
		}

		// Italic text
		if(token.token == MarkdownTokenScannerItalic.getToken())
		{
			var tokenIndex = 0;
			while(++tokenIndex < tokenArray.length && tokenArray[tokenIndex].token != token.token);

			var italicElement = MarkdownParserElement.createItalicElement(this.createElementContent(tokenArray.slice(1, tokenIndex)))
			if (tokenIndex == tokenArray.length-1) { return italicElement; }
			return [italicElement].concat(this.createElementContent(tokenArray.slice(tokenIndex+1)));
		}

		// Image
		if(token.token == MarkdownTokenScannerImage.getToken().join(''))
		{
			var linkTokenIndex = 0;
			while(++linkTokenIndex < tokenArray.length && tokenArray[linkTokenIndex].token != token.token);
			var linkElement = this.createElementContent(tokenArray.slice(1, linkTokenIndex))

			var captionTokenIndex = linkTokenIndex;
			while(++captionTokenIndex < tokenArray.length && tokenArray[captionTokenIndex].token != token.token);
			var captionElement = this.createElementContent(tokenArray.slice(linkTokenIndex+1, captionTokenIndex))

			var imageElement = MarkdownParserElement.createImageElement(linkElement, captionElement)
			if (captionTokenIndex == tokenArray.length-1) { return imageElement; }
			return [imageElement].concat(this.createElementContent(tokenArray.slice(captionTokenIndex+1)));
		}

		// Link
		if(token.token == MarkdownTokenScannerLink.getToken().join(''))
		{
			var linkTokenIndex = 0;
			while(++linkTokenIndex < tokenArray.length && tokenArray[linkTokenIndex].token != token.token);
			var linkElement = this.createElementContent(tokenArray.slice(1, linkTokenIndex))

			var captionTokenIndex = linkTokenIndex;
			while(++captionTokenIndex < tokenArray.length && tokenArray[captionTokenIndex].token != token.token);
			var captionElement = this.createElementContent(tokenArray.slice(linkTokenIndex+1, captionTokenIndex))

			var linkingElement = MarkdownParserElement.createLinkElement(linkElement, captionElement)
			if (captionTokenIndex == tokenArray.length-1) { return linkingElement; }
			return [linkingElement].concat(this.createElementContent(tokenArray.slice(captionTokenIndex+1)));
		}

		// Code
		if(token.token == MarkdownTokenScannerCode.getToken())
		{
			var tokenIndex = 0;
			while(++tokenIndex < tokenArray.length && tokenArray[tokenIndex].token != token.token);

			var codeElement = MarkdownParserElement.createCodeElement(this.createElementContent(tokenArray.slice(1, tokenIndex)));
			if (tokenIndex == tokenArray.length-1) { return codeElement; }
			return [codeElement].concat(this.createElementContent(tokenArray.slice(tokenIndex+1)));
		}

	}

	getElements() { return this.elementArray; }

	logTokens()   { console.log(this.tokenArray  ); }
	logElements() { console.log(this.elementArray); }
};