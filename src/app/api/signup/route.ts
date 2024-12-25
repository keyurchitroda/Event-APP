import { createUser } from "@/lib/actions/user.actions";
import User from "@/lib/database/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptJS from "bcryptjs";
import { connectToDatabase } from "@/lib/database";

export async function GET() {
  try {
    // const users = await User.findOne();
    // return NextResponse.json(
    //   { message: "User created successfully", success: true, data: users },
    //   { status: 201 }
    // );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const reqBody = await request.json();
    const { username, email, password, firstName, lastName } = reqBody;
    console.log("reqBody>>>>>>>>>>>>>>>>>>>>>>>.", reqBody);
    const user = await User.findOne({ email: email });
    console.log("user>>>>>>>>>>>>>>>>>>>>>>>.", user);

    if (user) {
      return NextResponse.json(
        { message: "User already exists", success: false, data: null },
        { status: 400 }
      );
    }
    const salt = await bcryptJS.genSalt(10);
    const hashedPassword = await bcryptJS.hash(password, salt);
    const newUser = {
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    };
    const userCreated = await createUser(newUser);
    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        data: userCreated,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, success: false, data: null },
      { status: 500 }
    );
  }
}
