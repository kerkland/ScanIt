import { NextResponse } from "next/server";
import { clearManufacturerSession } from "@/lib/manufacturer-auth";

export async function POST() {
    return clearManufacturerSession();
}
