import "./site.js";

const money = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const byId = (id) => document.getElementById(id);
const inputs = ["income", "essentials", "loans", "savings"].map(byId);

function updateBudget() {
  const [income, essentials, loans, savings] = inputs.map((input) => {
    const value = Number(input.value);
    return Number.isFinite(value) && value > 0 ? value : 0;
  });
  const outgoing = essentials + loans + savings;
  const balance = income - outgoing;
  byId("income-total").textContent = `₹${money.format(income)}`;
  byId("outgoing-total").textContent = `₹${money.format(outgoing)}`;
  byId("savings-total").textContent = `₹${money.format(savings)}`;
  byId("balance").textContent = `${balance < 0 ? "−" : ""}₹${money.format(Math.abs(balance))}`;

  const message = byId("budget-message");
  if (income === 0) message.textContent = "Add your monthly income to see how your month is shaping up.";
  else if (balance < 0) message.textContent = "Your planned outgoings are above your income. Review the numbers and consider speaking with a trusted professional.";
  else if (balance === 0) message.textContent = "Your income is fully allocated. Even a small buffer may bring more breathing room.";
  else message.textContent = "You have some breathing room. Consider which family goal matters most right now.";
}

inputs.forEach((input) => {
  input.addEventListener("input", updateBudget);
  input.addEventListener("change", () => {
    if (input.value !== "" && Number(input.value) < 0) input.value = "0";
    updateBudget();
  });
});
updateBudget();

const monthlySlider = byId("monthly-invest");
const yearsSlider = byId("years");
function shortRupees(value) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${money.format(value)}`;
}
function updateProjection() {
  const monthly = Number(monthlySlider.value);
  const years = Number(yearsSlider.value);
  const months = years * 12;
  const monthlyRate = Math.pow(1 + 0.08, 1 / 12) - 1;
  const estimate = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  byId("monthly-label").textContent = `₹${money.format(monthly)}`;
  byId("years-label").textContent = `${years} ${years === 1 ? "year" : "years"}`;
  byId("future-value").textContent = shortRupees(estimate);
  byId("contributed").textContent = `You put in ${shortRupees(monthly * months)} over ${years} ${years === 1 ? "year" : "years"}`;
}
monthlySlider.addEventListener("input", updateProjection);
yearsSlider.addEventListener("input", updateProjection);
updateProjection();

