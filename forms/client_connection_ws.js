/**
 * @properties={typeid:24,uuid:"DC0759C2-6C3E-4C02-BEF7-42B354F5F023"}
 */
function ws_create()
{
	var args = arguments[0];
	var connected = false;
	
	/**@type{Array<JSClientInformation>} */
	var arrClients = plugins.clientmanager.getConnectedClients();
	for(var cl = 0; cl < arrClients.length; cl++)
	{
		var currCl = arrClients[cl];
		if(currCl.getHostAddress() == args['ip']
		   && currCl.getUserName() == args['username']
		   && currCl.getOpenSolutionName() == args['solutionname'])
		{
			connected = true;
		    break;
		}		
	}
	
	return {value : true, connected : connected};
}