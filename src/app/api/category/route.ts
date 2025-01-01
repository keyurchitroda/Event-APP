import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Category from "@/lib/database/models/category.model";

await connectToDatabase();

export async function GET() {
  try {
    const users = await Category.find();
    return NextResponse.json(
      { message: "Category fetched successfully", success: true, data: users },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name } = reqBody;

    const category = await Category.findOne({ name });

    if (category) {
      return NextResponse.json(
        { message: "Category already exists", success: false, data: null },
        { status: 400 }
      );
    }

    const newCat = await Category.create(reqBody);
    return NextResponse.json(
      {
        message: "Category created successfully",
        success: true,
        data: newCat,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
