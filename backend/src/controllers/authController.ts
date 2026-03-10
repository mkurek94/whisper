import type { AuthRequest } from "../middleware/auth";
import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - user ID missing" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500)
    next();
  }
}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);

      if (!clerkUser) {
        return res.status(404).json({ message: "Clerk user not found" });
      }

      user = await User.create({
        clerkId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0],
        avatar: clerkUser.imageUrl,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next();
  }
}
