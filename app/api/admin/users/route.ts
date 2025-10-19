import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verify } from 'jsonwebtoken';
import { UserRole } from "@/types/user";

export async function GET(req: NextRequest) {
  try {
    // Use JWT authentication like other admin routes
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = verify(token, process.env.ADMIN_JWT_SECRET || 'admin-secret-key');
      if (!decoded || (decoded as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build the where clause for search
    const where = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Fetch users from database
    const client = await clientPromise;
    const db = client.db('new');
    const usersCollection = db.collection('users');
    
    // Find users with search and pagination
    const users = await usersCollection
      .find(where || {})
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const total = await usersCollection.countDocuments(where);

    // Transform users data for frontend
    const transformedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name || 'Unknown',
      email: user.email || 'No email',
      role: user.role || 'user',
      createdAt: user.createdAt || new Date().toISOString()
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