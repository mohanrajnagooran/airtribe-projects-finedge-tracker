/**
 * Computes overall income/expense/balance totals for a set of transactions.
 */
const computeSummary = (transactions) => {
  const summary = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.totalIncome += t.amount;
      else if (t.type === 'expense') acc.totalExpense += t.amount;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );

  summary.balance = round2(summary.totalIncome - summary.totalExpense);
  summary.totalIncome = round2(summary.totalIncome);
  summary.totalExpense = round2(summary.totalExpense);
  summary.transactionCount = transactions.length;

  return summary;
};

/**
 * Breaks down expense totals by category, sorted highest first.
 */
const computeCategoryBreakdown = (transactions) => {
  const byCategory = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });

  return Object.entries(byCategory)
    .map(([category, total]) => ({ category, total: round2(total) }))
    .sort((a, b) => b.total - a.total);
};

/**
 * Groups transactions by YYYY-MM and computes income/expense/balance for each month.
 */
const computeMonthlyInsights = (transactions) => {
  const byMonth = {};

  transactions.forEach((t) => {
    const month = (t.date || t.createdAt).slice(0, 7); // "YYYY-MM"
    if (!byMonth[month]) {
      byMonth[month] = { month, totalIncome: 0, totalExpense: 0 };
    }
    if (t.type === 'income') byMonth[month].totalIncome += t.amount;
    else if (t.type === 'expense') byMonth[month].totalExpense += t.amount;
  });

  return Object.values(byMonth)
    .map((m) => ({
      ...m,
      totalIncome: round2(m.totalIncome),
      totalExpense: round2(m.totalExpense),
      balance: round2(m.totalIncome - m.totalExpense),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

/**
 * Builds the top-line insights for the most recent month present in the data,
 * including comparison against the prior month.
 */
const computeLatestMonthInsight = (transactions) => {
  const monthly = computeMonthlyInsights(transactions);
  if (monthly.length === 0) return null;

  const latest = monthly[monthly.length - 1];
  const previous = monthly.length > 1 ? monthly[monthly.length - 2] : null;

  let expenseChangePct = null;
  if (previous && previous.totalExpense > 0) {
    expenseChangePct = round2(
      ((latest.totalExpense - previous.totalExpense) / previous.totalExpense) * 100
    );
  }

  return { ...latest, previousMonth: previous ? previous.month : null, expenseChangePct };
};

const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

module.exports = {
  computeSummary,
  computeCategoryBreakdown,
  computeMonthlyInsights,
  computeLatestMonthInsight,
};
