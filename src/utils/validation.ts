interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateName = (name: string): ValidationResult => {
    const trimmedName = name.trim();

    if (trimmedName.length < 4) {
        return { isValid: false, error: "O nome deve ter pelo menos 4 caracteres." };
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (!nameRegex.test(trimmedName)) {
        return { isValid: false, error: "O nome deve conter apenas letras." };
    }

    return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: "E-mail inválido." };
    }

    return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
    if (password.length < 8) {
        return { isValid: false, error: "A senha deve ter pelo menos 8 caracteres." };
    }
    
    const hasLetterRegex = /[A-Za-z]/;
    const hasNumberRegex = /[0-9]/;

    if (!hasLetterRegex.test(password)) {
        return { isValid: false, error: "A senha deve conter pelo menos uma letra." };
    }

    if (!hasNumberRegex.test(password)) {
        return { isValid: false, error: "A senha deve conter pelo menos um número." };
    }

    return { isValid: true };
};

export const validateTitle = (title: string): ValidationResult => {
    const trimmedTitle = title.trim();
    
    if (trimmedTitle.length === 0) {
        return { isValid: false, error: "O título não pode ser vazio." };
    }

    return { isValid: true };
};
