import Clubs from '../database/models/Club';

const getAll = async () => {
  const clubsData = await Clubs.findAll();
  return { status: 200, data: clubsData };
};

const getById = async (id: string) => {
  const club = await Clubs.findByPk(id);
  return { status: 200, data: club };
};

export default { getAll, getById };
