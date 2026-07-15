const diffDays = (startDate: Date, endDate: Date) => {
    return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
};

const addMonths = (date: Date, months: number): Date => {
    const d = new Date(date);
    const day = d.getDate();
    d.setMonth(d.getMonth() + months);
    // 防止 1月31日 +1个月 变成3月的 bug
    if (d.getDate() !== day) {
        d.setDate(0);
    }
    return d;
}

/**
 * 微粒贷贷款计算
 * @param principalYuan 借款金额 (元)
 * @param annualRate 年利率 (如 23.76 表示 23.76%)
 * @param startDate 借款日期
 * @param firstPaymentDate 首次还款日期
 * @param totalPeriods 总期数
 */
export const wldLoanCalculate = (principalYuan: number, annualRate: number, startDate: Date, firstPaymentDate: Date, totalPeriods: number) => {
    let dailyRate = annualRate / 100 / 360;
    const schedule: any[] = [];
    let remainingPrincipal = Math.round(principalYuan * 100); // 转为“分”

    // 计算一个近似的月供金额作为基准 (用于确定每期的大致还款额)
    // 注意：由于首期天数不同，这里的月供仅作为参考基准，实际还款额会根据天数调整
    const monthlyRate = annualRate / 100 / 12;
    const estimatedMonthlyPayment = Math.round(
        (remainingPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalPeriods)) /
        (Math.pow(1 + monthlyRate, totalPeriods) - 1)
    );

    let currentDate = startDate;
    let previousEndDate = startDate;

    for (let i = 1; i <= totalPeriods; i++) {
        // 确定当期还款日
        const dueDate = i === 1 ? firstPaymentDate : addMonths(firstPaymentDate, i - 1);

        // 计息结束日 = 下一个还款日的前一天
        // 如果是最后一期，计息结束日就是还款日
        const endDate = i < totalPeriods
            ? new Date(dueDate.getTime() - 24 * 60 * 60 * 1000)
            : dueDate;

        // 如果是第一期，计息开始日是借款日；否则是上一期的计息结束日的下一天
        const start = i === 1 ? startDate : new Date(previousEndDate.getTime() + 24 * 60 * 60 * 1000);

        const days = diffDays(start, dueDate); // 计息天数

        // 计算当期利息
        const interest = Math.round(remainingPrincipal * dailyRate * days);

        let principal: number;
        let payment: number;

        if (i < totalPeriods) {
            // 非最后一期：还款额取估算月供和（剩余本金+利息）的较小值，防止超额
            payment = Math.min(estimatedMonthlyPayment, remainingPrincipal + interest);
            principal = payment - interest;
        } else {
            // 最后一期：归还所有剩余本金，并支付当期利息
            principal = remainingPrincipal;
            payment = principal + interest;
        }

        // 更新剩余本金
        remainingPrincipal -= principal;

        schedule.push({
            period: i,
            startDate: start,
            endDate,
            dueDate,
            days,
            principal,
            interest,
            payment,
            remainingPrincipal: Math.max(0, remainingPrincipal), // 防止负数
        });

        previousEndDate = endDate;
    }

    // 最终修正：确保最后一期结束后剩余本金为0
    // 处理由于四舍五入导致的微小差额
    const lastPeriod = schedule[schedule.length - 1];
    if (lastPeriod.remainingPrincipal !== 0) {
        lastPeriod.payment += lastPeriod.remainingPrincipal;
        lastPeriod.principal += lastPeriod.remainingPrincipal;
        lastPeriod.remainingPrincipal = 0;
    }

    return schedule;

}

/**
 * 基于 等额本息 的计算还款方式
 * @param principalYuan 借款金额 (元)
 * @param annualRate 年利率 (如 23.76 表示 23.76%)
 * @param startDate 借款日期
 * @param firstPaymentDate 首次还款日期
 * @param totalPeriods 总期数
 */
export const equalPrincipalAndInterestLoanCalculate = (principalYuan: number, annualRate: number, startDate: Date, firstPaymentDate: Date, totalPeriods: number) => {
    const monthlyRate = annualRate / 100 / 12;
    const result: any[] = [];
    // 每月还款金额
    const monthlyPayment =
        (principalYuan *
            monthlyRate *
            Math.pow(1 + monthlyRate, totalPeriods)) /
        (Math.pow(1 + monthlyRate, totalPeriods) - 1);
    let remainingPrincipal = principalYuan;
    for (let i = 1; i <= totalPeriods; i++) {
        const interest = remainingPrincipal * monthlyRate;
        const principal = monthlyPayment - interest;
        remainingPrincipal -= principal;

        // 防止最后一期因浮点误差出现负数
        if (i === totalPeriods) {
            remainingPrincipal = 0;
        }

        result.push({
            period: i, // 期数
            dueDate: addMonths(firstPaymentDate, i - 1), // 还款日
            totalAmount: Number(monthlyPayment.toFixed(2)), // 还款金额
            principal: Number(principal.toFixed(2)), // 本金
            interest: Number(interest.toFixed(2)), // 利息
            remainingPrincipal: Number(Math.max(remainingPrincipal, 0).toFixed(2)), // 剩余本金
        });
    }

    return result;
}


/**
 * 基于 等额本金 的计算还款方式
 * @param principalYuan 借款金额 (元)
 * @param annualRate 年利率 (如 23.76 表示 23.76%)
 * @param startDate 借款日期
 * @param firstPaymentDate 首次还款日期
 * @param totalPeriods 总期数
 */
export const equalPrincipalLoanCalculate = (principalYuan: number, annualRate: number, startDate: Date, firstPaymentDate: Date, totalPeriods: number) => {
    const monthlyRate = annualRate / 100 / 12;
    const fixedPrincipal = principalYuan / totalPeriods;
    const result: any[] = [];

    let remainingPrincipal = principalYuan;

    for (let i = 1; i <= totalPeriods; i++) {
        const interest = remainingPrincipal * monthlyRate;
        const totalAmount = fixedPrincipal + interest;
        remainingPrincipal -= fixedPrincipal;

        if (i === totalPeriods) {
            remainingPrincipal = 0;
        }

        result.push({
            period: i,
            dueDate: addMonths(firstPaymentDate, i - 1),
            totalAmount: Number(totalAmount.toFixed(2)),
            principal: Number(fixedPrincipal.toFixed(2)),
            interest: Number(interest.toFixed(2)),
            remainingPrincipal: Number(Math.max(remainingPrincipal, 0).toFixed(2)),
        });
    }

    return result;
}