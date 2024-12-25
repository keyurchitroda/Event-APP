import { NextRequest, NextResponse } from "next/server";
import Jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.headers.get("Authorization") || "";
    const decodeToken: any = Jwt.verify(token, process.env.TOEKN_SECRET!);
    return decodeToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllDataFromToken = (request: NextRequest) => {
  try {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODk0ODY2NDUzMWQ5MTlmZjViZDljNCIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTcwMzQ5NTc5NywiZXhwIjoxNzAzNTgyMTk3fQ.vcLEJaw-Y8uQF7tRjkrsfdFkuAcWSoAJdtladLv0WKs"; // request.cookies.get("token")?.value || "";
    const decodeToken: any = Jwt.verify(token, process.env.TOEKN_SECRET!);
    console.log("token-=-=-=", decodeToken);
    return decodeToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
