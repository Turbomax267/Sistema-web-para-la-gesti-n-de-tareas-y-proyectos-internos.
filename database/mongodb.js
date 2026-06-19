/* eslint-disable no-console */
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'gestor_proyectos';
const collectionName = 'historial_tareas';

async function runExamples() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const historial = db.collection(collectionName);

    await historial.createIndex({ tareaId: 1, fecha: -1 });

    await historial.insertOne({
      tareaId: 1,
      accion: 'CREACION',
      campoModificado: 'tarea',
      valorAnterior: null,
      valorNuevo: {
        titulo: 'Nueva tarea de ejemplo',
        estado: 'Pendiente',
      },
      descripcion: 'Se registró la tarea inicial',
      fecha: new Date(),
    });

    const documentos = await historial.find({ tareaId: 1 }).sort({ fecha: -1 }).toArray();
    console.log('Documentos encontrados:', documentos);

    await historial.updateOne(
      { tareaId: 1, accion: 'CREACION' },
      {
        $set: {
          accion: 'ACTUALIZACION',
          campoModificado: 'estado',
          valorAnterior: 'Pendiente',
          valorNuevo: 'En Proceso',
          descripcion: 'La tarea cambió a En Proceso',
        },
      },
    );

    await historial.deleteOne({
      tareaId: 1,
      accion: 'ACTUALIZACION',
    });
  } catch (error) {
    console.error('Error ejecutando ejemplos MongoDB:', error);
  } finally {
    await client.close();
  }
}

runExamples();

