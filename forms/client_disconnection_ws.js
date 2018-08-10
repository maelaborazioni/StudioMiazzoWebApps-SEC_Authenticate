/**
 * @properties={typeid:24,uuid:"CD95F13D-24ED-452B-8525-9C49D7F213EA"}
 */
function ws_create()
{
	var args = arguments[0];
	
	/**@type{Array<JSClientInformation>} */
	var arrClients = plugins.clientmanager.getConnectedClients();
	for(var cl = 0; cl < arrClients.length; cl++)
	{
		var currCl = arrClients[cl];
		if(currCl.getHostAddress() == args['ip']
		   && currCl.getUserName() == args['username']
		   && currCl.getOpenSolutionName() == args['solutionname'])
		   // shutdown all clients with the specified username from the same ip
		   // (should be verified with care, albeit it's used only within MAWebApp
		   plugins.clientmanager.shutDownClient(currCl.getClientID());
	}
	
	return {value : true};
}