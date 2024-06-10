import UserModel from "../../models/user.model.js";

class UserDao {

    async crateUser (data) {
        try {
            const user = await UserModel.create(data);
            return user;
        } catch (error) {
            throw new Error ("(DAO) Error al crear Usuario");
        }
    }

    async getUserByEmail(mail) {
        try {
            const user = await UserModel.findOne(mail);
            return user;
        } catch (error) {
            throw new Error ("(DAO) Error al buscar Usuario");
        }
    }
}

export default UserDao;