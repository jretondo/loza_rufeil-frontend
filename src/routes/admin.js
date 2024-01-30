import index from "views/admin/dashboard"
import userAdmin from 'views/admin/userAdmin'
import clients from 'views/admin/clients'
import certificates from 'views/admin/certificates'
import accountingEntries from 'views/admin/accounting/entries'
import accountingAccounts from 'views/admin/accounting/accounts'
import accountingReports from 'views/admin/accounting/reports'

import purchasesEntries from 'views/admin/purchases/entries'
import purchasesProvider from 'views/admin/purchases/providers'
import purchasesReports from 'views/admin/purchases/reports'
import purchaseParameters from 'views/admin/purchases/parameters'

import sellClients from 'views/admin/sells/customers'

var routes = [
  {
    path: "/index",
    name: "Inicio",
    icon: "ni ni-tv-2 text-blue",
    component: index,
    layout: process.env.PUBLIC_URL + "/admin",
    id: 0
  }, {
    path: "/user-admin",
    name: "Usuarios",
    icon: "ni ni-single-02 text-blue",
    component: userAdmin,
    layout: process.env.PUBLIC_URL + "/admin",
    id: 6
  }, {
    path: "/business",
    name: "Empresas",
    icon: "ni ni-briefcase-24 text-red",
    component: clients,
    layout: process.env.PUBLIC_URL + "/admin",
    id: 7
  },
  {
    path: "/certificates",
    name: "Certificados Digitales",
    icon: "ni ni-key-25 text-green",
    component: certificates,
    layout: process.env.PUBLIC_URL + "/admin",
    id: 8
  },
  {
    sub: [
      {
        name: "Comprobantes",
        path: "/purchases/entries",
        component: purchasesEntries,
      },
      {
        name: "Proveedores",
        path: "/purchases/providers",
        component: purchasesProvider,
      },
      {
        name: "Reportes",
        path: "/purchases/reports",
        component: purchasesReports,
      },
      {
        name: "Parametros",
        path: "/purchases/parameters",
        component: purchaseParameters,
      }
    ],
    name: "Compras",
    icon: "ni ni-shop text-blue",
    layout: process.env.PUBLIC_URL + "/admin",
    id: 9
  },
  {
    sub: [
      {
        name: "Comprobantes",
        path: "/sells/entries",
        component: purchasesEntries,
      },
      {
        name: "Clientes",
        path: "/sells/customers",
        component: sellClients,
      },
      {
        name: "Reportes",
        path: "/sells/reports",
        component: purchasesReports,
      },
      {
        name: "Parametros",
        path: "/sells/parameters",
        component: purchaseParameters,
      }
    ],
    name: "Ventas",
    icon: "ni ni-money-coins text-red",
    layout: process.env.PUBLIC_URL + "/admin",
    id: 10
  },
  {
    sub: [
      {
        name: "Asientos Contables",
        path: "/accounting/entries",
        component: accountingEntries,
      },
      {
        name: "Plan de Cuentas",
        path: "/accounting/accounts",
        component: accountingAccounts,
      },
      {
        name: "Reportes",
        path: "/accounting/reports",
        component: accountingReports,
      }
    ],
    name: "Contabilidad",
    icon: "ni ni-briefcase-24 text-blue",
    layout: process.env.PUBLIC_URL + "/admin",
    id: 11
  }
];
export default routes;
