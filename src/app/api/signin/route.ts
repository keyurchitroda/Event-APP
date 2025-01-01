import { NextRequest, NextResponse } from "next/server";
import bcryptJS from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database";

await connectToDatabase();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          message: "User does not exists",
          success: false,
          data: null,
        },
        { status: 400 }
      );
    }

    const validatePassword = await bcryptJS.compare(password, user.password);
    if (!validatePassword) {
      return NextResponse.json(
        { message: "Invalid password", success: false, data: null },
        { status: 400 }
      );
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.TOEKN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      { message: "Login successfull", success: true, data: { user, token } },
      { status: 200 }
    );

    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
