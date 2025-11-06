import userDAO from "../DAO/userDAO";

const userBUS = {
  async getUserById(id: string) {
    try {
        return await userDAO.getUserById(id)
    } catch (error) {
        throw error
    }
  },

  async addUser(email: string, id: string) {
    try {
        return await userDAO.addUser(email, id)
    } catch (error) {
      throw error;
    }
  },
};

export default userBUS
