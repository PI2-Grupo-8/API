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

describe('Vehicles Tests', () => {
  let vehicleID;
  let createdVehicle;
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

    vehicleID = res.body._id;
    createdVehicle = res.body
  })

  it('Creates a vehicle', async () => {
    let vehicle = {
      owner: "61411b17b45f264f37ca89e3",
      code: "ABC1",
      name: "Novo Veiculo",
      description: "veiculo da horta de morangos",
      fertilizer: "Fertilizante",
      fertilizerAmount: 1
    }
    const res = await request(app).post('/vehicle/create').send(vehicle)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.owner).toBe(vehicle.owner);
    expect(res.body.code).toBe(vehicle.code);
    expect(res.body.name).toBe(vehicle.name);
    expect(res.body.description).toBe(vehicle.description);
    expect(res.body.fertilizer).toBe(vehicle.fertilizer);
    expect(res.body.fertilizerAmount).toBe(vehicle.fertilizerAmount);
  });

  it('Finds a vehicle by ID', async () => {
    const res = await request(app).get(`/vehicle/${vehicleID}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.owner).toBe(vehicle.owner);
    expect(res.body.code).toBe(vehicle.code);
    expect(res.body.name).toBe(vehicle.name);
    expect(res.body.description).toBe(vehicle.description);
    expect(res.body.fertilizer).toBe(vehicle.fertilizer);
    expect(res.body.fertilizerAmount).toBe(vehicle.fertilizerAmount);
  });

  it('Receives error on finding vehicle', async () => {
    const res = await request(app).get('/vehicle/123')
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(400);
  });

  it('Gets vehicles list', async () => {
    const res = await request(app).get('/vehicles/')
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([createdVehicle]));
  });

  it('Gets vehicles list by owner', async () => {
    const res = await request(app).get(`/vehicles/owner/${ownerID}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([createdVehicle]));
  });

  it('Updates a vehicle', async () => {
    let updateVehicle = {
      owner: "6141191e010902799a38244e",
      code: "4321",
      name: "Veiculo da Fazenda",
      description: "Veiculo para a fertilização de morangos",
      fertilizer: "Fertilizante X",
      fertilizerAmount: 2
    }
    const res = await request(app).put(`/vehicle/update/${vehicleID}`).send(updateVehicle)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.owner).toBe(updateVehicle.owner);
    expect(res.body.code).toBe(updateVehicle.code);
    expect(res.body.name).toBe(updateVehicle.name);
    expect(res.body.description).toBe(updateVehicle.description);
    expect(res.body.fertilizer).toBe(updateVehicle.fertilizer);
    expect(res.body.fertilizerAmount).toBe(updateVehicle.fertilizerAmount);
  });

  it('Receives error on updating vehicle', async () => {
    const res = await request(app).put('/vehicle/update/123').send(vehicle)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(400);
  });

  it('Deletes vehicle', async () => {
    const res = await request(app).delete(`/vehicle/delete/${vehicleID}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it('Receives error on deleting vehicle', async () => {
    const res = await request(app).delete('/vehicle/delete/123')
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(400);
  });

  describe('Validation errors on create', () => {
    it('Receives blank data error on create vehicle', async () => {
      let errorVehicle = {
        owner: null,
        code: null,
        name: null,
        description: null,
        fertilizer: null,
        fertilizerAmount: null
      }
      const res = await request(app).post('/vehicle/create').send(errorVehicle)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not create vehicle');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        'owner must not be blank',
        'code must not be blank',
        'name must not be blank',
        'description must not be blank',
        'fertilizer must not be blank',
        'fertilizerAmount must not be blank'
      ]);
    })

    it('Receives code validation error on create vehicle', async () => {
      let errorVehicle = {
        owner: "61411790de1c603fc8596ea9",
        code: "wqe234@#",
        name: "Veiculo da Horta",
        description: "Veiculo para a fertilização da horta",
        fertilizer: "Fertilizante de morangos",
        fertilizerAmount: 3
      }
      const res = await request(app).post('/vehicle/create').send(errorVehicle)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not create vehicle');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        'code must be 4 digits with only numbers and uppercase letters'
      ]);
    })

    it('Receives fertilizer amount validation error on create vehicle', async () => {
      let errorVehicle = {
        owner: "61411790de1c603fc8596ea9",
        code: "G4B1",
        name: "Veiculo da Horta",
        description: "Veiculo para a fertilização da horta",
        fertilizer: "Fertilizante de morangos",
        fertilizerAmount: 'a'
      }
      const res = await request(app).post('/vehicle/create').send(errorVehicle)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not create vehicle');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        'fertilizerAmount must be a number (measure in ml)'
      ]);
    })

    it('Receives owner validation error on create vehicle', async () => {
      let errorVehicle = {
        owner: "João",
        code: "G4B1",
        name: "Veiculo da Horta",
        description: "Veiculo para a fertilização da horta",
        fertilizer: "Fertilizante de morangos",
        fertilizerAmount: 1
      }
      const res = await request(app).post('/vehicle/create').send(errorVehicle)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not create vehicle');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        'owner must be a user ID'
      ]);
    })

    it('Receives duplicated code error on create vehicle', async () => {
      let errorVehicle = {
        owner: "61411790de1c603fc8596ea9",
        code: "JKR3",
        name: "Veiculo da Horta",
        description: "Veiculo para a fertilização da horta",
        fertilizer: "Fertilizante de morangos",
        fertilizerAmount: 3
      }
      const res = await request(app).post('/vehicle/create').send(errorVehicle)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not create vehicle');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        'code must be unique'
      ]);
    })
  })

  describe('Validation errors on update', () => {

    it('Receives blank data error on update vehicle', async () => {
      let errorVehicle = {
        owner: null,
        code: null,
        name: null,
        description: null,
        fertilizer: null,
        fertilizerAmount: null
      }

      const res = await request(app).put(`/vehicle/update/${vehicleID}`).send(errorVehicle)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not update vehicle');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        'owner must not be blank',
        'code must not be blank',
        'name must not be blank',
        'description must not be blank',
        'fertilizer must not be blank',
        'fertilizerAmount must not be blank'
      ]);
    })

    it('Receives code validation error on update vehicle', async () => {
      let errorVehicle = {
        owner: "61411790de1c603fc8596ea9",
        code: "wqe234@#",
        name: "Veiculo da Horta",
        description: "Veiculo para a fertilização da horta",
        fertilizer: "Fertilizante de morangos",
        fertilizerAmount: 3
      }
      const res = await request(app).put(`/vehicle/update/${vehicleID}`).send(errorVehicle)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not update vehicle');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        'code must be 4 digits with only numbers and uppercase letters'
      ]);
    })

    it('Receives fertilizer amount validation error on update vehicle', async () => {
      let errorVehicle = {
        owner: "61411790de1c603fc8596ea9",
        code: "G4B1",
        name: "Veiculo da Horta",
        description: "Veiculo para a fertilização da horta",
        fertilizer: "Fertilizante de morangos",
        fertilizerAmount: 'a'
      }
      const res = await request(app).put(`/vehicle/update/${vehicleID}`).send(errorVehicle)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not update vehicle');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        'fertilizerAmount must be a number (measure in ml)'
      ]);
    })

    it('Receives owner validation error on create vehicle', async () => {
      let errorVehicle = {
        owner: "toptoptoptop",
        code: "G4B1",
        name: "Veiculo da Horta",
        description: "Veiculo para a fertilização da horta",
        fertilizer: "Fertilizante de morangos",
        fertilizerAmount: 1
      }
      const res = await request(app).put(`/vehicle/update/${vehicleID}`).send(errorVehicle)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not update vehicle');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        'owner must be a user ID'
      ]);
    })

    it('Receives duplicated code error on create vehicle', async () => {
      let originalCodeVehicle = {
        owner: "61411b17b45f264f37ca89e3",
        code: "ABC1",
        name: "Novo Veiculo",
        description: "veiculo da horta de morangos",
        fertilizer: "Fertilizante",
        fertilizerAmount: 1
      }
      let errorVehicle = {
        owner: "61411790de1c603fc8596ea9",
        code: "ABC1",
        name: "Veiculo da Horta",
        description: "Veiculo para a fertilização da horta",
        fertilizer: "Fertilizante de morangos",
        fertilizerAmount: 3
      }
      await request(app).post('/vehicle/create').send(originalCodeVehicle)
        .set('authorization', `JWT ${token}`);

      const res = await request(app).put(`/vehicle/update/${vehicleID}`).send(errorVehicle)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not update vehicle');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        'code must be unique'
      ]);
    })
  })
});



