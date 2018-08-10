/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3D8B7D1B-1037-4E03-BD13-74742EDE4FBC"}
 */
function onShow(firstShow, event) 
{
//	return _super.onShow(firstShow, event)
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
 * @properties={typeid:24,uuid:"3887928C-7D1F-429C-95E0-D9D5735E5747"}
 */
function onHide(event) 
{
   globals.svy_mod_closeForm(event);
   return true;
}
