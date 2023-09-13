import CompleteCerosLeft from "function/completeCeroLeft"

export const accountCodeGenerate = (parentAccount) => {
    const subAccounts = parentAccount.subAccounts
    if (subAccounts.length > 0) {
        if (parentAccount.group === 0) {
            const code = {
                genre: parentAccount.genre,
                group: 1,
                caption: 0,
                account: 0,
                sub_account: 0,
                code: parentAccount.genre + "01000000"
            }
            console.log('code :>> ', code);
        } else if (parentAccount.caption === 0) {
            return {
                genre: parentAccount.genre,
                group: parentAccount.group,
                caption: 1,
                account: 0,
                sub_account: 0,
                code: parentAccount.genre + CompleteCerosLeft(parentAccount.group, 2) + "010000"
            }
        } else if (parentAccount.account === 0) {
            return {
                genre: parentAccount.genre,
                group: parentAccount.group,
                caption: parentAccount.caption,
                account: 1,
                sub_account: 0,
                code: parentAccount.genre + CompleteCerosLeft(parentAccount.group, 2) + CompleteCerosLeft(parentAccount.caption, 2) + "0100"
            }
        } else if (parentAccount.sub_account === 0) {
            return {
                genre: parentAccount.genre,
                group: parentAccount.group,
                caption: parentAccount.caption,
                account: parentAccount.account,
                sub_account: 1,
                code: parentAccount.genre + CompleteCerosLeft(parentAccount.group, 2) + CompleteCerosLeft(parentAccount.caption) + CompleteCerosLeft(parentAccount.account) + "01"
            }
        }
    } else {
        const lastSubAccount = subAccounts[subAccounts.length - 1]
        if (lastSubAccount.group === 0) {
            return {
                genre: lastSubAccount.genre + 1,
                group: 0,
                caption: 0,
                account: 0,
                sub_account: 0,
                code: lastSubAccount.genre + 1 + "00000000"
            }
        } else if (lastSubAccount.caption === 0) {
            return {
                genre: lastSubAccount.genre,
                group: lastSubAccount.group + 1,
                caption: 0,
                account: 0,
                sub_account: 0,
                code: lastSubAccount.genre + CompleteCerosLeft(lastSubAccount.group + 1, 2) + "000000"
            }
        } else if (lastSubAccount.account === 0) {
            return {
                genre: lastSubAccount.genre,
                group: lastSubAccount.group,
                caption: lastSubAccount.caption + 1,
                account: 0,
                sub_account: 0,
                code: lastSubAccount.genre + CompleteCerosLeft(lastSubAccount.group, 2) + CompleteCerosLeft(lastSubAccount.caption + 1, 2) + "0000"
            }
        } else if (lastSubAccount.sub_account > 0) {
            return {
                genre: lastSubAccount.genre,
                group: lastSubAccount.group,
                caption: lastSubAccount.caption,
                account: lastSubAccount.account,
                sub_account: lastSubAccount.sub_account + 1,
                code: lastSubAccount.genre + CompleteCerosLeft(lastSubAccount.group, 2) + CompleteCerosLeft(lastSubAccount.caption, 2) + CompleteCerosLeft(lastSubAccount.account, 2) + CompleteCerosLeft(lastSubAccount.sub_account + 1, 2)
            }
        }
    }
}