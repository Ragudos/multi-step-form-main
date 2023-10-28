import { getParsedStoredItemInSessionStorage } from "./utils.js";

export function loadSavedPersonalInfoData() {
    const storedData = getParsedStoredItemInSessionStorage("formData");

    if (!storedData || !storedData.data["personal-info"]) {
        return;
    }

    const personalInfo = storedData.data["personal-info"];
    const usernameInput = document.getElementById("name-input");
    const emailInput = document.getElementById("email-input");
    const phoneInput = document.getElementById("phone-number-input");

    usernameInput.value = personalInfo.username ?? "";
    emailInput.value = personalInfo.email ?? "";
    phoneInput.value = personalInfo["phone-number"] ?? "";
}

export function getPersonalInfo() {
    const personalInfoInputs = document.querySelectorAll("#personal-info input");
    const data = {};

    for (const input of personalInfoInputs) {
        const name = input.getAttribute("name");

        data[name] = input.value;
    }

    return data;
}
