const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const {
  connectDB,
  eraseDB
} = require('../src/db')
const { START_WORK, STOP_WORK } = require('../src/utils/commandTypes');

const { SECRET } = process.env

let db;

beforeAll(async () => {
  db = await connectDB();
});

afterEach(async () => {
  await eraseDB(db);
});

describe('Command Work Integration Test', () => {
  let vehicleId;
  let ownerID = "61411790de1c603fc8596ea9"

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
  });

  it('Creates command to start vehicle', async () => {
    const command = {
      vehicleId,
      type: START_WORK
    }
    await request(app).post('/command/create').send(command)
      .set('authorization', `JWT ${token}`);
    const res = await request(app).get(`/works/${vehicleId}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('Creates command to stop vehicle', async () => {
    const command = {
      vehicleId,
      type: STOP_WORK
    }
    await request(app).get(`/work/create/${vehicleId}`);
    await request(app).post('/command/create').send(command);
    const res = await request(app).get(`/works/${vehicleId}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });

});
