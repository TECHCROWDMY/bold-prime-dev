/**
 * All route url paths
 */

export class API {
  /***** BASE URL *****/
  public static BASE_URL_CRM: string = 'https://my.boldprime.com/';
  public static BASE_URL: string = 'https://fx.myboldprime.com/client-api/';
  public static IMAGE_BASE_URL: string = 'https://fx.myboldprime.com/';
  public static DASHBOARD_IMAGE_BASE_URL: string = 'https://fx.myboldprime.com';
  public static IMAGE_BASE_URL_BANNER: string = 'https://fx.myboldprime.com'; // end of url not add this symbol (/)
  public static OPEN_FILES: string = 'https://fx.myboldprime.com';
  public static BASE: string = 'https://fx.myboldprime.com';

  /***** USER AUTH *****/
  public static LOGIN: string = API.BASE_URL + 'login';
  public static REGISTER: string = API.BASE_URL + 'registration';
  public static REGISTER_PIN: string = API.BASE_URL + 'registration/send-pin';
  public static REGISTER_CONFIRM_PIN: string =
    API.BASE_URL + 'registration/confirmation';
  public static FORGOT_PASSWORD: string = API.BASE_URL + 'forgot-password';

  /*** Ranking */
  public static RANKS_CONTEST_LEADERS: string = API.BASE_URL_CRM + 'rest/contest/leaders';
  /***** ACCOUNT  *****/
  public static ACCOUNTS: string = API.BASE_URL + 'accounts';
  public static ACCOUNTS_TYPE: string = API.BASE_URL + 'accounts/types';
  public static ACCOUNTS_SEND_REPORT: string =
    API.BASE_URL + 'accounts/change/send-report';
  public static ACCOUNTS_CHANGE_PASSWORD: string =
    API.BASE_URL + 'accounts/change/password';
  public static ACCOUNTS_OPEN: string = API.BASE_URL + 'accounts/new';
  public static ACCOUNTS_OPEN_AMOUNT: string = API.BASE_URL + 'deposit/demo';
  public static ACCOUNTS_TRADER_HISTORY: string =
    API.BASE_URL + 'accounts/trading-history';
  public static ACCOUNTS_CHARTS_LOTS: string = API.BASE_URL + 'chart/ib_lots';
  public static ACCOUNTS_CHARTS_PROFIT: string =
    API.BASE_URL + 'chart/ib_commissions';
  public static ACCOUNTS_CHANGE_LEVERAGE: string =
    API.BASE_URL + 'accounts/change/leverage';

  /***** DEPOSIT  *****/
  public static DEPOSIT_PAYMENT_TYPE: string =
    API.BASE_URL + 'payment-systems/deposit';
  public static DEPOSIT_FEES: string = API.BASE_URL + 'deposit/fees';
  public static DEPOSIT_ACCOUNT: string =
    API.BASE_URL + 'deposit?version=1.0.0';

  /***** WITHDRAWAL DETAILS  *****/
  public static WITHDRAWAL_DETAILS: string =
    API.BASE_URL + 'payment-systems/withdrawal';
  public static PAYMENT_ACCOUNT_UPLOAD: string =
    API.BASE_URL + 'payment-details/upload';
  public static GET_PAYMENT_ACCOUNT_WALLET: string =
    API.BASE_URL + 'payment-details';
  public static PAYMENT_ACCOUNT: string = API.BASE_URL + 'payout?version=1.0.0';

  /***** HELP DESK  *****/
  public static HELP_DESK_GET_OPEN: string =
    API.BASE_URL + 'help-desk/tickets/open';
  public static HELP_DESK_GET_CLOSED: string =
    API.BASE_URL + 'help-desk/tickets/closed';
  public static HELP_DESK_DETAILS: string = API.BASE_URL + 'help-desk/tickets';
  public static HELP_DESK_CREATE_MASSAGE: string =
    API.BASE_URL + 'help-desk/ticket-comments';
  public static HELP_DESK_CATEGORIES: string =
    API.BASE_URL + 'help-desk/ticket-categories';
  public static HELP_DESK_CREATE: string = API.BASE_URL + 'help-desk/tickets';
  public static HELP_DESK_CLOSE_DELETE: string =
    API.BASE_URL + 'help-desk/tickets';

  /***** DOWNLOADS *****/
  public static DOWNLOADS_APP: string = API.BASE_URL + 'downloads';

