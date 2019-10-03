/**
 * Copyright © 2018 Benutech Inc. All rights reserved.
 * http://www.benutech.com - help@benutech.com
 * version: 1.17.0
 * https://github.com/benutech-inc/ttb-sdk
 * For latest release, please check - https://github.com/benutech-inc/ttb-sdk/releases
 * */

(function () {
  'use strict';

  var methodsMapping, siteProtocol, defaults;

  // methods and their API endpoints
  methodsMapping = {
    AUTH__LOGIN: {methodName: 'login', endpoint: 'webservices/login.json'},
    AUTH__LOGIN_REMOTE: {methodName: 'loginRemote', endpoint: 'webservices/remote_login.json'},
    AUTH__LOGOUT: {methodName: 'logout', endpoint: 'webservices/logout.json'},

    VENDOR__GET_PROFILE__USER: {methodName: 'TTB.getUserProfile', endpoint: 'webservices/get_vendor_user.json'},
    VENDOR__GET_PROFILE__VENDOR: {methodName: 'TTB.getVendorProfile', endpoint: 'webservices/get_vendor/{{partnerKey}}.json'},

    SPONSOR__GET_LIST: {methodName: 'TTB.getSponsors', endpoint: 'webservices/get_sponsors.json'},
    SPONSOR__GET_SELECTION: {methodName: 'TTB.getSponsorSelection', endpoint: 'webservices/get_sponsor_selection.json'},
    SPONSOR__SAVE_SELECTION: {methodName: 'saveSponsorSelection', endpoint: 'webservices/save_sponsor_selection.json'},
    SPONSOR__CLEAR_SELECTION: {methodName: 'clearSponsorSelection', endpoint: 'webservices/clear_sponsor_selection.json'},
    SPONSOR__ACCEPT_TOS: {methodName: 'TTB.getSponsors', endpoint: 'webservices/accept_tos/accept.json'},

    SEARCH_PROPERTY__PARCEL: {methodName: 'searchByParcelNumber', endpoint: 'webservices/search_parcel_number.json'},
    SEARCH_PROPERTY__ADDRESS: {methodName: 'searchBySiteAddress', endpoint: 'webservices/search_property/ttb.json'},
    SEARCH_PROPERTY__OWNER: {methodName: 'searchByOwnerName', endpoint: 'webservices/search_owner_name/ttb.json'},

    REPORT__ORDER: {methodName: 'orderReport', endpoint: 'webservices/order_report.json'},
    REPORT__GET_TYPES: {methodName: 'getTypesReport', endpoint: 'webservices/types_report.json'},

    PROPERTY__COMPS: {methodName: 'propertyComps', endpoint: 'webservices/property_comps.json'},
    PROPERTY__DETAILS: {methodName: 'propertyDetails', endpoint: 'webservices/property_details.json'},

    FARM__PE__CHECK_STATUS: {methodName: 'checkPEFarmStatus', endpoint: 'webservices/pe_farm_status/{{farmId}}.json'},
    FARM__GET_DETAILS: {methodName: 'getFarmProperties', endpoint: 'webservices/get_farm/{{farmId}}.json'},
    FARM__GET_LIST: {methodName: 'getFarmsList', endpoint: 'webservices/get_farm_metainfo.json'},

    GLOBAL_SEARCH__PROPERTIES: {methodName: 'globalSearch', endpoint: 'webservices/global_search.json'},
    GLOBAL_SEARCH__COUNT: {methodName: 'globalSearchCount', endpoint: 'webservices/global_search_count.json'},
    GLOBAL_SEARCH__FIELDS: {methodName: 'getSearchFields', endpoint: 'webservices/get_search_fields.json'}
  };

  //siteProtocol = window.location.protocol;
  siteProtocol = 'https:';
  defaults = {
    protocol: siteProtocol,
    devPortSandbox: '9000',
    devPortLanding: '9001',
    devPortExport: '9002', // SERVE mode
    // devPortExport: '9003', // PROD mode
    //partnerKey: '1-234-567-890', // no key by default.
    sponsor: {
      name: 'direct',
      title: 'Benutech',
      site: 'https://direct.titletoolbox.com/',
      logoURL: 'https://s3-us-west-1.amazonaws.com/titletoolbox/company+logos/Benutech/Benute+Logo.png',
      TOSURL: 'https://direct.api.titletoolbox.com/pages/tos/direct_tos'
    },
    enabledFeatures: 'iLookupWidget',
    baseURLPattern: 'https://{{sponsorName}}.api.titletoolbox.com/',
    scopedBootstrap: false,

    classScopedBootstrap: 'scoped-bootstrap',
    classScopedBootstrapHtml: 'scoped-bootstrap--html',
    classScopedBootstrapBody: 'scoped-bootstrap--body',

    debug: false,
    sdkPrefix: 'ttb-sdk',
    sessionKeyName: 'TTBSID',
    sessionKeySkippedMethods: [
        methodsMapping.AUTH__LOGIN.methodName, // e.g. 'login',
        methodsMapping.AUTH__LOGIN_REMOTE.methodName,
        methodsMapping.VENDOR__GET_PROFILE__USER.methodName,
        methodsMapping.VENDOR__GET_PROFILE__VENDOR.methodName,
        methodsMapping.SPONSOR__GET_SELECTION.methodName
    ],
    autoFillAttr: 'data-ttb-field',
    localStorageNames: {
      connect__selectedSponsor: 'connect--selected-sponsor'
    },
    dataTableConfig: {
      CDNs: {
        CSS: 'https://ttb-export.herokuapp.com/libs/jquery-data-tables/jquery.dataTables.min.css',
        JS: 'https://ttb-export.herokuapp.com/libs/jquery-data-tables/jquery.dataTables.min.js'
      },
      options: {}
    },
    iframeOptions: {
      height: '600px'
    },
    modalOptions: {
      sizeClass: 'modal-lg',
      autoDestroy: true
    },

    // for all components
    errorMessages: {
      GENERAL__CONNECT_FAILED: 'Failed in connecting to TitleToolbox',
      // CONNECT__NO_SPONSOR: 'No Partner - Please click "Connect" to select one.'
      CONNECT__NO_SPONSOR: 'The data related features are supported by various partners. Please click Connect to select a partner.'
    },

    sponsorItemTemplate: [
      '<tr>',
      ' <th scope="row">{{count}}</th>',
      ' <td>',
      '  <a href="{{websiteURL}}" target="_blank">',
      '   <img src="{{logoUrl}}" class="img-responsive" alt="Sponsor Logo" >',
      '  </a>',
      ' </td>',
      ' <td>',
      '  <strong>{{name}}</strong> <br>',
      '  {{websiteName}}',
      ' </td>',
      ' <td class="text-center">',
      '  {{sponsorActionButton}}',
      ' </td>',
      '</tr>'
    ].join(''),

    sponsorItemSelectedButton: [
      '<button type="button" class="btn btn-success ttb-sdk--select-sponsor--selected" disabled>',
      ' <!-- <span class="ttb-sdk--common--icon ttb-sdk--common--icon-cross"></span> -->',
      ' <span class="ttb-sdk--common--icon ttb-sdk--common--icon-check"></span>',
      ' Selected',
      '</button>'
    ].join(''),

    sponsorItemSelectButton: [
      '<button type="button" class="btn btn-primary"',
      ' data-sponsor-name="{{sponsorName}}"',
      ' data-sponsor-title="{{sponsorTitle}}"',
      ' data-sponsor-site="{{sponsorSite}}"',
      ' data-sponsor-logo="{{sponsorLogoURL}}"',
      ' data-sponsor-tos="{{sponsorTOSURL}}">',
      '  Select',
      '</button>'
    ].join(''),

    sponsorListTemplate: [
      '<h3 class="ttb-sdk--select-sponsor--heading">{{resultsMessage}}</h3>',
      '<div style="overflow-x: auto">',
      '<table class="table ttb-sdk--selected-sponsor--list">',
      ' <thead>',
      '  <tr>',
      '   <th scope="col" width="80" class="text-center">#</th>',
      '   <th scope="col" width="80" class="text-center">Logo</th>',
      '   <th scope="col" width="80" class="text-center">Name</th>',
      '   <th scope="col" width="80" class="text-center"></th>',
      '  </tr>',
      ' <thead>',
      ' <tbody class="align-items-center">{{sponsorsMarkup}}</tbody>',
      '</table>',
      '</div>'
    ].join(''),

    modalTemplate: [
      '<div id={{modalId}} class="ttb-sdk--modal modal" tabindex="-1" role="dialog" aria-labelledby="{{modalId}}-label" aria-hidden="true">',
      ' <div class="modal-dialog {{sizeClass}}" role="document">',
      '  <div class="modal-content">',
      '   <div class="modal-header">',
      '    <button type="button" class="close" data-dismiss="modal" aria-label="Close" title="Close">',
      '     <span aria-hidden="true">&times;</span>',
      '    </button>',
      '    <h4 class="modal-title" id="{{modalId}}-label">{{title}}</h4>',
      '   </div>',
      '   <div class="modal-body">',
      '    {{bodyContent}}',
      '   </div>',
      '  </div>',
      ' </div>',
      '</div>'
    ].join('')
  };

  /**
   * The main class for consuming TTB web services.
   * @class
   * @alias TTB
   *
   * @classdesc <p class="main-desc">JavaScript SDK for consuming webservices and widgets by TitleToolBox from third-party websites.</p>
   *
   * <p><strong id="dependencies">Dependencies:</strong></p>
   * <p>
   * <strong>JQuery</strong> - version <code>1.9.x</code> or higher should work. We recommend the latest version <code>3.x</code> <br/>
   * <code> &lt;script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js">&lt;/script> </code>
   * </p>
   *
   * <p>
   * <strong>Bootstrap</strong> - For modals, and rendering widgets, SDK uses bootstrap UI and script. <br/>
   * <code> &lt;script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js">&lt;/script> </code><br>
   * Official CSS: <br>
   * <code> &lt;link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> </code> <br/>
   * Scoped Bootstrap version: <br>
   * Having non-bootstrap based site ? please use the following scoped-bootstrap version to limit bootstrap styles to SDK widgets only. (bootstrap v3.3.7 used.)<br>
   * <code> &lt;link rel="stylesheet" href="https://cdn.rawgit.com/benutech-inc/ttb-sdk/1.17.0/dist/scoped-bootstrap.min.css​"> </code>
   * </p>
   *
   * <p>
   * <strong>Google Maps</strong> - Optional/for some methods only - E.g. ttb.instantLookupWidget(), and other google related methods/widgets only.)
   * <code> &lt;script src="https://maps.googleapis.com/maps/api/js?key=GOOGLE_API_KEY&libraries=places&callback=googleInit">&lt;/script> </code><br/>
   * (For API KEY, <a target="_blank" href="https://support.google.com/googleapi/answer/6158862">Google documentation</a> will be helpful.
   * </p>
   *
   * <p>
   * <strong>TitleToolBox SDK </strong> files (1 script, and 1 style), can be pulled via our public repo link:
   * <i>(keep the [latest version]{@link https://github.com/benutech-inc/ttb-sdk/releases})</i><br>
   * <code> &lt;link rel="stylesheet" href="https://cdn.rawgit.com/benutech-inc/ttb-sdk/1.17.0/dist/ttbSdk.min.css"> </code>
   * <code> &lt;script src="https://cdn.rawgit.com/benutech-inc/ttb-sdk/1.17.0/dist/ttbSdk.min.js​">&lt;/script> </code>
   * <br><br>OR via<strong> Bower </strong> using <code>bower install ttb-sdk --save</code>
   * <br><br>
   *
   * <i style="font-size: 13px;">SDK's <strong>NPM</strong> package will be released soon...</i>
   * </p>
   *
   * @param {Object} config - The configuration info required
   *
   * @param {String} config.partnerKey - The Partner-Key is a unique ID assigned to you by Company, that to be sent on
   * every request from your site.
   *
   * @param {String} [config.baseURL="https://direct.api.titletoolbox.com/"] - The Base URL to be used for APIs calls. (note - we can alternatively use <code>sponsor</code>
   * and/or <code>baseURLPattern</code> to keep switching to custom <code>baseURL</code> on the fly.)
   *
   * @param {Object} [config.sponsor] - The Title Company Sponsor object to be used in generating baseURL. contains name, title, site, logoURL, and TOSURL.
   * (Note - It will be ignored if baseURL is already passed.)
   *
   * @param {String} [config.baseURLPattern="https://{{sponsorName}}.api.titletoolbox.com/"] - The URL pattern to be used
   * to generate the baseURL which includes the <code>sponsor.name</code> provided. Must contain {{sponsorName}} at least once.
   * (Note - It will be ignored if <code>baseURL</code> is already passed.)
   *
   * @param {Function} [config.onSessionExpireV2] - [Recommended over deprecated onSessionExpire()] - The callback / handler to be called
   * whenever an API receives <code>401 - UNAUTHENTICATED</code> (session expired) from server.
   * This can be used to get a new valid "stk" from vendor site, via a login prompt or a direct ajax request to vendor server, to renew user login session from TTB server.
   * Method should return a promise, which should be resolved with a loginRemotePayload object. (Check loginRemotePayload details from loginRemote() method.)
   * @param {Object} [config.onSessionExpireV2.info] - Contains details against the failed request. This can be used for advanced handling. <br>
   * <code>info</code> object will contain <code>requestError</code>, <code>requestConfig</code>, <code>methodName</code> and <code>endpoint</code>.
   *
   * @param {String} [config.autoFillAttr="data-ttb-field"] - The attribute to be used for auto-fill input fields when
   * <code>options.autoFillContext</code> specified in methods which support auto-fill.
   * (Note: the attribute value on those inputs would be used to evaluate to <code>res.response.data</code>
   * - For example: &lt;input type="text" <code>data-ttb-field="GeneralInfo.Bedrooms"</code> />
   * or &lt;input type="text" <code>data-ttb-field="GeneralInfo['Year Built']"</code> />
   *
   * @param {String} [config.scopedBootstrap=false] - Whether the scoped bootstrap version is used.
   * (recommended when non-bootstrap sites faces styles conflicts with official bootstrap CSS)
   *
   * @param {String} [config.debug=true] - SDK debug mode flag useful for logs, etc.
   *
   * @param {Function} [config.onSessionExpire] - (DEPRECATED! Please check onSessionExpireV2() ) - The callback / handler to be called whenever an API receives <code>401 - UNAUTHENTICATED</code>
   * (session expired) from server. (NOTE: This will be ignored when onSessionExpireV2() is provided) <br>
   * Check out live working example at https://jsfiddle.net/shahzadns/rkw8v51y/
   * @param {Object} config.onSessionExpire.info - The info object that SDK passes to the callback to provide more control to recover the request failure.
   * @param {String} config.onSessionExpire.info.requestError - The AJAX error object passed to the error-handler of the API method that was failed.
   * @param {String} config.onSessionExpire.info.requestConfig - The configuration object passed to the request that was failed.
   * @param {Function} config.onSessionExpire.info.retry - retry the failed call, while auto-passing exactly all the info e.g. payload (if any), and query params (if any)
   * Returns the AJAX promise. - very useful to call and ready-up the feature once user logs-in back.
   *
   * @return {Object} ttb - The instance associated with the provided configuration.
   *
   * @example
   * // With basic and minimum requirement.
   * var ttb = new TTB({
   *   partnerKey: 'xxxxxxxxxxxxxxx',
   * });
   *
   * @example
   * // With advanced configuration for custom baseURL, and logs for debug mode.
   * var ttb = new TTB({
   *   partnerKey: 'xxxxxxxxxxxxxxx',
   *   baseURL: 'https://direct.api.titletoolbox.com/',
   *   debug: true
   * });
   *
   * @example
   * // With advanced configuration for custom <code>baseURLPattern</code> and <code>sponsor</code>, and custom auto-fill attributes.
   * var ttb = new TTB({
   *   partnerKey: 'xxxxxxxxxxxxxxx',
   *   baseURLPattern: 'https://customdomain.com/api/{{sponsorName}}',
   *   sponsor: {...} // switchable later via ttb.setSponsor(),
   *   autoFillAttr: 'data-model',
   *   scopedBootstrap: true
   * });
   *
   * @example
   * // (Optional but Recommended !) registering session-expired (401 status error) handler for ttb ajax requests.
   * // live working example will be provided soon.
   *
   * // your app store / constant having configuration
   * var ttbStore = {
   *   ttb: undefined,
   *   partnerKey: '558b3e66-47b2-477d-a0d3-6d85db4c3148',
   *   stk: '64on7i137ksveoa18os6i7g9a3', // assuming you maintain user valid stk in your store.
   *   getuser_url: 'https://newlawyersie.api.titletoolbox.com/webservices/get_ttb_user.json',
   * };
   *
   * // step#2 instantiate the TTB with your (vendor's) credentials. check full config from TTB instance section.
   * ttbStore.ttb = new TTB({
   *  partnerKey: ttbStore.partnerKey,
   *  onSessionExpireV2: ttbOnSessionExpireV2 // note suffix "V2" in "onSessionExpireV2"
   * });
   *
   * // step#3 set up a sessionExpire handler. following is just an example.
   * // this callback gets called, whenever any ttb method Ajax call encounters 401.
   * function ttbOnSessionExpireV2(info) {
   *  console.log('ttbOnSessionExpireV2: No / Expired Session.', info); // check out "info" in console for any advanced handling.
   *
   *  // step#3.1 build required info by getting the latest / valid stk (depends on vendor site's login system.)
   *  // option 1 - Some vendors have it in store on Frontend.
   *  // option 2 - Some vendors get latest stk from their server via ajax call.
   *  // option 3 - Some vendors perform a login prompt modal to renew user session on their login system to get latest stk for TTB.
   *
   *  // for example vendor has option 2 case.
   *  // build required info
   *  var loginRemotePayload = {
   *    stk: ttbStore.stk,
   *    getuser_url: ttbStore.getuser_url
   *  };
   *
   *  // step#3.2 Simply return the resolved promise containing this info, leave the rest on SDK to perform TTB system login, and retry the failed requests, like nothing happened. ^ _ ^
   *  return TTB.utilPromiseResolve(loginRemotePayload);
   * }
   *
   * // That's it! We are ready to shine!
   *
   * */
  window.TTB = function (config) {

    /**
     * @type {Object}
     * @desc The configuration passed while instantiating main SDK class.
     * For details, Please check documentation of <code> new TTB(...) </code> constructor.
     * */
    this.config = config;

    // setup instance id for recognising relevant logs of specific instance.
    window.TTB.instancesCount = window.TTB.instancesCount || 0;
    window.TTB.instancesCount++;

    /**
     * @type {Number}
     * @desc Instance Id to recognise instances and other usages. For example, Tracing relevant logs.
     * */
    this.instanceId = window.TTB.instancesCount;

    // setup default baseURL
    this.baseURLPattern = config.baseURLPattern || defaults.baseURLPattern;

    // set sponsor via proper channel. (priority => config > previously selected > default)
    var sponsor = config.sponsor || window.TTB._getLocal(defaults.localStorageNames.connect__selectedSponsor) || window.TTB.utilCopy(defaults.sponsor);
    var baseURL = this.setSponsor(sponsor);

    this.baseURL = config.baseURL || baseURL;
    this.autoFillAttr = config.autoFillAttr || defaults.autoFillAttr;
    this.scopedBootstrap = config.scopedBootstrap || defaults.scopedBootstrap;
    this.debug = config.debug || defaults.debug;

    /* exporting flags to main class for static methods */
    // scoped bootstrap to be true if at least one instance contains the flag.
    window.TTB.scopedBootstrap = !window.TTB.scopedBootstrap ? this.scopedBootstrap : window.TTB.scopedBootstrap;

    // namespace to hold any third-party instances references for later usage like destroy. e.g. dataTable
    //this._refs = {
    //  instantLookup: {}
    //};

    this._log(['TTB SDK instantiated. | version: ', window.TTB.version]);
  };


  /**
   * @memberof TTB
   * @alias version
   * @static
   * @description The version of the SDK being used.
   * @type String
   * */
  window.TTB.version = '1.17.0';


  /**
   * @memberof TTB
   * @alias version
   * @static
   * @description Total counts of TTB instances created.
   * @type String
   * */
  window.TTB.instancesCount = 0;

  /**
   * @memberof TTB
   * @alias debug
   * @static
   * @description The debug logs flag for static functions only.
   * (For instance methods, The "debug" property passed while instantiating, will be used.)
   * @type {Boolean}
   * */
  window.TTB.debug = false;

  /**
   * @memberof TTB
   * @alias _log
   * @static
   * @private
   * @description Logger for static functions only. uses window.TTB.debug flag to enable/disable logging.
   *
   * @param {Array} args - list of values to be logged.
   * */
  window.TTB._log = function (args) {
    window.TTB.debug && console.log.apply(console, [defaults.sdkPrefix + ' : static :'].concat(args));
  };


  /**
   * @memberof TTB
   * @alias _createDefaultInstance
   * @static
   *
   * This static method provides an instance for the internal use for TTB static methods.
   * @private
   *
   * @param {String} partnerKey - The partner key provided by support team for the consumer site.
   * @param {Object} sponsor - The sponsor object contains name, title, and TOSURL.
   *
   * @example
   *
   * var defaultTtb = TTB._createDefaultInstance();
   *
   * @return {Object} instance - instance object created with default configuration.
   *
   * */
  window.TTB._createDefaultInstance = function (partnerKey, sponsor) {
    return new TTB({
      partnerKey: partnerKey || defaults.partnerKey,
      sponsor: sponsor
    });
  };

  /**
   * @memberof TTB
   * @alias _getLocal
   * @static
   *
   * This static method gets a model from local storage with given ttb sdk prefix.
   * @private
   *
   * @param {String} key - name of the model against which was the value saved.
   *
   * @example
   *
   * var actionName = TTB._getLocal('selectedAction');
   *
   * @return {any} value - value retrieved from local Storage.
   *
   * */
  window.TTB._getLocal = function (key) {
    try {
      var value = window.localStorage.getItem(defaults.sdkPrefix + '--' + key);
      switch (value) {
        case 'null':
          return null;

        case 'undefined':
          return undefined;

        default:
          return (value[0] === '{' || value[0] === '[') ? JSON.parse(value) : value;
      }

    } catch (e) {
      return null;
    }
  };

  /**
   * @memberof TTB
   * @alias _setLocal
   * @static
   *
   * This static method gets a model from local storage with given ttb sdk prefix.
   * @private
   *
   * @param {String} key - name of the model against which was the value saved.
   * @param {any} value - the value to be saved.
   *
   * @example
   *
   * var actionName = TTB._setLocal('selectedAction', 'fullProfileReport');
   *
   * @return {Boolean} successWrite - if was successful write. helpful for browsers having "site data" write disabled.
   *
   * */
  window.TTB._setLocal = function (key, value) {
    try {
      var valueToWrite = typeof value === 'object' ? JSON.stringify(value) : value;
      window.localStorage.setItem(defaults.sdkPrefix + '--' + key, valueToWrite);
      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @memberof TTB
   * @alias _modal
   * @static
   *
   * Shows a modal with given dynamic content.
   * @private
   *
   * @param {Object} options - configuration options for the modal.
   * @param {String} options.title - The Title of the modal to be shown inside the modal header - can be plain text or HTML markup.
   * @param {String} options.bodyContent - The body content - can be plain text or HTML markup.
   * @param {String} [options.id="Dynamically generated number e.g. ttb-sdk--1234567890"] - A unique id to be assigned to the modal
   * @param {String} [options.sizeClass="modal-sm"] - modal dialog size class e.g. modal-lg, modal-md, modal-sm and custom as modal-full
   * @param {Boolean} [options.autoDestroy="true"] - To auto destroy the modal from the DOM, after it gets closed.
   *
   * @param {Function} [options.onBeforeShow] - A callback function to be invoked when modal is about to be shown. it uses <code>show.bs.modal</code> bootstrap modal event.
   * @param {Function} [options.onShown] - A callback function to be invoked when modal has been triggered and shown to user. it uses <code>shown.bs.modal</code> bootstrap modal event.
   * @param {Function} [options.onClose] - A callback function to be invoked when modal has been closed by the user. it uses <code>hidden.bs.modal</code> bootstrap modal event.
   * @param {Function} [options.onBeforeClose] - A callback function to be invoked when modal is about to be close. it uses <code>hide.bs.modal</code> bootstrap modal event.
   *
   * @return {String} $modal - A JQuery reference to the modal DOMNode Element.
   *
   * */
  window.TTB._modal = function (options) {
    var $modal, modalTemplate;

    options.id = options.id || (defaults.sdkPrefix + '--' + Date.now());
    options.sizeClass = options.sizeClass || defaults.modalOptions.sizeClass;
    options.autoDestroy = options.autoDestroy != undefined ? options.autoDestroy : defaults.modalOptions.autoDestroy;

    // generate the modal template against given info
    modalTemplate = defaults.modalTemplate
      .replace(/\{\{modalId}}/g, options.id)
      .replace('{{sizeClass}}', options.sizeClass)
      .replace('{{title}}', options.title)
      .replace('{{bodyContent}}', options.bodyContent);

    // inject the modal inside the DOM
    //return $(document.body).append(modalTemplate);
    $modal = $(modalTemplate).appendTo(document.body);

    //options.onBeforeShow && $modal.on('show.bs.modal', options.onBeforeShow);
    options.onShown && $modal.on('shown.bs.modal', options.onShown);
    //options.onBeforeClose && $modal.on('hide.bs.modal', options.onBeforeClose);
    //options.onClose && $modal.on('hide.bs.modal', options.onClose);

    $modal.on('show.bs.modal', onBeforeShowModal);
    $modal.on('hide.bs.modal', onBeforeCloseModal);

    // to auto destroy, always listen to close event
    if (options.autoDestroy) {

      $modal.on('hidden.bs.modal', function () {

        // invoked the given callback, before destroying
        options.onClose && options.onClose();

        // destroy the modal from DOM.
        $modal.remove();
      });

    } else {
      options.onClose && $modal.on('hide.bs.modal', options.onClose);
    }

    return $modal;

    // to be invoked before showing the modal. Adds bootstrap classes
    function onBeforeShowModal() {

      // remove scoped bootstrap related classes
      if (window.TTB.scopedBootstrap) {
        $('html').addClass(defaults.classScopedBootstrapHtml);
        $('body').addClass(defaults.classScopedBootstrapBody);
      }

      // invoked the given callback
      options.onBeforeShow && options.onBeforeShow();
    }

    // to be invoked before closing the modal. Removes bootstrap classes
    function onBeforeCloseModal() {

      // remove scoped bootstrap related classes
      if (window.TTB.scopedBootstrap) {
        $('html').removeClass(defaults.classScopedBootstrapHtml);
        $('body').removeClass(defaults.classScopedBootstrapBody);
      }

      // invoked the given callback
      options.onBeforeClose && options.onBeforeClose();
    }
  };

  /**
   * @memberof TTB
   * @alias utilIframeModal
   * @static
   *
   * Shows a modal having an iframe with given information, loaded. provide a subscription to "message" event of window, listening that iframe site origin.
   * @private
   *
   * @param {Object} modalOptions - configuration options for the modal. Please check TTB._modal for parameters information.
   *
   * @param {Object} iframeOptions - configuration options for the iframe site. (which is going to be loaded into the iframe)
   * @param {String} iframeOptions.id - The "id" value for the iframe element.
   * @param {String} iframeOptions.height - The "height" value for the iframe element.
   * @param {String} iframeOptions.origin - The origin of the site. E.g. "https://www.example.com/"
   * @param {String} iframeOptions.pathname - The pathname of the site. E.g. "/index.html" The final "src" value will be generated using origin, pathname, and params.
   * @param {Object} [iframeOptions.params] - params object to be auto transformed into query params with the final src URL. (hostOrigin is already being added)
   * @param {Function} [iframeOptions.onMessage] - A callback to be invoked when a message event is broadcasted from the iframe site origin.
   * parameters will be "data" - which is passed from iframe site, and "event" - complete event object.
   *
   * @return {String} $modal - A JQuery reference to the modal DOMNode Element.
   *
   * */
  window.TTB.utilIframeModal = function (modalOptions, iframeOptions) {
    var $modal, o;

    iframeOptions.height = iframeOptions.height || defaults.iframeOptions.height;

    o = {};
    o.src = iframeOptions.origin + iframeOptions.pathname + '?hostOrigin={{hostOrigin}}'
        .replace('{{hostOrigin}}', window.location.origin);

    // check if additional params are passed
    if (iframeOptions.params) {

      // technique used to pass URLs. https://stackoverflow.com/a/1739132
      $.each(iframeOptions.params, function(key, value) {
        o.src += value ? ('&' + key + '=' + encodeURIComponent(value)) : '';
      });
    }

    o.iframeTemplate = [
      '<iframe src="{{src}}" id="{{iframeId}}" name="{{iframeId}}" width="100%" height="{{height}}"></iframe>'
    ].join('')
      .replace('{{src}}', o.src)
      .replace('{{height}}', iframeOptions.height)
      .replace(/\{\{iframeId}}/g, iframeOptions.id);

    // subscribe to message event from iframe site, only when onMessage is provided
    if (iframeOptions.onMessage) {

      window.addEventListener('message', receiveMessage, false);

      o.modalOptionsOnClose = modalOptions.onClose;
      modalOptions.onClose = function () {

        window.TTB._log(['utilIframeModal: onClose']);

        // invoked any onClose callback if it was provide via modalOptions.
        o.modalOptionsOnClose && o.modalOptionsOnClose();

        // unsubscribe the message event when modal has been closed.
        window.removeEventListener('message', receiveMessage);
      };
    }

    // take in existing bodyContent if given.
    modalOptions.bodyContent = [modalOptions.bodyContent || '', o.iframeTemplate].join('');
    $modal = window.TTB._modal(modalOptions);

    // triggering .modal() of bootstrap
    $modal.modal({
      //backdrop: 'static'
    });

    return $modal;

    // listener to window "message" event.
    function receiveMessage(event) {
      window.TTB._log(['utilIframeModal: receiveMessage: origin:', event.origin]);

      if (event.origin !== iframeOptions.origin) {
        //window.TTB._log(['utilIframeModal: receiveMessage: from other origin:', event.origin]);
        return;
      }

      window.TTB._log(['utilIframeModal: receiveMessage: event: ', event]);
      iframeOptions.onMessage(event.data, event);
    }
  };

  /**
   * @memberof TTB
   * @alias utilGenerateUniqueId
   * @static
   *
   * Generates a unique string Id for list records.
   * @private
   *
   * @param {String} [prefix] - a prefix string to include to generated unique id.
   * @param {String} [suffix] - a suffix string to include to generated unique id.
   *
   * @return {String} UniqueId - A possibly unique id helpful for records identity.
   *
   * */
  window.TTB.utilGenerateUniqueId = function (prefix, suffix) {
    return defaults.sdkPrefix + '--' + (prefix || '') + Date.now() + '-' + parseInt(Math.random() * 100000) + (suffix || '');
  };

  /**
   * @memberof TTB
   * @alias utilCapitalize
   * @static
   *
   * Capitalizes the given string.
   * @private
   *
   * @param {String} [input] - string to transform into capital case
   *
   * @return {String} value - capitalized string.
   *
   * */
  window.TTB.utilCapitalize = function(input) {
    var capWord = function (wrd) {
      return wrd.charAt(0).toUpperCase() + wrd.substr(1).toLowerCase();
    };
    input += '';
    return input.split(' ').map(capWord).join(' ');
  };


  /**
   * @memberof TTB
   * @alias utilLoadDataTable
   * @static
   *
   * Injects assets (JS, CSS) for dataTable
   * @private
   *
   * @param {Function} [onLoad] - callback to be invoked when done loading data table.
   *
   * @return {String} value - capitalized string.
   *
   * */
  window.TTB.utilLoadDataTable = function(onLoad) {

    // check if lib has already been async loaded - initialize right away
    if (!!$(document).DataTable) {
      window.TTB._log(['utilLoadDataTable: data-table: already available: init']);
      onLoad && onLoad();

    } else {

      window.TTB._log(['utilLoadDataTable: data-table: not available yet: loading files:  CSS added.']);

      // load styles
      $(document.head)
        .append('<link type="text/css" rel="stylesheet" href="'+ defaults.dataTableConfig.CDNs.CSS + '"/>');

      // load script
      $.ajax({
        method: 'GET',
        url: defaults.dataTableConfig.CDNs.JS,
        dataType: 'script',
        cache: true,
        success: function (content) {
          window.TTB._log(['utilLoadDataTable: data-table: inject JS: success:']);

          // initialize after browser is done with including script
          onLoad && setTimeout(onLoad, 0);
        },
        error: function (reason) {
          window.TTB._log(['utilLoadDataTable: data-table: inject JS: failure: ', reason]);
        }
      });
    }
  };

  /**
   * @memberof TTB
   * @alias utilRenderTable
   * @static
   *
   * Generate and render a table based on given data and options.
   * @private
   *
   * @param {Array<Object>} records - the list of objects / records to show table against.
   *
   * @param {Object} options - configuration options for the table list. (which is going to be loaded into the given destination)
   * @param {String} options.containerSelector - The selector value for the target container.
   * @param {Array<Object>} options.columns - list of columns, each having "label", and "fieldName" fields.
   * @param {Function} options.onInit - callback to be called when data-table lib is injected and instance has been created.
   * @param {Function} options.onSelect - callback to be called when user selects any record from the list.
   *
   * @return {String} $container - A JQuery reference to the container DOMNode Element.
   *
   * */
  window.TTB.utilRenderTable = function (records, options) {
    var $container, o;

    //options.hover = options.hover || defaults.tableOptions.height;

    o = {
      selectedRecordIndex: undefined,
      dataTableInstance: undefined,
      classSelected: 'ttb-sdk--table--record-selected',

      tableId: undefined,
      headings: undefined,
      list: undefined,
      tableTemplate: undefined,
      tableMarkup: undefined
    };

    o.tableId = window.TTB.utilGenerateUniqueId('table-');
    o.tableTemplate =  [
      '<div class="table-responsive" id="{{tableId}}">',
      //' <table class="table display table-hover table-striped table-condensed table-bordered">',
      ' <table class="display">',
      '  <thead>',
      '  {{headings}}',
      '  </thead>',
      '  <tbody>',
      '  {{list}}',
      '  </tbody>',
      ' </table>',
      '</div>'
    ].join('');

    // capture the reference to container and for now hide the container
    $container = $(options.containerSelector)
      .hide();

    // generate headings
    o.headings = [
      '<tr>',

      // select button against each record
      '<td></td>',

      // all columns values
      options.columns.map(function(column) {
        return '<th>{{label}}</th>'.replace('{{label}}', column.label);

      }).join(''),

      '</tr>'
    ];

    // generate list / records
    o.list = records.map(function(record, recordIndex) {

      return [
        '<tr data-record-index="'+ recordIndex +'">',

        // select button against each record
        '<td><button class="btn btn-primary ttb-sdk--instant-lookup--select">Select</button></td>',

        // all columns values
        options.columns.map(function(column) {
          return '<td>{{value}}</td>'.replace('{{value}}', record[column.fieldName] || '-');

        }).join(''),

        '</tr>'

      ].join('');

    });

    o.tableMarkup = o.tableTemplate
      .replace('{{tableId}}', o.tableId)
      .replace('{{headings}}', o.headings.join(''))
      .replace('{{list}}', o.list.join(''));

    // render the generated table markup
    $container.empty().append(o.tableMarkup);

    // listen to select button to send the selection info to host function
    $container.find('table').on('click', '.ttb-sdk--instant-lookup--select', onRecordSelect);

    // load data-table library in advance.
    window.TTB.utilLoadDataTable(initializeDataTable);

    /* functions declarations below */

    // initialize data-table after checking with loading assets.
    function initializeDataTable() {
      window.TTB._log(['utilRenderTable: initializeDataTable: init']);

      o.dataTableInstance = $container.find('table').DataTable();
      o.dataTableInstance.on('draw.dt', activateSelectRecord);

      // show the rendered table
      $container.show();

      // invoked passed onInit callback to forward the control.
      options.onInit(o.dataTableInstance);
    }

    // to be invoked when a record is selected.
    function onRecordSelect(event) {
      var $record, record;

      //window.TTB._log(['utilRenderTable: onRecordSelect:']);

      // capture target record row.
      $record = $(this).closest('tr');

      o.selectedRecordIndex = +$record.attr('data-record-index');
      activateSelectRecord();

      record = records[o.selectedRecordIndex];

      window.TTB._log(['utilRenderTable: onRecordSelect: select: record:', o.selectedRecordIndex, record]);

      options.onSelect(record);
    }

    // to be invoked when search, or pagination re-draws the list.
    //function onTableReDraw() {
    //  window.TTB._log(['utilRenderTable: onTableReDraw']);
    //
    //}

    // add a class of selected entry and remove prev selection.
    function activateSelectRecord() {
      window.TTB._log(['utilRenderTable: activateSelectRecord:']);

      $container.find('table tr')
        .removeClass(o.classSelected)
        .filter('[data-record-index="' + o.selectedRecordIndex + '"]')
        .addClass(o.classSelected);
    }

    return $container;
  };

  /**
   * @memberof TTB
   * @alias utilBuildSponsorInfo
   * @static
   * @description Build up the sponsor object for setting new sponsor on TTB instance via setSponsor().
   *
   * @param {Object} sponsorMeta - sponsor meta object retrieved from response of getSponsors().
   *
   * @return {Object} sponsorInfo - object contains name, title, site, etc.
   * */
  window.TTB.utilBuildSponsorInfo = function (sponsorMeta) {
    return {
      name: sponsorMeta.vertical_name,
      title: sponsorMeta.company_info.company_name,
      site: sponsorMeta.site_url,
      logoURL: sponsorMeta.company_info.logo_url,
      TOSURL: sponsorMeta.TOS_content
    };
  };

  /**
   * @memberof TTB
   * @alias getUserProfile
   * @static
   * @private
   *
   * @description
   * This static method gets the user profile against the given "stk" and "getuser_url".
   *
   * @param {Object} payload - The payload object containing required info
   * @param {String} payload.stk - See more about "stk" from <code>loginRemote()</code>
   * @param {String} payload.getuser_url - See more about "getuser_url" from <code>loginRemote()</code>
   *
   * @param {String} partnerKey - The partner key provided by support team for the consumer site.
   *
   * @example
   *
   * var payload = {
   *   stk: "xxxxxxxxxxxxxxx"
   * };
   *
   * var partnerKey = 'xxxxxxxxxxxxxxxx';
   *
   * TTB.getUserProfile(payload, partnerKey)
   * .done(function(res) {
   *   if (res.response.status === 'OK') {
   *     // your success code here to consume res.response.data
   *     console.log(res.response.data);
   *   } else {
   *     // your failure code here to consume res.response.data
   *     console.log(res.response.data);
   *   }
   * })
   * .fail(function(err) {
   *   // your failure code here
   * })
   * .always(function() {
   *  // your on-complete code here as common for both success and failure
   * });
   *
   * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
   *
   * */
  window.TTB.getUserProfile = function (payload, partnerKey) {

    // get a default instance for internal use
    var ttb = window.TTB._createDefaultInstance(partnerKey);

    var request = {
      method: 'POST',
      data: JSON.stringify(payload),
      xhrFields: {
        withCredentials: false
      }
    };

    return ttb._ajax(request, methodsMapping.VENDOR__GET_PROFILE__USER);
  };

  /**
   * @memberof TTB
   * @alias getVendorProfile
   * @static
   * @private
   *
   * @description
   * This static method gets the vendor profile against the given "partnerKey".
   *
   * @param {String} partnerKey - The partner key provided by support team for the consumer site.
   *
   * @example
   *
   * var partnerKey = 'xxxxxxxxxxxxxxxxx';
   *
   * TTB.getVendorProfile(partnerKey)
   * .done(function(res) {
   *   if (res.response.status === 'OK') {
   *     // your success code here to consume res.response.data
   *     console.log(res.response.data);
   *   } else {
   *     // your failure code here to consume res.response.data
   *     console.log(res.response.data);
   *   }
   * })
   * .fail(function(err) {
   *   // your failure code here
   * })
   * .always(function() {
   *  // your on-complete code here as common for both success and failure
   * });
   *
   * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
   *
   * */
  window.TTB.getVendorProfile = function (partnerKey) {

    // get a default instance for internal use
    var ttb = window.TTB._createDefaultInstance(partnerKey);

    var url = (ttb.baseURL + methodsMapping.VENDOR__GET_PROFILE__VENDOR.endpoint).replace('{{partnerKey}}', partnerKey);

    var request = {
      url: url,
      method: 'GET',
      xhrFields: {
        withCredentials: false
      }
    };

    return ttb._ajax(request, methodsMapping.VENDOR__GET_PROFILE__VENDOR);
  };

  /**
   * @memberof TTB
   * @alias getSponsors
   * @static
   *
   * @description
   * [new widget .connectWidget() is recommended.] This static method provides the list of all available sponsors based on given info.
   *
   * @param {Object} payload - The payload object containing required info against the logged-in user, so that we could suggest the sponsor(s) for it.
   * @param {String} [payload.email] - The email address of the logged-in user, if they have signed-up previously for any sponsor(s), we include them.
   * @param {String} [payload.zipCode] - The Zip Code of the logged-in user, if user is newly signed-up in TTB system, we list the available sponsors in that region.
   *
   * @param {String} partnerKey - The partner key provided by support team for the consumer site.
   *
   * @example
   *
   * var payload = {
   *   email: 'agent47@domain.com',
   *   zipCode: '12345'
   * };
   *
   * TTB.getSponsors(payload)
   * .done(function(res) {
   *   if (res.response.status === 'OK') {
   *     // your success code here to consume res.response.data
   *     console.log(res.response.data);
   *   } else {
   *     // your failure code here to consume res.response.data
   *     console.log(res.response.data);
   *   }
   * })
   * .fail(function(err) {
   *   // your failure code here
   * })
   * .always(function() {
   *  // your on-complete code here as common for both success and failure
   * });
   *
   * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
   *
   * */
  window.TTB.getSponsors = function (payload, partnerKey) {

    // get a default instance for internal use
    var ttb = window.TTB._createDefaultInstance(partnerKey);

    var request = {
      method: 'POST',
      data: JSON.stringify(payload)
    };

    return ttb._ajax(request, methodsMapping.SPONSOR__GET_LIST);
  };

  /**
   * @memberof TTB
   * @alias getSponsorSelection
   * @static
   * @private
   *
   * @description
   * This static method gets the sponsor selection that user with given credentials, had performed previously.
   *
   * @param {String} partnerKey - The partner key provided by support team for the consumer site.
   * @param {Object} payload - The payload object containing user information for recognising.
   * @param {String} [payload.email] - The email address of the logged-in user.
   *
   * @example
   *
   * var partnerKey = 'xxxxxxxxxx';
   *
   * var payload = {
   *   email: 'agent47@domain.com'
   * };
   *
   * TTB.getSponsorSelection(partnerKey, payload)
   * .done(function(res) {
   *   if (res.response.status === 'OK') {
   *     // your success code here to consume res.response.data
   *     console.log(res.response.data);
   *   } else {
   *     // your failure code here to consume res.response.data
   *     console.log(res.response.data);
   *   }
   * })
   * .fail(function(err) {
   *   // your failure code here
   * })
   * .always(function() {
   *  // your on-complete code here as common for both success and failure
   * });
   *
   * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
   *
   * */
  window.TTB.getSponsorSelection = function (partnerKey, payload) {

    // get a default instance for internal use
    var ttb = window.TTB._createDefaultInstance(partnerKey);

    var request = {
      method: 'POST',
      data: JSON.stringify(payload)
    };

    return ttb._ajax(request, methodsMapping.SPONSOR__GET_SELECTION);
  };

  /**
   * @memberof TTB
   * @alias showSelectSponsor
   * @static
   *
   * @description
   * [new widget .connectWidget() is recommended.] This static method provides the list of all available sponsors based on given info.
   *
   * @param {Object} data - Information to be required through the sponsor selection flow.
   * @param {Object} [data.performLogin="true"] - To auto-perform login against the selected sponsor.
   * @param {Object} data.partnerKey - The partner key provided by support team for the consumer site.
   * @param {Object} data.getSponsorsPayload - To be used for <code>getSponsors()</code>. Please see payload information over [TTB.getSponsors()]{@link TTB#.getSponsors}.
   * @param {Object} data.loginRemotePayload - To be used for <code>loginRemote()</code>. Please see payload information over [TTB.loginRemote()]{@link TTB#loginRemote}.
   * @param {Object} [data.selectedSponsor] - if user has any existing sponsor, provide this to show that sponsor as selected, in the list.
   * @param {Object} [data.userProfile] - Alternate way to pass user profile, [Not recommended] (TTB Internal use only).

   * @param {Object} actions - The callbacks options to retrieve success and failure info.
   * @param {Function} [actions.onConnect] - The callback to be invoked with
   * when user is completely connected .ie. done with selecting sponsor *and then accepting their TOS.
   * @param {Function} [actions.onSelect] - The callback to be invoked with <code>selectedSponsor</code> when user selects the sponsor.
   * @param {Function} [actions.onError] - The callback to be invoked with <code>error</code> {String} message, against whatever step it fails.
   *
   * @example
   *
   * var data = {
   *   partnerKey: 'xxxxxxxxxxxxxxx',
   *   getSponsorsPayload: {...}
   *   loginRemotePayload: {...}
   * };
   *
   * actions = {
   *   onConnect: function(selectedSponsor, loginRemotePayload) {
   *    // your success code here to wrap things up considering it as a complete callback.
   *   },
   *   onSelect: function(selectedSponsor, loginRemotePayload) {
   *    // your success code here to consume "selectedSponsor"
   *
   *    // you can instantiate the TTB sdk against the selected sponsor.
   *    // var ttb = new TTB({
   *    //  ...
   *    //  sponsor: selectedSponsor
   *    //  ...
   *    // });
   *
   *    // OR you can update the sponsor of already instantiated TTB sdk
   *    // ttb.setSponsor(selectedSponsor);
   *   },
   *   onError: function(error, $sponsorModal) {
   *    // your failure code here consume error / reason {String}
   *   }
   * };
   *
   * TTB.showSelectSponsor(data, actions);
   *
   * @return {Object} $modal - JQuery reference to the rendered modal DOMNode.
   *
   * */
  window.TTB.showSelectSponsor = function (data, actions) {
    var modalId, $modal, messageTemplate;

    modalId = 'ttb-sdk--select-sponsor';
    messageTemplate = '<h3>{{message}}</h3>';

    // render the sponsors selector content via modal
    $modal = this._modal({
      id: modalId,
      title: 'Please select a Company to Partner with on your Data Integration',
      bodyContent: messageTemplate.replace('{{message}}', 'Retrieving list of all available Companies ...')
    });

    // retrieve the available sponsors
    window.TTB.getSponsors(data.getSponsorsPayload, data.partnerKey)
      //.fail(function (res) {
      .done(function (res) {
        var o, errorMessage;

        o = {
          sponsorsData: undefined,
          bodyMarkup: undefined,

          sponsorMarkup: undefined,
          sponsorsEmailMarkup: undefined,
          sponsorsZipMarkup: undefined,

          sponsorTOSTemplate: undefined,
          sponsorTOSMarkup: undefined,
          $sponsorTOSModal: undefined,

          resultsMessage: undefined,
          tempTargetList: undefined
        };

        if (res.response.status !== 'OK') {

          window.TTB._log(['showSelectSponsor: getSponsors: error in response: ', res.response]);

          errorMessage = messageTemplate.replace('{{message}}', 'Failed in retrieving companies list.');
          $modal.find('.modal-body').html(errorMessage);

          // pass the error response to error callback if provided.
          actions.onError && actions.onError(res.response.data[0], $modal);
          return;
        }

        o.sponsorsData = res.response.data;

        o.bodyMarkup = [];
        o.sponsorsEmailMarkup = [];
        o.sponsorsZipMarkup = [];
        o.sponsorsOtherMarkup = [];

        // iterate over the list and generate the available options
        $.each(o.sponsorsData, function (i, sponsor) {

          // generate the required action button - check if sponsor is already selected
          o.isCurrentSponsor = data.selectedSponsor && (data.selectedSponsor.name === sponsor.vertical_name);

          // if already selected - no info needed to render
          if (o.isCurrentSponsor) {
            o.sponsorActionButton = defaults.sponsorItemSelectedButton;

            // else render the info in button to generate the sponsor info later
          } else {
            o.sponsorActionButton = defaults.sponsorItemSelectButton
              .replace('{{sponsorName}}', sponsor.vertical_name)
              .replace('{{sponsorTitle}}', sponsor.company_info.company_name)
              .replace('{{sponsorSite}}', sponsor.site_url)
              .replace('{{sponsorLogoURL}}', sponsor.company_info.logo_url)
              .replace('{{sponsorTOSURL}}', sponsor.TOS_content);
          }

          // parse site url, to show only the domain name
          o.sponsorSiteName =
            (sponsor.company_info.company_website || '').replace(/http:\/\/www\.|https:\/\/www\./, '');

          // generate sponsor info markup
          o.sponsorMarkup = defaults.sponsorItemTemplate
            //.replace('{{count}}', i + 1)
            .replace('{{logoUrl}}', sponsor.company_info.logo_url)
            .replace('{{name}}', sponsor.company_info.company_name)
            .replace(/(\{\{websiteURL}})/g, sponsor.company_info.company_website || 'javascript:')
            .replace(/(\{\{websiteName}})/g, o.sponsorSiteName)
            .replace('{{sponsorActionButton}}', o.sponsorActionButton);

          // set the target list with respect to match.type
          switch (sponsor.match.type) {

            case 'email':
              o.tempTargetList = o.sponsorsEmailMarkup;
              break;

            case 'zip':
              o.tempTargetList = o.sponsorsZipMarkup;
              break;

            // considering them as Benutech / leads
            case null:
              o.tempTargetList = o.sponsorsOtherMarkup;
              break;

            default:
              window.TTB._log(['showSelectSponsor: unknown sponsor.match.type: ', sponsor.match.type]);
              // skip addition
              return;
          }

          // add the item to the relevant list
          o.sponsorMarkup = o.sponsorMarkup
            .replace('{{count}}', o.tempTargetList.length + 1);

          o.tempTargetList.push(o.sponsorMarkup);
        });

        // add match type "email" results.
        if (o.sponsorsEmailMarkup.length) {

          o.resultsMessage = 'It appears you <strong>currently partner</strong> with the following Companies ...';

          o.bodyMarkup.push(defaults.sponsorListTemplate
            .replace('{{resultsMessage}}', o.resultsMessage)
            .replace('{{sponsorsMarkup}}', o.sponsorsEmailMarkup.join(''))
          );
        }

        // add match type "zip" results.
        if (o.sponsorsZipMarkup.length) {

          // add a separator if match type "email" results were added too.
          //if (o.sponsorsEmailMarkup.length) {
          //  o.bodyMarkup.push('<hr>');
          //}

          o.resultsMessage = 'The following Companies are <strong>available Partners</strong> in the <strong>{{zipCode}}</strong> zip code.'
            .replace('{{zipCode}}', data.getSponsorsPayload.zipCode);

          o.bodyMarkup.push(defaults.sponsorListTemplate
            .replace('{{resultsMessage}}', o.resultsMessage)
            .replace('{{sponsorsMarkup}}', o.sponsorsZipMarkup.join(''))
          );
        }

        // add match type "null" results - when no zip, email results are there.
        if (o.sponsorsOtherMarkup.length && !o.sponsorsZipMarkup.length && !o.sponsorsEmailMarkup.length) {

          // check if there is only one result returned AND that it is the "Benutech"
          if (o.sponsorsData.length === 1 && o.sponsorsData[0].vertical_name === 'leads') {
            o.resultsMessage = [
              'There is currently not a Company as a participating Partner in Zip Code <strong>{{zipCode}}</strong>. ',
              'The Data will be proudly supplied by Benutech Inc.'
            ].join('')
            .replace('{{zipCode}}', data.getSponsorsPayload.zipCode);

          } else {
            o.resultsMessage = 'The following Companies are available Partners.';
          }

          o.bodyMarkup.push(defaults.sponsorListTemplate
            .replace('{{resultsMessage}}', o.resultsMessage)
            .replace('{{sponsorsMarkup}}', o.sponsorsOtherMarkup.join(''))
          );
        }

        // add the final markup to DOM.
        $modal.find('.modal-body').html(o.bodyMarkup.join(''));

        // register the click handler for sponsor selection
        $('#' + modalId + ' tbody').on('click', 'button', function (e) {
          var selectedSponsor;

          // TODO refactor - take data directly from sponsor object
          selectedSponsor = {
            name: $(this).attr('data-sponsor-name'),
            title: $(this).attr('data-sponsor-title'),
            site: $(this).attr('data-sponsor-site'),
            logoURL: $(this).attr('data-sponsor-logo'),
            TOSURL: $(this).attr('data-sponsor-tos')
          };

          // handle value "null" of "site"
          if (selectedSponsor.site === 'null') {
            selectedSponsor.site = null;
          }

          // present TOS modal
          window.TTB.showSponsorTOSModal(selectedSponsor, actions, {
            performLogin: data.performLogin === undefined ? true : data.performLogin,
            userProfile: data.userProfile,
            partnerKey: data.partnerKey,
            loginRemotePayload: data.loginRemotePayload
          });

          // auto close/hide the select-sponsor modal
          $modal.modal('hide');
        });

      })
      .fail(function (err) {
        var errorMessage;

        errorMessage = messageTemplate
          .replace('{{message}}', defaults.errorMessages.GENERAL__CONNECT_FAILED + ' for retrieving companies list.');

        $modal.find('.modal-body').html(errorMessage);

        // pass the error to error callback if provided.
        actions.onError && actions.onError(errorMessage, $modal);
      });

    // triggering .modal() of bootstrap
    return $modal.modal({
      //backdrop: 'static'
    });
  };

  /**
   * @memberof TTB
   * @alias showSponsorTOSModal
   * @static
   *
   * @description
   * [new widget .connectWidget() is recommended.] This static method is used as a helper component inside <code>showSelectSponsor()</code> method.
   * This method shows a "Thank you" modal for handling TOS against the selected sponsor, after user selected it
   * via <code>TTB.showSelectSponsor()</code>.
   *
   * @param {Object} selectedSponsor - The sponsor information retrieved after selecting a sponsor from the list via <code>TTB.showSelectSponsor()</code>.

   * @param {Object} actions - The callbacks options to retrieve success and failure info.
   * @param {Function} [actions.onConnect] - The callback to be invoked with
   * when user is completely connected .ie. done with selecting sponsor (via TTB.showSelectSponsor()) *and then accepting their TOS.
   * @param {Function} [actions.onSelect] - The callback to be invoked with <code>selectedSponsor</code> when user selects the sponsor.
   * @param {Function} [actions.onError] - The callback to be invoked with <code>error</code> {String} message, against whatever step it fails.
   *
   * @param {Object} options - The options to perform additional tasks, e.g. login only for now.
   * @param {Object} [options.performLogin="false"] - To auto-perform login against the selected sponsor.
   * @param {Object} options.partnerKey - The partner key provided by support team for the consumer site.
   * @param {Object} options.loginRemotePayload - "stk" and "getuser_url" information to be used for login. please check .loginRemote() documentation for more.
   * @param {Object} [options.userProfile] - Alternate way to pass user profile, [Not recommended] (TTB Internal use only).

   * @example
   *
   * var selectedSponsor = { ... }; // received from options.onSelect of TTB.showSelectSponsor()
   *
   * var actions = {
   *  onConnect: function(selectedSponsor, loginRemotePayload) {
   *    // your success code here to wrap things up considering it as a complete callback.
   *   },
   *   onSelect: function(selectedSponsor, loginRemotePayload) {
   *    // your success code here to consume "selectedSponsor"
   *
   *    // you can instantiate the TTB sdk against the selected sponsor.
   *    // var ttb = new TTB({
   *    //  ...
   *    //  sponsor: selectedSponsor
   *    //  ...
   *    // });
   *
   *    // OR you can update the sponsor of already instantiated TTB sdk
   *    // ttb.setSponsor(selectedSponsor);
   *   },
   *   onError: function(error, $sponsorModal) {
   *    // your failure code here
   *   }
   * };
   *
   * var options = {
   *  partnerKey: 'xxxxxxxxxxxxxxx',
   *  performLogin: true,
   *  loginRemotePayload: {...}
   * };
   *
   * TTB.showSponsorTOSModal(selectedSponsor, actions, options);
   *
   * @return {Object} $modal - JQuery reference to the rendered modal DOMNode.
   *
   * */
  window.TTB.showSponsorTOSModal = function (selectedSponsor, actions, options) {
    var ttb, modalId, $modal, headingTemplate, headingMarkup, bodyTemplate, bodyMarkup;

    options = options || {};
    modalId = 'ttb-sdk--sponsor-tos-modal';

    // create an instance against the selected sponsor.
    ttb = window.TTB._createDefaultInstance(options.partnerKey, selectedSponsor);

    // define modal component templates.
    headingTemplate = [
      'Thank you for choosing <br>{{sponsorTitle}} <br> as your partner. <br>',
      '<p id="ttb-sdk--sponsor-tos-message">Please read and agree to {{sponsorTitle}} <a href="{{sponsorTOSURL}}" target="_blank">Terms and conditions</a></p>'
    ].join('');

    bodyTemplate = [
      '<div class="form-group form-check" id="ttb-sdk--sponsor-tos-check">',
      ' <input id="ttb-sdk--sponsor-tos-agree" type="checkbox" class="form-check-input">',
      ' <label class="form-check-label" for="ttb-sdk--sponsor-tos-agree">I hereby agree</label>',
      '</div>',
      '<button id="ttb-sdk--sponsor-selection-finish" type="button" class="btn btn-success btn-block" disabled>Finish</button>'
    ].join('');

    headingMarkup = headingTemplate
      .replace(/\{\{sponsorTitle}}/g, selectedSponsor.title)
      .replace('{{sponsorTOSURL}}', selectedSponsor.TOSURL);

    bodyMarkup = bodyTemplate;
    //.replace('{{sponsorTitle}}', selectedSponsor.title);

    // render the sponsors selector content via modal
    $modal = window.TTB._modal({
      id: modalId,
      sizeClass: ' ',
      title: headingMarkup,
      bodyContent: bodyMarkup
    });

    // registers the click handler for accept sponsor TOS
    $('#ttb-sdk--sponsor-tos-agree').on('change', TOSAgreeChange);
    $('#ttb-sdk--sponsor-selection-finish').on('click', saveSponsor);

    // handle login-free flow; redirect user to the vertical site for login and TOS.
    if (!options.performLogin) {

      // hide TOS message, and check.
      $('#ttb-sdk--sponsor-tos-message').hide();
      $('#ttb-sdk--sponsor-tos-check').hide();

      // enable finish button without TOS agree check
      $('#ttb-sdk--sponsor-selection-finish').prop('disabled', false);
    }

    // triggering .modal() of bootstrap
    return $modal.modal({
      //backdrop: 'static'
    });

    function TOSAgreeChange() {
      var isChecked = $(this).prop('checked');
      $('#ttb-sdk--sponsor-selection-finish').prop('disabled', !isChecked);
    }

    function utilUpdateButton(text, disable) {
      $('#ttb-sdk--sponsor-selection-finish')
        .text(text || '')
        .prop('disabled', disable);
    }

    // handles the error by invoking the related action callback.
    function utilHandleError(reason) {
      actions.onError && actions.onError(reason, $modal);
    }

    // saves the sponsor selection over server, and to pass the control to the caller
    function saveSponsor() {
      var payload;

      window.TTB._log(['saveSponsor: called']);

      // disable accept button.
      utilUpdateButton('Saving Selection...', true);

      // handle SAML flow, where we don't have the stk yet.
      payload = !options.userProfile ? options.loginRemotePayload : {
        data: {
          User: options.userProfile
        }
      };

      //ttb.saveSponsorSelection(options.loginRemotePayload, true)
      ttb.saveSponsorSelection(payload, false)
        .then(function (res) {
          res = res.response;

          if (res.status === 'OK') {

            window.TTB._log(['saveSponsor: success', res]);

            utilUpdateButton('Selection Saved!', true);

            // handle SAML flow - fill up the loginRemotePayload, and bypass login, and TOS, to take user to vertical site.
            if (options.userProfile) {

              options.loginRemotePayload.stk = res.data.stk;
              options.loginRemotePayload.getuser_url = res.data.getuser_url;
            }

            // invoke onSelect callback with selectedSponsor and loginRemotePayload info.
            // for SAMLflow - from onSelect callback, user is taken to the vertical site to continue.
            actions.onSelect && actions.onSelect(selectedSponsor, options.loginRemotePayload, $modal);

            // authenticate user before request for TOS.
            options.performLogin && performLogin();

          } else {

            window.TTB._log(['saveSponsor: failed', res]);
            utilHandleError(res.data[0]);
          }

        }, function (reason) {
          window.TTB._log(['saveSponsor: error', reason]);
          utilHandleError(defaults.errorMessages.GENERAL__CONNECT_FAILED + ' for saving partner.');
        });
    }

    // performs a remote login using given stk, so that to forward with accept TOS
    function performLogin() {
      window.TTB._log(['performLogin: called']);

      // show progress on button
      utilUpdateButton('Authenticating...', true);

      //ttb.saveSponsorSelection(options.loginRemotePayload, true)
      ttb.loginRemote(options.loginRemotePayload, false)
        .then(function (res) {
          res = res.response;

          if (res.status === 'OK') {

            window.TTB._log(['performLogin: success', res]);

            // since login is successful, show TOS modal to let user accept.
            TOSAccept();

          } else {

            window.TTB._log(['performLogin: failed', res]);
            utilHandleError(res.data[0]);
          }

        }, function (reason) {
          window.TTB._log(['performLogin: error', reason]);
          utilHandleError(defaults.errorMessages.GENERAL__CONNECT_FAILED + ' for login.');
        });
    }

    // performs an ajax call to accept selected sponsor TOS.
    function TOSAccept() {
      var request;

      window.TTB._log(['TOSAccept: called']);

      // show progress on button
      utilUpdateButton('Accepting Terms...', true);

      request = {
        method: 'GET'
      };

      return ttb._ajax(request, methodsMapping.SPONSOR__ACCEPT_TOS)
        .then(function (res) {
          res = res.response;

          window.TTB._log(['TOSAccept: complete', res]);

          if (res.status === 'OK') {
            window.TTB._log(['TOSAccept: success', res]);

            // invoke connect callback with the selectedSponsor
            actions.onConnect && actions.onConnect(selectedSponsor, options.loginRemotePayload, $modal);

            utilUpdateButton('Connected !', false);
          } else {

            window.TTB._log(['TOSAccept: failed', res]);
            // invoke done callback with selectedSponsor
            utilHandleError(res.data.msg); // not data[0]
          }

        }, function (reason) {
          window.TTB._log(['TOSAccept: error', reason]);
          utilHandleError(defaults.errorMessages.GENERAL__CONNECT_FAILED + ' for accepting Terms.');
        });
    }
  };

  /**
   * @memberof TTB
   * @alias renderLogoWidget
   * @static
   *
   * @description
   * This static method renders a logo link on vendors's sites, clicking which can take user to the landing page for TTB powered widgets.
   * <br>
   * (Check it out in action over https://jsfiddle.net/benutech/w0ya3qr5/)
   *
   * @param {String} elementSelector - DOM element selector where the widget needs to be rendered.
   * <code>#lorem</code> or <code>.ipsum</code> etc.
   *
   * @param {Object} vendorInfo - The information regarding vendor, and it's user session details. for details, Check out utilGenerateLandingPageURL() documentation.

   * @example
   *
   * var elementSelector = '#ttb--render-logo-wrapper';
   *
   * var vendorInfo = {
   *  stk: "xxxxxxxxxxxxxxx",
   *  getuser_url: 'https://www.yoursite.com/webservices/getuser.json',
   *  partnerKey: 'xxxxxxxxxxxxxxxxx'
   * };
   *
   * TTB.renderLogoWidget(elementSelector, vendorInfo);
   *
   * @return {Object} wrapperEL - DOM Node reference to the rendered widget's wrapper.
   *
   * */
  window.TTB.renderLogoWidget = function (elementSelector, vendorInfo) {
    var landingPageUrl, template, markup, wrapperEL;

    landingPageUrl = window.TTB.utilGenerateLandingPageURL(vendorInfo);

    template = [
      '<a class="ttb-sdk--render-logo--link" target="_blank" href="{{landingPageUrl}}" title="Title ToolBox - Full Profile and Net Sheet Report Lookup">',
      ' <img class="ttb-sdk--render-logo--image" src="https://demo.titletoolbox.com/assets/images/logo_in.png" style="background-color: #389ae5;">',
      '</a>'
    ].join('');

    markup = template
      .replace('{{landingPageUrl}}', landingPageUrl);

    // we do not use jquery, to lose our dependency for this widget.
    wrapperEL = document.querySelector(elementSelector);

    // keep existing markup, just extend it.
    wrapperEL.innerHTML += markup;

    // return the reference for any further usage of element.
    return wrapperEL;
  };

  /**
   * @memberof TTB
   * @alias utilGenerateLandingPageURL
   * @static
   *
   * @description
   * This static method generates a link / URL to use on vendors's site, clicking which can take user to the landing page for TTB powered widgets.
   * <br>
   * it is used inside renderLogoWidget(), To learn more about it, check out its documentation.
   *
   * @param {Object} vendorInfo - The information regarding vendor, and it's user.
   * @param {String} vendorInfo.stk - The session token from existing login at 3rd-party app.
   * @param {String} vendorInfo.getuser_url - The URL to hit to get the user information against the given stk.
   * @param {Object} vendorInfo.partnerKey - The partner key provided by support team for the consumer site.

   * @example
   *
   * var vendorInfo = {
   *  stk: "xxxxxxxxxxxxxxx",
   *  getuser_url: 'https://www.yoursite.com/webservices/getuser.json',
   *  partnerKey: 'xxxxxxxxxxxxxxxxx'
   * };
   *
   * var TTBLandingPageUrl = TTB.utilGenerateLandingPageURL(vendorInfo);
   * // you can use this variable as HREF to any anchor (a) tag.
   * console.log(TTBLandingPageUrl);
   *
   * @return {string} TTBLandingPageUrl - A string URL contains provided info in an encoded format, as part of URL.
   *
   * */
  window.TTB.utilGenerateLandingPageURL = function (vendorInfo) {
    var TTBLandingPageUrl;

    // dev vs prod destination.
    TTBLandingPageUrl = window.location.port === defaults.devPortSandbox ?
      ('http://localhost:' + defaults.devPortLanding): 'https://ttb-landing-page.herokuapp.com';

    TTBLandingPageUrl += '/?stk={{stk}}&getuser_url={{getuser_url}}&partnerKey={{partnerKey}}&enabled_features={{enabled_features}}&debug={{debug}}'
        .replace('{{stk}}', vendorInfo.stk)
        .replace('{{getuser_url}}', encodeURIComponent(vendorInfo.getuser_url))
        .replace('{{partnerKey}}', vendorInfo.partnerKey)
        .replace('{{enabled_features}}', defaults.enabledFeatures)
        .replace('{{debug}}', window.TTB.debug);

    return TTBLandingPageUrl;
  };


  /**
   * @memberof TTB
   * @alias _utilAddSessionToken
   * @static
   *
   * @description
   * This static method extends provided object (if any) with the session-token (if any) stored by last login attempt by loginRemote() or login().
   *
   * @param {Object} [info] - any object to extend. E.g. query params converted object by _.ajax()
   *
   * @example
   *
   * var queryParams = { ... }; // your stuff
   * var infoContainsSessionToken = TTB._utilAddSessionToken(queryParams);
   *
   * @return {Object | undefined} info - extended object with session token (if any)
   *
   * */
  window.TTB._utilAddSessionToken = function (info) {

    // attach only when user is logged in.
    var sessionToken = TTB._getLocal(defaults.sessionKeyName);

    if (sessionToken) {

      // define one if no object provided
      info = info || {};

      // extend and return
      info[defaults.sessionKeyName] = sessionToken;
      return info;
    }

    // else - return what provided as it is. object or undefined
    return info;
  };

  /**
   * @memberof TTB
   * @alias utilPromiseReject
   * @static
   *
   * @description
   * This static method returns a promise with rejection, holding the passed reason.
   *
   * @param {Object | String | any} reason - reason of rejection. It can be an object, a string, or anything.
   *
   * @example
   *
   * var rejectedPromise = TTB.utilPromiseReject('Something went wrong');
   *
   * // or
   *
   * var rejectedPromise = TTB.utilPromiseReject({foo: 'Something useful as a detailed reason.'});
   *
   * @return {Promise} promise - promise with rejection state, holding the passed reason.
   *
   * */
  window.TTB.utilPromiseReject = function (reason) {
    var deferred;

    deferred = $.Deferred();
    deferred.reject(reason);

    return deferred;
  };

  /**
   * @memberof TTB
   * @alias utilPromiseResolve
   * @static
   *
   * @description
   * This static method returns a promise with resolution, holding the passed information.
   *
   * @param {Object | String | any} info - info for resolution. It can be an object, a string, or anything.
   *
   * @example
   *
   * var resolvedPromise = TTB.utilPromiseResolve('Successful operation !');
   *
   * // or
   *
   * var resolvedPromise = TTB.utilPromiseResolve({foo: 'Something useful as a detailed info.'});
   *
   * @return {Promise} promise - promise with resolved state, holding the passed info.
   *
   * */
  window.TTB.utilPromiseResolve = function (info) {
    var deferred;

    deferred = $.Deferred();
    deferred.resolve(info);

    return deferred;
  };

  /**
   * @memberof TTB
   * @alias utilCopy
   * @static
   *
   * @description
   * This static method returns a one-level-only deep copy / clone of provided info object.
   *
   * @param {Object} info - object to copy / clone.
   *
   * @example
   *
   * var detail = {foo: 'xoxo'};
   * var cloneOfDetail = TTB.utilCopy(detail);
   *
   * @return {Object | String | any} copy - copy / clone of provided info object.
   *
   * */
  window.TTB.utilCopy = function (info) {
    return $.extend({}, info);
  };

  /** @lends TTB.prototype */
  window.TTB.prototype = {

    /**
     * Logs the arguments based on debug flag.
     * @private
     *
     * @param {Array} args - list of values to be logged.
     * */
    _log: function (args) {
      this.config.debug && console.log.apply(console, [defaults.sdkPrefix + ' :', this.instanceId.toString(), ':'].concat(args));
    },

    /**
     * This method auto fills the form fields having data-ttb-field="", against the given data.
     *@private
     *
     * @param {String} selector - A query selector of context (form/parent element)
     * @param {Object} data - A data object retrieved from the response of certain of API, against which auto-fill needs to be processed.
     * @param {Boolean} [clearExisting="false"] - clear the existing / previously added values to all of the fields that are to be auto-filled.
     * @param {Number} [delay="0"] - A delay in milliseconds, useful when wished to visualize auto filling. (50 is a good value to test)
     *
     * */
    _fillFields: function (selector, data, clearExisting, delay) {
      var _self, $fields, model, modelValue, fillValue, timeout;

      _self = this;
      $fields = $(selector).find('input[' + _self.autoFillAttr + ']');

      // if delay is given, wrap the fillValue within a setTimeout.
      if (delay) {
        timeout = 0;
        fillValue = function($element, modelValue) {

          // how much to delay between each field
          timeout += delay;
          setTimeout(function(){
            $element.val(modelValue);
          }, timeout);
        };
      } else {
        fillValue = function(modelValue) {
          $(this).val(modelValue);
        };
      }

      $fields.each(function () {
        model = $(this).attr(_self.autoFillAttr);

        if (clearExisting) {
          $(this).val(undefined);
        }

        try {
          modelValue = eval('data.' + model);
          modelValue && fillValue($(this), modelValue);
        } catch (e) {
          _self._log(['autoFill : ', model, ': skipping - invalid model']);
        }
      });
    },


    /**
     * This method looks for the input field against the given fieldName as value of its data-ttb-field="" attribute,
     * to auto-fill it with the passed fieldValue.
     *@private
     *
     * @param {String} selector - A query selector of context (form/parent element)
     * @param {String} fieldName - the name specified via data-ttb-field="" attribute of input element.
     * @param {String | Number } fieldValue - the value to be filled with given input
     *
     * */
    _fillField: function (selector, fieldName, fieldValue) {
      var $field;

      $field = $(selector).find('input[' + this.autoFillAttr + '="' + fieldName + '"]');

      if ($field.length) {
        $field.val(fieldValue);
      } else {
        this._log(['autoFill : skipping : field not found - ', fieldName]);
      }
    },


    /**
     * Triggers the request with all required headers, cookies, etc.
     * @param options {Object} - The configuration to pass to $.ajax .
     * @param mapping {Object} - Certain method's mapping info that contains its methodName and the endpoint of the webservice it consumes.
     * @param [queryParams] {Object} - key-value paired info that needs to be passed as query params string.
     * @private
     *
     * */
    _ajax: function (options, mapping, queryParams) {
      var _self, request;

      _self = this;

      // take the full URL or build it up using baseURL and the given endpoint
      options.url = options.url || (this.baseURL + mapping.endpoint);

      // extend given AJAX options with required Headers, and CORS flag
      request = $.extend(options, {

        // TTB Sandbox required headers
        headers: {
          'Partner-Key': this.config.partnerKey,
          'Third-Party': true
        },

        // allow CORS
        xhrFields: options.xhrFields || {
          //withCredentials: true
        }
      });

      // custom data to attach with requests for internal additional logics.
      request.customData = {

        // keep original url for repeating requests (to avoid multiple times attaching query params)
        originalUrl: request.url
      };

      // proceed with the request using configuration
      return _self._ajaxProceed(request, mapping, queryParams);
    },

    /**
     * Proceed the ajax request after configuration has been build from _ajax(), or when retried from _handleSessionExpire()
     * @param request {Object} - The configuration built from _ajax() call.
     * @param mapping {Object} - Check _ajax() for details.
     * @param [queryParams] {Object} - Check _ajax() for details.
     *
     * @private
     *
     * */
    _ajaxProceed: function (request, mapping, queryParams) {
      var _self, o;

      _self = this;
      o = {};

      // check for type of the method. public vs auth-protected methods.
      o.isPublicAPIMethod = defaults.sessionKeySkippedMethods.indexOf(mapping.methodName) >= 0;

      // if its not a public API, send session id (TTBSID query param)
      if (!o.isPublicAPIMethod) {

        // attach only when user is logged in. - most probably user would be logged in this scenario.
        queryParams = TTB._utilAddSessionToken(queryParams);
      }

      // reset url to original Url (which is without query params)
      request.url = request.customData.originalUrl;

      // append query params (if any)
      o.paramsString = queryParams ? $.param(queryParams) : '';
      request.url += o.paramsString ? '?' + o.paramsString : '';

      return $.ajax(request)
        .then(function (res) {

          if (typeof res === 'string' || res instanceof Array || (res.response || res).status === 'OK') {
            _self._log([mapping.methodName + '() [', mapping.endpoint , ']', ': success :', res]);
          } else {
            _self._log([mapping.methodName + '() [', mapping.endpoint , ']', ': error :', res]);
          }

          return res;

        }, function (error) {
          _self._log([mapping.methodName + '() [', mapping.endpoint , ']', ': fail :', error]);

          // exit with error if it is not a session-expire response.
          if (error.status !== 401) {
            return error;
          }

          // handle session expire / no authentication
          return _self._handleSessionExpire(error, request, mapping);
        });

      //.always(function(arg) {
      //  _self._log([mapping.methodName + '() [', mapping.endpoint , ']', ': always :', arg]);
      //  return arg;
      //});
    },

    /**
     * Handles the failed requests due to session expire or not authenticated.
     * @param error {Object} - error object from the failed _ajaxProceed() callback.
     * @param request {Object} - Check _ajax() for details
     * @param mapping {Object} - Check _ajax() for details
     * @private
     *
     * */
    _handleSessionExpire: function (error, request, mapping) {
      var _self, sessionExpireInfo, renewSessionPromise, messages;

      _self = this;

      sessionExpireInfo = {
        requestConfig: request,
        requestError: error,
        methodName: mapping.methodName,
        endpoint: mapping.endpoint,
      };

      // DEPRECATED !
      // case: handle with old onSessionExpire() - when onSessionExpireV2() was not provided
      if (_self.config.onSessionExpire && !_self.config.onSessionExpireV2) {

        _self._log(['_handleSessionExpire:', mapping.methodName + '() [', mapping.endpoint , ']: handling with config.onSessionExpire()']);

        sessionExpireInfo.retry = function () {
          return $.ajax(request);
        };

        _self.config.onSessionExpire(sessionExpireInfo);

        // exist with error
        return error;
      }

      messages = {
        couldNotHandle: '_handleSessionExpire: ERROR - Could not handle.',
        checkDocs: 'Please check documentation for more details.',
      };

      // case: no config.onSessionExpireV2() was provided even.
      if (!_self.config.onSessionExpireV2) {
        _self._log([
          messages.couldNotHandle,
          'Neither config.onSessionExpire() nor config.onSessionExpireV2() was provided.',
          messages.checkDocs
        ]);

        // exist with error
        return error;
      }

      // case: config.onSessionExpireV2() was provided - handle with it.
      _self._log(['_handleSessionExpire:', mapping.methodName + '() [', mapping.endpoint , ']: handling with config.onSessionExpireV2()']);

      // call to let host app return a new/valid STK (e.g. host app prompt user for a login, OR return immediately a new STK)
      renewSessionPromise = _self.config.onSessionExpireV2(sessionExpireInfo);

      // case: no promise returned from the onSessionExpireV2() of the host app
      if (!renewSessionPromise) {

        _self._log([
          messages.couldNotHandle,
          'Expected a promise in return from onSessionExpireV2()',
          messages.checkDocs
        ]);

        // exist with error
        return error;
      }

      return renewSessionPromise
        .then(function(loginRemotePayload) {

          // case: promise resolved with invalid loginRemotePayload info.
          if (!loginRemotePayload || !loginRemotePayload.stk || !loginRemotePayload.getuser_url) {

            _self._log([
              messages.couldNotHandle,
              'onSessionExpireV2(): Returned promise resolved with invalid loginRemotePayload info.',
              messages.checkDocs
            ]);

            // reject and exist with error
            return window.TTB.utilPromiseReject(error);
          }

          // case: promise resolved with valid loginRemotePayload info
          // perform a login
          return _self.loginRemote(loginRemotePayload)
            .then(function (res) {

              _self._log(['_handleSessionExpire: loginRemote: success:']);

              // retry the failed request now
              return _self._ajaxProceed(request, mapping);

            }, function (reason) {

              _self._log([
                messages.couldNotHandle,
                'Could not perform login using provided loginRemotePayload info.',
                messages.checkDocs,
                reason
              ]);

              // exist with error
              return error;
            });

          // case: could not retrieve a valid STK
        }, function (reason) {

          _self._log([
            messages.couldNotHandle,
            'onSessionExpireV2(): returned Promise rejected.',
            messages.checkDocs,
            reason
          ]);

          // exist with error
          return error;
        });
    },


    /**
     * This method is used to switch to a different sponsor (Title Company) and it generates a new <code>baseURL</code>
     * based on passed <code/>sponsor.name</code> with existing <code>baseURLPattern</code>.
     *
     * @param {Object} sponsor - Information to be retrieved via <code>options.onSelect()</code> of <code>TTB.getSponsors()</code>
     * @param {String} sponsor.name - The <code>vertical_name</code> field value of sponsor object retrieved. (to be used in generating baseURL)
     * @param {String} sponsor.title - The <code>company_info.company_name</code> field value of sponsor object retrieved.
     * @param {String} sponsor.site - The <code>site_url</code> field value of sponsor object retrieved.
     * @param {String} sponsor.logoURL - The <code>company_info.logo_url</code> field value of sponsor object retrieved.
     * @param {String} sponsor.TOSURL - The <code>TOS_content</code> field value of sponsor object retrieved.
     *
     * @return {String} baseURL - The newly generated <code>baseURL</code>.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.setSponsor({
     *  name: 'direct',
     *  title: 'Benutech',
     *  site: 'http://direct.titletoolbox.com',
     *  logoURL: 'https://s3-us-west-1.amazonaws.com/titletoolbox/company+logos/Benutech/Benute+Logo.png',
     *  TOSURL: 'https://direct.api.titletoolbox.com/pages/tos/direct_tos'
     * });
     *
     * */
    setSponsor: function (sponsor) {
      this._log(['setSponsor: existing:', this.sponsor && this.sponsor.name, '| new:', sponsor.name]);

      // store in local storage for later use.
      window.TTB._setLocal(defaults.localStorageNames.connect__selectedSponsor, sponsor);

      // update sponsor in instance object
      this.sponsor = sponsor;

      // generate baseURL based of newly selected sponsor.
      return this.baseURL = this.baseURLPattern.replace('{{sponsorName}}', sponsor.name);
    },

    /**
     * This method is used to open up a TOS (Terms of Service) Modal. which lists TOS info of the selected sponsor.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.showTOS();
     *
     * @return {Object} $modal - JQuery reference to the rendered modal DOMNode.
     *
     * */
    showTOS: function () {
      var modalId, $modal, modalTemplate;

      modalId = 'ttb-sdk--sponsor-tos';

      modalTemplate = [
        '<iframe src="{{src}}" width="100%" height="600px"></iframe>',
        //'<div class="row">',
        //' <div class="col-xs-12">',
        //' <button class="btn btn-success ttb-sdk--tos-accept pull-right">Accept</button>',
        //' </div>',
        '</div>'
      ]
        .join('')
        .replace('{{src}}', this.sponsor.TOSURL);

      // render the sponsors TOS content via modal
      $modal = window.TTB._modal({
        id: modalId,
        title: 'Terms of Service',
        bodyContent: modalTemplate
      });

      // triggering .modal() of bootstrap
      return $modal.modal({
        //backdrop: 'static'
      });
    },

    /**
     * This method is used after selecting a sponsor via the static function <code>TTB.showSelectSponsor(...)</code> to open up a Thank you modal,
     * via which user can agree to TOS (Terms of Service) of the selected sponsor.
     *
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.handleSponsorTOS(selectedSponsor);
     *
     * @return {Object} $modal - JQuery reference to the rendered modal DOMNode.
     *
     * */
    handleSponsorTOS: function (selectedSponsor) {
      var modalId, $modal, modalTemplate;

      modalId = 'ttb-sdk--handle-sponsor-tos';

      // update the instance sponsor
      this.setSponsor(selectedSponsor);

      modalTemplate = [
        '<iframe src="{{src}}" width="100%" height="600px"></iframe>',
        //'<div class="row">',
        //' <div class="col-xs-12">',
        //' <button class="btn btn-success ttb-sdk--tos-accept pull-right">Accept</button>',
        //' </div>',
        '</div>'
      ]
        .join('')
        .replace('{{src}}', this.sponsor.TOSURL);

      // render the sponsors TOS content via modal
      $modal = window.TTB._modal({
        id: modalId,
        title: 'Terms of Service',
        bodyContent: modalTemplate
      });

      // triggering .modal() of bootstrap
      return $modal.modal({
        //backdrop: 'static'
      });
    },


    /**
     * This method is used to log the user in from 3rd-party site, and maintain a session for the user throughout the App.
     *
     * @param {Object} payload - The payload object containing required info
     * @param {String} payload.stk - The session token from existing login at 3rd-party app.
     * @param {String} payload.getuser_url - The URL to hit to get the user information against the given stk.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   stk: "xxxxxxxxxxxxxxx"
     * };
     *
     * ttb.loginRemote(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // user is successfully logged-in !!
     *     // your success code here to consume res.response.data for logged-in user info
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data for validation errors info
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    loginRemote: function (payload) {
      var _self;

      _self = this;
      payload.sso = false;

      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, methodsMapping.AUTH__LOGIN_REMOTE)
        .then(function (res) {
          var sessionToken;

          // if user is successfully logged-in !!
          if (res.response.status === 'OK') {
            // store sessionToken (vertical-stk)  in local-storage for later usage against each API key
            sessionToken = res.response.data[defaults.sessionKeyName];
            TTB._setLocal(defaults.sessionKeyName, sessionToken);

            _self._log(['loginRemote:', defaults.sessionKeyName, 'updated in localStorage.', TTB._getLocal(defaults.sessionKeyName)]);
          }

          return res;
        });
    },


    /**
     * This method is used to log the user in and maintain a session for the user throughout the App.
     *
     * @param {Object} payload - The payload object containing required info
     * @param {String} payload.username - the email/username used while signing up
     * @param {String} payload.password - the secret password of the account
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   TbUser: {
     *     username: "awesomeuser99@domain.com",
     *     password: "secret_Password0"
     *   }
     * };
     *
     * ttb.login(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // user is successfully logged-in !!
     *     // your success code here to consume res.response.data for logged-in user info
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data for validation errors info
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    login: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, methodsMapping.AUTH__LOGIN)
        .then(function (res) {
          var sessionToken;

          // if user is successfully logged-in !!
          if (res.response.status === 'OK') {
            // store sessionToken in local-storage for later usage against each API key
            sessionToken = res.response.data[defaults.sessionKeyName];
            TTB._setLocal(defaults.sessionKeyName, sessionToken);
          }

          return res;
        });
    },


    /**
     * Logs out from the TTB webservices server
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.logout()
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *    // user is successfully logged-out!!
     *    // your success code here to clear any cached info etc from the web page
     *    console.log(res.response.data);
     *
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    logout: function () {
      var request = {
        method: 'GET'
      };

      return this._ajax(request, methodsMapping.AUTH__LOGOUT);
    },


    /**
     * Search a property by APN.
     *
     * @param {Object} payload - The payload object containing required info
     * @param {String} payload.parcel_number - The Parcel Number against the property
     * @param {String} payload.state_county_fips - The State County FIPS against the property
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   parcel_number: "46327216",
     *   state_county_fips: "06059"
     * };
     *
     * ttb.searchByParcelNumber(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    searchByParcelNumber: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, methodsMapping.SEARCH_PROPERTY__PARCEL);
    },


    /**
     * Search a property by site address.
     *
     * @param {Object} payload - The payload object containing required info - (At least any of the following is required)
     * @param {string} [payload.site_address] - Property House# or Street# with the route e.g. "317 2nd St".
     * @param {string} [payload.site_unit] - Unit# of the property (If has any).
     * @param {string} [payload.site_city] - Property City e.g. "Huntington Beach"
     * @param {string} [payload.site_state] - Property State e.g. "CA"
     * @param {string} [payload.site_street_number] - Property Street# e.g. "317"
     * @param {string} [payload.site_route] - Property Route - "2nd St".
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   site_address: "317 2nd St",
     *   site_unit: "",
     *   site_city: "Huntington Beach",
     *   site_state: "CA",
     *   site_zip: "92648",
     *   site_street_number: "317",
     *   site_route: "2nd St"
     * };
     *
     * ttb.searchBySiteAddress(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    searchBySiteAddress: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, methodsMapping.SEARCH_PROPERTY__ADDRESS);
    },


    /**
     * Search a property by owners name.
     *
     * @param {Object} payload - The payload object containing required info - (At least any of the following is required)
     * @param {String} [payload.first_name] - Owner's First Name
     * @param {String} [payload.last_name] - Owner's Last Name
     * @param {String} [payload.state_county_fips] - State County FIPS of the property
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   first_name: "Fariba",
     *   last_name: "Siddiqi",
     *   state_county_fips: "06059"
     * };
     *
     * ttb.searchByOwnerName(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    searchByOwnerName: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, methodsMapping.SEARCH_PROPERTY__OWNER);
    },


    /**
     * This will allow you to order a report from the service. The available reports will depend on your account set up.
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {String} payload.sa_property_id - Unique ID of the property
     * @param {String} payload.state_county_fips - State FIPS of the property
     * @param {String} [payload.output="link"] - Format of output, supported types are "link", and "html".
     * @param {String} [payload.report_type="property_profile"] - The report type, supported types are "single_page_profile", "avm"(*), "prep"(*), "tax_bill" and "property_profile".
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   sa_property_id: "0039025849",
     *   state_county_fips: "06059",
     *   report_type: "property_profile",
     *   output: "link",
     * };
     *
     * ttb.orderReport(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    orderReport: function (payload) {

      // setup the defaults
      payload.output = payload.output || 'link';
      payload.report_type = payload.report_type || 'property_profile';

      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, methodsMapping.REPORT__ORDER);
    },


    /**
     * This method is used to return a list of sales around a subject property PLUS offer a series of statistics based on the response results.
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {String} payload.sa_property_id - Unique ID of the property
     * @param {String} payload.mm_fips_state_code - State FIPS of the property
     * @param {Number} [payload.date_transfer(+/-)] - Sold
     * @param {Number} [payload.distance_in_km] - Distance (in kilometers)
     * @param {Number} [payload.nbr_bath(+/-)] - Baths
     * @param {Number} [payload.nbr_bedrms(+/-)] - Beds
     * @param {Number} [payload.sqft(+/-)] - SQFT
     * @param {Number} [payload.yr_blt(+/-)] - Year built
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   "sa_property_id": "0039025849",
     *   "mm_fips_state_code": "06",
     *   "date_transfer(+/-)": 12,
     *   "distance_in_km": 1.6,
     *   "nbr_bath(+/-)": 1,
     *   "nbr_bedrms(+/-)": 1,
     *   "sqft(+/-)": 0.2,
     *   "yr_blt(+/-)": 20
     * };
     *
     * ttb.propertyComps(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    propertyComps: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, methodsMapping.PROPERTY__COMPS);
    },


    /**
     * This method is used to pull details of a property specified by property_id
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {Number} payload.property_id - Unique ID of the property
     * @param {Number} payload.state_fips - State FIPS of the property
     *
     * @param {Object} [options] - The options object
     * @param {String} [options.autoFillContext] - A query selector of an element(s) inside which to look for inputs elements
     * having <code>data-ttb-field</code>attribute.
     * @param {Boolean} [options.autoFillClearExisting="false"] - Clear the existing / previously added values to all of the fields that are to be auto-filled.
     * @param {Number} [options.autoFillDelay="0"] - A delay in milliseconds, useful when wished to visualize auto filling. (50 is a good value to test)
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   property_id: 0091683346
     *   state_fips: 25,
     * };
     *
     * var options = {
     *   autoFillContext: '#propertyDetails__form'
     * };
     *
     * ttb.propertyDetails(payload, options)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data for any extra effort other than the auto-fill
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    propertyDetails: function (payload, options) {
      var _self;

      _self = this;
      options = options || {autoFillContext: null};

      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, methodsMapping.PROPERTY__DETAILS)
        .then(function (res) {
          options.autoFillContext && _self._fillFields(options.autoFillContext, res.response.data, options.autoFillClearExisting, options.autoFillDelay);
          return res;
        });
    },

    /**
     * This method is used to check for the status on phone and/or email fields order for the properties of the given farm.
     * on successful call, check for <code>data.phone_status</code> and <code>data.email_status</code> flags.
     * value "completed" means that the requested contact field is ready, and so .getFarm() should be called again to fetch the farm.
     * "ordered" means the order is made, but it is in progress on the backend. orders usually takes up to ~2 minutes.
     * <br><br>
     * Note: The farm is supposed to be ordered/made via .globalSearch() method.
     *
     * @param {String} farmId - The <code>farm_id</code> of the target farm to be checked.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var farmId = 123;
     *
     * ttb.checkPEFarmStatus(farmId)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    checkPEFarmStatus: function (farmId) {
      var url = (this.baseURL + methodsMapping.FARM__PE__CHECK_STATUS.endpoint).replace('{{farmId}}', farmId);

      var request = {
        method: 'GET',
        url: url
      };

      return this._ajax(request, methodsMapping.FARM__PE__CHECK_STATUS);
    },

    /**
     * This method is used to fetch the given farm. i.e. to fetch all the properties/records​ of the given farm.
     * <br><br>
     * Note: The farm is supposed to be ordered/made via .globalSearch() method.
     *
     * @param {String} farmId - The <code>farm_id</code> of the target farm to be fetched.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var farmId = 123;
     *
     * ttb.getFarmProperties(farmId)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    getFarmProperties: function (farmId) {
      var url = (this.baseURL + methodsMapping.FARM__GET_DETAILS.endpoint).replace('{{farmId}}', farmId);

      var request = {
        method: 'GET',
        url: url
      };

      return this._ajax(request, methodsMapping.FARM__GET_DETAILS);
    },

    /**
     * This method is used to fetch the list of all the farms that were bought by the user.
     * <br><br>
     * Note: The farm is supposed to be ordered/made via .globalSearch() method.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.getFarmsList()
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    getFarmsList: function () {
      var request = {
        method: 'GET'
      };

      return this._ajax(request, methodsMapping.FARM__GET_LIST);
    },

    /**
     * This method is used to search all properties matching a set of criteria.<br>
     * There is a vast number of criteria available, see the Available Search Fields and Search Criteria section.
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {String} payload.mm_fips_state_code - State FIPS of the property
     * @param {Object | String} [payload.FIELD_NAME] - Other search fields to be sent.

     * @param {Object} [payload.customFilters] - Filters fields are to be sent via this wrapper - See the available search fields for more.
     * @param {Object} [payload.customFilters.is_site_number_even_search] - A custom filter
     * @param {Object} [payload.customFilters.FIELD_NAME] - Other filter type search fields to be sent.

     * @param {Object} [payload.searchOptions] - Additional options to take control on records.
     * @param {String} [payload.searchOptions.max_limit] - Limit the matched records.
     * @param {String} [payload.searchOptions.omit_saved_records=false] - Suppress/Omit records already saved.
     *
     * @param {Object} [queryParams] - The query string params limit and page on URL are used to control pagination of the result.
     * @param {String} [queryParams.limit] - Determines how many recs to include in one page.
     * @param {String} [queryParams.page] - Specifies the page number in the full result set.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var queryParams = { limit: 1000, page: 2 };
     * var payload = {
     *  "mm_fips_state_code": "06", // State FIPS
     *  "mm_fips_muni_code": "059", // County FIPS
     *  "sa_site_city": [ // Cities
     *    "ANAHEIM"
     *  ],
     *  "sa_site_zip": [ // Zip Codes
     *    "92801",
     *    "92805"
     *  ],
     *  "sa_site_mail_same": "Y",
     *  "sa_owner_1_type": "0",
     *  "sa_nbr_bedrms": { // Beds
     *    "match": "<=",
     *    "value": 3
     *  },
     *  "sa_nbr_bath": { // Baths
     *    "match": "<=",
     *    "value": 2
     * },
     *  "use_code_std": [
     *    "RSFR",
     *    "RCON"
     * ],
     *  "sa_yr_blt": { // Year built
     *    "match": "From-To",
     *    "value": {
     *      "from": 1950,
     *      "to": 2002
     *    }
     * },
     *  "sa_assr_year": {
     *    "match": ">",
     *    "value": 2000
     * },
     *  "searchOptions": { // Additional Search Options
     *    "omit_saved_records": false
     * },
     *  "customFilters": { // Filters
     *    "is_site_number_even_search": "Y"
     *  }
     * };
     *
     * ttb.globalSearch(payload, queryParams)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    globalSearch: function (payload, queryParams) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, methodsMapping.GLOBAL_SEARCH__PROPERTIES, queryParams);
    },


    /**
     * This method is to only get the count (as opposed to full set of records) against a certain set of search criteria.<br>
     * Note - It accepts the same search criteria input as for [global_search]{@link TTB#globalSearch} API.
     *
     * @param {Object} payload - The payload object containing required info.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *  "mm_fips_state_code": "06", // State FIPS
     *  "mm_fips_muni_code": "059", // County FIPS
     *  "sa_site_city": [ // Cities
     *    "ANAHEIM"
     *  ],
     *  "sa_site_zip": [ // Zip Codes
     *    "92801",
     *    "92805"
     *  ],
     *  "sa_nbr_bedrms": { // Beds
     *    "match": "<=",
     *    "value": 3
     *  },
     *  "searchOptions": { // Additional Search Options
     *    "omit_saved_records": false
     * },
     *  "customFilters": { // Filters
     *    "is_site_number_even_search": "Y"
     *  }
     * };
     *
     * ttb.globalSearchCount(payload, params)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     *
     * */
    globalSearchCount: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, methodsMapping.GLOBAL_SEARCH__COUNT);
    },


    /**
     * This method is to get all the properties nearby the given geolocation against the given radius.<br>
     * Note - for payloadExtension, It accepts the same search criteria format input as for [global_search]{@link TTB#globalSearch} API.
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {Object} [payloadExtension] - An optional payload to be merge into the auto-generated one. It can be utilized to
     * add custom filters like "Empty Nester" and/or other useful fields.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *  mm_fips_state_code: "06",  // State FIPS
     *  center_lat: "33.97652", // sa_y_coord // to be used in a geometry of type "circle" for radius.
     *  center_lng: "-117.726299", // sa_x_coord // required for same above reason.
     *  radius: "1", // required for same above reason.
     *  limit: "20" // Optional.
     * };
     *
     * ttb.nearbySearch(payload, params)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     *
     * */
    nearbySearch: function (payload, payloadExtension) {

      var queryParams = {limit: payload.limit || 1000, page: 1};
      var finalPayload = {
        "mm_fips_state_code": payload.mm_fips_state_code, // State FIPS

        // default - with type Single Family Residence, and Condonium
        "use_code_std": ["RSFR", "RCON"],

        // default - no filters
        customFilters: {},

        // default - no searchOptions
        searchOptions: {
          "max_limit": payload.limit || undefined
        },

        // nearby search is processed by using radius geometry with the main globalSearchMethod
        "geometry": {
          "match": "circle",
          "value": {
            "center_lat": payload.center_lat, // sa_y_coord
            "center_lng": payload.center_lng, // sa_x_coord
            "radius": payload.radius
          }
        }
      };

      // Include any other extension to payload if provided. e.g. customFilters or other fields criteria.
      finalPayload = $.extend(finalPayload, payloadExtension);

      var request = {
        method: 'POST',
        data: JSON.stringify(finalPayload)
      };

      return this._ajax(request, methodsMapping.GLOBAL_SEARCH__PROPERTIES, queryParams);
    },


    /**
     * This method will allow you to verify what reports are available to your user profile.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.getTypesReport()
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     *
     * */
    getTypesReport: function () {
      var request = {
        method: 'GET'
      };

      return this._ajax(request, methodsMapping.REPORT__GET_TYPES);
    },


    /**
     * This method provides the complete list of all fields that can be used to construct search terms for
     * [global_search]{@link TTB#globalSearch} and [global_search_count]{@link TTB#globalSearchCount} APIs. <br><br>
     *
     * To view the complete list of all available search fields and their possible values. <br>
     * Please follow this [JSON presentation]{@link http://jsoneditoronline.org/?id=ba6b41ee73822c653dae0e2cc8cf6351} -
     * The key info you should look for is the <code>field_name</code>, <code>search_type</code> and <code>choices</code>.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.getSearchFields()
     * .done(function(res) {
     *   if (res instanceof Array) {
     *     // your success code here to consume res as fields list. see example [< JSON here >]{@link http://jsoneditoronline.org/?id=ba6b41ee73822c653dae0e2cc8cf6351}
     *     console.log(res);
     *   } else {
     *     // your failure code here to consume res
     *     console.log(res);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     *
     * */
    getSearchFields: function () {
      var request = {
        method: 'GET'
      };

      return this._ajax(request, methodsMapping.GLOBAL_SEARCH__FIELDS);
    },


    /**
     * @description
     * This method saves the sponsor selection performed by the user with given credentials.
     * Performs an optional login identical to existing method loginRemote()
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {String} payload.stk - pls check loginRemote() for more.
     * @param {String} [payload.getuser_url] - pls check loginRemote() for more.
     *
     * @param {Boolean} [performLogin=false] - To perform a login - identical to loginRemote(),
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   stk: "xxxxxxxxxxxxxxx",
     *   getuser_url: 'https://www.yoursite.com/webservices/getuser.json' // absolute URL to the API
     * };
     *
     * var performLogin = true;
     *
     * ttb.saveSponsorSelection(payload, performLogin)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     *
     * */
    saveSponsorSelection: function (payload, performLogin) {

      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      var queryParams = {
        save_and_login: !!performLogin
      };

      return this._ajax(request, methodsMapping.SPONSOR__SAVE_SELECTION, queryParams);
    },

    /**
     * @description
     * This method deactivate the sponsor selection previously performed by the user with given credentials.
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {String} payload.email - The email address of the user.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   email: "awesomeuser99@domain.com"
     * };
     *
     * ttb.clearSponsorSelection(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     *
     * */
    clearSponsorSelection: function (payload) {

      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      //var queryParams = {
      //  perform_logout: !!performLogout
      //};

      return this._ajax(request, methodsMapping.SPONSOR__CLEAR_SELECTION);
    },


    /**
     * This method builds the address payload using the google  <code>autocomplete</code> instance once it's
     * <code>"place_changed"</code> event fires.
     * The returned payload can be utilized to consume <code>searchBySiteAddress()</code> API or you can fill form fields using SDK's autoFill API.
     *
     * @param {object} autocomplete - The google autocomplete instance used on your site, consuming it's <code>"place_changed"</code> event.
     *
     * @param {Object} [options]- The options object
     * @param {String} [options.autoFillContext] - A query selector of an element(s) inside which to look for inputs elements
     * having <code>data-ttb-field</code> attribute.
     * - For example: &lt;input type="text" <code>data-ttb-field="site_address"</code> />
     * @param {Boolean} [options.autoFillClearExisting="false"] - Clear the existing / previously added values to all of the fields that are to be auto-filled.
     * @param {Number} [options.autoFillDelay="0"] - A delay in milliseconds, useful when wished to visualize auto filling. (50 is a good value to test)
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * // render your autocomplete component instance on your desired location
     * var autocompleteElement = document.getElementById('googleBuildAddress__autocomplete');
     * var autocomplete = new google.maps.places.Autocomplete(autocompleteElement, {types: ['geocode']});
     *
     * // when the user selects an address from the drop-down, populate the address fields in the form.
     * autocomplete.addListener('place_changed', function () {
     *
     *   // approach # 01 - auto-fill only - build up the address by auto-filling the form fields and leaves the submission logic.
     *   // <i>(Note: before submission, make sure you build <code>site_address</code> using <code>site_street_number</code> + ' ' + <code>site_route</code>)</> </i>
     *
     *   var options = {
     *     autoFillContext: '#searchBySiteAddress__form'
     *   };
     *   ttb.googleBuildAddress(autocomplete, options);
     *
     *   //--- approach # 01 - auto-fill only - ends ---
     *
     *   // -- OR --
     *
     *   // approach # 02 - direct submission - build up the address by getting the payload and proceed with <code>searchBySiteAddress()</code> to retrieve the result.
     *   var payload = ttb.googleBuildAddress(autocomplete);
     *   ttb.searchBySiteAddress(payload)
     *   .done(function(res) {
     *     if (res.response.status === 'OK') {
     *       // your success code here to consume res.response.data for any extra effort other than the auto-fill
     *       console.log(res.response.data);
     *     } else {
     *       // your failure code here to consume res.response.data
     *       console.log(res.response.data);
     *     }
     *   })
     *   .fail(function(err) {
     *     // your failure code here
     *   })
     *   .always(function() {
     *    // your on-complete code here as common for both success and failure
     *   });
     *   // --- approach # 02 - direct submission - ends ---
     *
     * });
     *
     *
     * @return {Object} address   built address payload object using google place components, having following fields against mentioned mapping.
     *
     * @return {Object} address.site_street_number Component Type: <code>"street_number"</code> | Name Type: <code>"short_name"</code>.
     * @return {Object} address.site_route         Component Type: <code>"route"</code> | Name Type: <code>"short_name"</code>.
     * @return {Object} address.site_address       *Built using <code>site_street_number</code> + ' ' + <code>site_route</code>.
     * @return {Object} address.site_city          Component Type: <code>"locality"</code> | Name Type: <code>"long_name"</code>.
     * @return {Object} address.site_neighborhood  Component Type: <code>"neighborhood"</code> | Name Type: <code>"long_name"</code>.
     * @return {Object} address.site_state         Component Type: <code>"administrative_area_level_1"</code> | Name Type: <code>"short_name"</code>.
     * @return {Object} address.site_zip           Component Type: <code>"postal_code"</code> | Name Type: <code>"short_name"</code>.
     * @return {Object} address.county             Component Type: <code>"administrative_area_level_2"</code> | Name Type: <code>"short_name"</code>.
     * @return {Object} address.country            Component Type: <code>"country"</code> | Name Type: <code>"long_name"</code>.
     *
     * */
    googleBuildAddress: function (autocomplete, options) {
      var place, addressInfo, addressComp, addressType, addressValue, componentForm;

      // our details object can be used for payload
      addressInfo = {};

      // place-components vs form-fields mapping
      componentForm = {
        street_number: {field_name: 'site_street_number', name_type: 'short_name'},
        route: {field_name: 'site_route', name_type: 'short_name'},
        locality: {field_name: 'site_city', name_type: 'long_name'},
        neighborhood: {field_name: 'site_neighborhood', name_type: 'long_name'},
        administrative_area_level_1: {field_name: 'site_state', name_type: 'short_name'},
        administrative_area_level_2: {field_name: 'site_county', name_type: 'short_name'},
        postal_code: {field_name: 'site_zip', name_type: 'short_name'}
        //country: {field_name: 'country', name_type: 'long_name'}
      };

      // get the current place info from google autocomplete instance
      place = autocomplete.getPlace();

      // iterate over each component available in selected place
      for (var i = 0, len = place.address_components.length; i < len; i++) {
        addressComp = place.address_components[i];
        addressType = addressComp.types[0];

        // check if the component is of our use e.g. "administrative_area_level_1"
        if (componentForm[addressType]) {
          addressValue = addressComp[componentForm[addressType].name_type];

          // fill the address info object
          addressInfo[componentForm[addressType].field_name] = addressValue;

          // check to auto-fill field if auto-fill-context option was provided.
          options && options.autoFillContext && this._fillField(options.autoFillContext, componentForm[addressType].field_name, addressValue);
        }
      }

      // Special field handling for "site_address"
      // add field only if at least one of the field is given.
      if (addressInfo.site_street_number || addressInfo.site_route) {
        addressInfo.site_address = (addressInfo.site_street_number || '') +
          (addressInfo.site_street_number && addressInfo.site_route ? ' ' : '') +
          (addressInfo.site_route || '');
      }

      // replace "County" suffix by google for county for some addresses.
      // Handle missing county field for some addresses
      addressInfo.site_county = addressInfo.site_county ? addressInfo.site_county.replace(' County', '') : undefined;
        
      //addressInfo.site_address = addressInfo.site_street_number + ' ' + addressInfo.site_route;
      //addressInfo.custom_google_formatted_address = place.formatted_address;

      // return the built address info, in order to let consumer use the info the way they want.
      return addressInfo;
    },

    /**
     * This method renders a widget includes google autocomplete and supported actions drop-down. <br>
     * Make sure <strong>Google Maps script</strong> file is injected and <code>ttb.instantLookupWidget()</code> should be called inside global <code>googleInit()</code> function. <br>
     * And also <strong>ttbSdk.min.css</strong> file is injected for proper style and look for the widgets.
     *
     * @param {String} elementSelector - DOM element selector where the widget needs to be rendered.
     * <code>#lorem</code> or <code>.ipsum</code> etc.
     *
     * @param {Object} [actions] - The actions object contains mapping callbacks to be consumed when any action is clicked.
     * (only one action available currently.)
     * @param {Function} [actions.fullProfileReport] - To be invoked with an info object (info.success, info.data) as argument, when user selects an address
     * from the autocomplete and then clicks the action "Full Profile Report". This info can be used for handling success and failure.
     *
     * @example
     *
     * // with basic and minimum requirement.
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * // define googleInit() if it is not already created.
     * window.googleInit = function () {
     *
     *  var elementSelector = '#ttb-instant-lookup-wrapper';
     *  var $instantLookup = ttb.instantLookupWidget(elementSelector);
     * };
     *
     * @example
     *
     * // with advanced configuration for handling success, and failure of the actions results.
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * // define googleInit() if it is not already created.
     * window.googleInit = function () {
     *
     *  var actions = {
     *   fullProfileReport: function(info) {
     *     if (info.success === 'OK') {
     *       // your success code here to consume info.data
     *       console.log(info.data);
     *     } else {
     *       // your failure code here to consume info.data
     *       console.log(info.data);
     *     }
     *    }
     *  };
     *
     *  var elementSelector = '#ttb-instant-lookup-wrapper';
     *  var $instantLookup = ttb.instantLookupWidget(elementSelector, actions);
     * };
     *
     * @return {Object} $element - JQuery reference to the rendered widget container element.
     *
     * */
    instantLookupWidget: function (elementSelector, actions) {
      var o, autoComplete, _self, refs;

      _self = this;
      actions = actions || {};

      refs = {};
      o = {};
      o.tableOptions = {
        containerSelector: '.ttb-sdk--instant-lookup--list',
        onInit: undefined, // handled bellow passing required references.
        onSelect: undefined, // handled bellow passing required references.
        columns: [
          {
            label: 'Address',
            fieldName: 'customAddress'
          }, {
            label: 'Unit',
            fieldName: 'v_unit'
          }, {
            label: 'Apn',
            fieldName: 'sa_parcel_nbr_primary'
          }, {
            label: 'City',
            fieldName: 'customCity'
          }, {
            label: 'Zip',
            fieldName: 'sa_site_zip'
          }, {
            label: 'Mail State',
            fieldName: 'sa_mail_state'
          }, {
            label: 'Owner name',
            fieldName: 'formatted_sa_owner_1'
          }
        ]
      };
      o.selectedAction = window.TTB._getLocal('selectedAction', o.selectedAction) || {
          name: 'fullProfileReport',
          label: 'Full Profile Report'
        };

      o.widgetClass = 'ttb-sdk--instant-lookup--container';
      o.widgetTemplate = [
        '<!-- the wait spinner box -->',
        '<div class="col-xs-12">',
        ' <i class="ttb-sdk--spinner"></i>',
        '</div>',

        '<!-- the google autocomplete address lookup -->',
        '<div id="ttb-sdk--instant-lookup--address" class="col-xs-12 col-md-7">',
        ' <div class="">1 - Type in and select the property address below</div>',
        ' <div class="ttb-sdk--instant-lookup--auto-complete-wrapper">',
        '  <input type="text" class="form-control" id="ttb-sdk--instant-lookup--auto-complete" name="ttb-sdk--instant-lookup--auto-complete" placeholder="Search for an address...">',
        ' </div>',
        ' <i class="ttb-sdk--icon--right-arrow"></i>',
        ' <div class="ttb-sdk--instant-lookup--footer">',
        ' (If this is a Condo, APT, or other Multi Unit, please do not enter the unit #. It will ask you for it after you enter the address.)</div>',
        ' </div>',
        '</div>',

        '<!-- actions menu -->',
        '<div id="ttb-sdk--instant-lookup--actions" class="col-xs-12 col-md-5">',
        ' <div class="">2 - Select the type of report you want below</div>',

        ' <!-- split button -->',
        ' <div class="btn-group col-xs-12">',
        '  <ul>',
        '  <li><a data-action-name="netSheet" href="javascript:">NetSheet</a></li>',
        //'  <li><a data-action-name="generateReport" href="javascript:">Generate Report</a></li>',
        //'  <li role="separator" class="divider"></li>',
        '  <li><a data-action-name="fullProfileReport" href="javascript:">Full Profile Report</a></li>',
        '  </ul>',
        ' </div>',
        '</div>',

        '<!-- help tip ! -->',
        '<div id="ttb-sdk--instant-lookup--alert" class="col-xs-12 text-center">',
        ' <div class="alert alert-warning" style="border: 1px solid;">',
        ' Looks like you have not allowed popups for our site, yet. You can click <a href="javascript:" target="_blank">here</a> to get your report.',
        ' </div>',
        '</div>',

        '<!-- multiple matched properties list - [conditional] ! -->',
        '<div class="col-xs-12 ttb-sdk--instant-lookup--list">',
        '</div>',

        '<!-- widget footer ! -->',
        '<div class="col-xs-12 ttb-sdk--instant-lookup--footer text-center">',
        ' <i class="ttb-sdk--icon--info"></i>',
        ' Your report will automatically be created and displayed for you.',
        '</div>'
      ].join('')
        .replace('{{selectedActionLabel}}', o.selectedAction.label);

      o.$container = $(elementSelector);

      // validate if target element not found
      if (!o.$container.length) {
        this._log(['instantLookupWidget : abort : element not found - ', elementSelector]);
        return null;
      }

      // add required class for CSS
      o.$container
        .addClass(o.widgetClass)

        // render the widget template
        .append(o.widgetTemplate);

      // for scope bootstrap instances.
      if (window.TTB.scopedBootstrap) {
        o.$container
          .addClass(defaults.classScopedBootstrap)
          .addClass(defaults.classScopedBootstrapBody);
      }

      // capture the multiple match view container
      o.$multipleMatchContainer = $(o.tableOptions.containerSelector);

      // load data-table library in advance.
      window.TTB.utilLoadDataTable();

      // check for google autocomplete first
      try {
        var test = google.maps.places.Autocomplete;
      } catch(e) {
        this._log([
          'instantLookupWidget : abort : "google.maps.places.Autocomplete" not found -',
          ' please make sure the google script was loaded and that instantLookupWidget() is being called inside/after google load cb is ',
          ' called i.e. googleInit() or the mentioned callback=* in the google script src value.'
        ]);

        // abort the rendering
        return null;
      }

      // bind google autocomplete
      autoComplete = {};
      autoComplete.$element = o.$container.find('#ttb-sdk--instant-lookup--auto-complete');
      autoComplete.instance = new google.maps.places.Autocomplete(autoComplete.$element[0], {types: ['geocode']});

      //TODO destroy listener when element widget gets destroyed.
      // on address select, store the address components for later use when action is clicked.
      autoComplete.instance.addListener('place_changed', function() {
        _self._log(['instantLookupWidget: place_changed called.']);

        // reset previous attempt results
        resetSuccessAlert();

        // reset any prev attempt to multiple match list view
        resetMultipleMatchListView();

        // fill the address form fields
        o.selectedAddressInfo = _self.googleBuildAddress(autoComplete.instance);
      });

      o.$actions = o.$container.find('#ttb-sdk--instant-lookup--actions li');

      // bind click handlers to all actions
      o.$container.find('#ttb-sdk--instant-lookup--actions ul').on('click', 'li', setAndInvokeAction);

      // reset success alert bar used for e.g. full profile report link.
      function resetSuccessAlert() {
        //_self._log(['instantLookupWidget: resetSuccessAlert called.']);

        $('#ttb-sdk--instant-lookup--alert')
        .hide()
        .find('a')
        .attr('href', 'javascript:');
      }

      // resets the list rendered against any previously searched address
      function resetMultipleMatchListView() {
        _self._log(['instantLookupWidget: resetMultipleMatchListView called.']);

        // clear data-table instance (if was rendered)
        refs.dataTable && refs.dataTable.destroy(true);
        refs.dataTable = null;

        // clear DOM completely (if any thing still left by prev data-table instance)
        o.$multipleMatchContainer.empty();
      }

      // to be called from dropdown, selects the action, and auto-invokes it.
      function setAndInvokeAction(evt) {
        //console.log('setAndInvokeAction:');
        setActionSelection(evt);
        invokeSelectedAction();
      }

      // sets the clicked dropdown-action as selected.
      function setActionSelection(evt) {
        //console.log('setActionSelection:', evt);

        o.selectedAction.name = $(evt.target).data('action-name');
        // o.selectedAction.label = $(evt.target).text();

        // o.$selectedAction.text(o.selectedAction.label || '');
        window.TTB._setLocal('selectedAction', o.selectedAction);
      }

      // to be called on click of selected action button, or any other dropdown action.
      function invokeSelectedAction() {
        var promise, disableControls, enableControls, handleError;
        //console.log('invokeSelectedAction');

        // reset previous attempt results
        resetSuccessAlert();

        // reset any prev attempt to multiple match list view
        resetMultipleMatchListView();

        // if no address was selected / fetched via autocomplete
        if (!o.selectedAddressInfo) {
          autoComplete.$element.focus();
          return;
        }

        // to disable widget controls as activating wait state
        disableControls = function() {

          // activate wait spinner
          o.$container.find('.ttb-sdk--spinner').addClass('active');

          // disable widget controls
          autoComplete.$element.prop('disabled', true);
          o.$actions.addClass('ttb-sdk--disabled-link');
        };

        // function to enable widget controls back to normal
        enableControls = function () {
          // deactivate wait spinner
          o.$container.find('.ttb-sdk--spinner').removeClass('active');

          // enable widget controls
          autoComplete.$element.prop('disabled', false);
          o.$actions.removeClass('ttb-sdk--disabled-link');
        };

        // common handler for error relates scenarios. 3 scenarios.
        handleError = function (message) {
          _self._log(['instantLookupWidget : searchBySiteAddress - handleError - ', message]);
          enableControls();

          alert('TTB - Lookup Failed. \nReason: ' + message);
          selectionActionCb(false, {
            message: message
          });
        };

        // activate wait state
        disableControls();

        // get property_id and state info against the given addressInfo
        promise = _self.searchBySiteAddress(o.selectedAddressInfo);
        promise
          .then(function (res) {
            var property, records;

            _self._log(['instantLookupWidget : searchBySiteAddress - complete - ', res]);

            res = res.response;

            // error - when no records found
            if (res.status !== 'OK' || !res.data || !res.data.length) {
              handleError(res.data ? res.data[0] : 'Failed in property lookup.');
              return;
            }

            // error - when multiple records found.
            if (res.data.length > 1) {

              //handleError('Multiple records found, please enter unit number. For example: 303');
              //unitNumber = prompt('Multiple records found. If it\'s a Condo or Apt. complex, please provide a specific unit number.');
              //
              //if (unitNumber) {
              //  o.selectedAddressInfo.site_unit = unitNumber;
              //  invokeSelectedAction();
              //} else {
              //  handleError('Couldn\'t find the property.');
              //}

              // renders the retrieved list
              //var records = window.TTB._getLocal('ilookup-records');

              records = res.data.map(function (record) {

                record.customAddress = record.sa_site_house_nbr + ' ' + TTB.utilCapitalize(record.sa_site_street_name);
                record.customCity = TTB.utilCapitalize(record.sa_site_city);

                return record;
              });

              // capture the instance reference, and stop the wait state/
              o.tableOptions.onInit = function (dataTable) {
                refs.datatable = dataTable;
                enableControls();
              };

              // proceed with the used action while searching.
              o.tableOptions.onSelect = function (property) {

                // activate wait state
                disableControls();

                proceedActionWithTargetProperty(property, enableControls);
              };

              window.TTB.utilRenderTable(records, o.tableOptions);
              _self._log(['instantLookupWidget : match count:', records.length]);

              return;
            }

            // targeted property found, go ahead to invoke the selected action.
            property = res.data[0];
            proceedActionWithTargetProperty(property, enableControls);

          }, function() {
            handleError(defaults.errorMessages.GENERAL__CONNECT_FAILED + '.');
          });
      }

      // proceed with target action, after property is identified with any of the supported methods above.
      function proceedActionWithTargetProperty(property, enableControls) {
        //property.custom_google_formatted_address = o.selectedAddressInfo.custom_google_formatted_address;

        // generate formatted full address
        // e.g. 6039 Collins Ave, Miami Beach, FL 33140
        // pattern: [h#] [streetName] [suf], [city], [state] [zip]
        property.customFullAddress =
          (property.sa_site_house_nbr ? (property.sa_site_house_nbr + ' ') : '') +        // 6039
          (property.sa_site_street_name ? (property.sa_site_street_name + ' ') : '') +    // Collins
          (property.sa_site_suf ? (property.sa_site_suf + ', ') : '') +                   // Ave,
          (property.sa_site_city ? (property.sa_site_city + ', ') : '') +                 // Miami Beach,
          (property.sa_site_state ? (property.sa_site_state + ' ') : '') +                // FL
          (property.sa_site_zip ? (property.sa_site_zip) : '');                           // 33140

        switch (o.selectedAction.name) {

          case 'netSheet':
            _self._log(['instantLookupWidget : selectedAction: netSheet']);
            actionOpenNetSheet(property, enableControls);
            break;

          //case 'generateReport':
          //  ttb._log(['instantLookupWidget : selectedAction: generateReport - dev in progress.']);
          //  enableControls();
          //  break;

          case 'fullProfileReport':
            _self._log(['instantLookupWidget : selectedAction: fullProfileReport']);
            actionOrderReport(property, enableControls);
            break;

          default:
            _self._log(['instantLookupWidget : selectedAction: action not found - ', elementSelector]);
            enableControls();
        }
      }

      // invokes the selected action with given promise
      function selectionActionCb(success, data) {
        actions[o.selectedAction.name] && actions[o.selectedAction.name]({
          success: success,
          data: data
        });
      }

      // opens up a net sheet modal against the selected property
      function actionOpenNetSheet(property, enableControls) {
        var $modal, modalOptions, iframeOptions, origin;

        modalOptions = {
          id: 'ttb-sdk--net-sheet--modal',
          title: 'Net Sheet'
        };

        // dev vs prod destination.
        origin = [defaults.devPortSandbox, defaults.devPortLanding].indexOf(window.location.port) >= 0
          ? ('http://localhost:' + defaults.devPortExport) : 'https://ttb-export.herokuapp.com';

        iframeOptions = {
          id: 'ttb-sdk--net-sheet--iframe',
          height: '635px',
          origin: origin,
          pathname: '/netsheet',
          params: {
            partnerKey: _self.config.partnerKey,
            verticalName: _self.sponsor.name,
            verticalTitle: _self.sponsor.title,
            propertyId: property.sa_property_id,
            propertyAddress: property.customFullAddress,
            debug: _self.debug,
            TTBSID: TTB._getLocal(defaults.sessionKeyName)
          }
        };

        $modal = window.TTB.utilIframeModal(modalOptions, iframeOptions);

        // enable the controls back.
        enableControls();

        // invoke given action callback
        selectionActionCb(true, {
          message: 'Net Sheet Opened.'
        });
      }

      // perform order report against the selected property
      function actionOrderReport(property, enableControls) {
        _self.orderReport({
            sa_property_id: property.sa_property_id,
            state_county_fips: property.mm_fips_state_code + property.mm_fips_muni_code,
            report_type: 'property_profile',
            output: 'link'
          })
          .then(function (res) {
            var popup, reportLink;

            reportLink = res.response.data.report.link;

            // try auto-open a new tab to get the PDF file automatically.
            popup = window.open(reportLink);

            // for blocked-popups users, show and alert bar for the report link
            if (!popup) {

              // render the link to the success alert, and show it.
              $('#ttb-sdk--instant-lookup--alert')
                .show()
                .find('a')
                .attr('href', reportLink);
            }

            // enable the controls back.
            enableControls();

            // invoke given action callback
            selectionActionCb(true, {
              reportLink: reportLink
            });

          }, function () {
            var errorMessage = 'Failed in getting full profile report.';

            alert(errorMessage);
            enableControls();

            // invoke given action callback
            selectionActionCb(false, {
              message: errorMessage
            });
          });
      }
    },

    /***
     *
     * It uses <strong>localStorage</strong> of the host origin, to store the selected sponsor info as <code>ttb-sdk--connect--selected-sponsor</code>,
     * It is a good gate for host sites to persist the user's sponsor selection over their servers, by reading/writing from/to it.
     * Widget will pick it up whenever gets rendered.<br>
     * <br>*/

    /**
     * This method renders a widget includes a connect button to open up the TTB integration modal which contains an <code>iframe</code> controlled by TTB. <br>
     * <br>
     * (Make sure <strong>ttbSdk.min.css</strong> file is injected for proper style and look for the widgets.
     * You can even check out working example over https://jsfiddle.net/benutech/qr7ykw9L/)
     *
     * @param {Object} options - configuration for the connect widget.
     * @param {String} options.elementSelector - DOM element selector where the widget needs to be rendered.
     * <code>#lorem</code> or <code>.ipsum</code> etc.
     * @param {Object} options.loginRemotePayload - "stk" and "getuser_url" information to be used for login. please check .loginRemote() documentation for more.
     *
     * @param {Object} [actions] - The actions object contains mapping callbacks to be consumed on success or failure.
     * @param {Function} [actions.onConnectSuccess] - To be invoked with <code>info</code> object,
     * which on successful "Connect", contains <code>selectedSponsor</code> object, and <code>loginPerformed</code> flag (to be "true" when user gets auto logged in from widget modal)
     * @param {Function} [actions.onConnectFailure] - To be invoked with <code>reason</code> {String} message on failing connecting.
     *
     * @example
     *
     * // with basic and minimum requirement.
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var options = {
     *   elementSelector: '#ttb-connect-wrapper',
     *   loginRemotePayload: {
     *     stk: 'xxxxxxxxxxxxxxx'
     *   }
     * };
     *
     * var $ttbConnect = ttb.connectWidget(options);
     *
     * @example
     *
     * // with advanced configuration for handling success, and failure of the connection process.
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var options = {
     *   elementSelector: '#ttb-connect-wrapper'
     *   loginRemotePayload: {
     *     stk: 'xxxxxxxxxxxxxxx',
     *     getuser_url: 'https://www.yoursite.com/webservices/getuser.json'
     *   }
     * };
     *
     * var actions = {
     *   onConnectSuccess: function(info) {
     *     // optional callback - to be called when done.
     *     // passed argument will be an "info" object which contains "selectedSponsor" which can be used to set instance sponsor.
     *     // note: required details from sponsorInfo already being written to localStorage as "ttb-sdk--connect--selected-sponsor" by SDK.
     *   },
     *
     *   onConnectFailure: function(reason) {
     *     // optional callback - to be called when failed connecting.
     *    // passed argument will be:
     *    // reason {String} - Reason of the failure, e.g. "failed" if API did not connect.
     *   }
     * };
     *
     * var $ttbConnect = ttb.connectWidget(options, actions);
     *
     * @return {Object | null} $element - JQuery reference to the rendered widget container element.
     * OR null in case of any error in rendering widget. E.g. elementSelector did not found.
     *
     * */
    connectWidget: function (options, actions) {
      var o, ttb;

      o = {};

      o.$container = $(options.elementSelector);

      // validate if target element not found
      if (!o.$container.length) {
        this._log(['connectWidget : abort : element not found - ', options.elementSelector]);
        return null;
      }

      ttb = this;
      actions = actions || {};

      o.userProfile = undefined; // later to be filled via getUserProfile( )
      o.widgetClass = 'ttb-sdk--connect--container';
      o.widgetTemplate = [
        '<div id="ttb-sdk--connect--select-section" class="row">',
        ' <div id="ttb-sdk--connect--alert" class="col-xs-9">',
        defaults.errorMessages.CONNECT__NO_SPONSOR,
        ' </div>',
        ' <div id="ttb-sdk--connect--connect" class="col-xs-3">',
        '  <button type="button" class="btn btn-primary pull-right">Connect</button>',
        ' </div>',
        '</div>',
        '<!-- hidden by default -->',
        '<div id="ttb-sdk--connect--change-section" class="row" style="display: none;">',
        ' <div class="col-xs-4">',
        '  <strong>Title company</strong>',
        ' </div>',
        ' <!-- to be dynamically updated -->',
        ' <div id="ttb-sdk--connect--company-name" class="col-xs-4">',
        '  - ',
        ' </div>',
        ' <div id="ttb-sdk--connect--change" class="col-xs-4">',
        '  <button type="button" class="btn btn-primary pull-right">Change</button>',
        ' </div>',
        '</div>'
      ].join('');

      // add required class for CSS
      o.$container
        .addClass(o.widgetClass)

        // render the widget template
        .append(o.widgetTemplate);

      // for scope bootstrap instances.
      if (window.TTB.scopedBootstrap) {
        o.$container
          .addClass(defaults.classScopedBootstrap)
          .addClass(defaults.classScopedBootstrapBody);
      }

      // check for any existing connection - activate disconnected section UI.
      checkForExistingSponsor();

      // register handler of connect button to open up a connect modal
      o.$container.find('#ttb-sdk--connect--select-section button').on('click', onSelectConnection);
      o.$container.find('#ttb-sdk--connect--change-section button').on('click', onChangeConnection);

      // opens up the connect modal
      function onSelectConnection() {
        var $connectModal, modalOptions, iframeOptions, origin;

        ttb._log(['connectWidget: onSelectConnection: init.']);

        modalOptions = {
          id: 'ttb-sdk--connect--modal',
          title: 'Connect with TitleToolbox'
        };

        // dev vs prod destination.
        origin = window.location.port === defaults.devPortSandbox ?
          ('http://localhost:' + defaults.devPortLanding) : 'https://ttb-landing-page.herokuapp.com';

        iframeOptions = {
          id: 'ttb-sdk--connect--iframe',
          height: '635px', // TODO should calculated against window height
          origin: origin,
          pathname: '/index.html',
          params: {
            stk: options.loginRemotePayload.stk,
            getuser_url: options.loginRemotePayload.getuser_url,
            //userProfile: JSON.stringify(o.userProfile),
            partnerKey: ttb.config.partnerKey,
            debug: ttb.debug
          },
          onMessage: onMessage
        };

        // render the sponsors TOS content via modal
        $connectModal = window.TTB.utilIframeModal(modalOptions, iframeOptions);

        // to be invoked when a "message" event is broadcast from the given iframe site
        function onMessage(data, event) {
          ttb._log(['connectWidget: onMessage', data]);

          // skip for the unrelated message events
          if (data.action.indexOf('TTB:SDK::CONNECT_WIDGET') === -1) {
            return;
          }

          // close the connect widget modal.
          $connectModal.modal('hide');

          switch (data.action) {

            // failure - invoke given callbacks
            case 'TTB:SDK::CONNECT_WIDGET:ERROR':

              onConnectFailure(data.info.reason, false);
              break;

            // success - store sponsor, and update UI
            case 'TTB:SDK::CONNECT_WIDGET:SUCCESS':

              onConnectSuccess(data.info, true);
              break;

            default:
              ttb._log(['connectWidget: onMessage: unknown action', data.action]);
              return;
          }
        }
      }

      // alias to "select connection"
      function onChangeConnection() {
        ttb._log(['connectWidget: onChangeConnection: called.']);

        // call same "select connection" method for here too.
        onSelectConnection();
      }

      // pulls user profile, and checks for last selected sponsor.
      function checkForExistingSponsor() {

        // leave wait msg for select-connection UI.
        updateSelectConnectionMode('Pulling user profile...', true);

        // get user profile first.
        window.TTB.getUserProfile(options.loginRemotePayload, ttb.config.partnerKey)
          .then(function (res) {
            var payload;

            // catch error - report and exit.
            if (!res.data || !res.data.User) {
              onConnectFailure('Failed in pulling user profile.', true);
              return;
            }

            /* else - resume checking selected sponsor. */

            // keep the user profile cached for later connect modal box use.
            o.userProfile = res.data.User;

            // leave wait msg for select-connection UI.
            updateSelectConnectionMode('Checking current partner selection...', true);

            payload = {
              email: o.userProfile.email
            };
            window.TTB.getSponsorSelection(ttb.config.partnerKey, payload)
              .then(function (res) {
                var data, errorMessage;

                res = res.response;

                // catch error - report and exit.
                if (res.status !== 'OK') {

                  // we keep "connect" enabled here.
                  errorMessage = res.data[0].indexOf('RC_ERR_105') >= 0 ?
                    defaults.errorMessages.CONNECT__NO_SPONSOR : res.data[0];

                  onConnectFailure(errorMessage, false);
                  return;
                }

                /* else - resume setting selected sponsor */
                data = {
                  selectedSponsor: window.TTB.utilBuildSponsorInfo(res.data)
                };
                onConnectSuccess(data, false);

              }, function (reason) {

                // we keep "connect" enabled here.
                onConnectFailure(defaults.errorMessages.GENERAL__CONNECT_FAILED + ' for pulling partner selection.', false);
              });

          }, function (reason) {

            onConnectFailure(defaults.errorMessages.GENERAL__CONNECT_FAILED + ' for pulling user profile.', true);
          });
      }

      // handles the connect failure
      function onConnectFailure(reason, disableConnect) {

        // leave error msg for select-connection UI.
        updateSelectConnectionMode(reason, disableConnect);

        // invoke the related action callback.
        actions.onConnectFailure && actions.onConnectFailure(reason);
      }

      // saves the sponsor selection
      function onConnectSuccess(info, loginPerformed) {

        // update instance's selected sponsor
        ttb.setSponsor(info.selectedSponsor);

        // show change-connection UI
        o.$container
          .find('#ttb-sdk--connect--select-section').hide()
          .next('#ttb-sdk--connect--change-section').show()
          .find('#ttb-sdk--connect--company-name').text(ttb.sponsor.title || '');

        // leave success msg for select-connection UI.
        updateSelectConnectionMode('Partner selected.', true);

        // invoke the related action callback.
        actions.onConnectSuccess && actions.onConnectSuccess({
          selectedSponsor: ttb.sponsor,
          loginPerformed: loginPerformed
        });
      }

      // renders state related messages / errors on select-connection UI.
      function updateSelectConnectionMode(text, disableConnect) {
        o.$container
          .find('#ttb-sdk--connect--alert').text(text || '')
          .next('#ttb-sdk--connect--connect')
          .find('button').prop('disabled', disableConnect);
      }
    }

  };

})();
