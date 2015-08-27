/* synapp2.js - SynApp2 main interface
**
   +----------------------------------------------------------------------+
   | SynApp2 Version 1                                                    |
   +----------------------------------------------------------------------+
   | Copyright (c) 2007 - 2011 Richard Howell. All rights reserved.       |
   +----------------------------------------------------------------------+
   | This source file is subject to version 1.01 of the SynApp2 license,  |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | http://www.synapp2.org/license/1_01.txt                              |
   | If you did not receive a copy of the SynApp2 license and are unable  |
   | to obtain it through the world-wide-web, please send a note to       |
   | license@synapp2.org so we can mail you a copy immediately.           |
   +----------------------------------------------------------------------+
   | Authors: Richard Howell                                              |
   |                                                                      |
   +----------------------------------------------------------------------+
**
** http://www.synapp2.org
**
** $Id: synapp2.js,v 1.33 2011/01/08 18:18:12 richard Exp $
*/

/*
** establish symbolic constants
*/

var force_var = 1; // set for actual deployment, 0 during development with Mozilla

var is_ie = navigator.userAgent.indexOf('MSIE ') > 0 ? true : false ;
var is_ie6 = navigator.userAgent.indexOf('MSIE 6') > 0 ? true : false ;
var is_ff = navigator.userAgent.indexOf('Firefox') > 0 ? true : false ;
var is_safari = (navigator.userAgent.indexOf('Safari') > 0 && navigator.userAgent.indexOf('Chrome') < 0) ? true : false ;
var is_chrome = (navigator.userAgent.indexOf('Safari') > 0 && navigator.userAgent.indexOf('Chrome') > 0) ? true : false ;
var is_opera = navigator.userAgent.indexOf('Opera') >= 0 ? true : false ;

var var_const = (force_var || is_ie) ? "var " : "const " ;

eval(var_const + "IS_MSIE       = is_ie;");
eval(var_const + "IS_MSIE6      = is_ie6;");
eval(var_const + "IS_FF         = is_ff;");
eval(var_const + "IS_SAFARI     = is_safari;");
eval(var_const + "IS_CHROME     = is_chrome;");
eval(var_const + "IS_OPERA      = is_opera;");

eval(var_const + "APP_NAV           = '_app_nav_';");

eval(var_const + "SUB_NAV           = '_sub_nav_';");
eval(var_const + "SUB_NAV_ACTIVE    = '_sub_nav_active_';");
eval(var_const + "SUB_NAV_CALLBACK  = '_sub_nav_callback_';");
eval(var_const + "SUB_NAV_STYLE     = '_sub_nav_style_';");
eval(var_const + "SUB_NAV_OPTIONS   = '_sub_nav_options_';");

eval(var_const + "ALT_APPID     = '_request_appid_';");

eval(var_const + "_SHARED_      = '../_shared_/';");
eval(var_const + "ACTION_URL    = _SHARED_ + 'action.php';");

eval(var_const + "ACTION_INIT   = 'init';");
eval(var_const + "ACTION_SELECT = 'select';");
eval(var_const + "ACTION_INSERT = 'insert';");
eval(var_const + "ACTION_UPDATE = 'update';");
eval(var_const + "ACTION_DELETE = 'delete';");

eval(var_const + "MODE_GET_NORM = 'get_norm';");
eval(var_const + "MODE_GET_INIT = 'get_init';");
eval(var_const + "MODE_PUT_NORM = 'put_norm';");
eval(var_const + "MODE_REPORT   = 'report';");
eval(var_const + "MODE_ADHOC    = 'adhoc';");
eval(var_const + "MODE_FETCH    = 'fetch';");
eval(var_const + "MODE_CLOSE    = 'close';");
eval(var_const + "MODE_CANCEL   = 'cancel';");

////

// class cxl - Client eXchange Layer
//

// public:
//
// constructor
//
var cxl = function(pid)
{
    this.init();
    this.set_pid(pid);
    this.set_request_action(ACTION_SELECT);
};

var g_exchange_id = 0;

cxl.prototype.init = function()
{
    this.m_exchange_id = ++g_exchange_id;

    this.m_next = null; // function or cxl object reference

    this.m_request_object = null; // HTTP XML Request object reference

    this.m_container_id = '';
    this.m_feedback_id = '';
    this.m_filter_map = Array();

    this.m_send_request_pk = false;

    // exchange arguments/parameters
    //
    this.m_request_action = '';
    this.m_request_mode = '';
    this.m_request_pid = '';
    this.m_request_qid = '';

    this.m_request_show_response = false;
}

cxl.prototype.init_response = function()
{
    this.m_response_version = '';
    this.m_response_setup = '';
    this.m_response_authentication = '';
    this.m_response_authorization = '';
    this.m_response_logout = '';

    this.m_response_affected_rows = 0;
    this.m_response_found_rows = 0;
    this.m_response_insert_offset = 0;

    this.m_response_rows = 0;
    this.m_response_cols = 0;
    this.m_response_firstpage = 1;
    this.m_response_lastpage = 1;

    this.m_response_feedback = Array();

    this.m_response_is_adhoc = false;

    this.m_response_axis = '';
}

cxl.prototype.set_pid = function(pid)
{
    this.m_request_pid = (typeof pid == "string") ? pid : get_pid() ;
}

cxl.prototype.get_pid = function()
{
    return this.m_request_pid;
}

cxl.prototype.set_container = function(container_id)
{
    this.m_container_id = (typeof container_id == "string") ? container_id : '' ;
}

cxl.prototype.set_qid = function(qid)
{
    if (typeof qid == "string")
    {
        this.m_request_qid = qid;
    }
}

cxl.prototype.set_send_request_pk = function()
{
     this.m_send_request_pk = true;
}

cxl.prototype.get_send_request_pk = function()
{
     return this.m_send_request_pk;
}

cxl.prototype.set_request_action = function(action)
{
    if (typeof action == 'string')
    {
        switch (action)
        {
        case ACTION_INIT:
        case ACTION_SELECT:
        case ACTION_INSERT:
        case ACTION_UPDATE:
        case ACTION_DELETE:
            this.m_request_action = action;
            break;
        default:
            break;
        }
    }
}

cxl.prototype.set_request_mode_report = function()
{
    this.m_request_mode = MODE_REPORT;
}

cxl.prototype.set_request_mode_adhoc = function()
{
    this.m_request_mode = MODE_ADHOC;
}

cxl.prototype.set_request_mode_fetch = function()
{
    this.m_request_mode = MODE_FETCH;
}

cxl.prototype.set_request_mode_close = function()
{
    this.m_request_mode = MODE_CLOSE;
}

cxl.prototype.set_request_mode_cancel = function()
{
    this.m_request_mode = MODE_CANCEL;
}

cxl.prototype.set_filter = function(tform_id, sform_id)
{
    if (typeof tform_id == 'string' && typeof sform_id == 'string')
    {
        var key = trim(tform_id);
        var val = trim(sform_id);

        if (key.length && val.length)
        {
            this.m_filter_map[key] = val;
        }
    }
}

cxl.prototype.get_filter = function(tform_id)
{
    return this.m_filter_map[tform_id] ? this.m_filter_map[tform_id] : '' ;
}

cxl.prototype.set_show_response = function(flag)
{
    this.m_request_show_response = flag ? true : false ;
}

////

cxl.prototype.get_request_args = function(qid)
{
    var args = "";

    if (typeof qid == 'string' && qid)
    {
        this.set_qid(qid);
    }

    if (this.m_request_mode == MODE_REPORT ||
        this.m_request_mode == MODE_ADHOC ||
        this.m_request_mode == MODE_FETCH ||
        this.m_request_mode == MODE_CLOSE ||
        this.m_request_mode == MODE_CANCEL)
    {
        // do nothing
    }
    else
    {
        switch (this.m_request_action)
        {
        case ACTION_INSERT:
        case ACTION_UPDATE:
        case ACTION_DELETE:
            this.m_request_mode = MODE_PUT_NORM;
            break;
        case ACTION_INIT:
            this.m_request_mode = MODE_GET_INIT;
            this.m_request_action = ACTION_SELECT;
            break;
        case ACTION_SELECT:
        default:
            this.m_request_mode = MODE_GET_NORM;
            break;
        }
    }

    args += "_request_action_=" + this.m_request_action; // NOTE: first arg, no &
    args += "&_request_mode_=" + this.m_request_mode;
    args += "&_request_pid_=" +  this.get_pid();

    ////

    this.m_feedback_id = this.m_container_id + g_feedback_id_suffix; // TODO: HACK: KLUGE:

    var filter_form = this.get_filter(this.m_container_id);

    args += this.get_container_args(this.m_container_id);
    args += this.get_input_value_args(filter_form ? filter_form : this.m_container_id);

    ////

    if (!this.m_request_qid)
    {
        this.m_request_qid = get_container_qid(this.m_container_id);
    }

    args += "&_request_qid_=" + this.m_request_qid;

    ////

    if (!get_extra_arg(this.get_pid(), ALT_APPID) &&
        !get_extra_arg(this.m_request_qid, ALT_APPID)) // look ahead
    {
        args += "&_request_appid_=" + get_appid();
    }

    ////

    var page_extra_args = get_extra_args(this.get_pid());

    if (page_extra_args)
    {
        args += page_extra_args;
    }

    ////

    var query_extra_args = get_extra_args(this.m_request_qid);

    if (query_extra_args)
    {
        args += query_extra_args;
    }

    ////

    args += this.get_request_flow();

    ////

    if (this.m_request_show_response || typeof g_search_show_response == 'string')
    {
        args += "&_request_show_response_=true";
    }

    ////

    return args;
}

cxl.prototype.get_container_args = function(id)
{
    var args = "";

    if (m_map_id_args[id] && typeof m_map_id_args[id] == 'object')
    {
        for (var arg_name in m_map_id_args[id])
        {
            if (arg_name)
            {
                var arg_value = m_map_id_args[id][arg_name];

                args += ('&' + encodeURIComponent('_request' + arg_name) + "=" + encodeURIComponent(arg_value));
            }
        }
    }

    return args;
}

cxl.prototype.get_input_value_args = function(id)
{
    var args = "";

    if (typeof id == 'string' && id.length && this.m_request_mode != MODE_FETCH)
    {
        var container = document.getElementById(id);

        if (container)
        {
            var input_elements = container.getElementsByTagName("input");

            if (input_elements && input_elements.length)
            {
                for (var i = 0; i < input_elements.length; i++)
                {
                    var element = input_elements[i];

                    if (is_blind(element.id) || ((element.type == "radio" || element.type == "checkbox") && !element.checked) || element.type == 'button')
                    {
                        continue;
                    }

                    var name = element.name;
                    var value = element.value;

                    if (name)
                    {
                        args += ('&' + encodeURIComponent(name) + "=" + encodeURIComponent(value));
                    }
                }
            }

            ////

            var select_elements = container.getElementsByTagName("select");

            if (select_elements && select_elements.length)
            {
                for (var i = 0; i < select_elements.length; i++)
                {
                    var select_element = select_elements[i];

                    var name = select_element.name;

                    if (name)
                    {
                        args += ('&_request_col_expand_[]=' + encodeURIComponent(name)); // drive select options list population

                        var selected_options = 0;

                        for (var j = 0; j < select_element.options.length; j++)
                        {
                            if (select_element.options[j].selected)
                            {
                                selected_options++;
                            }
                        }

                        if (selected_options)
                        {
                            for (var j = 0; j < select_element.options.length; j++)
                            {
                                var value = select_element.options[j].value;

                                if (select_element.options[j].selected)
                                {
                                    args += ('&' + encodeURIComponent(name + (selected_options > 1 ? '[]' : '')) + "=" + encodeURIComponent(value));
                                }
                            }
                        }
                    }
                }
            }

            ////

            var textarea_elements = container.getElementsByTagName("textarea");

            if (textarea_elements && textarea_elements.length)
            {
                for (var i = 0; i < textarea_elements.length; i++)
                {
                    var element = textarea_elements[i];

                    var name = element.name;
                    var value = element.value;

                    if (name)
                    {
                        args += ('&' + encodeURIComponent(name) + "=" + encodeURIComponent(value));
                    }
                }
            }
        }
    }

    return args;
}

cxl.prototype.get_request_flow = function()
{
    var result = '';
    var flow_basis_default = '';

    for (var container_id in m_map_id_flow)
    {
        if (m_map_id_flow[container_id] && typeof m_map_id_flow[container_id] == 'object')
        {
            var basis = m_map_id_flow[container_id]['_basis_'] ? m_map_id_flow[container_id]['_basis_'] : '' ;

            if (container_id == find_container_id_by_flow_role(this.m_container_id, 'select'))
            {
                var flow_basis = basis ? basis : flow_basis_default ; // flow_basis_default kicks in only for the basis table

                result += ('&_request_flow_basis_=' + encodeURIComponent(flow_basis));
                result += ('&_request_limit_offset_=' + encodeURIComponent(get_container_offset(this.m_container_id)));
                result += ('&_request_limit_rows_=' + encodeURIComponent(get_container_limit(this.m_container_id)));
                result += ('&_request_order_=' + encodeURIComponent(get_container_order(this.m_container_id)));
            }

            flow_basis_default = basis;

            var row_ids = get_select_values_all(container_id);

            if (row_ids.length)
            {
                var basis_info = '';

                if (m_map_id_flow[container_id]['_basis_'] && m_map_id_flow[container_id]['_key_'])
                {
                    basis_info = ',' + m_map_id_flow[container_id]['_basis_'] + ',' + m_map_id_flow[container_id]['_table_'] + ',' + m_map_id_flow[container_id]['_key_'];
                }

                var qid = m_map_id_flow[container_id]['_qid_'];

                result += ('&_request_flow_[]=' + encodeURIComponent(qid + ',' + parseInt(row_ids[0]) + basis_info));

                if (qid == this.m_request_qid && this.get_send_request_pk() && (this.m_request_mode == MODE_FETCH || container_id == find_container_id_by_flow_role(this.m_container_id, 'select')))
                {
                    result += ('&_request_pk_=' + encodeURIComponent(parseInt(row_ids[0])));
                }

                var request_context = qid;

                for (var i = 0; i < row_ids.length; i++)
                {
                    request_context += (',' + encodeURIComponent(parseInt(row_ids[i])));
                }

                result += '&_request_context_[]=' + request_context;
            }
        }
    }

    return result;
}

