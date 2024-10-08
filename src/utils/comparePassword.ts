import bcrypt from "bcrypt";

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
}

export default comparePassword;
