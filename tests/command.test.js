const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const { COMMAND_TYPES } = require('../src/utils/commandTypes');
const {
  connectDB,
  eraseDB
} = require('../src/db');

const { SECRET } = process.env

let db;

beforeAll(async () => {
  db = await connectDB();
});

afterEach(async () => {
  await eraseDB(db);
});

describe('Command Tests', () => {
  let commandId;
  let createdCommand;

  let command = {
    vehicleId: "614cb73edca0485ebae091da",
    type: COMMAND_TYPES[0]
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
    const res = await request(app).post('/command/create').send(command)
      .set('authorization', `JWT ${token}`);
    commandId = res.body._id;
    createdCommand = res.body;
  })

  it('Creates a command', async () => {
    let command2 = {
      vehicleId: "61411790de1c603fc8596ea9",
      type: COMMAND_TYPES[0]
    }
    const res = await request(app).post('/command/create').send(command2)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicleId).toBe(command2.vehicleId);
    expect(res.body.type).toBe(command2.type);
  });

  it('Gives error on creating a command', async () => {
    let command3 = {
      vehicleId: "123",
      type: '123'
    }
    const res = await request(app).post('/command/create').send(command3)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(400);
  });

  it('Finds commands by vehicle ID', async () => {
    const res = await request(app).get(`/command/${command.vehicleId}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([createdCommand]));
  });

  it('Gets commands list', async () => {
    const res = await request(app).get('/commands/')
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([createdCommand]));
  });

});