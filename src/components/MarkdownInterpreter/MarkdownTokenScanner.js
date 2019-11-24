import MarkdownToken from './MarkdownToken'

export default class MarkdownTokenScanner {
	/* Abstract base class, this class cannot scan for specific tokens,
	 * Instead, it will detect everything that specific scanners cannot
	 * detect themselves.
	 */
	constructor()
	{
		this.scanners = []; // registered scanners
		this.scannersAmount = 0;
	}

	static getToken() { return 'TXT'; }

	addScanner(scanner)
	{
		// The first scanner added will have the highers priority
		this.scanners[this.scannersAmount++] = scanner;
	}

	scan(source)
	{
		// Check if any registered scanners recognize this as a token
		for(var scannerIndex = 0; scannerIndex < this.scannersAmount; scannerIndex++)
		{
			var scanToken = this.scanners[scannerIndex].scan(source);
			if (scanToken.isValid())
			{
				return scanToken;
			}
		}
		
		// It is not registered, so this scanner recognizes it as plain text
		return MarkdownToken(MarkdownTokenScanner.getToken(), source.charAt(0), 1);
	}

};