import MarkdownTokenizer from './MarkdownTokenizer'

export default class MarkdownParser
{
	constructor()
	{
		this.tokenizer = new MarkdownTokenizer();
	}

	setSource(src)
	{
		this.src = src;
	}

	parseSource()
	{
		this.src = this.tokenizer.tokenize(this.src);
		this.src = this.tokenizer.mergeTokens(this.src);
	}

	log()
	{
		console.log(this.src);
	}
};