// Defining a "format" function similar to those in other languages
// Written by: fearphage
// From: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

// Define a "isDigit" function, when called on a string will return true if the string is only digits
if (!String.prototype.isDigit) {
  String.prototype.isDigit = function() {
		return /^\d+$/.test(this);
	};
}





/* 	
 *  This function original authered by Boston Children's Hospital
 *	Part of their Python tools for UMLS
 *  Find original source here: https://github.com/chb/py-umls/blob/master/rxnorm.py
 *  Authored at the National Library of Medicine at NIH for use in DailyMed
 *  
 */




function ndc_normalize(ndc){
   /* Normalizes an NDC (National Drug Code) number.
	*
	* The pseudo-code published by NIH
	* (http://www.nlm.nih.gov/research/umls/rxnorm/NDC_Normalization_Code.rtf)
	* first identifies the format (e.g. "6-3-2") and then normalizes based on
	* that finding. However since the normalized string is always 5-4-2,
	* padded with leading zeroes and removing all dashes afterwards, this
	* implementation goes a much simpler route.
	* 
	* NDCs that only contain one dash are treated as if they were missing the
	* package specifier, so they get a "-00" appended before normalization.
	* 
	* :param str ndc: The NDC to normalize as string
	* :returns: A string with the normalized NDC, or `None` if the number
	* 	couldn't be normalized
	*/

	// Reject blank NDC and too long NDCs
	if(!ndc || ndc.length > 14){
		return null;
	}
	
	// Replace '*' with '0' as some of the NDCs from MTHFDA contain * instead of 0
	norm = ndc.replace(/\*/g, '0');
	
	// Split at dashes, pad with leading zeroes, cut to desired length
	parts = norm.split('-');
	

    // Code with only one dash; We append "-00" to get a 6-4-2 format and are done with it. 
	if (parts.length == 2){
		parts.push('00');
	}
	
	// Two dashes, 6-4-1 or 5-3-2 or similar formats, concat to 5-4-2
	if (parts.length == 3){
		norm = '{0}{1}{2}'.format(('00000'+parts[0]).slice(-5), ('0000'+parts[1]).slice(-4), ('00'+parts[2]).slice(-2));
	}

	// Mo dashes
	else if (parts.length == 1){
		
	   /* If NDC passed has 12 digits and first char is '0' and it's from
		* VANDF then trim first char". We do NOT check if it's from the VA
		* as this would require more information than just the NDC
		*/
		if (norm.length == 12 && norm.charAt(0) == '0'){
			norm = norm.substring(1);
		}
		
		// Only valid if it's 11 digits
		else if (norm.length != 11){
			return null;
		}
	}
	
	// Reject NDCs that still contain non-numeric chars
	return norm.isDigit() ? norm : null;

}