const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const validPhPhoneNumberWithPlusPrefix = /^(\+63|0)(\d{2}|\d{3})[-.\s]?(\d{3}[-.\s]?\d{4})$/;
const validPhPhoneNumberWithoutPlusPrefix = /^(\+63|0)(\d{2}|\d{3})[-.\s]?(\d{3}[-.\s]?\d{4})$/;

export function isNameValid(name) {
    return name.length >= 3;
}

export function isEmailValid(email) {
    return validEmailRegex.test(email);
}

export function isPhoneNumberPhilippineValid(phoneNumber) {
    if (phoneNumber[0] == "+") {
        if (phoneNumber.length < 13) {
            return false;
        }

        return validPhPhoneNumberWithPlusPrefix.test(phoneNumber);
    } else {
        if (phoneNumber.length < 11) {
            return false;
        }

        return validPhPhoneNumberWithoutPlusPrefix.test(phoneNumber);
    }
}

export function getParsedStoredItemInSessionStorage(key) {
    const storedItem = sessionStorage.getItem(key);

    if (!storedItem) {
        return undefined;
    }

    return JSON.parse(storedItem);
}

export function setItemInSessionStorage(key, item) {
    sessionStorage.setItem(key, JSON.stringify(item));
}

export function hideElementAndRemoveItsText(element) {
    if (element) {
        element.textContent = "";
        element.style.display = "none";
    }
}

export function showElementAndAddText(element, text) {
    if (element) {
        element.textContent = text;
        element.style.display = "initial";
    }
}

export function upperCaseFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1, word.length);
}

export function normalizeHyphenedWord(word) {
    return upperCaseFirstLetter(word.replace(/-/g, " "));
}


export function setSubmitBtnToBeSteps() {
    const nextBtn = document.getElementById("submit-btn");

    nextBtn.classList.remove("bg-primary-purplish-blue");
    nextBtn.classList.add("bg-primary-marine-blue");
    nextBtn.textContent = "Next Step";
    nextBtn.setAttribute("type", "button");
}

export function setSubmitBtnToSubmit() {
    const nextBtn = document.getElementById("submit-btn");

    nextBtn.classList.remove("bg-primary-marine-blue");
    nextBtn.classList.add("bg-primary-purplish-blue");
    nextBtn.textContent = "Confirm";
    nextBtn.setAttribute("type", "submit");
}
