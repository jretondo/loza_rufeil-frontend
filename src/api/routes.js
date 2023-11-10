const PROJECT = "loza-rufeil"
const LOCAL_PORT = "3020"
const API_PRODUCTION_ADDRESS = "https://api-prod.nekoadmin.com.ar"
let host = ""
let publicFiles = ""

if (process.env.NODE_ENV === "development") {
    host = `http://localhost:${LOCAL_PORT}/api`
    publicFiles = `http://localhost:${LOCAL_PORT}/static`
} else {
    host = `${API_PRODUCTION_ADDRESS}/${PROJECT}/api`
    publicFiles = `${API_PRODUCTION_ADDRESS}/${PROJECT}/static`
}

const auth = host + "/auth"
const routes = host + "/routes"
const permissions = host + "/permissions"
const users = host + "/user"
const activity = host + "/activity"
const clients = host + "/clients"
const providers = host + "/providers"
const certificates = host + "/certificates"
const accounting = host + "/accounting"
const modules = host + "/modules"
const purchases = host + "/purchases"

const authDir = {
    auth
}

const activityDir = {
    activity
}

const permissionsDir = {
    permissions,
    sub: {
        list: "/list"
    }
}

const usersDir = {
    users,
    sub: {
        details: users + "/details",
        mydata: users + "/mydata",
        clients: users + "/clients",
        permissions: users + "/permissions"
    }
}

const clientsDir = {
    clients,
    sub: {
        dataTax: clients + "/dataTax",
        dataTaxProof: clients + "/dataTaxProof",
        permissions: clients + "/permissions",
        token: clients + "/token",
    }
}

const providersDir = {
    providers,
    sub: {
        dataTax: providers + "/dataTax",
        dataTaxProof: providers + "/dataTaxProof",
        parameters: providers + "/parameters",
    }
}

const certificatesDir = {
    certificates,
    sub: {
        csr: certificates + "/csr",
        crtKey: certificates + "/crt-key"
    }
}

const routesDir = {
    routes,
    sub: {
        dashboard: routes + "/dashboard",
        userAdmin: routes + "/users",
        clients: routes + "/clients",
        certificates: routes + "/certificates",
        sells: routes + "/sells",
        purchases: routes + "/purchases",
        accounting: routes + "/accounting"
    }
}

const accountingDir = {
    accounting,
    sub: {
        period: accounting + "/period",
        accountingCharts: accounting + "/accountingCharts",
        accountingChart: accounting + "/accountingChart",
        attributableAccountingChart: accounting + "/attributableAccountingChart",
    }
}

const modulesDir = {
    modules,
    sub: {
        all: modules + "/all",
    }
}

const purchasesDir = {
    purchases,
    sub: {
        period: purchases + "/period",
        params: purchases + "/params",
        paymentsMethods: purchases + "/paymentsMethods",
        receipt: purchases + "/receipt",
        receipts: purchases + "/receipts",
        receiptsTxt: purchases + "/receipts/txt",
        cvsImport: purchases + "/receipt/import",
    }
}

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
    purchasesDir
}

export default API_ROUTES