import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { UserRole } from "@/types/user";

export async function GET(req: NextRequest) {
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
        { error: "Forbidden: You don't have permission to access this resource" },
        { status: 403 }
      );
    }

    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('CTC');
    const usersCollection = db.collection('users');

    // Build the search filter
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Fetch users with pagination
    const users = await usersCollection
      .find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .project({
        _id: 1,
        name: 1,
        email: 1,
        role: 1,
        createdAt: 1,
        image: 1
      })
      .toArray();

    // Get total count for pagination
    const total = await usersCollection.countDocuments(searchFilter);

    // Transform the data for the frontend
    const transformedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      createdAt: user.createdAt || new Date().toISOString(),
      image: user.image
    }));

    return NextResponse.json({
      users: transformedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
