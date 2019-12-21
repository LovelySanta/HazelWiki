import CodeLexer from './CodeLexer'

//Cpp
import CodeTokenScannerCppIgnore from './CodeTokenScannerCpp/CodeTokenScannerCppIgnore';
import CodeTokenScannerCppNumber from './CodeTokenScannerCpp/CodeTokenScannerCppNumber';

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
			this.lexer.addScanner(new CodeTokenScannerCppIgnore());
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
