import mongoose from "mongoose";

const connections: Record<string, mongoose.Connection> = {};

export async function connectTenantDB(dbName: string) {

  const baseUri = process.env.MONGO_URI;
  if (!baseUri) throw new Error("MONGO_URI missing");

  if (connections[dbName]) return connections[dbName];

  const url = new URL(baseUri);
  url.pathname = `/${dbName}`;
  const uri = url.toString();
    console.log("new db",uri);
  const conn = await mongoose.createConnection(uri).asPromise();

  connections[dbName] = conn;

  return conn;
}
