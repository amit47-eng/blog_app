import User from "../../../../model/user.model"; 
import dbConnect  from "../../../../utils/dbConnect"; 
import dotenv from "dotenv";

dotenv.config();
export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await req.json();

    // Validate required fields
    const requiredFields = ["firstname", "lastname", "about", "password", "username"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    // User must provide at least email or phoneNumber
    if (!body.email && !body.phoneNumber) {
      missingFields.push("email or phoneNumber");
    }

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          message: "Validation Error",
          missingFields: missingFields,
        }),
        { status: 400 }
      );
    }

    // Create the user
    const response = await User.create(body);
    return new Response(
      JSON.stringify({ message: "User registered successfully", response: response }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error); // Log full error
    return new Response(
      JSON.stringify({
        message: "Something went wrong while creating user",
        error: error.message, // Send error message for debugging
      }),
      { status: 500 }
    );
  }
}