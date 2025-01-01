import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Category from "@/lib/database/models/category.model";
import Event from "@/lib/database/models/event.model";
import crypto from "crypto";
import { uploadToS3 } from "@/lib/actions/aws.actions";
import {
  GetObjectCommand,
  S3Client,
  S3ClientConfigType,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { convertFileToBuffer, getPagination, randomString } from "@/lib/utils";

await connectToDatabase();

// const bucketName = process.env.BUCKET_NAME;

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
} as S3ClientConfigType);

export async function GET(request: NextRequest) {
  try {
    const searchParams: any = request.nextUrl.searchParams;
    const page: number = searchParams.get("page");
    const perPage: number = searchParams.get("per_page");
    const { limit1, offset } = getPagination(page, perPage);
    const totalEvents = await Event.countDocuments();
    `
    `;
    const events = await Event.find()
      .skip(offset)
      .limit(limit1)
      .populate("category", "_id name")
      .populate("organizer", "_id firstName lastName email");
    for await (let eventdata of events) {
      let imageUrlArray: any = [];
      for await (let imagedata of eventdata.imageUrl) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: imagedata,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        imageUrlArray.push(url);
      }
      eventdata.imageUrl = imageUrlArray;
    }

    return NextResponse.json(
      {
        message: "Event fetched successfully",
        success: true,
        data: events,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalEvents / limit1),
          totalItems: totalEvents,
          pageSize: limit1,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const reqFormData = await request.formData();
    const {
      title,
      description,
      location,
      startDateTime,
      price,
      isFree,
      category,
      organizer,
    } = Object.fromEntries(reqFormData);

    const imageFiles: File[] = reqFormData.getAll("imageUrl") as File[];

    const event = await Event.findOne({ title });

    if (event) {
      return NextResponse.json(
        { message: "Event already exists", success: false, data: null },
        { status: 400 }
      );
    }

    const imageArray = [];
    for await (const image of imageFiles) {
      const randomImgName = randomString();
      const fileBuffer = await convertFileToBuffer(image);
      const param = {
        Bucket: bucketName,
        Key: image.name + randomImgName,
        Body: fileBuffer,
        ContentType: image.type,
      };
      await uploadToS3(param.Bucket, param.Key, param.Body, param.ContentType);
      imageArray.push(image.name + randomImgName);
    }

    const newEvent = await Event.create({
      title,
      description,
      imageUrl: imageArray,
      startDateTime,
      price,
      isFree: isFree ? true : false,
      category,
      organizer,
    });
    return NextResponse.json(
      {
        message: "Event created successfully",
        success: true,
        data: newEvent,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
