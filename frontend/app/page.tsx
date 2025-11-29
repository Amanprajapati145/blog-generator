"use client"
import Hero from "@/components/Hero";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
 


  return (
   <div>
    <Hero />
   </div>
  );
}
