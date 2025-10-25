"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface Community {
  _id: string;
  name: string;
  handle: string;
  avatar?: string;
  membersCount: number;
  isVerified?: boolean;
  userRelation?: string;
}

interface MobileTrendingCommunitiesProps {
  communities: Community[];
  session: any;
  followingStates: { [key: string]: boolean };
  onFollow: (id: string, handle: string) => void;
}

export default function MobileTrendingCommunities({
  communities,
  session,
  followingStates,
  onFollow
}: MobileTrendingCommunitiesProps) {
  if (communities.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No trending communities</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide touch-pan-x w-screen -ml-4 -mr-4 sm:-ml-6 sm:-mr-6">
      <div className="flex gap-3 pb-4 pl-4 pr-4 sm:pl-6 sm:pr-6">
        {communities.slice(0, 5).map((community, commIndex) => (
          <motion.div
            key={community._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + commIndex * 0.1 }}
            className="flex-shrink-0 w-80 h-20"
          >
            <div className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-md hover:border-primary/30 bg-card h-full">
              <Avatar className="ring-2 ring-primary/10 flex-shrink-0">
                <AvatarImage src={community.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-silver text-white">
                  {community.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/communities/${community.handle}`}
                    className="font-semibold hover:text-primary transition-colors truncate text-sm"
                  >
                    {community.name}
                  </Link>
                  {community.isVerified && (
                    <Badge variant="outline" className="h-3 border-blue-300 px-1 text-[8px] text-blue-500 flex-shrink-0">
                      ✓
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">@{community.handle}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Users size={10} />
                  <span>{community.membersCount} members</span>
                </div>
              </div>
              {session && 
               community.userRelation !== 'member' && 
               community.userRelation !== 'admin' && 
               community.userRelation !== 'follower' && (
                <Button
                  size="sm"
                  variant={followingStates[community._id] ? "default" : "outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    onFollow(community._id, community.handle);
                  }}
                  className="h-6 text-xs px-2 flex-shrink-0"
                >
                  {followingStates[community._id] ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}