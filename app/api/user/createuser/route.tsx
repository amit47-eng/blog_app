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

    // Remove empty phoneNumber if not provided
    if (body.phoneNumber === "") {
      delete body.phoneNumber;
    }
    // Remove empty email if not provided
    if (body.email === "") {
      delete body.email;
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

    // --- Duplicate check ---
    if (body.email) {
      const existingEmail = await User.findOne({ email: body.email });
      if (existingEmail) {
        return new Response(
          JSON.stringify({ message: "Email already exists" }),
          { status: 409 }
        );
      }
    }
    if (body.phoneNumber) {
      const existingPhone = await User.findOne({ phoneNumber: body.phoneNumber });
      if (existingPhone) {
        return new Response(
          JSON.stringify({ message: "Phone number already exists" }),
          { status: 409 }
        );
      }
    }
    // --- End duplicate check ---

    // Create the user
    const response = await User.create(body);
    return new Response(
      JSON.stringify({ message: "User registered successfully", response: response }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error); // Log full error
    // Handle duplicate key error from MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return new Response(
        JSON.stringify({
          message: `A user with this ${field} already exists.`,
        }),
        { status: 409 }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Something went wrong while creating user",
        error: error.message, // Send error message for debugging
      }),
      { status: 500 }
    );
  }
}