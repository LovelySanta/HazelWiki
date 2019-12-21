import CodeLexer from './CodeLexer'

//Cpp
import CodeTokenScannerCppIgnore      from './CodeTokenScannerCpp/CodeTokenScannerCppIgnore'
import CodeTokenScannerCppNumber      from './CodeTokenScannerCpp/CodeTokenScannerCppNumber'
import CodeTokenScannerCppParenthesis from './CodeTokenScannerCpp/CodeTokenScannerCppParenthesis'
import CodeTokenScannerCppTypes       from './CodeTokenScannerCpp/CodeTokenScannerCppTypes'
import CodeTokenScannerCppOperator    from './CodeTokenScannerCpp/CodeTokenScannerCppOperator'
import CodeTokenScannerCppComment    from './CodeTokenScannerCpp/CodeTokenScannerCppComment'

export default class CodeParser
{
	constructor()
	{
		// lexer is used to create tokens
		this.lexer = new CodeLexer();
		//this.lexer.addScanner(new CodeTokenScannerData());
	}

	setLanguage(lang)
	{
		lang = lang.toLowerCase();
		console.log(lang)

		this.lexer.resetScanners(); // Remove all scanners

		// Add scanners specific to a language
		if(lang == null || lang == "")
		{
			// no language specified
		}

		// cpp language
		else if(lang == "cpp" || lang == "c++")
		{
			this.lexer.addScanner(new CodeTokenScannerCppComment());
			this.lexer.addScanner(new CodeTokenScannerCppIgnore());
			this.lexer.addScanner(new CodeTokenScannerCppParenthesis());
			this.lexer.addScanner(new CodeTokenScannerCppTypes());
			this.lexer.addScanner(new CodeTokenScannerCppOperator());
			this.lexer.addScanner(new CodeTokenScannerCppNumber());
		}

		// unknown language
		else
		{
			console.warn("unknown code parsing language: " + lang);
		}
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
