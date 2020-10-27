import { Requisition } from "@prisma/client";
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET);

export const uploadFile = (file: any, requisition: Requisition) => {

}