import MarkdownTokenizer from './MarkdownTokenizer'

export default class MarkdownParser {
	constructor() {}

	setSource(src) {
		this.src = src;
	}

	parseSource() {
		var tokenizer = new MarkdownTokenizer()
		tokenizer.tokenize(this.src);
	}

	log() {
		console.log(this.src);
	}
};