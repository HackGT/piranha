import { Requisition } from "@prisma/client";
import { Storage } from "@google-cloud/storage";
import { GraphQLError } from "graphql";
import { prisma } from "../common";

if (!process.env.GOOGLE_STORAGE_BUCKET) {
    throw new Error("Google storage bucket not specified");
}

const storage = new Storage();
const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET);

export const uploadFiles = async (promiseFiles: any, requisition: Requisition) => {
    let files: any[] = await Promise.all(promiseFiles);

    let promiseStreams: Promise<any>[] = [];
    let createPrismaFiles = []

    for (const file of files) {
        if (!["image/jpeg", "image/png", "application/pdf", "text/plain"].includes(file.mimetype)) { // Has frontend validation as well
            throw new GraphQLError("File type is not accepted.");
        }

        const name = file.filename;
        const googleName = name + "_" + Date.now();

        createPrismaFiles.push({
            name: name,
            googleName: googleName,
            mimetype: file.mimetype
        });

        const writeStream = bucket.file(googleName).createWriteStream({
            resumable: false,
            metadata: {
                contentType: file.mimetype,
            }
        });

        promiseStreams.push(new Promise<any>((resolve, reject) => {
            file.createReadStream()
                .pipe(writeStream)
                .on('finish', () => resolve(true))
                .on('error', () => reject(false))
        }))
    }

    const uploadResults: boolean[] = await Promise.all(promiseStreams);

    if (!uploadResults.every(success => success == true)) {
        throw new GraphQLError("Files could not be uploaded");
    }

    await prisma.requisition.update({
        where: {
            id: requisition.id
        },
        data: {
            files: {
                create: createPrismaFiles
            }
        }
    });
}