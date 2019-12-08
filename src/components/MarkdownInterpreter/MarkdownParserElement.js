import MarkdownTokenScanner        from './MarkdownTokenScanner'        // Base scanner
import MarkdownTokenScannerNewline from './MarkdownTokenScannerNewline' // Newline scanner
import MarkdownTokenScannerCode    from './MarkdownTokenScannerCode'    // Code scanner
import MarkdownTokenScannerImage   from './MarkdownTokenScannerImage'   // Image scanner
import MarkdownTokenScannerLink    from './MarkdownTokenScannerLink'    // Link scanner
import MarkdownTokenScannerHeader  from './MarkdownTokenScannerHeader'  // Header scanner
import MarkdownTokenScannerBold    from './MarkdownTokenScannerBold'    // Bold scanner
import MarkdownTokenScannerItalic  from './MarkdownTokenScannerItalic'  // Italic scanner

export default class MarkdownParserElement
{
	constructor(token, content)
	{
		this.token = token;
		this.content = content
	}

	static createTextElement(content)
	{
		return new MarkdownParserElement(MarkdownTokenScanner.getToken(), [content]);
	}

	static createBoldElement(boldContent)
	{
		return new MarkdownParserElement(MarkdownTokenScannerBold.getToken(), [boldContent]);
	}

	static createItalicElement(italicContent)
	{
		return new MarkdownParserElement(MarkdownTokenScannerItalic.getToken(), [italicContent]);
	}

	static createNewlineElement(amount)
	{
		return new MarkdownParserElement(MarkdownTokenScannerNewline.getToken(), [amount])
	}

	static createHeaderElement(level, contentElement)
	{
		return new MarkdownParserElement(MarkdownTokenScannerHeader.getToken(), [level].concat(contentElement));
	}
};