  /***** PROFILE *****/
  public static PROFILE: string = API.BASE_URL + 'profile';
  public static PROFILE_NOTIFICATION_OPTIONS: string =
    API.BASE_URL + 'profile/notification-preferences/options';
  public static PROFILE_NOTIFICATION_UPDATE: string =
    API.BASE_URL + 'profile/change/notification-preferences';
  public static DOCUMENTS_LISTS: string = API.BASE_URL + 'documents';
  public static DOCUMENTS_CONFIG: string = API.BASE_URL + 'documents/configs';
  public static DOCUMENTS_UPLOAD: string = API.BASE_URL + 'documents/upload';
  public static ACCOUNT_MANAGER_DETAILS: string =
    API.BASE_URL + 'profile/contact-manager-details';
  public static ACCOUNT_CHANGE_PASSWORD: string =
    API.BASE_URL + 'profile/change-password';
  public static ACCOUNT_CHANGE_EMAIL: string =
    API.BASE_URL + 'profile/change-email';
  public static ACCOUNT_CHANGE_MOBILE: string =
    API.BASE_URL + 'profile/change-phone';

  /***** MESSAGE *****/
  public static MESSAGE_LIST: string = API.BASE_URL + 'profile/messages';

  /***** MY -AGREEMENT *****/
  public static AGGREMENT_DOCUMENT: string =
    API.BASE_URL + 'company-documents/accepted';
  public static AGGREMENT_DOCUMENT_TYPE: string =
    API.BASE_URL + 'company-documents/all';

  /***** CONTEST *****/
  public static CONTEST_LIST: string = API.BASE_URL + 'contest/list';
  public static CONTEST_COMMON: string = API.BASE_URL + 'contest';

  /***** PAYMENT  *****/
  public static PAYMENT_LIST: string = API.BASE_URL + 'payment-details';
  public static PAYMENT_DETAILS_CONFIG: string =
    API.BASE_URL + 'payment-details/configs';

  /***** TRANSACTIONS *****/
  public static TRANSACTIONS_LIST: string = API.BASE_URL + 'transactions';
  public static TRANSACTIONS_CANCEL: string =
    API.BASE_URL + 'transactions/cancel';
  public static TRANSFER_LIST: string = API.BASE_URL + 'transfers/';

  /***** TRANSFER *****/
  public static TRANSFER_NEW: string = API.BASE_URL + 'transfers/new';
  public static TRANSFER_NEW2: string = API.BASE_URL + 'transfers/check';

  /***** IB MANU  *****/

  /***** DASHBOARD  *****/
  public static DASHBOARD_LIST: string = API.BASE_URL + 'ib/tree';
  public static DASHBOARD_LIST_REF: string = API.BASE_URL + 'ib/referrals';
  public static COMMISSION_LIST: string = API.BASE_URL + 'ib/commissions';
  public static GET_TOTALS_COMMISSION: string =
    API.BASE + '/table-configurator/totals/';
  public static DASHBOARD_ACCOUNT_LIST: string =
    API.BASE_URL + 'ib/referrals/accounts';

  /***** PERFORMANCE DASHBOARD  *****/
  public static PERFORMANCE_DASHBOARD: string =
    API.BASE_URL + 'ib/performance-dashboard';

  /***** PERFORMANCE DASHBOARD  *****/
  public static IB_TRANSACTIONS_LIST: string =
    API.BASE_URL + 'ib/ib-transactions';

  /***** CLIENTS TRANSACTIONS  *****/
  public static CLIENT_TRANSACTIONS_LIST: string =
    API.BASE_URL + 'transactions';

  /***** MARJETING TOOLS  *****/
  public static LINKS: string = API.BASE_URL + 'ib/links';
  public static LINKS_LANDING_PAGE: string =
    API.BASE_URL + 'ib/links/landing-pages';
  public static LINKS_NEW: string = API.BASE_URL + 'ib/links/new';
  public static LINKS_DELETE: string = API.BASE_URL + 'ib/links';
  public static BANNER_LIST: string = API.BASE_URL + 'ib/banners';
  public static CONVERT_RATE: string = API.BASE_URL + 'transfers/convert/rate';

  /***** REPORTS  *****/
  public static ACCOUNT_REPORTS_LIST: string =
    API.BASE_URL + 'ib/reports/accounts-commissions';

  /***** REPORTS  *****/
  public static CLIENT_REPORTS_LIST: string =
    API.BASE_URL + 'ib/reports/clients-commissions';

  /***** LOGOUT *****/
  public static LOGOUT: string = API.BASE_URL + 'logout';

  /***** COMMON API *****/
  public static SEND_PIN: string = API.BASE_URL + 'pin/send';

  /***** REQUEST IB *****/
  public static REQUEST_IB: string = API.BASE_URL + 'applications/upload';
}
