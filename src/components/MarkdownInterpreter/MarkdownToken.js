export default class MarkdownToken {
	constructor(type, value, length) {
		this.type  = type;
		this.value = value;
		this.length = length;
	}

	isNull() { return this.type == MarkdownToken.nullToken().type }

	static endOfFileToken() { return new MarkdownToken('EOF', '', 0); }
	static nullToken() { return new MarkdownToken('NULL', '', 0); }
	static errorToken() { return new MarkdownToken('ERROR', '', -1); }
};