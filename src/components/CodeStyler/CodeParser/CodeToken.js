export default class CodeToken
{
	constructor(token, content, length)
	{
		this.token   = token;
		this.content = content;
		this.length  = length;
	}

	isNull() { return this.token == CodeToken.nullToken().token }
	isError() { return this.token == CodeToken.errorToken().token }
	isValid() { return !(this.isNull() || this.isError()); }
	isEnd() { return this.token == CodeToken.endOfFileToken().token }

	static endOfFileToken() { return new CodeToken('EOF', null, 0); }
	static nullToken() { return new CodeToken('NULL', null, 0); }
	static errorToken() { return new CodeToken('ERROR', null, 0); }
};