////

cxl.prototype.create_request_object = function()
{
    try
    {
        this.m_request_object = new XMLHttpRequest();
    }
    catch (e1)
    {
        try
        {
            this.m_request_object = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e2)
        {
            try
            {
                this.m_request_object = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e3)
            {
                this.m_request_object = null;
            }
        }
    }
}

cxl.prototype.send_request = function(qid, action)
{
    this.set_request_action(action);

    var args = this.get_request_args(qid);

    if (event_msg_is_enabled())
    {
        event_msg('(' + this.m_exchange_id + ') TX action: ' + this.m_request_action +
                                                  ', mode: ' + this.m_request_mode +
                                                   ', QID: ' + this.m_request_qid +
                                          ', container_id: ' + this.m_container_id);
    }

    if (this.m_request_object == null)
    {
        this.create_request_object();
    }

    if (this.m_request_object != null)
    {
        // Do nothing
    }
}

////

cxl.prototype.response_handler = function()
{
    if (this.m_request_object.readyState == 4)
    {
        show_ready();

        if (event_msg_is_enabled())
        {
            event_msg('(' + this.m_exchange_id + ') RX status: ' + this.m_request_object.status + ' ' + this.m_request_object.statusText);
        }

        if (this.m_request_object.status == 200)
        {
            this.init_response();
            this.init_feedback();

            this.manage_debug_msg();

            var fault_count = this.characterize_response(this.m_request_object.responseXML);

            this.manage_version();
            this.manage_auth_msg();

            if ((this.m_response_authentication != 'succeeded' ||
                this.m_response_authorization != 'succeeded' ||
                this.m_response_logout != '') && !this.m_response_setup)
            {
                ; // do nothing
            }
            else if (fault_count)
            {
                this.process_feedback();
            }
            else
            {
                if (this.m_response_is_adhoc)
                {
                    this.process_adhoc();
                }
                else
                {
                    this.update_container();
                }

                if (this.m_next)
                {
                    if (typeof this.m_next == 'function')
                    {
                        this.m_next(this);
                    }
                    else if (this.m_next.send_request && typeof this.m_next.send_request == 'function')
                    {
                        this.m_next.send_request();
                    }
                }
            }
        }
        else
        {
            debug_msg("Request status: " + this.m_request_object.status + ' ' +
                                           this.m_request_object.statusText + "\n" +
                                           this.m_request_object.responseText); // 404 = request url not found, 500 = error
        }
    }
}

cxl.prototype.create_handler_onreadystatechange = function(obj)
{
    return function() { obj.response_handler() }
}

////

cxl.prototype.response_has_debug_msg = function()
{
    var result = false;

    if (this.m_request_object.responseXML && this.m_request_object.responseXML.nodeType == 9)
    {
        var debug_msg_elements = this.m_request_object.responseXML.getElementsByTagName("debug_msg");

        if (debug_msg_elements && debug_msg_elements.length)
        {
            result = true;
        }
    }

    return result;
}

cxl.prototype.response_has_error_msg = function()
{
    var result = false;

    if (this.m_request_object.responseXML && this.m_request_object.responseXML.nodeType == 9)
    {
        var error_elements = this.m_request_object.responseXML.getElementsByTagName("error");

        if (error_elements &&
            error_elements.length &&
            error_elements[0].firstChild &&
            error_elements[0].firstChild.nodeValue)
        {
            result = true;
        }
    }

    return result;
}

cxl.prototype.manage_version = function()
{
    var version_container = document.getElementById('id_version');

    if (version_container)
    {
        version_container.innerHTML = 'version ' + this.m_response_version;
    }
}

cxl.prototype.manage_debug_msg = function()
{
    var error_flag = this.response_has_error_msg();

    if (error_flag ||
        this.m_request_show_response ||
        this.response_has_debug_msg() ||
        this.m_request_object.responseText == "")
    {
        debug_msg(this.m_request_object.responseText, error_flag);
    }
    else
    {
        error_flag = false;

        if (!this.m_request_object.responseXML)
        {
            error_flag = true;
        }
        else if (this.m_request_object.responseXML.documentElement &&
                 this.m_request_object.responseXML.documentElement.nodeName == 'parsererror') // Firefox
        {
            error_flag = true;
        }
        else if (this.m_request_object.responseXML.parseError &&
                 this.m_request_object.responseXML.parseError.errorCode != 0) // IE
        {
            error_flag = true;
        }
        else if (!this.m_request_object.responseXML.getElementsByTagName('response').length)
        {
            error_flag = true;
        }

        if (error_flag)
        {
            var msg = "** XML Parsing Error ** \n" +
                      "[check SynApp2 response: must be well-formed and valid]\n" +
                      "[check PHP configuration: display_errors={false,'0'}]\n";

            debug_msg(msg + this.m_request_object.responseText, error_flag);
        }
    }
}

cxl.prototype.manage_auth_msg = function()
{
    if (this.m_response_setup)
    {
        // do nothing
    }
    else if (this.get_pid() == 'login')
    {
        if (this.m_response_authentication == 'succeeded')
        {
            window.location = document.referrer; // Login success
        }
        else
        {
            set_container_msg_markup('Unrecognized username and/or password');
        }
    }
    else if (this.get_pid() == 'logout')
    {
        if (this.m_response_logout)
        {
            window.location = '../' + this.m_response_logout + '/';
        }
    }
    else if (this.m_response_authentication != 'succeeded')
    {
        set_container_msg_markup('Please <a id="id_login_" href="' + _SHARED_ + 'login.htm?appid=' + get_appid() + '">Login</a>.');
        set_focus('id_login_');
    }
    else if (this.m_response_authorization != 'succeeded')
    {
        set_container_msg_markup('You are not authorized to use this page.');
    }
    else
    {
        var attrs = get_page_mark_attrs();

        if (attrs)
        {
            var breadcrumb_msg = 'Jump to: ' + attrs.app + ', page ' + attrs.title;
            set_container_msg_markup('<a id="id_crumb_" href="' + attrs.url + '">' + breadcrumb_msg + '</a>');
        }
    }
}

////

cxl.prototype.wick_response_members = function(node, member_name)
{
    if (node.nodeType == 3) // TEXT_NODE
    {
        if (typeof member_name == "string")
        {
            if (typeof this[member_name] == "number")
            {
                this[member_name] = parseInt(node.nodeValue);
            }
            else if (typeof this[member_name] == "string")
            {
                this[member_name] = trim(node.nodeValue);
            }
        }
    }
    else
    {
        var member = null;

        if (node.nodeType == 1) // ELEMENT_NODE
        {
            member = "m_response_" + node.nodeName;
        }

        if (node.hasChildNodes())
        {
            for (var i = 0; i < node.childNodes.length; i++)
            {
                this.wick_response_members(node.childNodes[i], member);
            }
        }
    }
}

cxl.prototype.characterize_response = function(node)
{
    if (node && node.nodeType == 9)
    {
        this.wick_response_members(node);

        ////

        set_container_found_rows(this.m_container_id, this.m_response_found_rows);

        if (this.m_request_mode == MODE_PUT_NORM)
        {
            set_container_offset(find_container_id_by_flow_role(this.m_container_id, 'select'), this.m_response_insert_offset);
        }

        ////

        var status_elements = node.getElementsByTagName("status");

        if (status_elements && status_elements.length)
        {
            for (var i = 0; i < status_elements.length; i++)
            {
                var status_node = status_elements[i].firstChild;

                if (status_node && status_node.nodeType == 3)
                {
                    this.m_response_feedback.push({name:status_elements[i].getAttribute('name'), value:status_node.nodeValue});
                }
            }
        }

        ////

        var auth_actions_nodes = node.getElementsByTagName("auth_actions");

        if (auth_actions_nodes && auth_actions_nodes.length)
        {
            var auth_action_element = auth_actions_nodes[0];

            if (auth_action_element && auth_action_element.hasChildNodes())
            {
                var response_auth_actions = Array();

                for (var i = 0; i < auth_action_element.childNodes.length; i++)
                {
                    var action_node = auth_action_element.childNodes[i];

                    if (action_node.nodeType == 1)
                    {
                        var action_qid = action_node.getAttribute('id');

                        if (action_qid)
                        {
                            if (action_node.firstChild)
                            {
                                response_auth_actions[action_qid] = action_node.firstChild.nodeValue.split(',');
                            }
                            else
                            {
                                response_auth_actions[action_qid] = Array();
                            }
                        }
                    }
                }

                manage_auth_action_controls(response_auth_actions);
            }
        }

        ////

        var adhoc_elements = node.getElementsByTagName("adhoc");

        if (adhoc_elements && adhoc_elements.length)
        {
            this.m_response_is_adhoc = true;
        }
    }

    return this.m_response_feedback.length; // NOTE: fault_count
}

cxl.prototype.init_feedback = function()
{
    if (this.m_feedback_id)
    {
        var feedback_container = document.getElementById(this.m_feedback_id);

        if (feedback_container)
        {
            var feedback_label_elements = feedback_container.getElementsByTagName("label")

            if (feedback_label_elements && feedback_label_elements.length)
            {
                for (var j = 0; j < feedback_label_elements.length; j++)
                {
                    feedback_label_elements[j].style.display = "none";
                }
            }
        }
    }
}

