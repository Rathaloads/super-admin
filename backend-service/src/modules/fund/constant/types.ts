export enum eFundType {
    INCOME = 1, // 收入
    EXPENSE = 2, // 支出
    LOAN = 3, // 贷款
    REPAYMENT = 4, // 还款
}

export enum eRepaymentStatus {
    PENDING = 0, // 待还款
    REPAID = 1, // 已还款
    OVERDUE = 2, // 逾期
}


export enum eRepaymentType {
    EQUAL_PRINCIPAL = 1, // 等额本金
    EQUAL_INSTALLMENT = 2, // 等额本息
}

export enum eLoanPlatform {
    WLD = "WLD", // 微粒贷
    JB = "JB", // 借呗
    HB = "HB", // 花呗
    OTHER = "OTHER", // 其他
}