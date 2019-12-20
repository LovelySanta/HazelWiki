import MarkdownToken from './MarkdownToken'
import MarkdownTokenizer from './MarkdownTokenizer'

import MarkdownTokenScanner        from './MarkdownTokenScanner'        // Base scanner
import MarkdownTokenScannerNewline from './MarkdownTokenScannerNewline' // Newline scanner
import MarkdownTokenScannerCode    from './MarkdownTokenScannerCode'    // Code scanner
import MarkdownTokenScannerImage   from './MarkdownTokenScannerImage'   // Image scanner
import MarkdownTokenScannerLink    from './MarkdownTokenScannerLink'    // Link scanner
import MarkdownTokenScannerHeader  from './MarkdownTokenScannerHeader'  // Header scanner
import MarkdownTokenScannerList    from './MarkdownTokenScannerList'    // List scanner
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
		this.tokenizer.addScanner(new MarkdownTokenScannerList());
		this.tokenizer.addScanner(new MarkdownTokenScannerBold());
		this.tokenizer.addScanner(new MarkdownTokenScannerItalic());

		// codeScanner is used to convert src to text only (used for code and code block)
		this.codeScanner = new MarkdownTokenizer();
		this.codeBlockScanner = new MarkdownTokenizer();
		this.codeBlockScanner.addScanner(new MarkdownTokenScannerNewline());

		this.src = '';
		this.tokenArray = [];
		this.elementArray = [];

		this.insideParagraph = false
	}

	parse(src)
	{
		// Find tokens in the source
		this.setSrc(src);
		this.createTokens();
		this.cleanupTokens();

		// Create elements from tokens
		this.createElements();
		return this.getElements();
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

			// remove \r token
			if (token.token == MarkdownTokenScanner.getToken() && token.content === "\r")
			{
				this.tokenArray.splice(--tokenIndex, 1);
			}

			// remove EOF token
			else if (token.isEnd())
			{
				this.tokenArray.splice(--tokenIndex, 1);
			}

			// remove space after header token
			else if (token.token == MarkdownTokenScannerHeader.getToken())
			{
				var nextToken = this.tokenArray[tokenIndex];
				if (nextToken.token == MarkdownTokenScanner.getToken() && nextToken.content === " ")
					this.tokenArray.splice(tokenIndex--, 1);
			}

			// remove invalid list tokens + remove spaces before/after valid list tokens
			else if (token.token == MarkdownTokenScannerList.getToken())
			{
				// Check if this token is a valid token
				var offset = 1;
				while(++offset <= tokenIndex && this.tokenArray[tokenIndex-offset].token == MarkdownTokenScanner.getToken() && this.tokenArray[tokenIndex-offset].content === " ");

				if(this.tokenArray[tokenIndex-offset].token === MarkdownTokenScannerNewline.getToken())
				{
					// Valid list, remove spaces before/after it
					var prevToken = this.tokenArray[tokenIndex-2];
					var nextToken = this.tokenArray[tokenIndex];
					if(prevToken.token == MarkdownTokenScanner.getToken() && prevToken.content === " ")
					{
						token.content++;
						tokenIndex--;
						this.tokenArray.splice(--tokenIndex, 1); // remove space token before this list token
					}
					else if (nextToken.token == MarkdownTokenScanner.getToken() && nextToken.content === " ")
					{
						this.tokenArray.splice(tokenIndex--, 1); // remove space after this list token
					}
				}
				else
				{
					// Invalid list token, unscan it
					this.tokenArray[--tokenIndex] = new MarkdownToken(MarkdownTokenScanner.getToken(), token.token, token.token.length);
				}
			}
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
		return (!this.insideParagraph) && (
			token.token == MarkdownTokenScanner.getToken() ||                        // Regular text
			token.token == MarkdownTokenScannerNewline.getToken() ||                 // Newline
			token.token == MarkdownTokenScannerItalic.getToken() ||                  // Italic text
			token.token == MarkdownTokenScannerBold.getToken() ||                    // Bold text
			token.token == MarkdownTokenScannerList.getToken() ||                    // List
			token.token == MarkdownTokenScannerImage.getToken().join('') ||          // Image
			token.token == MarkdownTokenScannerLink.getToken().join('') ||           // Link
			(token.token == MarkdownTokenScannerCode.getToken() && token.length < 3) // Inline code
		);
	}

	createElements()
	{
		if(this.tokenArray && this.tokenArray.length > 0)
			this.elementArray = this.createElementsRecursive(this.tokenArray);
		else
			this.elementArray = [];
	}

	createElementsRecursive(tokenArray)
	{
		if(tokenArray.length == 0)
		{
			console.warn("Parser received an empty array!");
			return [];
		}
		var token = tokenArray[0];

		// Header
		if(token.token == MarkdownTokenScannerHeader.getToken())
		{
			// Find the end of the header
			var newlineTokenIndex = 0;
			while(++newlineTokenIndex < tokenArray.length-1 && tokenArray[newlineTokenIndex].token != MarkdownTokenScannerNewline.getToken());

			// Create the header element
			this.insideParagraph = true; // a header content can't be a paragraph
			var headerElement = MarkdownParserElement.createHeaderElement(token.length, this.createElementsRecursive(tokenArray.slice(1, newlineTokenIndex)));
			this.insideParagraph = false;

			// Return the header
			if (newlineTokenIndex == tokenArray.length-1) { return headerElement; }
			return [headerElement].concat(this.createElementsRecursive(tokenArray.slice(newlineTokenIndex+1)));
		}

		// Code block
		if(token.token == MarkdownTokenScannerCode.getToken() && token.length >= 3)
		{
			// Find the end of the code block
			var codeBlockEnd = 0;
			while(++codeBlockEnd < tokenArray.length-1 && tokenArray[codeBlockEnd].token !== token.token);
			var codeBlockContent = tokenArray.slice(1, codeBlockEnd)

			// Extract the code language
			var codeLanguage = null;
			if(codeBlockContent[0].token == MarkdownTokenScanner.getToken()) { codeLanguage = codeBlockContent.splice(0,1)[0].content; }
			while(codeBlockContent[0].token == MarkdownTokenScannerNewline.getToken()) { codeBlockContent.splice(0,1); }
			while(codeBlockContent[codeBlockContent.length-1].token == MarkdownTokenScannerNewline.getToken()) { codeBlockContent.splice(-1); }

			// Create the code block element
			this.insideParagraph = true; // a code block can't be a paragraph
			var codeBlockElement = MarkdownParserElement.createCodeBlockElement(codeLanguage, this.createElementsRecursive(codeBlockContent));
			this.insideParagraph = false;

			// Return the code block element
			if (codeBlockEnd == tokenArray.length-1) { return codeBlockElement; }
			return [codeBlockElement].concat(this.createElementsRecursive(tokenArray.slice(codeBlockEnd+1)));
		}

		// Paragraph
		if(this.isPagragraphToken(token))
		{
			// Remove leading newline tokens first
			var paragraphBeginIndex = -1
			while(++paragraphBeginIndex < tokenArray.length-1 && tokenArray[paragraphBeginIndex].token == MarkdownTokenScannerNewline.getToken());

			// Find the end of the current paragraph
			var newlineTokenIndex = paragraphBeginIndex;
			while(++newlineTokenIndex < tokenArray.length-1 && !(tokenArray[newlineTokenIndex].token == MarkdownTokenScannerNewline.getToken() && tokenArray[newlineTokenIndex].length >= 2));

			// Create the paragraph element
			this.insideParagraph = true;
			var paragraphElement = MarkdownParserElement.createParagraphElement(this.createElementsRecursive(tokenArray.slice(paragraphBeginIndex, newlineTokenIndex)));
			this.insideParagraph = false;

			// Return the paragraph element
			if (newlineTokenIndex >= tokenArray.length - 1) { return paragraphElement; }
			return [paragraphElement].concat(this.createElementsRecursive(tokenArray.slice(newlineTokenIndex+1)));
		}

		// Newline
		if(token.token == MarkdownTokenScannerNewline.getToken())
		{
			// Create the newline element
			var element = MarkdownParserElement.createNewlineElement(token.length)

			// Return the newline element
			if (tokenArray.length == 1) { return element; }
			return [element].concat(this.createElementsRecursive(tokenArray.slice(1)));
		}

		// Regular text
		if(token.token == MarkdownTokenScanner.getToken())
		{
			// Create the text element
			var element = MarkdownParserElement.createTextElement(token.content);

			// Return the text element
			if (tokenArray.length == 1) { return element; }
			return [element].concat(this.createElementsRecursive(tokenArray.slice(1)));
		}

		// Bold text
		if(token.token == MarkdownTokenScannerBold.getToken())
		{
			// Find the end of the bold element
			var tokenIndex = 0;
			while(++tokenIndex < tokenArray.length && tokenArray[tokenIndex].token != token.token);

			// Create the bold element
			var boldElement = MarkdownParserElement.createBoldElement(this.createElementsRecursive(tokenArray.slice(1, tokenIndex)))

			// Return the bold element
			if (tokenIndex == tokenArray.length-1) { return boldElement; }
			return [boldElement].concat(this.createElementsRecursive(tokenArray.slice(tokenIndex+1)));
		}

		// Italic text
		if(token.token == MarkdownTokenScannerItalic.getToken())
		{
			// Find the end of the italic element
			var tokenIndex = 0;
			while(++tokenIndex < tokenArray.length && tokenArray[tokenIndex].token != token.token);

			// Create the italic element
			var italicElement = MarkdownParserElement.createItalicElement(this.createElementsRecursive(tokenArray.slice(1, tokenIndex)))

			// Return the italic element
			if (tokenIndex == tokenArray.length-1) { return italicElement; }
			return [italicElement].concat(this.createElementsRecursive(tokenArray.slice(tokenIndex+1)));
		}

		// Image
		if(token.token == MarkdownTokenScannerImage.getToken().join(''))
		{
			// Find the end of the caption element, the part between the '[]'
			var captionTokenIndex = 0;
			while(++captionTokenIndex < tokenArray.length && tokenArray[captionTokenIndex].token != token.token);

			// Create the caption element
			var captionElement;
			if(captionTokenIndex > 1)
				captionElement = this.createElementsRecursive(tokenArray.slice(1, captionTokenIndex));
			else
				captionElement = this.createElementsRecursive([new MarkdownToken(MarkdownTokenScanner.getToken(), "")]);

			// Find the end of the source link element, the part between the '()'
			var linkTokenIndex = captionTokenIndex;
			while(++linkTokenIndex < tokenArray.length && tokenArray[linkTokenIndex].token != token.token);

			// Create the source link element
			var linkElement;
			if(linkTokenIndex-captionTokenIndex > 1)
				linkElement = this.createElementsRecursive(tokenArray.slice(captionTokenIndex+1, linkTokenIndex));
			else
				linkElement = this.createElementsRecursive([new MarkdownToken(MarkdownTokenScanner.getToken(), "")]);

			// Create the image element
			var imageElement = MarkdownParserElement.createImageElement(linkElement, captionElement);

			// Return the image element
			if (linkTokenIndex == tokenArray.length-1) { return imageElement; }
			return [imageElement].concat(this.createElementsRecursive(tokenArray.slice(linkTokenIndex+1)));
		}

		// Link
		if(token.token == MarkdownTokenScannerLink.getToken().join(''))
		{
			// Find the end of the caption element, the part between the '[]'
			var captionTokenIndex = 0;
			while(++captionTokenIndex < tokenArray.length && tokenArray[captionTokenIndex].token != token.token);

			// Create the caption element
			var captionElement;
			if(captionTokenIndex > 1)
				captionElement = this.createElementsRecursive(tokenArray.slice(1, captionTokenIndex));
			else
				captionElement = this.createElementsRecursive([new MarkdownToken(MarkdownTokenScanner.getToken(), "")]);

			// Find the end of the source link element, the part between the '()'
			var linkTokenIndex = captionTokenIndex;
			while(++linkTokenIndex < tokenArray.length && tokenArray[linkTokenIndex].token != token.token);

			// Create the source link element
			var linkElement;
			if(linkTokenIndex-captionTokenIndex>1)
				linkElement = this.createElementsRecursive(tokenArray.slice(captionTokenIndex+1, linkTokenIndex));
			else
				linkElement = this.createElementsRecursive([new MarkdownToken(MarkdownTokenScanner.getToken(), "")]);

			// Create the link element
			var linkingElement = MarkdownParserElement.createLinkElement(linkElement, captionElement);

			// Return the link element
			if (linkTokenIndex == tokenArray.length-1) { return linkingElement; }
			return [linkingElement].concat(this.createElementsRecursive(tokenArray.slice(linkTokenIndex+1)));
		}

		// List
		if(token.token == MarkdownTokenScannerList.getToken())
		{
			// Get all list items in this list
			var listItems = []
			var listItemBeginIndex = 0;
			while(listItemBeginIndex < tokenArray.length && tokenArray[listItemBeginIndex].token == MarkdownTokenScannerList.getToken())
			{
				// Search for the end of this list item
				var listItemEndIndex = listItemBeginIndex;
				while(++listItemEndIndex < tokenArray.length && tokenArray[listItemEndIndex].token !== MarkdownTokenScannerNewline.getToken());

				// Add this list item to the list
				listItems.push(tokenArray.slice(listItemBeginIndex, listItemEndIndex))

				// Get the start of the next list item (account for any amount of newlines)
				listItemBeginIndex = listItemEndIndex + 1;
			}

			// Create a recursive list with sublists
			function createRecursiveListItems(list) {
				var recursiveListLevel = list[0][0].content;
				var recursiveList = [];

				// create a list of all elements on this list level
				var listIndex = -1
				while(++listIndex < list.length && list[listIndex][0].content <= recursiveListLevel)
				{
					var thisListElement = list[listIndex].slice(1);

					// if there is a sub list level, create a list of those recursively
					var subListIndex = listIndex;
					while(++subListIndex < list.length && list[subListIndex][0].content > recursiveListLevel);
					var subListElements = []
					if(subListIndex-listIndex>1)
					{
						subListElements = createRecursiveListItems(list.slice(listIndex+1, subListIndex))
						//console.log(subListElements)
					}

					// add this element to the list
					recursiveList.push([thisListElement, subListElements])
					listIndex = subListIndex-1;
				}

				// return the list
				return recursiveList;
			}
			listItems = createRecursiveListItems(listItems);

			// Convert this list to elements
			function createRecursiveListElements(self, list) {
				var listIndex = -1;
				while(++listIndex < list.length)
				{
					var listElement = self.createElementsRecursive(list[listIndex][0]);
					if(listElement.length === undefined) listElement = [listElement];

					var subListElement = null;
					if(list[listIndex][1].length > 0)
					{
						//console.log(list[listIndex][1])
						subListElement = createRecursiveListElements(self, list[listIndex][1]);
					}
					list[listIndex] = [listElement, subListElement];
				}
				return MarkdownParserElement.createListElement(list);
			}
			var listElement = createRecursiveListElements(this, listItems);

			// Return the list element
			if (listItemEndIndex == tokenArray.length-1) { return listElement; }
			return [listElement].concat(this.createElementsRecursive(tokenArray.slice(listItemEndIndex+1)));
		}

		// Code
		if(token.token == MarkdownTokenScannerCode.getToken())
		{
			// Find the end of the code
			var tokenIndex = 0;
			while(++tokenIndex < tokenArray.length && tokenArray[tokenIndex].token != token.token);

			// Create the code element
			var codeElement = MarkdownParserElement.createCodeElement(this.createElementsRecursive(tokenArray.slice(1, tokenIndex)));

			// Return the code element
			if (tokenIndex == tokenArray.length-1) { return codeElement; }
			return [codeElement].concat(this.createElementsRecursive(tokenArray.slice(tokenIndex+1)));
		}

		console.warn("unknown token: ".concat(token.token))
		if(tokenArray.length > 1)
			return this.createElementsRecursive(tokenArray.slice(1));
		return [];
	}

	getElements() { return this.elementArray; }

	logTokens()   { console.log(this.tokenArray  ); }
	logElements() { console.log(this.elementArray); }
};
