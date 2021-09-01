const request = require('supertest');
const app = require('../src/index');
const {
  connectTestDB,
  removeAllCollections
} = require('./dbTestEnv')

beforeAll(async () => {
  db = await connectTestDB();
});

afterEach(async () => {
  await removeAllCollections(db);
});

describe('Vehicles Tests', () => {
  let vehicleID;
  let createdVehicle;

  let vehicle = {
    owner: "Maria",
    code: "1234",
    name: "Trator da Horta",
    description: "Trator para a fertilização da horta"
  }

  beforeEach(async () => {
    const res = await request(app).post('/vehicle/create').send(vehicle);
    vehicleID = res.body._id;
    createdVehicle = res.body
  })

  it('Creates a vehicle', async () => {
    const res = await request(app).post('/vehicle/create').send(vehicle);

    expect(res.statusCode).toBe(200);
    expect(res.body.owner).toBe(vehicle.owner);
    expect(res.body.code).toBe(vehicle.code);
    expect(res.body.name).toBe(vehicle.name);
    expect(res.body.description).toBe(vehicle.description);
  });

  it('Finds a vehicle by ID', async () => {
    const res = await request(app).get(`/vehicle/${vehicleID}`)

    expect(res.statusCode).toBe(200);
    expect(res.body.owner).toBe(vehicle.owner);
    expect(res.body.code).toBe(vehicle.code);
    expect(res.body.name).toBe(vehicle.name);
    expect(res.body.description).toBe(vehicle.description);
  });

  it('Receives error on finding vehicle', async () => {
    const res = await request(app).get('/vehicle/123')

    expect(res.statusCode).toBe(400);
  });

  it('Gets vehicles list', async () => {
    const res = await request(app).get('/vehicles/')

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([createdVehicle]));
  });

  it('Updates a vehicle', async () => {
    let updateVehicle = {
      owner: "João",
      code: "4321",
      name: "Trator da Fazenda",
      description: "Trator para a fertilização de morangos"
    }
    const res = await request(app).put(`/vehicle/update/${vehicleID}`).send(updateVehicle);

    expect(res.statusCode).toBe(200);
    expect(res.body.owner).toBe(updateVehicle.owner);
    expect(res.body.code).toBe(updateVehicle.code);
    expect(res.body.name).toBe(updateVehicle.name);
    expect(res.body.description).toBe(updateVehicle.description);
  });

  it('Receives error on updating vehicle', async () => {
    const res = await request(app).put('/vehicle/update/123').send(vehicle)

    expect(res.statusCode).toBe(400);
  });

  it('Deletes vehicle', async () => {
    const res = await request(app).delete(`/vehicle/delete/${vehicleID}`)

    expect(res.statusCode).toBe(200);
  });

  it('Receives error on deleting vehicle', async () => {
    const res = await request(app).delete('/vehicle/delete/123')

    expect(res.statusCode).toBe(400);
  });

});



