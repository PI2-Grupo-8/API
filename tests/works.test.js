const request = require('supertest');
const app = require('../src/app');
const {
  connectDB,
  eraseDB
} = require('../src/db')

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

  beforeEach(async () => {
    const res = await request(app).post('/vehicle/create').send(vehicle);
    vehicleId = res.body._id;

    await request(app).get(`/work/create/${vehicleId}`);
    const res2 = await request(app).get(`/work/finish/${vehicleId}`);
    finishedWork = res2.body;

    const res3 = await request(app).get(`/work/create/${vehicleId}`);
    openedWork = res3.body;

  });

  it('Creates new work', async () => {
    const res = await request(app).get(`/work/create/${otherVehicleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.vehicleId).toBe(otherVehicleId);
  });

  it('Gives error on creating new work with invalid vehicle', async () => {
    const res = await request(app).get('/work/create/123');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Could not create work');
  });

  it('Gives error on creating new work with working vehicle', async () => {
    const res = await request(app).get(`/work/create/${vehicleId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Could not create work');
  });

  it('Finish work', async () => {
    const res = await request(app).get(`/work/finish/${vehicleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.vehicleId).toBe(vehicleId);
  });

  it('Gives error on finishing new work with invalid vehicle', async () => {
    const res = await request(app).get('/work/finish/123');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Could not finish work');
  });

  it('Lists vehicles current works', async () => {
    const res = await request(app).get(`/works/${vehicleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual(expect.arrayContaining([openedWork]));
  });

  it('Lists vehicles finished works', async () => {
    const res = await request(app).get(`/works/${vehicleId}?status=finished`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual(expect.arrayContaining([finishedWork]));
  });

  it('Lists vehicles works', async () => {
    const res = await request(app).get(`/works/${vehicleId}?status=all`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual(expect.arrayContaining([openedWork, finishedWork]));
  });
});
