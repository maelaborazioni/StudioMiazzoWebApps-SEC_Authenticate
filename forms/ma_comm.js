/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"7F17B130-90E9-4BA5-ABE4-9B580C7AF2AA",variableType:8}
 */
var _idSystemNews = null;

/**
 * @properties={typeid:35,uuid:"969AE1FF-3F4D-4015-BA4D-4E02CAB9ABEC",variableType:-4}
 */
var _arrIdSystemNews = [];

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"2475BE35-EC76-4CEE-AA64-4D81604C1957"}
 */
var _programName = null;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"B8E20960-D542-4AAF-B1A6-F038DA4951ED"}
 */
var _htmlTxt = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"14D71FA1-D705-403C-9130-B92B2B80F068"}
 */
function onActionAnnullaLettura(event)
{
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F978E793-CA2C-4A77-A16C-345E23626076"}
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
 * @properties={typeid:24,uuid:"C6562047-DD67-420C-B857-34BB5138C231"}
 */
function dc_next(event) 
{
   globals.svy_utl_setSelectedIndexNext(controller.getName());
}
