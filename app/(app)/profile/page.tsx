"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { About } from "@/components/profile/About";
import { Photos } from "@/components/profile/Photos";
import { Prompts } from "@/components/profile/Prompts";
import { Settings } from "@/components/profile/Settings";
import { BottomNav } from "@/components/nav/BottomNav";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about");

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return <About />;
      case "photos":
        return <Photos />;
      case "prompts":
        return <Prompts />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-neutral-950 dark:to-neutral-900 p-4 pt-16 pb-24">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Profile</CardTitle>
            </div>
            <div className="flex justify-around pt-4">
              <Button variant={activeTab === "about" ? "default" : "ghost"} onClick={() => setActiveTab("about")}>About</Button>
              <Button variant={activeTab === "photos" ? "default" : "ghost"} onClick={() => setActiveTab("photos")}>Photos</Button>
              <Button variant={activeTab === "prompts" ? "default" : "ghost"} onClick={() => setActiveTab("prompts")}>Prompts</Button>
              <Button variant={activeTab === "settings" ? "default" : "ghost"} onClick={() => setActiveTab("settings")}>Settings</Button>
            </div>
          </CardHeader>
          <CardContent>
            {renderTabContent()}
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
