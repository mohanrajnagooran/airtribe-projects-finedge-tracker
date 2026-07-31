/**
 * Rule-based "AI insight" generator.
 *
 * This produces human-readable financial insight sentences from analytics
 * output without requiring any external API key, so the project runs
 * out-of-the-box. The function signature is intentionally kept pure
 * (data in, strings out) so it can later be swapped for a call to an LLM
 * provider (e.g. the Anthropic Messages API) without touching callers.
 */
const generateInsights = ({ summary, categoryBreakdown, latestMonth }) => {
  const insights = [];

  if (!summary || summary.transactionCount === 0) {
    return ['No transactions yet — add some income or expenses to see insights.'];
  }

  // Overall balance insight
  if (summary.balance > 0) {
    insights.push(
      `You're in the green overall: total income exceeds expenses by $${summary.balance.toFixed(2)}.`
    );
  } else if (summary.balance < 0) {
    insights.push(
      `You're spending more than you earn overall, by $${Math.abs(summary.balance).toFixed(2)}.`
    );
  } else {
    insights.push('Your total income and expenses are perfectly balanced.');
  }

  // Top spending category
  if (categoryBreakdown && categoryBreakdown.length > 0) {
    const top = categoryBreakdown[0];
    const pctOfExpense =
      summary.totalExpense > 0 ? ((top.total / summary.totalExpense) * 100).toFixed(1) : 0;
    insights.push(
      `Your biggest expense category is "${top.category}" at $${top.total.toFixed(2)} (${pctOfExpense}% of total spending).`
    );
  }

  // Month-over-month trend
  if (latestMonth && latestMonth.expenseChangePct !== null) {
    const direction = latestMonth.expenseChangePct >= 0 ? 'up' : 'down';
    insights.push(
      `Spending in ${latestMonth.month} is ${direction} ${Math.abs(latestMonth.expenseChangePct)}% compared to ${latestMonth.previousMonth}.`
    );
  }

  return insights;
};

module.exports = { generateInsights };
