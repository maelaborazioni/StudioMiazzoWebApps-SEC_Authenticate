/**
 * We're using this post request to get back the encrypted token needed for the safe login with the deeplink
 * 
 * @properties={typeid:24,uuid:"92EE1CF2-98C6-4BA6-BAF6-B9518A1DF647"}
 */
function ws_create()
{
	var args = arguments[0];
	
	var now = new Date();
	now.getTime();
	var strArgs = args['username'] + ':' + args['owner'] + ':' + args['organization'] + ':' 
	              + application.getUUID() + ':' + now.getTime();
	
	var options = scopes.crypto.createOptions().setAlgorithmName(scopes.crypto.ALGORITHM_NAMES.AES);
	var key = scopes.crypto.createOptions().setAlgorithmName(scopes.crypto.ALGORITHM_NAMES.AES).getKeyAsString();
	options.setKey(key);
	
	// encrypting parameters' string
	var encrypted = scopes.crypto.encrypt(strArgs.toString(),options);
	
	// resulting text (base-64-encoded)
	var result = encrypted.getValue();
	
	return {value : true, crypted : result};
}
