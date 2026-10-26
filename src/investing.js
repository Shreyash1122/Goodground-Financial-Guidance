import "./site.js";

const form = document.getElementById("invest-form");
const results = document.getElementById("invest-results");
const money = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const rupees = (amount) => `₹${money.format(Math.round(amount))}`;

document.getElementById("edit-inputs").addEventListener("click", () => {
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("salary").focus({ preventScroll: true });
});

function addLearningCard(kicker, title, description, href, linkText) {
  const card = document.createElement("article");
  card.className = "learning-card";
  const label = document.createElement("span");
  label.className = "learning-kicker";
  label.textContent = kicker;
  const heading = document.createElement("h3");
  heading.textContent = title;
  const paragraph = document.createElement("p");
  paragraph.textContent = description;
  card.append(label, heading, paragraph);
  if (href) {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = `${linkText} ↗`;
    card.append(link);
  }
  document.getElementById("learning-path").append(card);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const salary = Number(document.getElementById("salary").value);
  const essentials = Number(document.getElementById("essentials").value);
  const repayments = Number(document.getElementById("debt-payments").value);
  const otherSpending = Number(document.getElementById("other-spending").value);
  const emergencySavings = Number(document.getElementById("emergency-savings").value);
  const targetMonths = Number(document.getElementById("buffer-months").value);
  const horizon = document.getElementById("time-horizon").value;
  const risk = document.getElementById("risk-comfort").value;
  const highInterestDebt = document.getElementById("high-interest-debt").value === "yes";
  const monthlyBalance = salary - essentials - repayments - otherSpending;
  const coreCosts = essentials + repayments;
  const bufferTarget = coreCosts * targetMonths;
  const bufferGap = Math.max(0, bufferTarget - emergencySavings);
  const coverage = coreCosts > 0 ? emergencySavings / coreCosts : null;

  document.getElementById("monthly-balance").textContent = `${monthlyBalance < 0 ? "−" : ""}${rupees(Math.abs(monthlyBalance))}`;
  document.getElementById("coverage-months").textContent = coverage === null ? "Not available" : `${coverage.toFixed(1)} months`;
  document.getElementById("buffer-gap").textContent = coverage === null
    ? "Add essential costs and loan minimums to estimate coverage"
    : `${rupees(emergencySavings)} accessible savings ÷ monthly core costs`;
  document.getElementById("buffer-target").textContent = rupees(bufferTarget);
  document.getElementById("buffer-status").textContent = bufferGap > 0
    ? `Example gap: ${rupees(bufferGap)}`
    : "Your selected example target is met";

  const intro = document.getElementById("result-intro");
  if (monthlyBalance < 0) {
    intro.textContent = "The costs entered are higher than the take-home income. Consider reviewing your monthly plan before exploring market risk.";
  } else if (highInterestDebt) {
    intro.textContent = "You entered high-interest debt. Learning about repayment terms may be a useful first step before taking on investment volatility.";
  } else if (bufferGap > 0) {
    intro.textContent = "Your selected emergency-buffer example is not yet met. Consider how accessible savings fit into your plan before taking market risk.";
  } else if (monthlyBalance === 0) {
    intro.textContent = "Your listed monthly costs use the income entered. Check whether irregular costs or other goals need room before considering investments.";
  } else {
    intro.textContent = `The costs entered leave a monthly balance of ${rupees(monthlyBalance)}. This is not an investment amount; account for irregular costs and other goals first.`;
  }

  const path = document.getElementById("learning-path");
  path.replaceChildren();
  if (monthlyBalance < 0) {
    addLearningCard("FIRST THINGS FIRST", "Review the monthly picture", "Your listed spending is above take-home income. Check for missing income or costs and consider speaking with a trusted, qualified professional before taking market risk.", "https://investor.sebi.gov.in/moneymatters-inc-exp.html", "SEBI budgeting guide");
  } else if (monthlyBalance === 0) {
    addLearningCard("FIRST THINGS FIRST", "Make space in the month", "The current numbers leave no unallocated balance. A budget review can help you decide whether anything has been missed or needs a different priority.", "https://investor.sebi.gov.in/moneymatters-inc-exp.html", "SEBI budgeting guide");
  }

  if (highInterestDebt) {
    addLearningCard("DEBT CHECK", "Understand repayment choices", "Compare the debt rate, fees, minimum payments and any early-repayment terms. This tool cannot determine which repayment choice is best for you; avoid borrowing to invest.", "https://investor.sebi.gov.in/moneymatters-inc-exp.html", "SEBI money basics");
  }
  if (bufferGap > 0) {
    addLearningCard("CASH BUFFER", "Learn about accessible emergency savings", `The example target you chose is ${rupees(bufferTarget)}. Your entries show a gap of ${rupees(bufferGap)}. RBI educational material uses three months of living expenses as a general reference and notes that less-secure income may call for more; choose a target that fits your household.`, "https://www.rbi.org.in/FinancialEducation/content/I%20Can%20Do_RBI.pdf", "RBI emergency fund guide");
  }

  if (horizon === "short") {
    addLearningCard("GOAL UNDER 3 YEARS", "Prioritize access and stability in your research", "For money needed soon, learn how accessible savings and bank deposit options work, including rates, terms and early-withdrawal rules. Market-linked values can fall just when you need the money.", "https://investor.sebi.gov.in/investment-thingsbeforeinv.html", "SEBI investing basics");
  } else if (horizon === "medium") {
    addLearningCard("GOAL IN 3–7 YEARS", "Compare time horizon, liquidity and risk", "Learn how deposits and different debt or hybrid mutual-fund categories work. Compare lock-ins, interest-rate risk, credit risk, liquidity and fees; none of these inputs identifies a suitable product or allocation.", "https://www.amfiindia.com/investor/knowledge-center-info?zoneName=riskInMutualFunds", "AMFI mutual-fund risks");
  } else if (risk === "low") {
    addLearningCard("LONGER-TERM GOAL · LOWER SWING COMFORT", "Explore diversified lower-volatility categories", "Learn about deposits and diversified fixed-income or hybrid fund categories, including how inflation, interest-rate changes, credit quality, liquidity and fees can affect them. A lower swing preference does not mean an option is risk-free.", "https://investor.sebi.gov.in/investment-thingsbeforeinv.html", "SEBI factors to consider");
  } else {
    addLearningCard("LONGER-TERM GOAL · MARKET RISK", "Learn how diversified equity funds work", "Broad index mutual funds and other diversified equity-fund categories can spread exposure across many companies, but their value can fall and principal can be lost. Compare diversification, costs, risk labels and how long you can stay invested.", "https://www.amfiindia.com/investor/knowledge-center-info?zoneName=riskInMutualFunds", "AMFI mutual-fund risks");
  }

  if (risk === "high") {
    addLearningCard("RISK CHECK", "Understand the downside before seeking growth", "A higher comfort with fluctuations does not establish your ability to absorb a loss. Consider dependents, job stability, upcoming goals and how you might react to a sustained fall before choosing any market-linked investment.", "https://investor.sebi.gov.in/investment-thingsbeforeinv.html", "SEBI risk and goals guide");
  }

  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
});

