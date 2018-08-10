/**
 * @properties={typeid:24,uuid:"D554DFF6-8585-4CE4-875E-1AD5A53D3C66"}
 */
function showMessageWindow()
{
	var frm = forms.ma_messages;
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Compila il messaggio da inviare');
    globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
}

/**
 * Gestisce l'invio della comunicazione tramite mail al dipendente
 * 
 * @param dataRichiesta
 * @param statoRichiesta
 * @param approvatoIl
 * @param approvatoDa
 * @param giornoDal
 * @param giornoAl
 * @param dalleOre
 * @param alleOre
 * @param userid
 * @param idevento
 * @param [revocata]
 * @param [othersid]
 * @param [confirmsid]
 * @param [refusesid]
 * @param [noteRispostaRichiesta]
 *
 * @properties={typeid:24,uuid:"3FAC4CFF-9DD4-4226-9F9B-C8BB3CA6F9E0"}
 */
function gestisciInvioComunicazione(dataRichiesta,statoRichiesta,approvatoIl,approvatoDa,giornoDal,giornoAl,dalleOre,alleOre,
	                                userid,idevento,revocata,othersid,confirmsid,refusesid,noteRispostaRichiesta)
{
	// comunicazione avvenuta conferma o rifiuto della richiesta
	var emailaddress = globals.getMailUtente(userid);

	// verifica possesso modulo comunicazioni
	var hasModuleCom = globals.ma_utl_hasModule(globals.Module.COMUNICAZIONI);
	
	if (emailaddress) {
		if (emailaddress && plugins.mail.isValidEmailAddress(emailaddress)) 
		{
			var properties = globals.setSparkPostSmtpProperties();
			var subject = "Presenza Semplice Studio Miazzo - Comunicazione gestione richiesta ferie e permessi";
			var subjectEn = "Advice for new request - Presenza Semplice Studio Miazzo";
			
			var msgText = "plain msg<html>";
			var msgTextEn = msgText; //"English version : <br/><p style = \"font-size : 14px\">";
			
			msgText += "Gentile <b>" + globals.getUserName(userid) + "</b>, <br/>";
			msgTextEn += "Dear <b>" + globals.getUserName(userid) + "</b>, <br/>";
			
			msgText += " la richiesta di <i>" + getDescrizioneEvento(idevento) + '</i>';
			msgTextEn += " the request of <i>" + getDescrizioneEvento(idevento) + '</i>';
			
			msgText += ((giornoDal == giornoAl) ? " relativa al giorno " : " relativa al periodo dal giorno ") + '<b>';
			msgTextEn += ((giornoDal == giornoAl) ? " on the day " : " for the period ") + '<b>';
			
			msgText += utils.dateFormat(giornoDal, globals.EU_DATEFORMAT) + '</b>';
			msgTextEn += utils.dateFormat(giornoDal, globals.EU_DATEFORMAT) + '</b>';
			
			msgText += (giornoDal == giornoAl) ? '' : ' al giorno <b>' + utils.dateFormat(giornoAl, globals.EU_DATEFORMAT) + '</b>';
			msgTextEn += (giornoDal == giornoAl) ? '' : ' since <b>' + utils.dateFormat(giornoAl, globals.EU_DATEFORMAT) + '</b>';
			
			var vDalleOre = dalleOre != null ? (dalleOre.getHours() >= 10 ? dalleOre.getHours() : '0' + dalleOre.getHours()) 
			                                    + ':' + (dalleOre.getMinutes() >= 10 ? dalleOre.getMinutes() : '0' + dalleOre.getMinutes()) : '';
            var vAlleOre = alleOre != null ? (alleOre.getHours() >= 10 ? alleOre.getHours() : '0' + alleOre.getHours()) 
			                                    + ':' + (alleOre.getMinutes() >= 10 ? alleOre.getMinutes() : '0' + alleOre.getMinutes()) : '';
			
            msgText += (dalleOre && alleOre) ? ' dalle ore ' + vDalleOre + ' alle ore ' + vAlleOre : '';
            msgTextEn += (dalleOre && alleOre) ? ' since ' + vDalleOre + ' until ' + vAlleOre : '';
            
			msgText += " è stata " + (revocata ?  'revocata' : (statoRichiesta == 1 ? 'accettata ' : ' rifiutata '));
			msgTextEn += " has been " + (revocata ?  'revoked' : (statoRichiesta == 1 ? 'accepted ' : ' refused '));
			
			msgText += " dal responsabile <b>" + globals.getUserName(approvatoDa) + "</b> in data " + (revocata ? utils.dateFormat(globals.TODAY,globals.EU_DATEFORMAT) : utils.dateFormat(approvatoIl, globals.EU_DATEFORMAT));
			msgTextEn += " by the manager <b>" + globals.getUserName(approvatoDa) + "</b> on " + (revocata ? utils.dateFormat(globals.TODAY,globals.EU_DATEFORMAT) : utils.dateFormat(approvatoIl, globals.EU_DATEFORMAT));
						
			if(noteRispostaRichiesta)
			{
				msgText += ('<br/><br/>Note aggiuntive : <i>' + noteRispostaRichiesta + '</i>');
				msgTextEn += ('<br/><br/>Additional notes : <i>' + noteRispostaRichiesta + '</i>');
			}
			
			msgText += ". <br/><br/> Cordiali saluti.";
			msgTextEn += ". <br/><br/> Best regards.";
			
			// english language
			var englishLang = globals.ma_utl_userHasKey(userid,globals.ma_utl_getSecurityKeyId(globals.Key.ENGLISH_LAN));
			
			// invia all'utente direttamente interessato 
			var success = plugins.mail.sendMail
			(emailaddress,
				'Ferie e permessi <assistenza@studiomiazzo.it>',
				englishLang ? subjectEn : subject,
                englishLang ? msgTextEn : msgText,
				null,
				null,
				null,
				properties);
			if (!success)
			{
				var exMsg = plugins.mail.getLastSendMailExceptionMsg();
				application.output(exMsg,LOGGINGLEVEL.ERROR);
				globals.ma_utl_showWarningDialog(exMsg, 'Comunicazione gestione richiesta');
			}
			
			// inserimento messaggio in tabella 
			if(hasModuleCom)
				scopes.message.createMessage(userid,
											 englishLang ? subjectEn : subject,
					                         englishLang ? msgTextEn : msgText,
				                        	 Module.FERIE_PERMESSI,
											 approvatoDa);
		}
		else
		{
			application.output('i18n:ma.msg.notValidEmailAddress');
			globals.ma_utl_showWarningDialog('i18n:ma.msg.notValidEmailAddress', 'Comunicazione gestione richiesta');
		}
	}
	
	// invia comunicazione agli altri utenti osservatori specificati per l'avviso di conferma o di rifiuto
   	if(statoRichiesta == 1 && confirmsid && confirmsid.length > 0
   		|| statoRichiesta == 0 && refusesid && refusesid.length > 0)
   	{
   		/** @type {Array<Number>} */
   		var arrId = statoRichiesta == 1 ? confirmsid.split(',') : refusesid.split(',');
		for(var o = 0; o < arrId.length; o++)
		{
			// comunicazione avvenuta conferma o rifiuto della richiesta agli osservatori
			var otheremailaddress = globals.getMailUtente(arrId[o]);
						
			// se l'utente che ha gestito non corrisponde a quello a cui inviare l'avviso
			// e se quest'ultimo ha un indirizzo mail valido
			if (arrId[o] != approvatoDa && otheremailaddress) {
				if (plugins.mail.isValidEmailAddress(otheremailaddress)) 
				{
					var otherproperties = globals.setSparkPostSmtpProperties();
					var othersubject = "Presenza Semplice Studio Miazzo - Comunicazione gestione richiesta ferie e permessi";
					var othersubjectEn = "Advice for new request - Presenza Semplice Studio Miazzo";
					var othermsgText = "plain msg<html>";
					var othermsgTextEn = othermsgText; //"English version : <br/><p style = \"font-size : 14px\">";
					
					othermsgText += "Gentile <b>" + globals.getUserName(arrId[o]) + "</b>, <br/>";
					othermsgTextEn += "Dear <b>" + globals.getUserName(arrId[o]) + "</b>, <br/>";
					
					othermsgText += " la richiesta di <i>" + getDescrizioneEvento(idevento) + '</i>';
					othermsgTextEn += " the request of <i>" + getDescrizioneEvento(idevento) + '</i>';
					
					othermsgText += ((giornoDal == giornoAl) ? " relativa al giorno " : " relativa al periodo dal giorno ") + '<b>';
					othermsgTextEn += ((giornoDal == giornoAl) ? " on the day " : " for the period since ") + '<b>';
					
					othermsgText += utils.dateFormat(giornoDal, globals.EU_DATEFORMAT) + '</b>';
					othermsgTextEn += utils.dateFormat(giornoDal, globals.EU_DATEFORMAT) + '</b>';
					
					othermsgText += (giornoDal == giornoAl) ? '' : ' al giorno <b>' + utils.dateFormat(giornoAl, globals.EU_DATEFORMAT) + '</b>';
					othermsgTextEn += (giornoDal == giornoAl) ? '' : ' until <b>' + utils.dateFormat(giornoAl, globals.EU_DATEFORMAT) + '</b>';
					
					var othervDalleOre = dalleOre != null ? (dalleOre.getHours() >= 10 ? dalleOre.getHours() : '0' + dalleOre.getHours()) 
					                                    + ':' + (dalleOre.getMinutes() >= 10 ? dalleOre.getMinutes() : '0' + dalleOre.getMinutes()) : '';
		            var othervAlleOre = alleOre != null ? (alleOre.getHours() >= 10 ? alleOre.getHours() : '0' + alleOre.getHours()) 
					                                    + ':' + (alleOre.getMinutes() >= 10 ? alleOre.getMinutes() : '0' + alleOre.getMinutes()) : '';
					
		            othermsgText += (dalleOre && alleOre) ? ' dalle ore ' + othervDalleOre + ' alle ore ' + othervAlleOre : '';
		            othermsgTextEn += (dalleOre && alleOre) ? ' since ' + othervDalleOre + ' until ' + othervAlleOre : '';
		            
		            othermsgText += " effettuata da/per il dipendente <i>" + globals.getUserName(userid) + "</i>";
		            othermsgTextEn += " made by/for <i>" + globals.getUserName(userid) + "</i>";
		            
		            othermsgText += " è stata " + (revocata ? 'revocata ' : (statoRichiesta == 1 ? 'accettata ' : ' rifiutata '));
		            othermsgTextEn += " has been " + (revocata ? 'revoked ' : (statoRichiesta == 1 ? 'accepted ' : ' refused '));
		            
		            othermsgText += " dal responsabile <b>" + globals.getUserName(approvatoDa) + "</b> in data " + utils.dateFormat(approvatoIl, globals.EU_DATEFORMAT);
		            othermsgTextEn += " by the manager <b>" + globals.getUserName(approvatoDa) + "</b> on " + utils.dateFormat(approvatoIl, globals.EU_DATEFORMAT);
		            
		            othermsgText += ". <br/><br/> Cordiali saluti.";
		            othermsgTextEn += ". <br/><br/> Best regards.";
					
		            // TODO aggiungere in coda al messaggio standard la traduzione in inglese
		            othermsgTextEn += "</p>";
//					othermsgText += ("<br/><br/><br/>" + othermsgTextEn)
		            
		            // english language
					var englishLangOther = globals.ma_utl_userHasKey(arrId[o],globals.ma_utl_getSecurityKeyId(globals.Key.ENGLISH_LAN));
		            
					// invia all'utente direttamente interessato 
					var othersuccess = plugins.mail.sendMail
					(otheremailaddress,
						'Ferie e permessi <assistenza@studiomiazzo.it>',
						englishLangOther ? othersubjectEn : othersubject,
						englishLangOther ? othermsgTextEn : othermsgText,
						null,
						null,
						null,
						otherproperties);
					if (!othersuccess)
					{
						var otherexMsg = plugins.mail.getLastSendMailExceptionMsg();
						application.output(otherexMsg,LOGGINGLEVEL.ERROR);
						globals.ma_utl_showWarningDialog(otherexMsg, 'Comunicazione gestione richiesta');
					}
					
					// inserimento messaggio in tabella 
					if(hasModuleCom)
						scopes.message.createMessage(arrId[o],
													 englishLangOther ? subjectEn : subject,
							                         englishLangOther ? othermsgTextEn : othermsgText,
							                         Module.FERIE_PERMESSI,
													 approvatoDa);
				}
				else
				{
					application.output('i18n:ma.msg.notValidEmailAddress');
					globals.ma_utl_showWarningDialog('i18n:ma.msg.notValidEmailAddress', 'Comunicazione gestione richiesta');
				}
			}
			
		}
   	}
	
//	// invia comunicazione agli altri utenti osservatori specificati
//   	if(othersid && othersid.length > 0)
//   	{
//   		var arrOthersId = othersid.split(',');
//		for(var o = 0; o < arrOthersId.length; o++)
//		{
//			if(arrOthersId[o] != approvatoDa)
//			{
//				// comunicazione avvenuta conferma o rifiuto della richiesta agli osservatori
//			   var otheremailaddress = globals.getUserEmailAddress(arrOthersId[o]);
//			   				
//				if (otheremailaddress) {
//					if (otheremailaddress && plugins.mail.isValidEmailAddress(otheremailaddress)) 
//					{
//						var otherproperties = globals.setSmtpProperties();
//						var othersubject = "Presenza Semplice Studio Miazzo - Comunicazione gestione richiesta ferie e permessi";
//						var othermsgText = "plain msg<html>Gentile <b>" + globals.getUserName(arrOthersId[o]) + "</b>, <br/>";
//						othermsgText += " la richiesta di <i>" + globals.getDescrizioneEvento(idevento) + '</i>';  
//						othermsgText += ((giornoDal == giornoAl) ? " relativa al giorno " : " relativa al periodo dal giorno ") + '<b>';
//						othermsgText += utils.dateFormat(giornoDal, globals.EU_DATEFORMAT) + '</b>';
//						othermsgText += (giornoDal == giornoAl) ? '' : ' al giorno <b>' + utils.dateFormat(giornoAl, globals.EU_DATEFORMAT) + '</b>';
//						
//						var othervDalleOre = dalleOre != null ? (dalleOre.getHours() >= 10 ? dalleOre.getHours() : '0' + dalleOre.getHours()) 
//						                                    + ':' + (dalleOre.getMinutes() >= 10 ? dalleOre.getMinutes() : '0' + dalleOre.getMinutes()) : '';
//			            var othervAlleOre = alleOre != null ? (alleOre.getHours() >= 10 ? alleOre.getHours() : '0' + alleOre.getHours()) 
//						                                    + ':' + (alleOre.getMinutes() >= 10 ? alleOre.getMinutes() : '0' + alleOre.getMinutes()) : '';
//						
//			            othermsgText += (dalleOre && alleOre) ? ' dalle ore ' + othervDalleOre + ' alle ore ' + othervAlleOre : '';
//			            othermsgText += " effettuata dal dipendente <i>" + globals.getUserName(userid) + "</i>";
//			            othermsgText += " è stata " + (revocata ? 'revocata' : (statoRichiesta == 1 ? 'accettata ' : ' rifiutata '));
//			            othermsgText += " dal responsabile <b>" + globals.getUserName(approvatoDa) + "</b> in data " + utils.dateFormat(approvatoIl, globals.EU_DATEFORMAT);
//			            othermsgText += ". <br/><br/> Cordiali saluti.";
//						
//						// invia all'utente direttamente interessato 
//						var othersuccess = plugins.mail.sendMail
//						(otheremailaddress,
//							'Ferie e permessi <assistenza@studiomiazzo.it>',
//							othersubject,
//							othermsgText,
//							null,
//							null,
//							null,
//							otherproperties);
//						if (!othersuccess)
//						{
//							var otherexMsg = plugins.mail.getLastSendMailExceptionMsg();
//							application.output(otherexMsg,LOGGINGLEVEL.ERROR);
//							globals.ma_utl_showWarningDialog(otherexMsg, 'Comunicazione gestione richiesta');
//						}
//					}
//					else
//					{
//						application.output('i18n:ma.msg.notValidEmailAddress');
//						globals.ma_utl_showWarningDialog('i18n:ma.msg.notValidEmailAddress', 'Comunicazione gestione richiesta');
//					}
//				}
//			}
//		}
//   	}
}