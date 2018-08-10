/**
 * Verifica la presenza di eventuali news non ancora lette e le visualizza 
 * in fase di ingresso
 * 
 * @param ownerid
 * @param userid
 * @param program_name
 * @param already_read
 *
 * @properties={typeid:24,uuid:"7130AED9-4BFE-4745-B931-0AC66708B705"}
 * @AllowToRunInFind
 */
function verificaDatiNews(ownerid,userid,program_name,already_read)
{
	var dsNewsToRead = getDatiNews(ownerid,userid,program_name,already_read);
	
	if(dsNewsToRead && dsNewsToRead.getMaxRowIndex())
	{
		/** @type {JSFoundSet<db:/ma_news/System_News>}*/
		var fsNews = databaseManager.getFoundSet(globals.Server.MA_NEWS,globals.Table.SYSTEM_NEWS);
		fsNews.find();
		fsNews.idsystemnews = dsNewsToRead.getColumnAsArray(1); // idSystemNews
		fsNews.search();
		
		if(fsNews.getSize() == 0)
			return false; 
		
		var frm = already_read ? forms.ma_news : forms.ma_news_all;
		frm.foundset.loadRecords(dsNewsToRead);
		globals.ma_utl_showFormInDialog(frm.controller.getName(),already_read ? 'Registro news' : 'News');
		return true;
	}
	
	return false;
}

/**
 * TODO generated, please specify type and doc for the params
 * @param ownerid
 * @param userid
 * @param program_name
 * @param already_read
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"7926355B-5428-4A7F-923B-355706D4A118"}
 */
function getDatiNews(ownerid,userid,program_name,already_read)
{
	// verifica utente/servizio software	
	var arrSwOwner = globals.getIdTabSoftwareFromCodice(globals.ma_utl_getAllSoftwares(ownerid));
	
	if(arrSwOwner.length == 0)
		return null;
	
	var sqlNewsToRead = 'SELECT * \
        FROM [System_News] SN \
        WHERE \
        ProgramName = ? \
        AND \
        Cliente = 1 \
        AND \
        ( \
        Protocol IS NULL \
        OR \
        Protocol IS NOT NULL \
        AND \
        idSystemNews IN (SELECT DISTINCT SN_.idSystemNews \
        FROM System_News SN_ \
	       INNER JOIN System_News_Services SNS_ \
	       ON SN_.Protocol = SNS_.Protocol \
	       WHERE SNS_.idTabServizioSoftware IN ('.concat(arrSwOwner.map(function(sw){return sw}).join(','))
			+ ')))'; 
	var arrNewsToRead = [program_name];
	
	if(already_read)
	{
		sqlNewsToRead += ' AND idSystemNews NOT IN \
		        (SELECT idSystemNews \
		         FROM Utenti_NewsRead \
					WHERE idUtente = ? ) ';
		
		arrNewsToRead.push(globals.svy_sec_lgn_user_id);
	}
	
	var dsNewsToRead  = databaseManager.getDataSetByQuery(globals.Server.MA_NEWS,sqlNewsToRead,arrNewsToRead,-1);

	return dsNewsToRead;
}

/**
 * @properties={typeid:24,uuid:"4E67D5F5-3B73-468C-9BC8-D07F81E4449C"}
 */
function selezione_news()
{
	verificaDatiNews(globals.svy_sec_lgn_owner_id,globals.svy_sec_lgn_user_id,'StudioMiazzoWebApps',false);
}