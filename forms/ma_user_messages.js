/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CDD28CE5-E48D-4D0A-8446-AD295BE772B1"}
 */
function onActionConfermaLettura(event) 
{
	var params = {
        processFunction: process_conferma_lettura,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D5C8F87F-F2ED-44B1-BEB3-F9FFF3797322"}
 */
function onActionConfermaLetturaAll(event) 
{
	var params = {
        processFunction: process_conferma_lettura_all,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}

/**
 * @AllowToRunInFind
 * 
 * Segna come letto il messaggio correntemente visualizzato
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"BA3D2B1F-A26A-44DB-9CF8-961F752B7660"}
 */
function process_conferma_lettura(event)
{
	var onError = false;
	
	try
	{
		/** @type {JSFoundSet<db:/svy_framework/sec_user_messages>} */
		var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,globals.Table_Svy.MESSAGES);
	    if(fs.find())
	    {
	    	fs.user_message_id = foundset.user_message_id;
	    	if(fs.search())
	    	{
	    		databaseManager.startTransaction();
	    		fs.read = 1;
	    		if(!databaseManager.commitTransaction())
	    			throw new Error('Errore durante il salvataggio del nuovo valore');
	    	}
	    }
	}
	catch(ex)
	{
		onError = true;
		databaseManager.rollbackTransaction();
		var msg = 'Metodo process_conferma_lettura : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		// per la form dei messaggi non ancora letti, sulla conferma singola, non deve chiudere tutto ma posizionarsi sul messaggio successivo
		if(!onError && controller.getName() == 'ma_user_messages')
	    {
	    	if(foundset.find())
	    	{
	    		foundset.user_id = globals.svy_sec_lgn_user_id;
	    		foundset.read = 0;
	    		if(foundset.search())
	    		{
	    			plugins.busy.unblock();
	    			updateButtons();
	    			scopes.message.setMessageLbl(foundset.getSize());
	    		}
	    		else
	    		{	
	    			plugins.busy.unblock();
	    			scopes.message.setMessageLbl(0);
	    			globals.svy_mod_closeForm(event);
	    		}
	    	}
	    	else
	    	{
		    	plugins.busy.unblock();
				globals.svy_mod_closeForm(event);
	    	}
	    }
	    else
	    	plugins.busy.unblock();	
	}
}

/**
 * @AllowToRunInFind
 * 
 * Segna come letti tutti i messaggi correntemente visualizzati
 *  
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"EBF7DC8C-70D3-4D36-AC98-48AF58284119"}
 */
function process_conferma_lettura_all(event)
{
	try
	{
		var arrMsgId = globals.foundsetToArray(foundset,'user_message_id');
		
		/** @type {JSFoundSet<db:/svy_framework/sec_user_messages>} */
		var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,globals.Table_Svy.MESSAGES);
	    if(fs.find())
	    {
	    	fs.user_message_id = arrMsgId;
	    	if(fs.search())
	    	{
	    		databaseManager.startTransaction();
	    		for(var i = 1; i < fs.getSize(); i++)
	    		    fs.getRecord(i).read = 1;
	    		
	    		if(!databaseManager.commitTransaction())
	    			throw new Error('Errore durante il salvataggio del nuovo valore');
	    	}
	    }
	}
	catch(ex)
	{
		var msg = 'Metodo process_conferma_lettura_all : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		scopes.message.setMessageLbl(0);
		globals.svy_mod_closeForm(event);
	    plugins.busy.unblock();	
	}
}

/**
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 * @param {Boolean} [svyNavBaseOnShow]
 *
 * @properties={typeid:24,uuid:"1A3E305E-D812-4010-85BF-2992E9C966B3"}
 */
function onShowForm(firstShow, event, svyNavBaseOnShow) 
{
	plugins.busy.prepare();
	updateButtons();
}

/**
 * @properties={typeid:24,uuid:"4BFE6DFB-5BB6-4871-B4F3-DD6E81E29E24"}
 */
function updateButtons()
{
	var enabled = foundset.getSize() ? true : false;
	elements.btn_next.enabled = enabled && foundset.getSelectedIndex() != foundset.getSize(); 
	elements.btn_previous.enabled = enabled && foundset.getSelectedIndex() != 1;
	elements.btn_confirm_all.enabled = enabled;
}