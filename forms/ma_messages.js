/**
 * @type {Number}
 *  
 * @properties={typeid:35,uuid:"631DB4B3-BA6B-42D9-A657-70796149FDC3",variableType:8}
 */
var vUserId = null;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"ECF04C71-C16F-4781-AB2A-6796C846EFD5"}
 */
var vModule = null;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"633AAB8D-9EF1-4CE1-A8E0-D315839F6896"}
 */
var vMessage = null; 

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0D2FD8A8-EEE2-401F-A3FC-161466ADFE0C"}
 */
function onActionBtnAnnulla(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"1059CFA8-15A1-468D-B2E4-391288EADDA0"}
 */
function onActionBtnConferma(event) 
{
	if(scopes.message.createMessage(vUserId,'Test message',vMessage,vModule,globals.svy_sec_lgn_user_id))
	{
		globals.ma_utl_showInfoDialog('Messaggio inviato correttamente');
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.svy_mod_closeForm(event);
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C987CD20-D7A6-423E-9C78-2391525680B5"}
 */
function onActionVisualizza(event) 
{
	scopes.message.verifyUserMessages(84,0);
}
