const PROJECT = 'loza-rufeil';
const LOCAL_PORT = '3020';
const API_PRODUCTION_ADDRESS = 'https://api-prod.nekoadmin.com.ar';
let host = '';
let publicFiles = '';

if (process.env.NODE_ENV === 'development') {
  host = `http://localhost:${LOCAL_PORT}/api`;
  publicFiles = `http://localhost:${LOCAL_PORT}/static`;
} else {
  host = `${API_PRODUCTION_ADDRESS}/${PROJECT}/api`;
  publicFiles = `${API_PRODUCTION_ADDRESS}/${PROJECT}/static`;
}

const auth = host + '/auth';
const routes = host + '/routes';
const permissions = host + '/permissions';
const users = host + '/user';
const activity = host + '/activity';
const clients = host + '/clients';
const providers = host + '/providers';
const customers = host + '/customers';
const certificates = host + '/certificates';
const accounting = host + '/accounting';
const modules = host + '/modules';
const purchases = host + '/purchases';
const sells = host + '/sells';

const authDir = {
  auth,
};

const activityDir = {
  activity,
};

const permissionsDir = {
  permissions,
  sub: {
    list: '/list',
  },
};

const usersDir = {
  users,
  sub: {
    details: users + '/details',
    mydata: users + '/mydata',
    clients: users + '/clients',
    permissions: users + '/permissions',
  },
};

const clientsDir = {
  clients,
  sub: {
    dataTax: clients + '/dataTax',
    dataTaxProof: clients + '/dataTaxProof',
    permissions: clients + '/permissions',
    token: clients + '/token',
  },
};

const providersDir = {
  providers,
  sub: {
    dataTax: providers + '/dataTax',
    dataTaxProof: providers + '/dataTaxProof',
    parameters: providers + '/parameters',
  },
};

const customersDir = {
  customers,
  sub: {
    dataTax: customers + '/dataTax',
    dataTaxProof: customers + '/dataTaxProof',
    parameters: customers + '/parameters',
  },
};

const certificatesDir = {
  certificates,
  sub: {
    csr: certificates + '/csr',
    crtKey: certificates + '/crt-key',
  },
};

const routesDir = {
  routes,
  sub: {
    dashboard: routes + '/dashboard',
    userAdmin: routes + '/users',
    clients: routes + '/clients',
    certificates: routes + '/certificates',
    sells: routes + '/sells',
    purchases: routes + '/purchases',
    accounting: routes + '/accounting',
  },
};

const accountingDir = {
  accounting,
  sub: {
    period: accounting + '/period',
    entries: accounting + '/entries',
    journal: accounting + '/journal',
    ledger: accounting + '/ledger',
    balance: accounting + '/balance',
    lastEntryData: accounting + '/lastEntryData',
    accountingEntry: accounting + '/accountingEntry',
    allowImport: accounting + '/allowImport',
    accountingCharts: accounting + '/accountingCharts',
    accountingChartsPDF: accounting + '/accountingCharts/PDF',
    accountingChartsExcel: accounting + '/accountingCharts/Excel',
    accountingChart: accounting + '/accountingChart',
    attributableAccountingChart: accounting + '/attributableAccountingChart',
    reorderCheckEntryNumber: accounting + '/accountingEntry/reorder/check',
    reorderEntry: accounting + '/accountingEntry/reorder',
  },
};

const modulesDir = {
  modules,
  sub: {
    all: modules + '/all',
  },
};

const purchasesDir = {
  purchases,
  sub: {
    period: purchases + '/period',
    periods: purchases + '/periods',
    params: purchases + '/params',
    paymentsMethods: purchases + '/paymentsMethods',
    receipt: purchases + '/receipt',
    receipts: purchases + '/receipts',
    uncheckedReceipts: purchases + '/receipt/unchecked',
    checkReceipts: purchases + '/receipt/check',
    receiptsTxt: purchases + '/receipts/txt',
    cvsImport: purchases + '/receipt/import',
    periodTotal: purchases + '/period/total',
    excelExport: purchases + '/receipts/export',
    report: purchases + '/receipts/report',
    entries: purchases + '/entries',
  },
};

const sellsDir = {
  purchases,
  sub: {
    period: sells + '/period',
    periods: sells + '/periods',
    params: sells + '/params',
    paymentsMethods: sells + '/paymentsMethods',
    receipt: sells + '/receipt',
    receipts: sells + '/receipts',
    uncheckedReceipts: sells + '/receipt/unchecked',
    checkReceipts: sells + '/receipt/check',
    receiptsTxt: sells + '/receipts/txt',
    cvsImport: sells + '/receipt/import',
    periodTotal: sells + '/period/total',
    excelExport: sells + '/receipts/export',
    report: sells + '/receipts/report',
    entries: sells + '/entries',
  },
};

const API_ROUTES = {
  publicFiles,
  authDir,
  routesDir,
  permissionsDir,
  usersDir,
  activityDir,
  clientsDir,
  certificatesDir,
  providersDir,
  accountingDir,
  modulesDir,
  purchasesDir,
  customersDir,
  sellsDir,
};

export default API_ROUTES;
