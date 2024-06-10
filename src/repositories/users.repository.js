import UserDao from "../daos/dbManager/users.dao.js";

const userDao = new UserDao();

class UserRepository {

    async createUser (data) {
        try {
            const user = await userDao.crateUser(data);
            return user;
        } catch (error) {
            console.log ("(REPOSITORY) Error al crear Usuario");
            return false;
        }
    }

    async getUserByEmail (mail) {
        try {
            const user = await userDao.getUserByEmail(mail);
            return user;
        } catch (error) {
            console.log ("(REPOSITORY) Error al buscar Usuario");
            return false;
        }
    }

}

export default UserRepository;