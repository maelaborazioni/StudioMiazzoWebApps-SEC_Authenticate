/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1EF421F8-AB69-406D-BB81-1D6AEA9CC91A"}
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
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"FCA4DD6F-DA2D-4A08-B1D1-2F68B396DE92"}
 * @AllowToRunInFind
 */
function process_conferma_lettura(event)
{
	var onError = false;
	
	try
	{
		/** @type{JSFoundSet<db:/ma_news/utenti_newsread>} */
		var fs = databaseManager.getFoundSet(globals.Server.MA_NEWS,globals.Table.UTENTI_NEWS_READ);
		
		databaseManager.startTransaction();
		var rec = fs.getRecord(fs.newRecord());
		
		rec.idsystemnews = foundset.idsystemnews;
		rec.programname = foundset.programname;
		rec.idutente = globals.svy_sec_lgn_user_id;
		rec.read_data = globals.TODAY;
		
		if(!databaseManager.commitTransaction())
		{
			databaseManager.rollbackTransaction();
			globals.ma_utl_showWarningDialog('Errore durante il salvataggio della conferma di lettura','News');
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
		if(!onError & controller.getName() == 'ma_news')
		{
			if(foundset.find())
			{
				/** @type {JSDataSet} */
				var dsNewsToRead = scopes.news.getDatiNews(globals.svy_sec_lgn_owner_id
					                                       ,globals.svy_sec_lgn_user_id
														   ,'StudioMiazzoWebApps'
														   ,false);
				if(dsNewsToRead && dsNewsToRead.getMaxRowIndex())
				{
					foundset.idsystemnews = dsNewsToRead.getColumnAsArray(1);
				
					if(foundset.search())
					{
						plugins.busy.unblock();
						updateButtons();
					}
					else
					{
						plugins.busy.unblock();
						globals.svy_mod_closeForm(event);
					}
				}
			}
			
			plugins.busy.unblock();
			globals.svy_mod_closeForm(event);
		}
		else
		    plugins.busy.unblock();	
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9EEB2388-A94D-4242-8455-0C9D69737E17"}
 */
function onActionAnnullaLettura(event)
{
	globals.svy_mod_closeForm(event);
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0B3F2A93-95FF-4899-A4DC-EDE569593362"}
 */
function onRecordSelection(event) 
{
	if(foundset.getSelectedRecord())
	{
		var recNews = foundset.getSelectedRecord();
		var path = "https://www.studiomiazzo.it/news/" + recNews.programname + '/';
		if(recNews.programversion != '')
			path += ('Ver' + utils.stringReplace(recNews.programversion,'.','_') + '/index.html');
		else
			path += ('InternalNews/Protocol_' + utils.stringReplace(recNews.protocol,'.','_') + '/index.html');
				
		var htmlText = '<iframe src=' + path + ' height="500px" width="840px"/>';
		
		_htmlTxt = htmlText;
		
		elements.btn_next.enabled = foundset.getSelectedIndex() != foundset.getSize(); 
		elements.btn_previous.enabled = foundset.getSelectedIndex() != 1;
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AA2339DC-01E8-4484-89B2-BEED70D1B8FA"}
 */
function dc_prev(event)
{
    globals.svy_utl_setSelectedIndexPrevious(controller.getName());
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2A962646-EEA0-4074-B126-60E0F8637770"}
 */
function dc_next(event) 
{
   globals.svy_utl_setSelectedIndexNext(controller.getName());
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"10DD3768-D3F2-416D-A5F6-684E7C16DDCA"}
 * @AllowToRunInFind
 */
function onShow(firstShow, event) 
{
	plugins.busy.prepare();
	
	var enabled = foundset.getSize() ? true : false;
	elements.btn_next.enabled = enabled && foundset.getSelectedIndex() != foundset.getSize(); 
	elements.btn_previous.enabled = enabled && foundset.getSelectedIndex() != 1;
	elements.btn_confirm_all.enabled = enabled;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8CFB128C-3FD1-4F9E-93C3-5AB344264587"}
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
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"D760F3CE-FB98-4888-9B4D-6CED4087D74E"}
 */
function process_conferma_lettura_all(event)
{
	try
	{
		/** @type{JSFoundSet<db:/ma_news/utenti_newsread>} */
		var fs = databaseManager.getFoundSet(globals.Server.MA_NEWS,globals.Table.UTENTI_NEWS_READ);
		
		databaseManager.startTransaction();
		
		for(var f = 1; f <= foundset.getSize(); f++)
		{
			var rec = fs.getRecord(fs.newRecord());
		
			rec.idsystemnews = foundset.getRecord(f).idsystemnews;
			rec.programname = foundset.getRecord(f).programname;
			rec.idutente = globals.svy_sec_lgn_user_id;
			rec.read_data = globals.TODAY;
		}
		
		if(!databaseManager.commitTransaction())
		{
			databaseManager.rollbackTransaction();
			globals.ma_utl_showWarningDialog('Errore durante il salvataggio della conferma di lettura','News');
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
		globals.svy_mod_closeForm(event);
		plugins.busy.unblock();
	}
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"645366CB-F2B6-4C2F-9ECF-AE273632B461"}
 */
function onHide(event) 
{
	// Verifica per le ditte del gruppo se sono presenti sull'ftp dati inviati dalla sede
	// e in caso affermativo lancia la ricezione automatica (nell'ordine tabelle generali/ditta/certificati telematici)
	if (globals.ma_utl_hasKey(globals.Key.RILEVAZIONE_PRESENZE)
		&& globals.ma_utl_getSoftware(globals.Module.RILEVAZIONE_PRESENZE) != globals.ModuleSoftware.PRESENZA_SEMPLICE_LITE) 
		globals.verificaDatiFtp();
	return true;
}

/**
 * @properties={typeid:24,uuid:"34AB9CD0-9C2D-44BC-9D38-269F6612D870"}
 */
function updateButtons()
{
	var enabled = foundset.getSize() ? true : false;
	elements.btn_next.enabled = enabled && foundset.getSelectedIndex() != foundset.getSize(); 
	elements.btn_previous.enabled = enabled && foundset.getSelectedIndex() != 1;
	elements.btn_confirm_all.enabled = enabled;
}
