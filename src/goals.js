const money = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const formatRupees = (amount) => `₹${money.format(amount)}`;

for (const form of document.querySelectorAll("[data-goal-savings]")) {
  const targetInput = form.elements.namedItem("target");
  const savedInput = form.elements.namedItem("saved");
  const monthsInput = form.elements.namedItem("months");
  const monthlyOutput = form.querySelector("[data-monthly]");
  const remainingOutput = form.querySelector("[data-remaining]");

  function updateGoal() {
    const target = Math.max(0, Number(targetInput.value) || 0);
    const saved = Math.max(0, Number(savedInput.value) || 0);
    const months = Math.max(1, Number(monthsInput.value) || 1);
    const remaining = Math.max(0, target - saved);
    const monthly = Math.ceil(remaining / months);
    monthlyOutput.textContent = formatRupees(monthly);
    remainingOutput.textContent = remaining === 0
      ? "Your entered savings already meet this target."
      : `${formatRupees(remaining)} remaining across ${months} ${months === 1 ? "month" : "months"}`;
  }

  form.addEventListener("input", updateGoal);
  form.addEventListener("change", () => {
    targetInput.value = Math.max(1, Number(targetInput.value) || 1);
    savedInput.value = Math.max(0, Number(savedInput.value) || 0);
    monthsInput.value = Math.min(600, Math.max(1, Number(monthsInput.value) || 1));
    updateGoal();
  });
  form.addEventListener("submit", (event) => event.preventDefault());
  updateGoal();
}
