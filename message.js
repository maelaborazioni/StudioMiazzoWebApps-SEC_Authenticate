/**
 * Recupera i messaggi inviati all'utente
 * 
 * @param {Number} userId
 * 
 * @return {JSFoundSet<db:/svy_framework/sec_user_messages>}
 * 
 * @properties={typeid:24,uuid:"261F750F-2519-4580-BFB1-B04F6857F92E"}
 * @AllowToRunInFind
 */
function getUserMessages(userId)
{
	/**@type {JSFoundSet<db:/svy_framework/sec_user_messages>} */
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,globals.Table_Svy.MESSAGES);
	if(fs.find())
	{
		fs.user_id = userId;
		if(fs.search())
			return fs;
	}
	
	return null;
}

/**
 * Recupera i messaggi inviati all'utente e non ancora letti
 * 
 * @param {Number} userId
 * 
 * @return {JSFoundSet<db:/svy_framework/sec_user_messages>}
 * 
 * @properties={typeid:24,uuid:"2DCDDC4B-6709-40D9-8D15-D96095FF4ABD"}
 * @AllowToRunInFind
 */
function getUnreadUserMessages(userId)
{
	/**@type {JSFoundSet<db:/svy_framework/sec_user_messages>} */
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,globals.Table_Svy.MESSAGES);
	if(fs.find())
	{
		fs.user_id = userId;
		fs.read = '^';
		if(fs.search())
			return fs;
	}
	
	return null;
}

/**
 * Crea un nuovo messaggio
 * 
 * @param {Number} userId
 * @param {String} subject
 * @param {String} message
 * @param {String} module
 * @param {Number} fromUserId
 * @param {String} [url]
 *
 * @properties={typeid:24,uuid:"DAEC9F3D-D18F-4B12-B0AD-8783271B18A0"}
 */
function createMessage(userId,subject,message,module,fromUserId,url)
{
	/**@type {JSFoundSet<db:/svy_framework/sec_user_messages>} */
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,globals.Table_Svy.MESSAGES);
	var rec = fs.getRecord(fs.newRecord());
	
	databaseManager.startTransaction();
	
	try
	{
		if(rec)
		{
			rec.user_id = userId;
			rec.subject = subject;
			rec.message = message;
			rec.module = module;
			rec.read = null;
			rec.url = url != null ? url : "";
			rec.user_chat_id = null;
			rec.prev_user_message_id = null;
			rec.from_user_id = fromUserId;
			rec.created = new Date();
			
			if(!databaseManager.commitTransaction())
				throw new Error('Errore durante il salvataggio di un nuovo messaggio');
			
			return true;
		}
		else
			throw new Error('Errore durante il salvataggio di un nuovo messaggio');
	}
	catch(ex)
	{
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message,'Gestione messaggi web application');
	
		return false;
	}
}

/**
 * Modifica il messaggio
 * 
 * @param {Number} userMessageId
 * @param {Number} newMessage
 * 
 * 
 * @properties={typeid:24,uuid:"993BDA42-8BC6-4775-A6EF-F48AA71FCA79"}
 * @AllowToRunInFind
 */
function editMessage(userMessageId,newMessage)
{
	/**@type {JSFoundSet<db:/svy_framework/sec_user_messages>} */
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,globals.Table_Svy.MESSAGES);
	
	try
	{
	    if(fs.find())
		{
			fs.user_message_id = userMessageId;
			if(fs.search())
			{
				databaseManager.startTransaction();
				fs.message = newMessage;
				databaseManager.saveData(fs);
			}
			else
				throw new Error('Il messaggio da modificare non è stato trovato');
				
		}
		else
			throw new Error('Errore durante il recupero del messaggio da modificare');
	}
	catch(ex)
	{
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message,'Gestione messaggi web application');
	}

}

/**
 * @AllowToRunInFind
 * 
 * Modifica lo stato del messaggio selezionato
 * 
 * @param {Number} userMessageId
 * @param {Number} isRead
 *
 * @properties={typeid:24,uuid:"FC3C0175-D7B4-4DC5-867A-7DE6AAB76FF8"}
 */
