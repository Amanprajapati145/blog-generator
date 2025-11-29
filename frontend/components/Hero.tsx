"use client";

import React from "react";
import { Button } from "./ui/button";
import { ArrowUpWideNarrow, Donut, Sparkle, Speaker } from "lucide-react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const features = [
    {
      id: 1,
      title: "AI-Powered Topics",
      text: "Never run out of ideas. Get relevant, trending topic suggestion instantly to keep your content fresh and engaging",
      icon: <Sparkle />,
    },
    {
      id: 2,
      title: "SEO Optimized",
      text: "Generate content that's structured to rank higher on search engines, complete with keywords and meta descriptions",
      icon: <ArrowUpWideNarrow />,
    },
    {
      id: 3,
      title: "Multiple tones",
      text: "Adapt our article's voice to match your brand from professional and format to casual and witty.",
      icon: <Speaker />,
    },
  ];

  const router = useRouter();
  return (
    <section className="flex flex-col">
      {/* header */}
      <div className="flex items-center  justify-center h-[65vh] px-4 md:px-8 ">
        <div className="flex flex-col items-center  gap-6 text-center max-w-4xl">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-snug sm:leading-tight md:leading-tight">
            Create High-Quality{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-purple-700">
              Blogs in Seconds
            </span>
            , Not Hours
          </h1>

          {/* Paragraph */}
          <p className="text-base sm:text-lg md:text-xl font-medium text-zinc-500 max-w-2xl">
            Leverage our advanced AI to generate engaging, SEO-friendly articles
            on any topic. Save time, rank higher, and grow your audience
            effortlessly.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-4">
            <Button
              onClick={() => router.push("/generate-blog")}
              className="w-full cursor-pointer sm:w-56 h-12 text-lg font-semibold text-white bg-linear-to-r from-blue-700 to-purple-700 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              Generate Blog
            </Button>

            <div className="p-0.5 bg-linear-to-r from-blue-700 to-purple-700 rounded-lg w-full sm:w-56">
              <Button
                onClick={() => router.push("/generate-blog")}
                className="w-full h-12 text-lg font-semibold bg-white text-purple-700 rounded-lg hover:bg-transparent hover:text-purple-800 transition-all"
              >
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* why choose us */}
      <div className="mb-5">
        <div className="flex p-3  flex-col justify-center items-center gap-5">
          <h1 className="text-3xl font-semibold">Why Choose Us?</h1>
          <p className="text-xl max-w-3xl text-center font-semibold text-zinc-500">
            Our platform is packed with features designed to streamline your
            writing process and boost your content's impact.
          </p>
        </div>

        {/* features */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 py-4  gap-10 place-items-center container mx-auto">
          {features.map((feature) => (
            <div
              className="flex gap-4 rounded-t-xl shadow-xl border-purple-300 border p-4 flex-col items-center justify-center"
              key={feature.id}
            >
              <span className="text-xl bg-linear-to-r from-blue-700 to-purple-700 text-white p-4 rounded-xl">
                {feature.icon}
              </span>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-zinc-500 font-semibold text-center">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* part-3 */}
      <div className="mt-5 mb-5 flex flex-col justify-center items-center gap-5">
        <h1 className="text-3xl max-w-xl text-center font-semibold ">
          Ready to revolutionize your content strategy?
        </h1>
        <p className="text-lg font-semibold text-zinc-500 max-w-xl text-center">
          Start creating compelling blog posts with the power of AI today. No
          credit card required
        </p>
        <Button
          onClick={() => router.push("/generate-blog")}
          className="bg-linear-to-r cursor-pointer w-56 h-12 text-lg from-blue-700 to-purple-700"
        >
          Generate Blog
        </Button>
      </div>
    </section>
  );
};

export default Hero;
