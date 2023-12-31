export function invoiceTypeConvert(invoiceType) {
    switch (invoiceType) {
        case 1:
            return "Factura A";
        case 2:
            return "Nota de debito A";
        case 3:
            return "Nota de credito A";
        case 4:
            return "Recibo A"
        case 6:
            return "Factura B";
        case 7:
            return "Nota de debito B";
        case 8:
            return "Nota de credito B";
        case 9:
            return "Recibo B";
        case 11:
            return "Factura C";
        case 12:
            return "Nota de debito C";
        case 13:
            return "Nota de credito C";
        case 15:
            return "Recibo C";
        case 51:
            return "Factura M";
        case 52:
            return "Nota de debito M";
        case 53:
            return "Nota de credito M";
        case 54:
            return "Recibo M";
        case 81:
            return "Tique factura A - Controlador Fiscal";
        case 82:
            return "Tique factura B - Controlador Fiscal";
        case 83:
            return "Tique";
        case 109:
            return "Tique C"
        case 110:
            return "Tique nota de credito"
        case 111:
            return "Tique fcatura C"
        case 112:
            return "Tique nota de crédito A"
        case 113:
            return "Tique nota de crédito B"
        case 114:
            return "Tique nota de crédito C"
        case 115:
            return "Tique nota de debito A"
        case 116:
            return "Tique nota de debito B"
        case 117:
            return "Tique nota de debito C"
        case 118:
            return "Tique factura M"
        case 119:
            return "Tique nota de credito M"
        case 120:
            return "Tique nota de debito M"
        default:
            return "";
    }
}

export function invoiceTypeConvertObject(invoiceType) {
    switch (invoiceType) {
        case 1:
            return {
                type: { id: 1, name: "Factura" },
                word: "A"
            };
        case 2:
            return {
                type: { id: 5, name: "Nota de débito" },
                word: "A"
            };
        case 3:
            return {
                type: { id: 4, name: "Nota de crédito" },
                word: "A"
            };
        case 4:
            return {
                type: { id: 2, name: "Recibo" },
                word: "A"
            }
        case 6:
            return {
                type: { id: 1, name: "Factura" },
                word: "B"
            };
        case 7:
            return {
                type: { id: 5, name: "Nota de débito" },
                word: "B"
            };
        case 8:
            return {
                type: { id: 4, name: "Nota de crédito" },
                word: "B"
            };
        case 9:
            return {
                type: { id: 2, name: "Recibo" },
                word: "B"
            };
        case 11:
            return {
                type: { id: 1, name: "Factura" },
                word: "C"
            };
        case 12:
            return {
                type: { id: 5, name: "Nota de débito" },
                word: "C"
            };
        case 13:
            return {
                type: { id: 4, name: "Nota de crédito" },
                word: "C"
            };
        case 15:
            return {
                type: { id: 2, name: "Recibo" },
                word: "C"
            };
        case 51:
            return {
                type: { id: 1, name: "Factura" },
                word: "M"
            };
        case 52:
            return {
                type: { id: 5, name: "Nota de débito" },
                word: "M"
            };
        case 53:
            return {
                type: { id: 4, name: "Nota de crédito" },
                word: "M"
            };
        case 54:
            return {
                type: { id: 2, name: "Recibo" },
                word: "M"
            };
        case 81:
            return {
                type: { id: 3, name: "Ticket" },
                word: "A"
            };
        case 82:
            return {
                type: { id: 3, name: "Ticket" },
                word: "B"
            };
        case 83:
            return {
                type: { id: 3, name: "Ticket" },
                word: "B"
            };
        case 109:
            return {
                type: { id: 3, name: "Ticket" },
                word: "C"
            };
        default:
            return {
                type: { id: 1, name: "Factura" },
                word: "B"
            };
    }
}