import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../../client';

export default{
    Mutation: {
        login: async (_, {username, password}) => {
            const user = await client.user.findUnique({where: {username}})
            if(!user){
                return {
                    ok: false,
                    error: "username not found."
                }
            }
            const passwordOk = await bcrypt.compare(password, user.password);
            if(!passwordOk) {
                return {
                    ok: false,
                    error: 'Wrong Password.'
                }
            }
            const token = await jwt.sign({id: user.id}, process.env.PRIVATE_KEY);
            return {
                ok: true,
                token,
            }
        },
    }
}