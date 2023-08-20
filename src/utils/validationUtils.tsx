export const validateInput = (value: string, fieldName: string) => {
    let error;
    if (!value) {
        error = `${fieldName} is required`;
    } else if (!/^[A-Za-z]+$/.test(value)) {
        error = `Only letters are allowed for ${fieldName}`;
    } else if (value.length < 3 || value.length > 20) {
        error = `${fieldName} must be between 3 and 20 characters`;
    }
    return error;
};

export const validatePhoneNumber = (value: any, fieldName: string) => {
    let error;
    if (!value) {
        error = `${fieldName} is required`;
    } else if (!/^[0-9]+$/.test(value)) {
        error = `Only numbers are allowed for ${fieldName}`;
    } else if (value.length < 7 || value.length > 20) {
        error = `${fieldName} must be between 7 and 20 digits`;
    }
    return error;
};