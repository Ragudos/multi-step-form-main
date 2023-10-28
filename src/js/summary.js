import { getParsedStoredItemInSessionStorage, normalizeHyphenedWord, setItemInSessionStorage, setSubmitBtnToBeSteps, upperCaseFirstLetter } from "./utils.js";
import { priceTagsInDollars } from "./consts.js";

const changeBtn = document.getElementById("change-plan-btn");

function goToPlanPage() {
    const storedData = getParsedStoredItemInSessionStorage("formData");

    storedData.currentStep = 2;

    const activeSection = document.querySelector("#subscription-form > section[aria-hidden='false']");
    const planSection = document.getElementById("plan");
    const activeList = document.querySelector("#current-step-indicator-list [aria-current='step']");
    const planStep = document.querySelector("#current-step-indicator-list [data-step='plan']");

    activeList.removeAttribute("aria-current");
    activeSection.setAttribute("aria-hidden", "true");
    planSection.setAttribute("aria-hidden", "false");
    planStep.setAttribute("aria-current", "step");

    setSubmitBtnToBeSteps();

    setItemInSessionStorage("formData", storedData);
}

changeBtn.addEventListener("click",  goToPlanPage);

function appendChosenAddOnsToContainer(addOns, planType) {
    const chosenAddOnsContainer = document.querySelector("#summary #chosen-add-ons");
    let sum = 0;

    chosenAddOnsContainer.innerHTML = "";

    for (const addOn in addOns) {
        if (!addOns[addOn]) {
            continue;
        }

        const price = priceTagsInDollars["add-ons"][addOn][planType];
        const normalizedWord = normalizeHyphenedWord(addOn);
        const shortenedPlanType = planType == "monthly" ? "mo" : "yr";
        const div = document.createElement("div");
        const addOnName = document.createElement("div");
        const priceTag = document.createElement("div");

        sum += price;

        div.classList.add("flex", "justify-between", "flex-wrap");

        addOnName.classList.add("text-neutral-cool-gray", "small");
        addOnName.textContent = normalizedWord;

        priceTag.setAttribute("aria-label", `The ${planType} price of ${normalizedWord} add-on`);
        priceTag.textContent = `+\$${price}/${shortenedPlanType}`;
        priceTag.classList.add("text-primary-marine-blue", "medium");
        
        div.append(addOnName);
        div.append(priceTag);

        chosenAddOnsContainer.append(div);
    }

    if (sum == 0) {
        chosenAddOnsContainer.innerHTML = "<small>No chosen add-on</small>";
    }

    return sum;
}

export function showSummary() {
    const storedData = getParsedStoredItemInSessionStorage("formData");
    const chosenPlanContainer = document.querySelector("#summary #chosen-plan");
    const chosenPlanCostContainer = document.querySelector("#summary #chosen-plan-cost");
    const totalContainer = document.querySelector("#summary #total-cost");
    const planType = storedData.data.plan.type;
    const tier = storedData.data.plan.tier;
    const priceOfPlan = priceTagsInDollars.plan[tier][planType];
    const shortenedPlanType = planType == "monthly" ? "mo" : "yr";

    const sum = appendChosenAddOnsToContainer(storedData.data["add-ons"], planType);

    totalContainer.innerHTML = `
        <div class="text-neutral-cool-gray">
            Total &#40;per ${planType.slice(0, planType.length - 2)}&#41;
        </div>
        <div aria-label="Total cost" class="text-primary-purplish-blue bold">
            +\$${sum + priceOfPlan}/${shortenedPlanType}
        </div>
    `;

    chosenPlanCostContainer.textContent = `\$${priceOfPlan}/${shortenedPlanType}`;
    chosenPlanContainer.textContent = `${upperCaseFirstLetter(tier)} (${upperCaseFirstLetter(planType)})`;
}