function setMessageStatus(userMessageId,isRead)
{
	/**@type {JSFoundSet<db:/svy_framework/sec_user_messages>} */
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,globals.Table_Svy.MESSAGES);
	
	try
	{
	    if(fs.find())
		{
			fs.user_message_id = userMessageId;
			if(fs.search())
			{
				databaseManager.startTransaction();
				fs.read = isRead ? new Date() : null;
				databaseManager.saveData(fs);
			}
			else
				throw new Error('Il messaggio da settare non è stato trovato');
				
		}
		else
			throw new Error('Errore durante il recupero del messaggio da settare');
	}
	catch(ex)
	{
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message,'Gestione messaggi web application');
	}
}

/**
 * Elimina il messaggio selezionato
 * 
 * @param {Number} userMessageId
 *
 * @properties={typeid:24,uuid:"16AEBC3D-5282-425E-93EC-C1DFEDA31637"}
 * @AllowToRunInFind
 */
function deleteMessage(userMessageId)
{
	/**@type {JSFoundSet<db:/svy_framework/sec_user_messages>} */
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,globals.Table_Svy.MESSAGES);
	
	try
	{
	    if(fs.find())
		{
			fs.user_message_id = userMessageId;
			if(fs.search())
			   fs.deleteRecord(fs.getSelectedRecord());
			else
				throw new Error('Il messaggio da settare non è stato trovato');
		}
		else
			throw new Error('Errore durante il recupero del messaggio da settare');
	}
	catch(ex)
	{
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message,'Gestione messaggi web application');
	}
}

/**
 * Verifica la presenza di eventuali messaggi indirizzati all'utente 
 * 
 * @param user_id
 * @param [already_read]
 *
 * @properties={typeid:24,uuid:"E923F225-DF58-4E2A-97FC-B132DFB00DE0"}
 */
function verifyUserMessages(user_id,already_read)
{
	var fsMsg = (already_read != null && already_read) ? scopes.message.getUserMessages(user_id) : scopes.message.getUnreadUserMessages(user_id);
	if(fsMsg != null)
	{
		var numMsg = fsMsg.getSize();
		setMessageLbl(numMsg); 
		return numMsg ? true : false;
	}
	
	return false;
}

/**
 * TODO generated, please specify type and doc for the params
 * @param user_id
 * @param [already_read]
 *
 * @properties={typeid:24,uuid:"A7185A5B-56AE-4951-B17E-261D18AEDA5A"}
 */
function showUserMessages(user_id,already_read)
{
	var fsMsg = (already_read != null && already_read) ? scopes.message.getUserMessages(user_id) : scopes.message.getUnreadUserMessages(user_id);
	if(fsMsg != null)
	{
		var numMsg = fsMsg.getSize();
		if(numMsg > 0)
		{
			var frm = already_read ? forms.ma_user_messages_all : forms.ma_user_messages;
			frm.foundset.loadRecords(fsMsg);
			globals.ma_utl_showFormInDialog(frm.controller.getName(),already_read ? 'Registro messaggi' : 'Nuovi messaggi');
		}		
	}
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Number} numMsg number of messages
 *
 * @properties={typeid:24,uuid:"286B0FCB-D0AC-4E0E-83AA-A6C5F1966D25"}
 */
function setMessageLbl(numMsg)
{
	var elem = forms.svy_nav_fr_menu.elements.lbl_info; 

	if(numMsg > 0)
	{
		var msg = numMsg + (numMsg == 1 ? ' nuovo messaggio' : ' nuovi messaggi');
		var msgEn = numMsg + ( numMsg == 1 ? ' unread message' : ' unread messages'); 
		elem.text = globals.ma_utl_hasKey(globals.Key.ENGLISH_LAN) ? msgEn : msg;
		elem.toolTipText = globals.ma_utl_hasKey(globals.Key.ENGLISH_LAN) ? 'Click to show' : 'Clicca per visualizzare';
		elem.visible = true;
	}
	else
	{
		elem.text =	 elem.toolTipText =	'';
		forms.svy_nav_fr_menu.elements.lbl_info.visible = false;
	}
}