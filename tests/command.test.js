const request = require('supertest');
const app = require('../src/app');
const { COMMAND_TYPES } = require('../src/utils/commandTypes');
const {
  connectDB,
  eraseDB
} = require('../src/db');

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

  beforeEach(async () => {
    const res = await request(app).post('/command/create').send(command);
    commandId = res.body._id;
    createdCommand = res.body;
  })

  it('Creates a command', async () => {
    let command2 = {
      vehicleId: "61411790de1c603fc8596ea9",
      type: COMMAND_TYPES[0]
    }
    const res = await request(app).post('/command/create').send(command2);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicleId).toBe(command2.vehicleId);
    expect(res.body.type).toBe(command2.type);
  });

  it('Gives error on creating a command', async () => {
    let command3 = {
      vehicleId: "123",
      type: '123'
    }
    const res = await request(app).post('/command/create').send(command3);

    expect(res.statusCode).toBe(400);
  });

  it('Finds commands by vehicle ID', async () => {
    const res = await request(app).get(`/command/${command.vehicleId}`)

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([createdCommand]));
  });

  it('Gets commands list', async () => {
    const res = await request(app).get('/commands/')

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([createdCommand]));
  });

});