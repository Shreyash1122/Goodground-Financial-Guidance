const money = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const byId = (id) => document.getElementById(id);

// This quick budget snapshot is calculated entirely in the visitor's browser.
const budgetInputs = ["income", "essentials", "loans", "savings"].map(byId);
const leftoverEl = byId("leftover");
const statusEl = byId("status");
const messageEl = byId("result-message");

function updateBudget() {
  const [income, essentials, loans, savings] = budgetInputs.map((input) => {
    const value = Number(input.value);
    return Number.isFinite(value) && value > 0 ? value : 0;
  });
  const leftover = income - essentials - loans - savings;
  leftoverEl.textContent = `${leftover < 0 ? "−" : ""}${money.format(Math.abs(leftover))}`;
  if (income === 0) {
    statusEl.textContent = "Add your monthly income";
    messageEl.textContent = "Enter a take-home amount to see how your month is shaping up.";
  } else if (leftover < 0) {
    statusEl.textContent = "Your month feels stretched";
    messageEl.textContent = "Your planned outgoings are above your income. Review the numbers and consider talking with a trusted financial professional.";
  } else if (leftover === 0) {
    statusEl.textContent = "Every rupee has a place";
    messageEl.textContent = "Your income is fully allocated. Even a small buffer can bring a little more breathing room.";
  } else {
    statusEl.textContent = "A good place to grow from";
    messageEl.textContent = "You have some breathing room. Let’s give it a purpose that matters to you.";
  }
}

budgetInputs.forEach((input) => input.addEventListener("input", updateBudget));
updateBudget();

const monthlySlider = byId("monthly-invest");
const yearsSlider = byId("years");
const monthlyLabel = byId("monthly-label");
const yearsLabel = byId("years-label");
const futureValue = byId("future-value");
const contributed = byId("contributed");

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
  monthlyLabel.textContent = `₹${money.format(monthly)}`;
  yearsLabel.textContent = `${years} ${years === 1 ? "year" : "years"}`;
  futureValue.textContent = shortRupees(estimate);
  contributed.textContent = `You put in ${shortRupees(monthly * months)} over ${years} ${years === 1 ? "year" : "years"}`;
}

monthlySlider.addEventListener("input", updateProjection);
yearsSlider.addEventListener("input", updateProjection);
updateProjection();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}));

// Keep form fields from accepting negative amounts while allowing temporary empty input.
budgetInputs.forEach((input) => input.addEventListener("change", () => {
  if (input.value !== "" && Number(input.value) < 0) input.value = "0";
  updateBudget();
}));

