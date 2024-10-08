import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

export default hashPassword;
