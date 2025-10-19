import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { UserRole } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in" },
        { status: 401 }
      );
    }

    // Check if the user is an operator or admin
    const userRole = session.user.role as UserRole;
    if (userRole !== "operator" && userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You don't have permission to perform this action" },
        { status: 403 }
      );
    }

    // Get request body
    const body = await req.json();
    const { userId, newRole } = body;

    if (!userId || !newRole) {
      return NextResponse.json(
        { error: "Bad request: Missing userId or newRole" },
        { status: 400 }
      );
    }

    // Validate the role
    const validRoles: UserRole[] = ["user", "ctc_student", "technical_lead", "operator", "admin"];
    if (!validRoles.includes(newRole as UserRole)) {
      return NextResponse.json(
        { error: "Bad request: Invalid role" },
        { status: 400 }
      );
    }

    // Check if the current user has permission to assign this role
    // Operators can only promote to CTC student or Technical Lead
    if (userRole === "operator" && (newRole === "operator" || newRole === "admin")) {
      return NextResponse.json(
        { error: "Forbidden: You don't have permission to assign this role" },
        { status: 403 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('new');
    const usersCollection = db.collection('users');

    // Check if user exists
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update the user's role
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          role: newRole,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // If the user is promoted to CTC student or Technical Lead, we might want to send them an email
    // This would be implemented here

    return NextResponse.json({
      message: "User role updated successfully",
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: newRole,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}