function validatePrice(price) {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(price);
}

function validateNumericString(str) {
    const regex = /^\d+$/;
    return regex.test(str);
}

function validateNonEmptyString(str) {
    return str.trim().length > 0;
}

export const validationUtils = {
    validatePrice,
    validateNumericString,
    validateNonEmptyString,
};