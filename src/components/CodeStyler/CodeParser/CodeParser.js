import CodeLexer from './CodeLexer'

export default class CodeParser
{
	constructor()
	{
		// lexer is used to create tokens
		this.lexer = new CodeLexer();
		//this.lexer.addScanner(new CodeTokenScannerData());
	}

	parse(src)
	{
		// Find tokens in the source
		this.setSrc(src);
		this.createTokens();
		console.log(this.tokenArray)
		//this.cleanupTokens();

		// Create elements from tokens
		//this.createElements();
		//return this.getElements();
		return [];
	}

	setSrc(src)
	{
		this.src = src;
	}

	createTokens()
	{
		this.tokenArray = this.lexer.tokenize(this.src);
	}
};