cxl.prototype.process_feedback = function()
{
    if (this.m_response_feedback && this.m_response_feedback.length)
    {
        if (this.m_response_feedback[0].value.indexOf('delete_denied') >= 0 ||
            this.m_response_feedback[0].value.indexOf('duplicate_denied') >= 0)
        {
            var msg = this.m_response_feedback[0].name + "\n\n";

            for (var i = 0; i < this.m_response_feedback.length; i++)
            {
                msg += this.m_response_feedback[i].value + "\n";
            }

            alert(msg);
        }
        else if (this.m_response_is_adhoc)
        {
            var msg = '';

            for (var i = 0; i < this.m_response_feedback.length; i++)
            {
                msg += this.m_response_feedback[i].value + "\n";
            }

            alert(msg);
        }
        else if (this.m_feedback_id)
        {
            var feedback_container = document.getElementById(this.m_feedback_id);

            if (feedback_container)
            {
                var feedback_label_elements = feedback_container.getElementsByTagName('label');

                if (feedback_label_elements && feedback_label_elements.length)
                {
                    // process each fault
                    //
                    for (var i = 0; i < this.m_response_feedback.length; i++)
                    {
                        // match fault with feedback_label by name
                        //
                        for (var j = 0; j < feedback_label_elements.length; j++)
                        {
                            var for_id = feedback_label_elements[j].getAttribute('for');

                            if (!for_id && feedback_label_elements[j].attributes['for'])
                            {
                                for_id = feedback_label_elements[j].attributes['for'].value; // HACK: IE
                            }

                            if (for_id && for_id.endsWith(this.m_response_feedback[i].name))
                            {
                                // report the fault
                                //
                                feedback_label_elements[j].innerHTML = this.m_response_feedback[i].value;
                                feedback_label_elements[j].style.display = "block";

                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

cxl.prototype.process_adhoc = function()
{
    if (this.m_response_is_adhoc)
    {
        var node = this.m_request_object.responseXML;

        if (node && node.nodeType == 9)
        {
            var adhoc_elements = node.getElementsByTagName("adhoc");

            if (adhoc_elements && adhoc_elements.length > 0)
            {
                var container_node = document.getElementById(this.m_container_id);

                if (container_node)
                {
                    var s1 = this.m_request_object.responseText.indexOf("<markup>");
                    var s2 = this.m_request_object.responseText.indexOf("</markup>");

                    if (s1 > 0 && s2 > s1)
                    {
                        if (container_node.nodeType == 1 &&
                            container_node.nodeName.toLowerCase() == 'input' &&
                            container_node.type.toLowerCase() == 'text')
                        {
                            container_node.value = trim(this.m_request_object.responseText.substring(s1 + 8, s2)); // 8 is length of "<markup>"
                        }
                        else
                        {
                            container_node.innerHTML = this.m_request_object.responseText.substring(s1 + 8, s2); // 8 is length of "<markup>"
                        }
                    }
                }

                ////

                var idd_elements = node.getElementsByTagName("idd");

                if (idd_elements && idd_elements.length && idd_elements[0].firstChild)
                {
                    set_drag_items(idd_elements[0].firstChild.nodeValue.split(","));
                }

                var tdd_elements = node.getElementsByTagName("tdd");

                if (tdd_elements && tdd_elements.length && tdd_elements[0].firstChild)
                {
                    set_drag_targets(tdd_elements[0].firstChild.nodeValue.split(","), true);
                }
            }
        }
    }
}

cxl.prototype.process_payload = function(container_id)
{
    if (container_id && this.m_request_object && this.m_request_object.responseXML)
    {
        var xmgr = new csx(container_id);

        var map_col_names = this.m_response_axis.split(',');

        var payload_rows = this.m_request_object.responseXML.getElementsByTagName('tr');

        for (var r = 0; payload_rows && r < payload_rows.length; r++)
        {
            var response_cols = payload_rows[r].getElementsByTagName('td');

            for (var j = 0; response_cols && j < response_cols.length; j++)
            {
                if (!j)
                {
                    xmgr.set_cell_by_row_name(r, '_row_id_', payload_rows[r].getAttribute('id')); // set pk
                }

                if (map_col_names[j])
                {
                    var col_name = map_col_names[j];
                    var col_value = '';

                    if (response_cols[j].text)
                    {
                        col_value = response_cols[j].text; // IS_MSIE [HACK: KLUGE: firstChild.nodeValue gets truncated at first entity reference]
                    }
                    else if (response_cols[j].firstChild)
                    {
                        col_value = response_cols[j].firstChild.nodeValue; // w3c
                    }

                    xmgr.set_cell_by_row_name(r, col_name, col_value);
                }
            }
        }
    }
}

cxl.prototype.update_container = function()
{
    if (this.m_container_id && this.m_request_object && this.m_request_object.responseXML)
    {
        if (get_container_role(this.m_container_id) == 'select')
        {
            clr_select_state_all(this.m_container_id);
            resize_container(this.m_container_id, this.m_response_rows);
        }

        ////

        update_expanded_elements(this.m_container_id, this.m_request_object.responseXML.getElementsByTagName('select'));

        ////

        this.process_payload(this.m_container_id);

        ////

        if (this.m_request_mode == MODE_GET_NORM && get_container_role(this.m_container_id) == 'select')
        {
            set_element_text_by_id(this.m_container_id + g_found_rows_id_suffix, '&nbsp;(' + get_container_found_rows(this.m_container_id) + ')'); // TODO: HACK: KLUGE:
            do_stat(this.m_container_id);
            manage_nav_controls(this.m_container_id, { lastpage:this.m_response_lastpage, firstpage:this.m_response_firstpage });
        }

        ////

        if (this.m_request_mode != MODE_FETCH)
        {
            show_container(this.m_container_id, (this.m_request_mode == MODE_CLOSE || this.m_request_mode == MODE_CANCEL || this.m_request_mode == MODE_PUT_NORM));
        }
    }
}

//
// class cxl

// class csx - Client Side eXchange
//

// public:
//
// constructor
//
var csx = function(container_id)
{
    this.init(container_id);
};

csx.prototype.set_cell_by_row_name = function(r, name, value)
{
//    if (name && name in this.m_map_name_col)
    if (name && typeof this.m_map_name_col[name] == 'number')
    {
        this.set_cell_by_row_col(r, this.m_map_name_col[name], value);
    }
}

// private:
//

csx.prototype.init = function(container_id)
{
    this.m_container_id = container_id;
    this.m_rows = null;
    this.m_map_name_col = Array();

    this.build();
}

csx.prototype.build = function()
{
    if (this.m_container_id)
    {
        this.fetch_cells();
        this.fetch_maps();
    }
}

csx.prototype.push_cell_element = function(element)
{
    if (!this.m_rows)
    {
        this.m_rows = Array({ cells:Array() });
    }

    this.m_rows[0].cells.push(element);
}

csx.prototype.fetch_cells = function()
{
    var container = document.getElementById(this.m_container_id);

    if (container)
    {
        var nodeName = container.nodeName.toLowerCase();

        ////

        if (nodeName == 'input' || nodeName == 'textarea')
        {
            this.push_cell_element(elements[i]); // NOTE: supports lookup/fetch
        }
        else
        {
            this.m_rows = get_table_rows(this.m_container_id);
        }

        ////

        if (!this.m_rows)
        {
            var element_types = ['input', 'textarea', 'select']; // supported 'form' elements

            for (var element_type = 0; element_type < element_types.length; element_type++)
            {
                var elements = container.getElementsByTagName(element_types[element_type]);

                if (elements && elements.length)
                {
                    for (var i = 0; i < elements.length; i++)
                    {
                        this.push_cell_element(elements[i]);
                    }
                }
            }
        }
    }
}

csx.prototype.fetch_maps = function()
{
    this.m_map_name_col = Array();

    for (var c = 0; c < this.get_col_count(); c++)
    {
        var cell = this.get_cell(0, c);

        if (cell)
        {
            var col_name = null;

            if ((col_name = cell.getAttribute('axis')) ||
                (col_name = cell.getAttribute('name')))
            {
                this.m_map_name_col[col_name] = c;
            }
        }
    }
}

csx.prototype.get_row_count = function()
{
    return this.m_rows ? this.m_rows.length : 0 ;
}

csx.prototype.get_col_count = function()
{
    return this.m_rows ? this.m_rows[0].cells.length : 0 ;
}

csx.prototype.get_cell = function(r, c)
{
    return this.m_rows && this.m_rows[r] && this.m_rows[r].cells[c] ? this.m_rows[r].cells[c] : null ;
}

csx.prototype.set_cell_by_row_col = function(r, c, value)
{
    this.set_cell_value(this.get_cell(r, c), value);
}

csx.prototype.set_cell_value = function(cell, value)
{
    if (cell && typeof cell.nodeName == 'string')
    {
        switch (cell.nodeName.toLowerCase())
        {
        case 'td':
            if (cell.firstChild && cell.firstChild.nodeType == 1 && cell.firstChild.nodeName.toLowerCase() == 'input')
            {
                cell.firstChild.value = value;
            }
            else
            {
                cell.innerHTML = (typeof value == 'number' || (value && value.length)) ? value : '&nbsp;' ;

                if (cell.firstChild && cell.firstChild.nodeType != 3 && cell.onclick)
                {
                    cell.onclick = null; // avoid any conflict with row_action handler
                }
            }
            break;
        case 'select':
            cell.value = value ? value : 1 ; // TODO: KLUGE: verify that value is valid else select first option
            break;
        case 'input':
            if (cell.type != 'text')
            {
                break;
            }
        case 'textarea':
        default:
            cell.value = value;
            break;
        }
    }
}

//
// class csx

////

/*
** action dispatch functions
*/

function do_search(tform_id, sform_id)
{
    var xch = new cxl();

    xch.set_container(tform_id);
    xch.set_filter(tform_id, sform_id);
    xch.send_request();
}

////

function do_nav_reset(tform_id, sform_id, control_name)
{
    if (!nav_control_is_disabled(sform_id, control_name))
    {
        reset_container(sform_id);
        do_nav_first(tform_id, sform_id);
    }
}

function do_nav_first(tform_id, sform_id, control_name)
{
    if (!nav_control_is_disabled(tform_id, control_name))
    {
        clr_select_state_all(tform_id);
        set_container_offset(tform_id, 0);
        do_search(tform_id, sform_id)
    }
}

function do_nav_up(tform_id, sform_id, control_name)
{
    if (!nav_control_is_disabled(tform_id, control_name))
    {
        clr_select_state_all(tform_id);
        set_container_offset(tform_id, get_container_offset(tform_id) - get_container_limit(tform_id));
        do_search(tform_id, sform_id)
    }
}

function do_nav_dn(tform_id, sform_id, control_name)
{
    if (!nav_control_is_disabled(tform_id, control_name))
    {
        clr_select_state_all(tform_id);
        set_container_offset(tform_id, get_container_offset(tform_id) + get_container_limit(tform_id));
        do_search(tform_id, sform_id)
    }
}

function do_nav_last(tform_id, sform_id, control_name)
{
    if (!nav_control_is_disabled(tform_id, control_name))
    {
        clr_select_state_all(tform_id);
        set_container_offset(tform_id, get_container_offset_last_row(tform_id));
        do_search(tform_id, sform_id)
    }
}

function do_nav_row(tform_id, relative_offset, vkey)
{
    var i = get_select_index_relative(tform_id, relative_offset);

    if (i >= 0)
    {
        set_select_state_exclusive(tform_id, i);
    }
    else
    {
        do_vkey_action(vkey);
    }
}

function do_nav_close(tform_id, control_name)
{
    if (!nav_control_is_disabled(tform_id, control_name))
    {
        clr_select_state_all(tform_id);

        var flow_info = get_flow_info(tform_id);

        if (flow_info)
        {
            var cxl_select = new cxl();

            cxl_select.set_container(tform_id);
            cxl_select.set_qid(get_container_qid(tform_id));
            cxl_select.set_request_mode_close();

            if (flow_info.parent_node_id)
            {
                var sform_id = find_container_id_by_flow_role(flow_info.parent_node_id, 'search');
                eval("cxl_select.m_next = function() { do_search('" + flow_info.parent_node_id + "', '" + sform_id + "'); }");
            }

            cxl_select.send_request();
        }
    }
}

function do_nav_select(tform_id, control_name)
{
    if (!nav_control_is_disabled(tform_id, control_name))
    {
        var flow_info = get_flow_info(tform_id);

        if (flow_info && flow_info.child_node_id)
        {
            var display_container_id = find_container_id_by_flow_role(tform_id, 'display');
            var display_qid = get_container_qid(tform_id);

            if (display_container_id && display_qid)
            {
                var cxl_display = new cxl();

                set_container_offset_from_select_index(tform_id);

                cxl_display.set_container(display_container_id);
                cxl_display.set_qid(display_qid);
                cxl_display.set_send_request_pk();

                var cxl_select = new cxl();

                set_container_offset(flow_info.child_node_id, 0);

                cxl_select.set_container(flow_info.child_node_id);
                cxl_select.set_filter(flow_info.child_node_id, find_container_id_by_flow_role(flow_info.child_node_id, 'search'));
                cxl_select.set_qid(get_container_qid(flow_info.child_node_id));

                cxl_display.m_next = cxl_select;

                cxl_display.send_request();
            }
        }
    }
}

////

function do_add(container_id, control_name)
{
    if (!nav_control_is_disabled(container_id, control_name))
    {
        var iform_id = find_container_id_by_flow_role(container_id, 'input');

        if (iform_id)
        {
            set_container_action(iform_id, ACTION_INSERT);

            var cxl_input = new cxl();

            set_container_offset_from_select_index(container_id);

            cxl_input.set_container(iform_id);
            cxl_input.set_qid(get_container_qid(container_id));
//            cxl_input.set_show_response(true);
            cxl_input.set_request_action(ACTION_INIT);

            eval("cxl_input.m_next = function() { lookup_all('" + iform_id + "'); }");

            cxl_input.send_request();
        }
    }
}

function do_edit(tform_id, control_name)
{
    if (!nav_control_is_disabled(tform_id, control_name))
    {
        var iform_id = find_container_id_by_flow_role(tform_id, 'input');

        if (iform_id)
        {
            set_container_action(iform_id, ACTION_UPDATE);

            var cxl_input = new cxl();

            set_container_offset_from_select_index(tform_id);

            cxl_input.set_container(iform_id);
            cxl_input.set_qid(get_container_qid(tform_id));
            cxl_input.set_send_request_pk();
//            cxl_input.set_show_response(true);

            cxl_input.send_request();
        }
    }
}

function do_delete(tform_id, control_name)
{
    if (!nav_control_is_disabled(tform_id, control_name))
    {
        if (confirm(get_delete_confirm_msg(get_selection_row_count(tform_id))))
        {
            var cxl_delete = new cxl();

            set_container_offset_from_select_index(tform_id);

            //cxl_delete.set_container(''); // no container
            cxl_delete.set_qid(get_container_qid(tform_id));
            cxl_delete.set_send_request_pk();
//            cxl_delete.set_show_response(true);
            cxl_delete.set_request_action(ACTION_DELETE);

            var cxl_select = new cxl();

            cxl_select.set_container(tform_id);
            cxl_select.set_filter(tform_id, find_container_id_by_flow_role(tform_id, 'search'));
            cxl_select.set_qid(get_container_qid(tform_id));

            cxl_delete.m_next = cxl_select;

            cxl_delete.send_request();
        }
    }
}

////

function do_ok(tform_id, iform_id, control_name)
{
    if (!nav_control_is_disabled(iform_id, control_name))
    {
        var request_action = get_container_action(iform_id);

        var cxl_input = new cxl();

        cxl_input.set_container(iform_id);
        cxl_input.set_qid(get_container_qid(tform_id));
//        cxl_input.set_show_response(true);
        cxl_input.set_request_action(request_action);

        if (request_action == ACTION_UPDATE)
        {
            cxl_input.set_send_request_pk();
        }

        var cxl_select = new cxl();

        cxl_select.set_container(tform_id);
        cxl_select.set_filter(tform_id, find_container_id_by_flow_role(tform_id, 'search'));
        cxl_select.set_qid(get_container_qid(tform_id));

        cxl_input.m_next = cxl_select;

        cxl_input.send_request();
    }
}

function do_cancel(tform_id, iform_id, control_name)
{
    if (!nav_control_is_disabled(iform_id, control_name))
    {
        set_container_action(iform_id, ACTION_SELECT);

        var cxl_input = new cxl();

        cxl_input.set_container(iform_id);
        cxl_input.set_qid(get_container_qid(tform_id));
        cxl_input.set_request_mode_cancel();
//        cxl_input.set_show_response(true);

        var cxl_select = new cxl();

        cxl_select.set_container(tform_id);
        cxl_select.set_filter(tform_id, find_container_id_by_flow_role(tform_id, 'search'));
        cxl_select.set_qid(get_container_qid(tform_id));

        cxl_input.m_next = cxl_select;

        cxl_input.send_request();
    }
}

////

function do_app_nav(nav_container_id)
{
    if (typeof g_search_app_nav == 'undefined' || (typeof g_search_app_nav == 'string' && eval(g_search_app_nav)))
    {
        var app_nav_request = new cxl();
//        app_nav_request.set_show_response(true);
        app_nav_request.set_request_mode_adhoc();
        app_nav_request.set_container(nav_container_id);
        set_extra_arg(APP_NAV, 'document_pathname', document.location.pathname);
        app_nav_request.send_request(APP_NAV);
        hide_show(nav_container_id, 'show');
    }
}

function do_sub_nav(container_id, active, callback, style, options_csv)
{
    var sub_nav_request = new cxl();
//    sub_nav_request.set_show_response(true);
    sub_nav_request.set_request_mode_adhoc();
    sub_nav_request.set_container(container_id);
    set_extra_arg(SUB_NAV, SUB_NAV_ACTIVE, active);
    set_extra_arg(SUB_NAV, SUB_NAV_CALLBACK, typeof callback == 'string' ? callback : 'sub_nav_callback');
    set_extra_arg(SUB_NAV, SUB_NAV_STYLE, typeof style == 'string' ? style : 'select');
    set_extra_arg(SUB_NAV, SUB_NAV_OPTIONS, typeof options_csv == 'string' ? options_csv : '');
    sub_nav_request.send_request(SUB_NAV);
    hide_show(container_id, 'show');
}

////

function do_lookup(control, container_id, qid)
{
    var lookup_request = new cxl();

    if (control && control.options && control.options.length)
    {
        if (control.selectedIndex < 0 || control.selectedIndex >= control.options.length)
        {
            control.selectedIndex = 0; // TODO: HACK: this block shouldn't be necessary
        }

        lookup_request.set_container(container_id);
//        lookup_request.set_show_response(true);
        set_extra_arg(qid, '_request_pk_', control.options[control.selectedIndex].value); // TODO: HACK: KLUGE: need better method to manage request_pk
        lookup_request.set_send_request_pk();
        lookup_request.set_request_mode_fetch();
        lookup_request.send_request(qid);
        set_extra_arg(qid, '_request_pk_', 0);
    }
    else
    {
        lookup_request.set_container(container_id);
//        lookup_request.set_show_response(true);
        lookup_request.set_send_request_pk();
        lookup_request.set_request_mode_fetch();
        lookup_request.send_request(qid);
    }
}

function lookup_all(container_id)
{
    if (container_id && m_lookup_request[container_id])
    {
        for (var i in m_lookup_request[container_id])
        {
            var details = m_lookup_request[container_id][i];

            if (details.select_id)
            {
                do_lookup(null, container_id, details.qid); // independent
            }
            else if (details.basis_id)
            {
                var control = document.getElementById(details.basis_id);

                if (control)
                {
                    do_lookup(control, container_id, details.qid); // select list control
                }
            }
        }
    }
}

function do_stat(container_id)
{
    var stat_container_id = find_container_id_by_flow_role(container_id, 'stat');

    if (stat_container_id && document.getElementById(stat_container_id))
    {
        var stat_request = new cxl();

        stat_request.set_container(stat_container_id);
//        stat_request.set_show_response(true);
        stat_request.set_request_mode_fetch();
        stat_request.send_request();
    }
}

////

var m_map_id_flow = Array();

var m_flow_to_container = Array();
var m_container_to_flow = Array();

var m_container_to_role = Array();
var m_container_to_limit = Array();
var m_container_to_action = Array();

var m_qid_to_containers = Array();

var m_map_id_args = Array();
var m_map_id_extra_args = Array();
var m_map_id_is_blind = Array();

////

function reg_blind(id)
{
    if (id)
    {
        m_map_id_is_blind[id] = {_is_blind_:true};
    }
}

function is_blind(id)
{
    return m_map_id_is_blind[id] && typeof m_map_id_is_blind[id]._is_blind_ == 'boolean' ? m_map_id_is_blind[id]._is_blind_ : false ;
}

function reg_args(container_id, args)
{
    if (container_id)
    {
        m_map_id_args[container_id] = args;
    }
}

function reg_date(container_id, datepicker_format)
{
    if (container_id && typeof setAttributeEx == 'function')
    {
        setAttributeEx(container_id, 'datepicker', 'true');

        if (datepicker_format)
        {
            setAttributeEx(container_id, 'datepicker_format', datepicker_format);
        }
    }
}

function set_extra_arg(id, arg_name, arg_value)
{
    if (id && arg_name)
    {
        if (!m_map_id_extra_args[id])
        {
            m_map_id_extra_args[id] = Array();
        }

        m_map_id_extra_args[id][arg_name] = arg_value;
    }
}

function get_extra_arg(id, arg_name)
{
    return m_map_id_extra_args[id] && typeof m_map_id_extra_args[id][arg_name] == 'string' ? m_map_id_extra_args[id][arg_name] : null ;
}

function get_extra_args(id)
{
    var args = '';

    if (m_map_id_extra_args[id] && typeof m_map_id_extra_args[id] == 'object')
    {
        for (var arg_name in m_map_id_extra_args[id])
        {
            var name = trim(arg_name);
            var value = get_extra_arg(id, name);

            if (value)
            {
                args += ('&' + encodeURIComponent(name) + "=" + encodeURIComponent(value));
            }
        }
    }

    return args;
}

////

var m_lookup_request = Array();

function reg_lookup(container_id, details)
{
    if (container_id)
    {
        if (!m_lookup_request[container_id])
        {
            m_lookup_request[container_id] = Array();
        }

        m_lookup_request[container_id].push(details);
    }
}

////

function reg_flow(container_id, args)
{
    if (container_id)
    {
        if (!args._found_rows_)
        {
            args._found_rows_ = 0;
        }

        if (!args._limit_)
        {
            args._limit_ = 5;
        }

        if (!args._offset_)
        {
            args._offset_ = 0;
        }

        if (!args._order_)
        {
            args._order_ = '';
        }

        m_map_id_flow[container_id] = args;
    }
}

////

function set_qid_container_id(qid, container_id)
{
    if (qid && container_id)
    {
        if (!m_qid_to_containers[qid])
        {
            m_qid_to_containers[qid] = Array();
        }

        m_qid_to_containers[qid].push(container_id);
    }
}

function get_container_qid(container_id)
{
    var result = '';

    if (container_id)
    {
        var flow_container_id = find_flow_container_id(container_id);

        if (flow_container_id && m_map_id_flow[flow_container_id] && m_map_id_flow[flow_container_id]._qid_)
        {
            result = m_map_id_flow[flow_container_id]._qid_;
        }
    }

    return result;
}

function set_container_role(id, role)
{
    if (id && role)
    {
        m_container_to_role[id] = role;
    }
}

function get_container_role(id)
{
    return m_container_to_role[id] ? m_container_to_role[id] : '' ;
}

////

function set_container_limit(id, limit)
{
    if (id && typeof limit == 'number')
    {
        m_container_to_limit[id] = Math.max(1, limit);
    }
}

function get_container_limit(id)
{
    return m_container_to_limit[id] ? m_container_to_limit[id] : 1 ;
}

////

function set_container_offset(id, offset)
{
    if (m_map_id_flow[id])
    {
        m_map_id_flow[id]._offset_ = Math.max(0, offset);
    }
}

function set_container_offset_from_select_index(id)
{
    var tform_id = find_container_id_by_flow_role(id, 'select')

    if (tform_id)
    {
        set_container_offset(tform_id, get_container_offset(tform_id) + Math.max(0, get_select_index_relative(tform_id, 0)));
    }
}

function get_container_offset(id)
{
    return m_map_id_flow[id] ? m_map_id_flow[id]._offset_ : 0 ;
}

function get_container_offset_last_row(id)
{
//    return Math.max(0, get_container_found_rows(id) - 1); // TODO: TBD: which behavior is better??
    return Math.max(0, get_container_found_rows(id) - get_container_limit(id));
}

////

function set_container_action(id, request_action)
{
    if (id && request_action)
    {
        m_container_to_action[id] = request_action;
    }
}

function get_container_action(id)
{
    return m_container_to_action[id] ? m_container_to_action[id] : ACTION_SELECT ;
}

////

function set_container_found_rows(id, found_rows)
{
    if (m_map_id_flow[id])
    {
        m_map_id_flow[id]._found_rows_ = Math.max(0, found_rows);
    }
}

function get_container_found_rows(id)
{
    return m_map_id_flow[id] ? m_map_id_flow[id]._found_rows_ : 0 ;
}

////

function get_container_order(id)
{
    return m_map_id_flow[id] ? m_map_id_flow[id]._order_ : '' ;
}

function set_container_order(id, order_value)
{
    if (m_map_id_flow[id])
    {
        m_map_id_flow[id]._order_ = order_value;
    }
}

function set_order(container_id, axis, row, c)
{
    var za = '';

    if (axis == '_row_no_')
    {
        set_container_order(container_id, '');
    }
    else
    {
        switch (get_container_order(container_id))
        {
        case axis:
            set_container_order(container_id, 'za,' + axis);
            za = ' (decending)';
            break;
        case 'za,' + axis:
        default:
            set_container_order(container_id, axis);
            break;
        }
    }

    if (row)
    {
        var title = '';
        var indicator = String.fromCharCode(8201) + String.fromCharCode(9830) + String.fromCharCode(8201); // &thinsp;&diams;&thinsp;

        for (var i = 0; i < row.cells.length; i++)
        {
            if (row.cells[i].innerHTML.indexOf(indicator) >= 0)
            {
                row.cells[i].innerHTML = row.cells[i].innerHTML.replace(indicator , '');
                break;
            }
        }

        if (row.cells[c].innerHTML && row.cells[c].innerHTML != '&nbsp;')
        {
            title = "Sort Order: " + row.cells[c].innerHTML + za;
            row.cells[c].innerHTML = !za ?  indicator + row.cells[c].innerHTML : row.cells[c].innerHTML + indicator ;
        }

        row.title = title;
    }

    do_nav_first(container_id, find_container_id_by_flow_role(container_id, 'search')); // TODO: HACK: KLUGE:
}

function create_order_handler(container_id, axis, row, c)
{
    return function()
    {
        set_order(container_id, axis, row, c);
    }
}

////

function reg_overlay(flow_container_id, group_container_id, role, limit)
{
    // TODO: check to make sure container_id isn't in another overlay

    if (!m_flow_to_container[flow_container_id])
    {
        m_flow_to_container[flow_container_id] = Array();
    }

    m_flow_to_container[flow_container_id].push(group_container_id);

    if (!m_container_to_flow[group_container_id])
    {
        m_container_to_flow[group_container_id] = flow_container_id;
    }

    set_container_role(group_container_id, role);
    set_container_limit(group_container_id, limit);
}

function find_flow_container_id(container_id)
{
    return m_container_to_flow[container_id] ? m_container_to_flow[container_id] : '' ;
}

// container_id -- any member of the flow group
// role -- any valid flow role - { search, display, input, select, stat }
//
// returns the container_id for the specified role in the group
//
function find_container_id_by_flow_role(container_id, role)
{
    var result = '';

    if (container_id && role)
    {
        var flow_container_id = find_flow_container_id(container_id);

        if (flow_container_id)
        {
            for (var i in m_flow_to_container[flow_container_id])
            {
                if (get_container_role(m_flow_to_container[flow_container_id][i]) == role)
                {
                    result = m_flow_to_container[flow_container_id][i];
                    break
                }
            }
        }
    }

    return result;
}

function get_flow_first_search_container_id()
{
    var result = '';

    for (var container_id in m_map_id_flow)
    {
        var search_container_id = find_container_id_by_flow_role(container_id, 'search');

        if (search_container_id)
        {
            result = search_container_id;
            break;
        }
    }

    return result;
}

function get_flow_basis_key_container_ids()
{
    var result = Array();

    for (var container_id in m_map_id_flow)
    {
        if (m_map_id_flow[container_id]._key_)
        {
            result.push(container_id);
        }
    }

    return result;
}

function customize_background()
{
    if (get_appid())
    {
        var background = find_css_element('#id_body_' + get_appid(), 'background'); // MAGIC: selector prefix

        if (background)
        {
            document.body.style.background = background;
        }
    }
}

function set_compatible_screen()
{
    if (IS_MSIE6)
    {
        var old_screen = find_css_element('#id__iform__screen', 'background'); // MAGIC: selector

        if (old_screen)
        {
            var new_screen = old_screen.replace('.png', '.gif');

            if (new_screen != old_screen)
            {
                replace_css_element('#id__iform__screen', 'background', new_screen);
            }
        }
    }
}

function hilite_listener(focus_id, blur_id)
{
    if (blur_id)
    {
        var blur_element = document.getElementById(blur_id);
        var blur_color = find_css_element('class_layout_group_std', 'borderColor'); // MAGIC: selector

        if (blur_element && blur_color)
        {
            blur_element.style.borderColor = blur_color;
        }
    }

    if (focus_id)
    {
        var focus_element = document.getElementById(focus_id);
        var focus_color = find_css_element('class_layout_group_listener', 'borderColor'); // MAGIC: selector

        if (focus_element && focus_color)
        {
            focus_element.style.borderColor = focus_color;
        }
    }
}

// the order of elements in m_map_id_flow[] is critical, and
// the element representing the 'basis' table should appear *immediately after*
// the element that represents the 'contraint' key
//
function get_flow_info(container_id)
{
    var flow_info = null;

    if (container_id && m_map_id_flow[container_id])
    {
        var _basis_ = m_map_id_flow[container_id]._basis_ ? m_map_id_flow[container_id]._basis_ : '' ;

        var flow_parent_container_id = '';

        for (var flow_container_id in m_map_id_flow)
        {
            if (flow_container_id == container_id)
            {
                flow_info = { parent_node_id:flow_parent_container_id, child_node_id:get_flow_child_container_id(container_id) } ;
                break;
            }
            else if (!_basis_ || (!is_flow_basis_container_id(flow_container_id) && _basis_ == m_map_id_flow[flow_container_id]._basis_))
            {
                flow_parent_container_id = flow_container_id;
            }
        }
    }

    return flow_info;
}

function get_flow_child_container_id(container_id)
{
    var result = '';

    if (container_id && m_map_id_flow[container_id] && m_map_id_flow[container_id]._basis_)
    {
        var _basis_ = m_map_id_flow[container_id]._basis_;

        var armed = '';

        for (var flow_container_id in m_map_id_flow)
        {
            if (armed && (is_flow_basis_container_id(flow_container_id) || _basis_ ==  m_map_id_flow[flow_container_id]._basis_))
            {
                result = flow_container_id;
                break;
            }
            else if (flow_container_id == container_id)
            {
                armed = true;
            }
        }
    }

    return result;
}

function is_flow_basis_container_id(container_id)
{
    return container_id && m_map_id_flow[container_id] && m_map_id_flow[container_id]._basis_ ? false : true ;
}

var m_flow_basis_container_id = '';

function get_flow_basis_container_id()
{
    var result = m_flow_basis_container_id;

    if (!result)
    {
        for (var flow_container_id in m_flow_to_container)
        {
            if (is_flow_basis_container_id(flow_container_id))
            {
                result = m_flow_basis_container_id = flow_container_id;
                break;
            }
        }
    }

    return result;
}

function is_flow_col_container_id(container_id)
{
    return container_id && m_map_id_flow[container_id] && !get_flow_child_container_id(container_id);
}

function get_flow_col_next(container_id)
{
    var result = '';

    if (!result)
    {
        var armed = '';

        for (var i = 0; i < 2 && !result; i++)
        {
            for (var flow_container_id in m_map_id_flow)
            {
                if (armed && is_flow_col_container_id(flow_container_id))
                {
                    result = flow_container_id;
                    break;
                }
                else if (flow_container_id == container_id)
                {
                    armed = true;
                }
            }
        }
    }

    return result;
}

////

function bind_vkey_listener(container)
{
    if (container && container.id)
    {
        var element_types = ['input', 'textarea', 'select']; // supported 'form' elements

        for (var element_type = 0; element_type < element_types.length; element_type++)
        {
            var elements = container.getElementsByTagName(element_types[element_type]);

            if (elements && elements.length)
            {
                for (var i = 0; i < elements.length; i++)
                {
                    if (!elements[i].onfocus)
                    {
                        elements[i].onfocus = function() { do_vkey_listener_onfocus(container.id) };
                    }
                }
            }
        }
    }
}

function bind_search_actions(container_id)
{
    if (container_id)
    {
        var container = document.getElementById(container_id);

        if (container)
        {
            var select_container_id = find_container_id_by_flow_role(container_id, 'select');

            var control_elements = container.getElementsByTagName('button');

            if (control_elements && control_elements.length)
            {
                for (var i = 0; i < control_elements.length; i++)
                {
                    var control_element = control_elements[i];
                    var control_name = control_element.getAttribute('name');

                    switch (control_name)
                    {
                    case 'do_search':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_nav_first('" + select_container_id + "', '" + container_id + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_ENTER, control_element.onclick);
                        break;
                    case 'do_reset':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_nav_reset('" + select_container_id + "', '" + container_id + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_ESC, control_element.onclick);
                        break;
                    case 'do_add':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_add('" + select_container_id + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_INSERT + VKEYMOD_CTRL, control_element.onclick);
                        break;
                    default:
                        // do nothing
                        break;
                    }
                }
            }

            bind_vkey_listener(container);
        }
    }
}

function bind_select_actions(container_id)
{
    if (container_id)
    {
        var container = document.getElementById(container_id);

        if (container)
        {
            var search_container_id = find_container_id_by_flow_role(container_id, 'search');

            var control_elements = container.getElementsByTagName('button');

            if (control_elements && control_elements.length)
            {
                var is_flow_col_focus_handler_needed = true;

                for (var i = 0; i < control_elements.length; i++)
                {
                    var control_element = control_elements[i];
                    var control_name = control_element.getAttribute('name');

                    switch (control_name)
                    {
                    case 'do_nav_first':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_nav_first('" + container_id + "', '" + search_container_id + "', '" + control_name + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_HOME, control_element.onclick);
                        break;
                    case 'do_nav_up':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_nav_up('" + container_id + "', '" + search_container_id + "', '" + control_name + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_PGUP, control_element.onclick);
                        map_vkey_action(container_id, VKEY_UP, function() { do_nav_row(container_id, -1, VKEY_PGUP); });
                        break;
                    case 'do_nav_dn':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_nav_dn('" + container_id + "', '" + search_container_id + "', '" + control_name + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_PGDN, control_element.onclick);
                        map_vkey_action(container_id, VKEY_DN, function() { do_nav_row(container_id, 1, VKEY_PGDN); });
                        break;
                    case 'do_nav_last':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_nav_last('" + container_id + "', '" + search_container_id + "', '" + control_name + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_END, control_element.onclick);
                        break;
                    case 'do_nav_close':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_nav_close('" + container_id + "', '" + control_name + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_LEFT, control_element.onclick);
                        map_vkey_action(container_id, VKEY_ESC, control_element.onclick);
                        break;
                    case 'do_add':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_add('" + container_id + "', '" + control_name + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_INSERT, control_element.onclick);
                        map_vkey_action(container_id, VKEY_INSERT + VKEYMOD_CTRL, control_element.onclick);
                        break;
                    case 'do_edit':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_edit('" + container_id + "', '" + control_name + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_RIGHT + VKEYMOD_CTRL, control_element.onclick);
                        map_col_action(container_id, control_element.onclick);
                        map_row_action(container_id); // overridden by do_nav_select
                        break;
                    case 'do_delete':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_delete('" + container_id + "', '" + control_name + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_DELETE, control_element.onclick);
                        break;
                    case 'do_nav_select':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_nav_select('" + container_id + "', '" + control_name + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_RIGHT, control_element.onclick);
                        map_vkey_action(container_id, VKEY_ENTER, control_element.onclick);
                        map_row_action(container_id, control_element.onclick); // override do_edit
                        is_flow_col_focus_handler_needed = false;
                        break;
                    default:
                        // do nothing
                        break;
                    }
                }

                if (is_flow_col_focus_handler_needed)
                {
                    map_vkey_action(container_id, VKEY_RIGHT, function() { set_container_focus(get_flow_col_next(container_id), true, true); });
                }
            }

            bind_vkey_listener(container);
        }
    }
}

function bind_input_actions(container_id)
{
    if (container_id)
    {
        var container = document.getElementById(container_id);

        if (container)
        {
            var select_container_id = find_container_id_by_flow_role(container_id, 'select');

            var control_elements = container.getElementsByTagName('button');

            if (control_elements && control_elements.length)
            {
                for (var i = 0; i < control_elements.length; i++)
                {
                    var control_element = control_elements[i];
                    var control_name = control_element.getAttribute('name');

                    switch (control_name)
                    {
                    case 'do_exchange':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_ok('" + select_container_id + "', '" + container_id + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_OK, control_element.onclick);
                        break;
                    case 'do_cancel':
                        if (!control_element.onclick)
                        {
                            eval("control_element.onclick = function() { do_cancel('" + select_container_id + "', '" + container_id + "'); }");
                        }
                        map_vkey_action(container_id, VKEY_CANCEL, control_element.onclick);
                        break;
                    default:
                        // do nothing
                        break;
                    }
                }
            }

            bind_vkey_listener(container);
        }
    }
}

function bind_containers()
{
    for (var container_id in m_container_to_role)
    {
        var role = m_container_to_role[container_id];

        switch (role)
        {
        case 'search':
            bind_search_actions(container_id);
            break;
        case 'select':
            bind_select_actions(container_id);
            break;
        case 'input':
            bind_input_actions(container_id);
            break;
        default:
            // do nothing
            break;
        }

        reset_container(container_id);
        set_qid_container_id(get_container_qid(container_id), container_id);
    }

    ////

    set_container_focus(get_flow_first_search_container_id()); // else 1st input element if !first_search_container_id
}

// bound directly by select onchange attribute
//
function process_change(control)
{
    if (control && control.id)
    {
        for (var container_id in m_lookup_request)
        {
            for (var i in m_lookup_request[container_id])
            {
                var details = m_lookup_request[container_id][i];

                if (details.basis_id == control.id)
                {
                    do_lookup(control, container_id, details.qid);
                    return;
                }
            }
        }
    }
}

////

// one-time initialization of page flow, and
// is called from body.onload event handler, and
// is required only for SynApp2 generated pages
//
function do_init(args)
{
    customize_background();

    // support legacy browser
    //
    set_compatible_screen();

    // leave some bread crumbs
    //
    if (!args || !args.skip_page_mark_attrs)
    {
        set_page_mark_attrs();
    }

    // process flow information
    //
    bind_containers();

    // setup event handlers
    //
    add_vkey_event_handler();
    add_resize_event_handler();
    add_onscroll_event_handler();
}

////

var g_appid = '';

function set_appid(appid)
{
    g_appid = (typeof appid == 'string') ? appid : '' ;
}

function get_appid()
{
    return g_appid;
}

var g_pid = '';

function set_pid(pid)
{
    g_pid = (typeof pid == 'string') ? pid : '' ;
}

function get_pid()
{
    return g_pid;
}

function set_page_mark_attrs()
{
    var pid = get_pid();

    if (pid && pid != 'welcome' && pid != 'login' && pid != 'logout')
    {
        if (get_appid() == 'synapp2')
        {
            set_synapp2_cookie(get_appid(), document.title + '@' + document.URL);
        }
        else
        {
            set_synapp2_cookie(get_appid(), get_appid() + ' ' + document.title + '@' + document.URL);
        }
    }
}

function get_page_mark_attrs()
{
    var attrs = null;

    var pid = get_pid();

    if (pid && pid != 'welcome' && pid != 'login' && pid != 'logout')
    {
        var appid = get_cookie('appid'); // NOTE: only synapp2 pages set_cookie('appid')

        if (appid)
        {
            var tokens = get_cookie(get_appid() == 'synapp2' ? appid : 'synapp2').split('@');

            if (tokens && tokens.length == 2)
            {
                var sep = tokens[0].indexOf(' ');

                attrs = { app:tokens[0].substring(0, sep), title:tokens[0].substring(sep), url:tokens[1] };
            }
        }
    }

    return attrs;
}

function set_mark_appid_db(appid_db)
{
    set_session_cookie('appid', appid_db);
    set_container_msg_markup('');
}

function get_mark_appid_db()
{
    return get_cookie('appid');
}

////

function set_caption(text)
{
    set_element_text_by_id(m_control_bar_caption_id, text);
}

function set_prompt(text)
{
    set_element_text_by_id(m_control_bar_prompt_id, text);
}

////

var m_default_style = Array();

function hide_show(id, state, zIndex)
{
    var element = null;

    if (id && (element = document.getElementById(id)))
    {
        var old_style = { display:"", top:"", left:"", zIndex:"" };

        old_style.display = get_element_style_property_value(element, "display");
        old_style.top = get_element_style_property_value(element, "top");
        old_style.left = get_element_style_property_value(element, "left");
        old_style.zIndex = get_element_style_property_value(element, "zIndex");

        ////

        if (!m_default_style[id])
        {
            m_default_style[id] = { display:old_style.display, top:old_style.top, left:old_style.left, zIndex:old_style.zIndex };
        }

        ////

        var new_style = { display:old_style.display, top:old_style.top, left:old_style.left, zIndex:old_style.zIndex };

        ////

        if (typeof state != 'string')
        {
            state = 'default';
        }

        if (typeof zIndex != 'number')
        {
            zIndex = m_default_style[id].zIndex;
        }

        ////

        switch (state)
        {
        case 'hide':
            new_style.display = "none";
            new_style.zIndex = m_default_style[id].zIndex;
            break;
        case 'show':
            new_style.display = m_default_style[id].display == "inline" ? "inline" : "block";
            new_style.zIndex = zIndex;
            break;
        default:
            alert('hide_show() - invalid state: ' + state);
            // drop thru
        case 'default':
            new_style.display = m_default_style[id].display;
            new_style.zIndex = m_default_style[id].zIndex;
            break;
        }

        ////

        element.style.zIndex = new_style.zIndex;
        element.style.display = new_style.display;
    }
}

function set_container_focus(container_id, no_default_container, preserve_select_index)
{
    if (container_id || !no_default_container)
    {
        var container = container_id ? document.getElementById(container_id) : document ;

        if (container)
        {
            var focus_id = '';

            if (get_container_role(container_id) == 'select')
            {
                var select_index = preserve_select_index ? Math.max(0, get_select_index_relative(container_id, 0)) : 0 ;
                set_select_state_exclusive(container_id, select_index);
            }
            else
            {
                // TODO: process elements in node order

                var element_types = ['input', 'textarea', 'select']; // supported 'form' elements

                for (var element_type = 0; !focus_id && element_type < element_types.length; element_type++)
                {
                    var elements = container.getElementsByTagName(element_types[element_type]);

                    if (elements && elements.length)
                    {
                        for (var i = 0; i < elements.length; i++)
                        {
                            if (elements[i].id && !elements[i].readOnly && !elements[i].disabled)
                            {
                                if (element_types[element_type] != 'input' || elements[i].type == "text")
                                {
                                    focus_id = elements[i].id;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            if (focus_id)
            {
                set_focus(focus_id);
            }
        }
    }
}

function reset_container(container_id)
{
    if (container_id)
    {
        var container = document.getElementById(container_id);

        if (container)
        {
            var elements = container.getElementsByTagName('input');

            if (elements && elements.length)
            {
                for (var i = 0; i < elements.length; i++)
                {
                    var element = elements[i];

                    if (element.type == "text")
                    {
                        element.value = '';
                    }
                    else if (element.type == "radio" || element.type == "checkbox")
                    {
                        element.checked = false;
                        element.value = '';
                    }
                }
            }

            elements = container.getElementsByTagName('select');

            if (elements && elements.length)
            {
                for (var i = 0; i < elements.length; i++)
                {
                    if (elements[i].options && elements[i].options.length && !elements[i].onchange)
                    {
                        for (var j = 0; j < elements[i].options.length; j++)
                        {
                            var option_element = elements[i].options[j];

                            if (option_element.selected != option_element.defaultSelected)
                            {
                                option_element.selected = option_element.defaultSelected;
                            }
                        }
                    }
                }
            }

            elements = container.getElementsByTagName('textarea');

            if (elements && elements.length)
            {
                for (var i = 0; i < elements.length; i++)
                {
                    elements[i].value = '';
                }
            }

            set_element_text_by_id(container_id + g_found_rows_id_suffix, ''); // TODO: HACK: KLUGE:

            // TODO: TBD: what about 'select' or other elements??

            manage_nav_controls(container_id, { disable_all:true });
        }
    }
}

eval(var_const + "CHECKBOX_COL = 0;");

function resize_container(container_id, row_size)
{
    if (container_id)
    {
        var tbody_rows = get_table_rows(container_id);

        if (tbody_rows && tbody_rows.length)
        {
            if (row_size < 1)
            {
                row_size = 1; // preserve 1st row [as the row template]
            }

            eval(var_const + "TEMPLATE_ROW = 0;");
            eval(var_const + "ACTION_COL = 1;");

            var row_template = tbody_rows[TEMPLATE_ROW];

            ////

            for (var i = 0; i < row_template.cells.length; i++)
            {
                if (i == CHECKBOX_COL)
                {
                    row_template.cells[CHECKBOX_COL].firstChild.value = '';
                }
                else
                {
                    if (!row_template.cells[i].onclick)
                    {
                        if (i == ACTION_COL)
                        {
                            row_template.cells[ACTION_COL].onclick = create_col_action_handler(container_id, 0);
                        }
                        else
                        {
                            row_template.cells[i].onclick = create_row_action_handler(container_id, 0);
                        }
                    }

                    row_template.cells[i].innerHTML = '&nbsp;';
                }
            }

            ////

            if (tbody_rows.length < row_size)
            {
                var table_element = row_template.parentNode.parentNode;
                var table_element_class = (table_element && table_element.className) ? table_element.className : '' ;
                var bcg_even_row = find_css_element(table_element_class + '_bcg_even_row', 'backgroundColor'); // MAGIC: selector suffix

                while (tbody_rows.length < row_size)
                {
                    var row_element = row_template.parentNode.insertRow(tbody_rows.length);

                    if (bcg_even_row && !(tbody_rows.length % 2))
                    {
                        row_element.style.backgroundColor = bcg_even_row;
                    }

                    for (var i = 0; i < row_template.cells.length; i++)
                    {
                        var c = row_element.insertCell(row_element.cells.length);

                        ////

                        var display = row_template.cells[i].style.display;

                        if (c.style.display != display)
                        {
                            c.style.display = display;
                        }

                        if (i == CHECKBOX_COL)
                        {
                            c.innerHTML = row_template.cells[i].innerHTML;
                        }
                        else
                        {
                            c.innerHTML = '&nbsp;';

                            if (i == ACTION_COL)
                            {
                                c.onclick = create_col_action_handler(container_id, tbody_rows.length - 1);
                            }
                            else
                            {
                                c.onclick = create_row_action_handler(container_id, tbody_rows.length - 1);
                            }

                            var width = row_template.cells[i].style.width;

                            if (c.style.width != width)
                            {
                                c.style.width = width;
                            }

                            var whiteSpace = row_template.cells[i].style.whiteSpace;

                            if (c.style.whiteSpace != whiteSpace)
                            {
                                c.style.whiteSpace = whiteSpace;
                            }

                            var textAlign = row_template.cells[i].style.textAlign;

                            if (c.style.textAlign != textAlign)
                            {
                                c.style.textAlign = textAlign;
                            }
                        }
                    }
                }
            }
            else
            {
                while (tbody_rows.length > row_size)
                {
                    row_template.parentNode.deleteRow(tbody_rows.length - 1);
                }
            }

            ////

            for (var r = 0; r < tbody_rows.length; r++)
            {
                if (tbody_rows[r].cells.length)
                {
                    if (!tbody_rows[r].cells[CHECKBOX_COL].firstChild.onclick)
                    {
                        tbody_rows[r].cells[CHECKBOX_COL].firstChild.onclick = create_select_handler(container_id, tbody_rows, r);
                    }

                    if (!tbody_rows[r].cells[CHECKBOX_COL].firstChild.onfocus && tbody_rows[TEMPLATE_ROW].cells[CHECKBOX_COL].firstChild.onfocus)
                    {
                        tbody_rows[r].cells[CHECKBOX_COL].firstChild.onfocus = tbody_rows[TEMPLATE_ROW].cells[CHECKBOX_COL].firstChild.onfocus;
                    }
                }
            }

            ////

            var thead_rows = get_table_rows(container_id, true);

            if (thead_rows && thead_rows.length)
            {
                if (!thead_rows[TEMPLATE_ROW].cells[CHECKBOX_COL].onclick)
                {
                    thead_rows[TEMPLATE_ROW].cells[CHECKBOX_COL].onclick = create_sync_select_all_handler(container_id, thead_rows[TEMPLATE_ROW].cells[CHECKBOX_COL].firstChild);
                }

                for (var c = 0; c < row_template.cells.length && c < thead_rows[TEMPLATE_ROW].cells.length; c++)
                {
                    if (c != CHECKBOX_COL && !thead_rows[TEMPLATE_ROW].cells[c].onclick)
                    {
                        thead_rows[TEMPLATE_ROW].cells[c].onclick = create_order_handler(container_id, row_template.cells[c].getAttribute("axis"), thead_rows[TEMPLATE_ROW], c);
                    }
                }
            }
        }
    }
}

function show_container(container_id, is_close_cancel_or_put)
{
    var container_role = get_container_role(container_id);

    var is_input = container_role == 'input';
    var is_display = container_role == 'display';
    var is_select = container_role == 'select';

    var flow_info = get_flow_info(find_container_id_by_flow_role(container_id, 'select'));

    if (flow_info)
    {
        var is_screen_needed = !is_close_cancel_or_put && (is_input || (is_select && flow_info.child_node_id));

        var zIndex = is_screen_needed ? (is_input ? 4 : 2 ) : null ;

        if (is_display)
        {
            hide_show(find_container_id_by_flow_role(container_id, 'search'), 'hide');
            hide_show(find_container_id_by_flow_role(container_id, 'select'), 'default');
            hide_show(container_id, 'show', zIndex);
        }
        else if (is_select)
        {
            var search_id = find_container_id_by_flow_role(container_id, 'search');
            var display_id = find_container_id_by_flow_role(container_id, 'display');

            if (is_close_cancel_or_put)
            {
                reset_container(display_id);
                hide_show(display_id, 'default');

                // reset_container(search_id); // do not reset
                set_container_focus(search_id, true); // no_default_container
                hide_show(search_id, 'default');

                reset_container(container_id);
                hide_show(container_id, 'default');
            }
            else
            {
                reset_container(display_id);
                hide_show(display_id, 'hide');

                hide_show(search_id, 'show', zIndex);

                hide_show(container_id, 'show', zIndex);
                set_container_focus(container_id);
            }
        }

        if (is_screen_needed)
        {
            hide_show(g_screen_id, 'show', zIndex - 1);
            do_resize_action();
        }
        else
        {
            hide_show(g_screen_id, 'default');
        }

        if (is_input)
        {
            if (is_close_cancel_or_put)
            {
                reset_container(find_container_id_by_flow_role(container_id, 'search')); // TODO: wouldn't need this if insert_offset used search filter
                reset_container(container_id);
                hide_show(container_id, 'default');
            }
            else
            {
                var screen_pos = get_pos(document.getElementById(g_screen_id))
                var element = document.getElementById(container_id);

                if (element)
                {
                    // shift the iform into the viewport - if and as needed
                    element.style.top = Math.max(screen_pos.top, get_viewport_offset_top()) + 'px';
                    element.style.left = Math.max(screen_pos.left, get_viewport_offset_left()) + 'px';
                }

                hide_show(container_id, 'show', zIndex);
                set_container_focus(container_id);
            }
        }
    }
}

////

function update_expanded_elements(container_id, response_select_elements)
{
    if (container_id && response_select_elements && response_select_elements.length)
    {
        var container = document.getElementById(container_id);

        if (container)
        {
            var element_types = ['input', 'select']; // supported 'form' elements

            for (var element_type = 0; element_type < element_types.length; element_type++)
            {
                var update_elements = container.getElementsByTagName(element_types[element_type]);

                if (update_elements && update_elements.length)
                {
                    // process response "select" nodes
                    //
                    for (var s = 0; s < response_select_elements.length; s++)
                    {
                        var response_select_element = response_select_elements[s];

                        if (response_select_element)
                        {
                            // match response and container nodes by name
                            //
                            var response_select_name = response_select_element.getAttribute('name');

                            if (response_select_name)
                            {
                                // fetch matching container "select" node
                                //
                                var update_element = get_named_element(update_elements, response_select_name);

                                if (update_element)
                                {
                                    // discard any existing container options
                                    //
                                    remove_select_options(update_element);

                                    // fetch response options
                                    //
                                    var response_options = response_select_element.getElementsByTagName("option");

                                    if (response_options && response_options.length)
                                    {
                                        // process response options
                                        //
                                        for (var i = 0; i < response_options.length; i++)
                                        {
                                            var option_node = response_options[i].firstChild;

                                            if (option_node && option_node.nodeType == 3)
                                            {
                                                var value = response_options[i].getAttribute('value');
                                                var text = option_node.nodeValue;

                                                // update container
                                                //
                                                append_select_option(update_element, value, text);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

////

function set_select_state_one(input_checkbox)
{
    if (input_checkbox && input_checkbox.value && !input_checkbox.checked && input_checkbox.onclick)
    {
        input_checkbox.checked = true;
        input_checkbox.onclick();
    }
}

function set_select_state_exclusive(container_id, i)
{
    var tbody_rows = get_table_rows(container_id);

    if (tbody_rows)
    {
        for (var r = 0; r < tbody_rows.length; r++)
        {
            var input_checkbox = tbody_rows[r].cells[CHECKBOX_COL].firstChild;

            if (r != i)
            {
                clr_select_state_one(input_checkbox);
            }
        }

        if (i >= 0 && i < tbody_rows.length)
        {
            var input_checkbox = tbody_rows[i].cells[CHECKBOX_COL].firstChild;

            set_select_state_one(input_checkbox);
            input_checkbox.focus();
        }
    }
}

function set_select_state_all(container_id)
{
    var tbody_rows = get_table_rows(container_id);

    if (tbody_rows)
    {
        for (var r = 0; r < tbody_rows.length; r++)
        {
            set_select_state_one(tbody_rows[r].cells[CHECKBOX_COL].firstChild);
        }
    }
}

function clr_select_state_one(input_checkbox)
{
    if (input_checkbox && input_checkbox.checked && input_checkbox.onclick)
    {
        input_checkbox.checked = false;
        input_checkbox.onclick();
    }
}

function clr_select_state_all(container_id)
{
    var tbody_rows = get_table_rows(container_id);

    if (tbody_rows)
    {
        for (var r = 0; r < tbody_rows.length; r++)
        {
            clr_select_state_one(tbody_rows[r].cells[CHECKBOX_COL].firstChild);
        }
    }
}

function sync_select_state_all(container_id, input_checkbox)
{
    if (input_checkbox && input_checkbox.checked)
    {
        set_select_state_all(container_id);
    }
    else
    {
        clr_select_state_all(container_id);
    }
}

function create_sync_select_all_handler(container_id, input_checkbox)
{
    return function()
    {
        sync_select_state_all(container_id, input_checkbox);
    }
}

function get_select_value(input_checkbox)
{
    return input_checkbox && input_checkbox.checked ? input_checkbox.value : '' ;
}

function get_select_value_first(container_id)
{
    var result = '';

    var tbody_rows = get_table_rows(container_id);

    if (tbody_rows)
    {
        for (var r = 0; r < tbody_rows.length; r++)
        {
            var row_id = get_select_value(tbody_rows[r].cells[CHECKBOX_COL].firstChild);

            if (row_id)
            {
                result = row_id;
                break;
            }
        }
    }

    return result;
}

function get_select_values_all(container_id)
{
    var result = Array();

    var tbody_rows = get_table_rows(container_id);

    if (tbody_rows)
    {
        for (var r = 0; r < tbody_rows.length; r++)
        {
            var row_id = get_select_value(tbody_rows[r].cells[CHECKBOX_COL].firstChild);

            if (row_id)
            {
                result.push(row_id);
            }
        }
    }

    return result;
}

function get_select_index_relative(container_id, relative_offset)
{
    var result = -1;

    var tbody_rows = get_table_rows(container_id);

    if (tbody_rows)
    {
        for (var r = 0; r < tbody_rows.length; r++)
        {
            if (get_select_value(tbody_rows[r].cells[CHECKBOX_COL].firstChild))
            {
                if (!relative_offset)
                {
                    result = r;
                }
                else if (relative_offset < 0 && r)
                {
                    result = r - 1;
                }
                else if (relative_offset > 0 && r + 1 < tbody_rows.length)
                {
                    result = r + 1;
                }

                break;
            }
        }
    }

    return result;
}

function get_selection_row_count(container_id)
{
    return get_select_values_all(container_id).length;
}

function is_selection(container_id)
{
    return get_selection_row_count(container_id) > 0;
}

function is_selection_single(container_id)
{
    return get_selection_row_count(container_id) == 1;
}

function is_selection_short(container_id)
{
    var result = false;

    if (is_flow_basis_container_id(container_id))
    {
        var container_ids = get_flow_basis_key_container_ids();

        var keys_selected = 0;

        for (var i in container_ids)
        {
//            if (is_selection(container_ids[i])) // TODO: TBD: support/allow multi-add??
            if (is_selection_single(container_ids[i]))
            {
                keys_selected++;
            }
        }

        if (keys_selected < container_ids.length)
        {
            result = true; // not all foreign keys have been established
        }
    }

    return result;
}

////

function toggle_select_hilite(row_element)
{
    var temp = get_element_style_property_value(row_element, "color");
    row_element.style.color = get_element_style_property_value(row_element, "background-color", "backgroundColor");
    row_element.style.backgroundColor = temp;
}

function on_select_state_change(container_id)
{
    manage_nav_controls(container_id, { selection_dependent_only:true });

    if (!is_flow_basis_container_id(container_id))
    {
        manage_nav_controls(get_flow_basis_container_id(), { selection_dependent_only:true });
    }
}

function create_select_handler(container_id, rows, r)
{
    return function()
    {
        toggle_select_hilite(rows[r]);
        on_select_state_change(container_id);
    }
}

////

var m_map_id_col_action = Array();

function map_col_action(id, handler)
{
    if (id)
    {
        if (typeof handler == 'function')
        {
            m_map_id_col_action[id] = function(i) { set_select_state_exclusive(id, i); setTimeout(handler, 25); };
        }
    }
}

function create_col_action_handler(id, i)
{
    return function() { do_col_action(id, i); }
}

function do_col_action(id, i)
{
    if (typeof m_map_id_col_action[id] == 'function')
    {
        m_map_id_col_action[id](i);
    }
}

var m_map_id_row_action = Array();

function map_row_action(id, handler)
{
    if (id)
    {
        if (typeof handler == 'function')
        {
            m_map_id_row_action[id] = function(i) { set_select_state_exclusive(id, i); setTimeout(handler, 25); };
        }
        else
        {
            m_map_id_row_action[id] = function(i) { set_select_state_exclusive(id, i); };
        }
    }
}

function create_row_action_handler(id, i)
{
    return function() { do_row_action(id, i); }
}

function do_row_action(id, i)
{
    if (typeof m_map_id_row_action[id] == 'function')
    {
        m_map_id_row_action[id](i);
    }
}

////

function nav_control_state_handler(control_element, flag_disable)
{
    if (control_element && typeof control_element == 'object')
    {
        var img_elements = control_element.getElementsByTagName('img');

        if (img_elements && img_elements.length)
        {
            var img_element = img_elements[0]; // manage only the first one

            var img_src = img_element.getAttribute('src');

            if (img_src && img_src.contains('action_'))
            {
                var is_disabled = img_src.contains('_gray.');

                if (flag_disable && !is_disabled)
                {
                    img_element.setAttribute('src', img_src.replace('.gif', '_gray.gif')); // show disabled // TODO: HACK: KLUGE: .gif
                }
                else if (!flag_disable && is_disabled)
                {
                    img_element.setAttribute('src', img_src.replace( '_gray.', '.')); // show enabled
                }
            }
        }

        if (typeof control_element.disabled == 'boolean')
        {
            control_element.disabled = flag_disable || control_element.style.display == 'none' ? true : false ;
        }
    }
}

function nav_control_is_disabled(container_id, control_name)
{
    var result = false;

    if (container_id && control_name)
    {
        var container = document.getElementById(container_id);

        if (container)
        {
            var tag_names = ['button'];

            for (var t = 0; t < tag_names.length; t++)
            {
                var control_elements = container.getElementsByTagName(tag_names[t]);

                if (control_elements && control_elements.length)
                {
                    for (var i = 0; i < control_elements.length; i++)
                    {
                        var control_element = control_elements[i];

                        if (control_element && control_element.getAttribute('name') == control_name)
                        {
                            if (typeof control_element.disabled == 'boolean')
                            {
                                result = control_element.disabled ? true : false ;
                            }

                            break;
                        }
                    }
                }
            }
        }
    }

    return result;
}

function manage_nav_controls(container_id, nav_flags)
{
    if (container_id && nav_flags && get_container_role(container_id) == 'select')
    {
        var container = document.getElementById(container_id);

        if (container)
        {
            var tag_names = ['button'];

            for (var t = 0; t < tag_names.length; t++)
            {
                var control_elements = container.getElementsByTagName(tag_names[t]);

                if (control_elements && control_elements.length)
                {
                    for (var i = 0; i < control_elements.length; i++)
                    {
                        var control_element = control_elements[i];
                        var control_name = control_element.getAttribute('name');

                        if (control_name && nav_flags.disable_all)
                        {
                            nav_control_state_handler(control_element, true);
                        }
                        else if (nav_flags.selection_dependent_only)
                        {
                            switch (control_name)
                            {
                            case 'do_add':
                                nav_control_state_handler(control_element, is_selection_short(container_id));
                                break;
                            case 'do_edit':
                            case 'do_nav_select':
                                nav_control_state_handler(control_element, !is_selection_single(container_id));
                                break;
                            case 'do_delete':
                                nav_control_state_handler(control_element, !is_selection(container_id));
                                break;
                            }
                        }
                        else
                        {
                            switch (control_name)
                            {
                            case 'do_nav_first':
                            case 'do_nav_up':
                                nav_control_state_handler(control_element, nav_flags.firstpage ? true : false);
                                break;
                            case 'do_nav_last':
                            case 'do_nav_dn':
                                nav_control_state_handler(control_element, nav_flags.lastpage ? true : false);
                                break;
                            case'do_nav_close':
                                nav_control_state_handler(control_element, false);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

////

function manage_auth_action_controls(auth_actions)
{
    if (auth_actions)
    {
        for (var qid in auth_actions)
        {
            if (m_qid_to_containers[qid])
            {
                var container_ids = m_qid_to_containers[qid];

                for (var c = 0; c < container_ids.length; c++)
                {
                    var container = document.getElementById(container_ids[c]);

                    if (container)
                    {
                        var tag_names = ['button'];

                        for (var t = 0; t < tag_names.length; t++)
                        {
                            var control_elements = container.getElementsByTagName(tag_names[t]);

                            if (control_elements && control_elements.length)
                            {
                                for (var i = 0; i < control_elements.length; i++)
                                {
                                    var control_element = control_elements[i];
                                    var control_name = control_elements[i].getAttribute('name');

                                    if (control_name == 'do_add')
                                    {
                                        if (!in_array(auth_actions[qid], '_auth_add_'))
                                        {
                                            nav_control_state_handler(control_element, true);
                                            control_element.style.display = 'none';
                                        }
                                    }
                                    else if (control_name == 'do_edit')
                                    {
                                        if (!in_array(auth_actions[qid], '_auth_edit_'))
                                        {
                                            nav_control_state_handler(control_element, true);
                                            control_element.style.display = 'none';
                                        }
                                    }
                                    else if (control_name == 'do_delete')
                                    {
                                        if (!in_array(auth_actions[qid], '_auth_delete_'))
                                        {
                                            nav_control_state_handler(control_element, true);
                                            control_element.style.display = 'none';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

////

function get_delete_confirm_msg(record_count)
{
    return 'Do you want to delete the ' + (record_count > 1 ? (record_count + ' selected records?') : 'selected record?');
}

////

var m_page_msg_id = 'id_page_msg'; // TODO: HACK: KLUGE: MAGIC:

function set_container_msg_markup(markup, msg_container_id)
{
    if (!msg_container_id || typeof msg_container_id != 'string')
    {
        msg_container_id = m_page_msg_id; // TODO: HACK: KLUGE: EXTERN:
    }

    var msg_element = document.getElementById(msg_container_id);

    if (msg_element && typeof markup == 'string')
    {
        msg_element.innerHTML = markup;
    }
}

////

var m_debug_msg_window = null;
var m_debug_msg_window_to_front = false; //true; // DEFAULT: change as appropriate for your needs

function debug_msg(content, error_flag)
{
    if (!m_debug_msg_window || m_debug_msg_window.closed)
    {
        m_debug_msg_window = window.open("", "Messages", "width=700, height=500, scrollbars=1, resizable=1");
    }

    if (m_debug_msg_window)
    {
        var doc = m_debug_msg_window.document;

        doc.open();
        doc.write("<html><head><title>SynApp2 Messages</title></head><body><textarea rows=200 cols=180>");

        if (typeof content == "string" && content.length)
        {
            doc.write(content);
        }
        else
        {
            doc.write("empty");
        }

        doc.write("</textarea></body></html>");
        doc.close();

        if ((error_flag || m_debug_msg_window_to_front) && m_debug_msg_window.focus)
        {
            m_debug_msg_window.focus(); // Mozilla must enable "Raise or lower windows" in advanced settings
        }
    }
}

////

var m_event_msg_window = null;
var m_event_msg_is_enabled = false; //true; // DEFAULT: change as appropriate for your needs

function event_msg_is_enabled()
{
    return m_event_msg_is_enabled;
}

function event_msg(content)
{
    if (event_msg_is_enabled())
    {
        if (!m_event_msg_window || m_event_msg_window.closed)
        {
            m_event_msg_window = window.open("", "Events", "width=700, height=500, scrollbars=1, resizable=1");
            m_event_msg_window.document.write("<title>SynApp2 Event Messages</title>");
        }

        if (m_event_msg_window)
        {
            m_event_msg_window.document.write('<pre style="display:inline;">' + content + '<br /></pre>');
        }
    }
}

////

// adapted from code posted on 08-23-2002 by RoyW to
// http://codingforums.com/archive/index.php?t-4555.html
//
function process_search_string()
{
    var srch = unescape(document.location.search.substring(1));
    var pairs = srch.split(/\&/);

    // for (var i in pairs) // this construct fails in Chrome 5.0.375.55
    for (var i = 0; i < pairs.length; i++)
    {
        var pair = pairs[i].split(/\=/);

        if (pair.length == 2)
        {
            window['g_search_' + pair[0]] = pair[1];
        }
    }
}

process_search_string(); // create global vars from search string (e.g. g_search_XXXX, g_search_YYYY)

////

function show_busy()
{
    document.body.style.cursor = 'wait';
    window.status = "SynApp2 - Wait...";
}

function show_progress()
{
    document.body.style.cursor = 'progress';
    window.status = "SynApp2 - Working...";
}

function show_ready()
{
    window.status = "SynApp2 - Ready.";
    document.body.style.cursor = 'default';
}

////

eval(var_const + "VKEY_LIMIT_LO = 12;");

eval(var_const + "VKEY_ENTER    = 13;");
eval(var_const + "VKEY_OK       = 13;");
eval(var_const + "VKEY_ESC      = 27;");
eval(var_const + "VKEY_CANCEL   = 27;");
eval(var_const + "VKEY_SPACE    = 32;");
eval(var_const + "VKEY_PGUP     = 33;");
eval(var_const + "VKEY_PGDN     = 34;");
eval(var_const + "VKEY_END      = 35;");
eval(var_const + "VKEY_HOME     = 36;");
eval(var_const + "VKEY_LEFT     = 37;");
eval(var_const + "VKEY_UP       = 38;");
eval(var_const + "VKEY_RIGHT    = 39;");
eval(var_const + "VKEY_DN       = 40;");
eval(var_const + "VKEY_INSERT   = 45;");
eval(var_const + "VKEY_DELETE   = 46;");

eval(var_const + "VKEY_LIMIT_HI = 47;");

eval(var_const + "VKEYMOD_SHIFT = '__shift';");
eval(var_const + "VKEYMOD_CTRL  = '__ctrl';");
eval(var_const + "VKEYMOD_ALT   = '__alt';");

var m_map_id_vkey_listener = Array();
var m_map_id_vkey_action = Array();

function do_vkey_listener_onfocus(id)
{
    if (id)
    {
        hilite_listener(id, m_map_id_vkey_listener.length ? m_map_id_vkey_listener[0] : '');
        m_map_id_vkey_listener = [id];
    }
}

function map_vkey_action(id, vkey, handler, map_as_vkey_listener)
{
    if (id && vkey && typeof handler == 'function')
    {
        m_map_id_vkey_action[id + '__' + vkey] = handler;

        if (map_as_vkey_listener)
        {
            m_map_id_vkey_listener = [id];
        }
    }
}

function do_vkey_action(vkey, is_shift, is_ctrl, is_alt)
{
    var result = null;

    if (vkey)
    {
        for (var i = 0; i < m_map_id_vkey_listener.length; i++)
        {
            var action_key = m_map_id_vkey_listener[i] + '__' + vkey;

            if (is_ctrl)
            {
                action_key += VKEYMOD_CTRL;
            }

            if (is_alt)
            {
                action_key += VKEYMOD_ALT;
            }

            if (is_shift)
            {
                action_key += VKEYMOD_SHIFT;
            }

            if (typeof m_map_id_vkey_action[action_key] == 'function')
            {
                // m_map_id_vkey_action[action_key]();
                window.setTimeout(m_map_id_vkey_action[action_key], 25); // invoke from another thread
                result = true;
                break;
            }
        }
    }

    return result;
}

function vkey_event_handler(e)
{
    if (!e) e = window.event;

    var result = true;

    var ignore = false;

    if (e.keyCode == VKEY_ENTER &&
        ((e.target && e.target.nodeName.toLowerCase() == 'button') ||
         (e.srcElement && e.srcElement.nodeName.toLowerCase() == 'button')))
    {
        ignore = true; // ASSUME: action handled by button onclick
    }

    if (!ignore &&
        e.keyCode > VKEY_LIMIT_LO &&
        e.keyCode < VKEY_LIMIT_HI &&
        do_vkey_action(e.keyCode, e.shiftKey, e.ctrlKey, e.altKey))
    {
        result = false; // DOM level 0 / IE

        if (e.preventDefault && e.stopPropagation)
        {
            // DOM level 2
            e.preventDefault();
            e.stopPropagation();
        }
    }

    return result;
}

function add_vkey_event_handler()
{
    if (typeof document.addEventListener == 'function')
    {
        document.addEventListener('keydown', vkey_event_handler, false); // DOM Level 2 event model
    }
    else if (typeof document.attachEvent != 'undefined')
    {
        document.attachEvent('onkeydown', vkey_event_handler); // IE event model
    }
}

////

var g_content_id = 'id_page_content'; // TODO: HACK: KLUGE: MAGIC:
var g_screen_id = 'id__iform__screen'; // TODO: HACK: KLUGE: MAGIC:
var g_feedback_id_suffix = '_feedback'; // TODO: HACK: KLUGE: MAGIC:
var g_found_rows_id_suffix = '__found_rows'; // TODO: HACK: KLUGE: MAGIC:

function do_resize_action()
{
    var content_element = document.getElementById(g_content_id);
    var screen_element = document.getElementById(g_screen_id);

    if (content_element && screen_element)
    {
        var window_dimensions = get_window_dimensions();
        var content_element_pos = get_pos(content_element);

        screen_element.style.width = (window_dimensions.width - content_element_pos.left + get_viewport_offset_left()) + 'px';
        screen_element.style.height = (window_dimensions.height - content_element_pos.top + get_viewport_offset_top()) + 'px';
    }
}

function resize_event_handler(e)
{
    do_resize_action();
}

function add_resize_event_handler()
{
    window.onresize = resize_event_handler;
}

function onscroll_event_handler(e)
{
    do_resize_action();
}

function add_onscroll_event_handler()
{
    window.onscroll = onscroll_event_handler;
}

////

/*
** drag 'n drop
*/

var m_drag_items = null;
var m_drag_targets = null;

function set_drag_items(idds)
{
    m_drag_items = Array();

    if (typeof idds == 'object')
    {
        for (var iddi = 0; iddi < idds.length; iddi++)
        {
            var id = idds[iddi];
            var doc_element = null;

            if (id && (doc_element = document.getElementById(id)))
            {
                m_drag_items[id] = doc_element;

                DragHandler.attach(doc_element); // webtookit.drag.js

                doc_element.dragBegin = function(drag_item, dx, dy) { on_item_dragBegin(drag_item, dx, dy); return false; }
                doc_element.drag = function(drag_item, dx, dy) { on_item_drag(drag_item, dx, dy); return false; }
                doc_element.dragEnd = function(drag_item, dx, dy) { on_item_dragEnd(drag_item, dx, dy); return false; }
            }
        }
    }
}

function set_drag_targets(tdds, flag_notify_targets_dragBegin)
{
    m_drag_targets = Array();

    if (typeof tdds == 'object')
    {
        for (var tddi = 0; tddi < tdds.length; tddi++)
        {
            var id = tdds[tddi];
            var doc_element = null;

            if (id && (doc_element = document.getElementById(id)))
            {
                m_drag_targets[id] = doc_element;
            }
        }

        if (typeof flag_notify_targets_dragBegin == 'boolean' && flag_notify_targets_dragBegin == true)
        {
            notify_targets_dragBegin(); // NOTE: set flag_notify_targets_dragBegin when drag_targets are generated in response to (ie. after) dragBegin event
        }
    }
}

//function on_dragBegin(drag_item, dx, dy) {} // OPTIONAL: implement this method for drag/drop

function on_item_dragBegin(drag_item, dx, dy)
{
    if (typeof on_dragBegin == 'function')
    {
        on_dragBegin(drag_item, dx, dy);
    }
}

//function on_target_dragBegin(drag_target) {} // OPTIONAL: implement this method for drag/drop (eg. element.style.backgroundColor = 'white';)

function notify_targets_dragBegin()
{
    if (typeof on_target_dragBegin == 'function' && typeof m_drag_targets == 'object')
    {
        for (var id in m_drag_targets)
        {
            var element = m_drag_targets[id];

            if (element)
            {
                on_target_dragBegin(element);
            }
        }
    }
}

//function on_target_dragEnd(drag_target) {} // OPTIONAL: implement this method for drag/drop (eg. element.style.backgroundColor = 'transparent';)

function notify_targets_dragEnd()
{
    if (typeof on_target_dragEnd == 'function' && typeof m_drag_targets == 'object')
    {
        for (var id in m_drag_targets)
        {
            var element = m_drag_targets[id];

            if (element)
            {
                on_target_dragEnd(element);
            }
        }
    }
}

//function on_drag(drag_item, dx, dy) {} // OPTIONAL: implement this method for drag/drop

function on_item_drag(drag_item, dx, dy)
{
    if (typeof on_drag == 'function')
    {
        on_drag(drag_item, dx, dy);
    }
}

//function on_dragEnd(drag_item, drag_target, dx, dy) {} // IMPORTANT: implement this method for drag/drop

function on_item_dragEnd(drag_item, dx, dy)
{
    notify_targets_dragEnd();

    if (typeof on_dragEnd == 'function')
    {
        on_dragEnd(drag_item, get_drag_target(drag_item, dx, dy), dx, dy);
    }
    else
    {
        alert('function on_dragEnd(drag_item, drag_target, dx, dy) {} - not implemented!');
    }
}

function get_drag_target(drag_item, dx, dy)
{
    var drop_target = null;

    if (typeof m_drag_targets == 'object')
    {
        var pos = get_pos(drag_item);

        var x = pos.left;
        var y = pos.top;

        for (var id in m_drag_targets)
        {
            var element = m_drag_targets[id];

            if (element)
            {
                var pos = get_pos(element);

                var x1 = pos.left;
                var x2 = x1 + element.offsetWidth;
                var y1 = pos.top;
                var y2 = y1 + element.offsetHeight;

                if (x >= x1 && x <= x2 && y >= y1 && y <= y2)
                {
                    drop_target = element;
                    break;
                }
            }
        }
    }

    return drop_target;
}

////

/*
** DOM utility functions
*/

////

function set_focus(id)
{
    if (id)
    {
        var element = null;

        if ((element = document.getElementById(id)))
        {
            try
            {
                element.focus();

                if (element.nodeName.toLowerCase() == 'input' && element.type == 'text')
                {
                    element.select();
                }
            }
            catch (ex)
            {
                alert("Cannot set focus to: " + id);
            }
        }
    }
}

////

function get_named_element(elements, name)
{
    var named_element = null;

    if (elements && elements.length && name)
    {
        // TODO: this could be a map instead of a search loop

        for (var i = 0; i < elements.length; i++)
        {
            var element = elements[i];

            if (element && element.getAttribute && element.getAttribute('name') == name)
            {
                named_element = element;
                break;
            }
        }
    }

    return named_element;
}

////

function set_input_text_value(id, value)
{
    if (typeof id == 'string' && id.length)
    {
        var element = document.getElementById(id);

        if (element)
        {
            element.value = value;
        }
    }
}

function get_input_text_value(id)
{
    var text_value = '';

    if (typeof id == 'string' && id.length)
    {
        var element = document.getElementById(id);

        if (element)
        {
            text_value = element.value;
        }
    }

    return text_value;
}

function set_element_text(element, text)
{
    try
    {
        element.innerHTML = text; // TODO: more complete and robust
    }
    catch (ex)
    {
    }
}

function set_element_text_by_id(id, text)
{
    if (id)
    {
        var element = document.getElementById(id);

        if (element)
        {
            set_element_text(element, text);
        }
    }
}

////

function remove_select_options(select_element)
{
    if (select_element)
    {
        var container_options = select_element.getElementsByTagName("option");

        if (container_options && select_element.remove)
        {
            // process back to front to avoid pulling the rug out from under our feet
            //
            for (var i = container_options.length - 1; i >= 0; i--)
            {
                select_element.remove(i);
            }
        }
    }
}

function append_select_option(element, value, text)
{
    if (element)
    {
        var nodeName = element.nodeName.toLowerCase();

        if (nodeName == 'select')
        {
            var option = document.createElement('option');

            option.value = value;
            option.text = text;

            try
            {
                element.add(option, null); // standards compliant; doesn't work in IE
            }
            catch(ex)
            {
                element.add(option); // IE only
            }
        }
        else if (nodeName == 'input')
        {
            element.value = text;
        }
    }
}

////

function get_table_rows(id, thead_flag)
{
    var table_rows = null;

    if (id)
    {
        var container = document.getElementById(id);

        if (container)
        {
            var t_elements = container.getElementsByTagName(thead_flag ? 'thead' : 'tbody');

            if (t_elements && t_elements.length)
            {
                table_rows = t_elements[0].rows;
            }
        }
    }

    return table_rows;
}

function get_container_thead_rows(id)
{
    return get_table_rows(id, true);
}

////

/*
** CSS functions
*/

function get_element_style_property_value(element, name_CSS, name_IE)
{
    var style_property_value = '';

    if (element.currentStyle)
    {
        // IE browser
        var name = (typeof name_IE == "string") ? name_IE : name_CSS ;
        style_property_value = element.currentStyle[name];
    }
    else if (document.defaultView)
    {
        // w3c browser
        style_property_value = document.defaultView.getComputedStyle(element, null).getPropertyValue(name_CSS);
    }

    return style_property_value;
}

function find_css_element(selector_key, element_name)
{
    var result = null;

    var cssRules = !IS_MSIE ? 'cssRules' : 'rules' ;

    for (var S = 0; !result && S < document.styleSheets.length; S++)
    {
        for (var R = 0; !result && R < document.styleSheets[S][cssRules].length; R++)
        {
            if (document.styleSheets[S][cssRules][R].selectorText.contains(selector_key))
            {
                if (document.styleSheets[S][cssRules][R].style[element_name])
                {
                    result = document.styleSheets[S][cssRules][R].style[element_name];
                }
            }
        }
    }

    return result;
}

function replace_css_element(selector_key, element_name, value)
{
    var result = null;

    var cssRules = !IS_MSIE ? 'cssRules' : 'rules' ;

    for (var S = 0; !result && S < document.styleSheets.length; S++)
    {
        for (var R = 0; !result && R < document.styleSheets[S][cssRules].length; R++)
        {
            if (document.styleSheets[S][cssRules][R].selectorText.contains(selector_key))
            {
                if (document.styleSheets[S][cssRules][R].style[element_name])
                {
                    document.styleSheets[S][cssRules][R].style[element_name] = value;
                }
            }
        }
    }
}

////

/*
** misc helper functions
*/

function in_array(a, v)
{
    if (typeof a == 'object')
    {
        for (var i in a)
        {
            if (a[i] === v)
            {
                return true;
            }
        }
    }

    return false;
}

function get_array_index(arr, val)
{
    var index = -1;

    if (typeof arr == 'object')
    {
        for (var i = 0; i < arr.length; i++)
        {
            if (arr[i] == val)
            {
                index = i;
                break;
            }
        }
    }

    return index;
}

////

/**
*
* trim functions adapted from code found at http://www.webtoolkit.info/
*
* without the second parameter, the functions will trim:
*   " " (ASCII 32 (0x20)), an ordinary space
*   "\t" (ASCII 9 (0x09)), a tab
*   "\n" (ASCII 10 (0x0A)), a new line (line feed)
*   "\r" (ASCII 13 (0x0D)), a carriage return
*   "\0" (ASCII 0 (0x00)), the NUL-byte
*   "\x0B" (ASCII 11 (0x0B)), a vertical tab
*
**/

function ltrim(str, chars)
{
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars)
{
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

function trim(str, chars)
{
    return ltrim(rtrim(str, chars), chars);
}

////

String.prototype.startsWith = function(s)
{
    return typeof s == 'string' && s.length && this.indexOf(s) == 0;
}

String.prototype.contains = function(s)
{
    return typeof s == 'string' && s.length && this.indexOf(s) >= 0;
}

String.prototype.endsWith = function(s)
{
    return typeof s == 'string' && this.search(s + '$') >= 0;
}

////

/*
** cookie functions
*/

// adapted from code posted on http://www.quirksmode.org/js/cookies.html

function set_cookie(name, value, days)
{
    var expires = '';

    if (days)
    {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }

    var terms = name + "=" + encodeURIComponent(value) + expires + "; path=/";

    document.cookie = terms;
}

function set_session_cookie(name, value)
{
    set_cookie(name, value, 0);
}

function set_synapp2_cookie(name, value)
{
    set_cookie(name, value, 32);
}

function delete_cookie(name)
{
    set_cookie(name, "", -1);
}

function get_cookie(name)
{
    var value = '';

    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++)
    {
        var c = ca[i];

        while (c.charAt(0) == ' ')
        {
            c = c.substring(1, c.length);
        }

        if (c.indexOf(nameEQ) == 0)
        {
            value = decodeURIComponent(c.substring(nameEQ.length, c.length));
            break;
        }
    }

    return value;
}

////

/*
** window and DOM geometry functions
*/

function get_pos(element)
{
    var offset_left = 0;
    var offset_top = 0;

    while (element)
    {
        offset_left += element.offsetLeft;
        offset_top += element.offsetTop;

        element = element.offsetParent;
    }

    return { top:offset_top, left:offset_left };
}

function get_viewport_offset_top()
{
    return window.pageYOffset ||
           document.documentElement.scrollTop ||
           document.body.scrollTop ||
           0;
}

function get_viewport_offset_left()
{
    return window.pageXOffset ||
           document.documentElement.scrollLeft ||
           document.body.scrollLeft ||
           0;
}

function get_viewport_offset()
{
    return { top:get_viewport_offset_top(), left:get_viewport_offset_left() }
}

function get_window_dimensions()
{
    var windowX = (document.documentElement && document.documentElement.clientWidth) || window.innerWidth || self.innerWidth || document.body.clientWidth;
    var windowY = (document.documentElement && document.documentElement.clientHeight) || window.innerHeight || self.innerHeight || document.body.clientHeight;

    return { x:windowX, y:windowY, width:windowX, height:windowY, top:0, right:windowX, bottom:windowY, left:0 };
}

////
