import UserDao from "../daos/manager/dbMongo/users.mongo.js";

const userDao = new UserDao();

function DTO (user) {
    const {password, ...rest} = user;

    // console.log(`usuario DTO: ${rest._doc}`)
    return rest._doc;
}

class UserRepository {

    async createUser (data) {
        try {
            const user = await userDao.crateUser(data);
            const usuario = DTO(user);
            return usuario;
        } catch (error) {
            console.log ("(REPOSITORY) Error al crear Usuario");
            return false;
        }
    }

    async getUserById (id) {
        try {
            const user = await userDao.getUserById(id);
            const usuario = DTO(user);
            return usuario;
        } catch (error) {
            console.log ("(REPOSITORY) Error al buscar Usuario");
            return false;
        }
    }

    async getUserByEmail (mail) {
        try {
            const user = await userDao.getUserByEmail(mail);
            const usuario = DTO(user);
            return usuario;
        } catch (error) {
            console.log ("(REPOSITORY) Error al buscar Usuario");
            return false;
        }
    }

}

export default UserRepository;