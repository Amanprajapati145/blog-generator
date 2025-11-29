"use client";
import React from "react";
import { 
  Sparkles, 
  Target, 
  Zap, 
  FileEdit, 
  Wand2, 
  CheckCircle,
  Code,
  Brain,
  Database,
  Layers,
  Rocket,
  Shield,
  Users
} from "lucide-react";

const About = () => {
  const steps = [
    {
      icon: FileEdit,
      title: "Enter Your Topic",
      description: "Simply input your blog topic, target audience, and preferred tone. Our intelligent system understands your requirements.",
      color: "from-violet-500 to-purple-600"
    },
    {
      icon: Wand2,
      title: "AI Generation",
      description: "Our advanced AI processes your input, researches the topic, and generates SEO-optimized content with proper structure.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: CheckCircle,
      title: "Review & Publish",
      description: "Edit, refine, and customize the generated content. Export or publish directly to your platform with one click.",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  const technologies = [
    {
      icon: Code,
      name: "MERN Stack",
      description: "MongoDB, Express.js, React, and Node.js for a robust full-stack application",
      color: "bg-green-500/10 text-green-700 border-green-500/20"
    },
    {
      icon: Brain,
      name: "Google Gemini AI",
      description: "Powered by Google's latest Gemini model for intelligent content generation",
      color: "bg-blue-500/10 text-blue-700 border-blue-500/20"
    },
    {
      icon: Layers,
      name: "LangChain",
      description: "Advanced framework for building context-aware AI applications",
      color: "bg-purple-500/10 text-purple-700 border-purple-500/20"
    },
    {
      icon: Database,
      name: "MongoDB Atlas",
      description: "Scalable cloud database for storing your content and user data",
      color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
    }
  ];

  const features = [
    {
      icon: Rocket,
      title: "Lightning Fast",
      description: "Generate comprehensive blog posts in under 60 seconds"
    },
    {
      icon: Shield,
      title: "SEO Optimized",
      description: "Built-in SEO best practices and optimization tools"
    },
    {
      icon: Users,
      title: "Multi-User Support",
      description: "Perfect for teams and collaborative content creation"
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-500/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">AI-Powered Content Platform</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            The <span className="bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Future of Content</span>
            <br />Creation
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Empower your content strategy with our AI-powered blog generator, 
            designed to help marketers, creators, and businesses produce 
            high-quality articles effortlessly.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-24">
          <div className="bg-linear-to-br from-violet-500 to-purple-600 rounded-3xl p-12 lg:p-16 shadow-2xl shadow-violet-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white">Our Mission</h2>
              </div>
              
              <p className="text-xl text-white/90 leading-relaxed max-w-4xl">
                Our mission is to democratize content creation. We provide a powerful 
                yet simple tool for marketers, creators, and businesses to generate 
                engaging, relevant, and well-structured blog posts in minutes, not hours. 
                By leveraging cutting-edge AI technology, we're making professional content 
                creation accessible to everyone.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A seamless three-step process to transform your ideas into polished blog posts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 h-full">
                  <div className={`w-16 h-16 bg-linear-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-linear-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-500/10 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Cutting-Edge Technology</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Built with Modern Tech
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Powered by industry-leading technologies for optimal performance and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center mb-4 ${tech.color}`}>
                  <tech.icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {tech.name}
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experience the advantages of AI-powered content creation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-linear-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="w-12 h-12 bg-linear-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 rounded-3xl p-12 lg:p-16 text-center shadow-2xl shadow-violet-500/30">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Content?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using AI to supercharge their content strategy
          </p>
          <button className="bg-white text-violet-600 hover:bg-slate-50 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
            Get Started Free
            <Sparkles className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default About;