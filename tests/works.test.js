const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const {
  connectDB,
  eraseDB
} = require('../src/db')

const { SECRET } = process.env

let db;

beforeAll(async () => {
  db = await connectDB();
});

afterEach(async () => {
  await eraseDB(db);
});

describe('Works Test', () => {
  let otherVehicleId = '6160c3ea2b5391cb514db02d';
  let vehicleId;
  let ownerID = "61411790de1c603fc8596ea9"
  let finishedWork;
  let openedWork;

  let vehicle = {
    owner: ownerID,
    code: "JKR3",
    name: "Veiculo da Horta",
    description: "Veiculo para a fertilização da horta",
    fertilizer: "Fertilizante de morangos",
    fertilizerAmount: 3
  }

  const token = jwt.sign({
    _id: '6170e1900c5f53f7116322b0',
    name: 'user',
    email: 'user@email.com',
    password: '123'
  }, SECRET, {
    expiresIn: 240,
  });

  beforeEach(async () => {
    const res = await request(app).post('/vehicle/create').send(vehicle)
      .set('authorization', `JWT ${token}`);
    vehicleId = res.body._id;

    await request(app).get(`/work/create/${vehicleId}`)
      .set('authorization', `JWT ${token}`);
    const res2 = await request(app).get(`/work/finish/${vehicleId}`)
      .set('authorization', `JWT ${token}`);
    finishedWork = res2.body;

    const res3 = await request(app).get(`/work/create/${vehicleId}`)
      .set('authorization', `JWT ${token}`);
    openedWork = res3.body;

  });

  it('Creates new work', async () => {
    const res = await request(app).get(`/work/create/${otherVehicleId}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicleId).toBe(otherVehicleId);
  });

  it('Gives error on creating new work with invalid vehicle', async () => {
    const res = await request(app).get('/work/create/123')
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Could not create work');
  });

  it('Gives error on creating new work with working vehicle', async () => {
    const res = await request(app).get(`/work/create/${vehicleId}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Could not create work');
  });

  it('Finish work', async () => {
    const res = await request(app).get(`/work/finish/${vehicleId}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicleId).toBe(vehicleId);
  });

  it('Gives error on finishing new work with invalid vehicle', async () => {
    const res = await request(app).get('/work/finish/123')
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Could not finish work');
  });

  it('Lists vehicles current works', async () => {
    const res = await request(app).get(`/works/${vehicleId}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual(expect.arrayContaining([openedWork]));
  });

  it('Lists vehicles finished works', async () => {
    const res = await request(app).get(`/works/${vehicleId}?status=finished`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual(expect.arrayContaining([finishedWork]));
  });

  it('Lists vehicles works', async () => {
    const res = await request(app).get(`/works/${vehicleId}?status=all`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual(expect.arrayContaining([openedWork, finishedWork]));
  });
});
