import Club from '../database/models/Club';

const getAll = async () => {
  const clubs = await Club.findAll();
  return { status: 200, data: clubs };
};

const getById = async (id: string) => {
  const club = await Club.findByPk(id);
  return { status: 200, data: club };
};

export default { 
  getAll, 
  getById,
};
