import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { 
  Camera, 
  Dumbbell, 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Users,
  Star,
  Clock,
  Calendar,
  Mail,
  MessageCircle,
  ChevronDown,
  Check,
  ArrowRight
} from 'lucide-react';
import { webinarData, formFields } from '../data/mockData';

const LandingPage = () => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });
  const [webinarStats, setWebinarStats] = useState({
    totalRegistrations: 0,
    availableSeats: 100
  });
  const { toast } = useToast();

  // Mock countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real-time webinar stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/webinar-stats`);
        if (response.ok) {
          const stats = await response.json();
          setWebinarStats({
            totalRegistrations: stats.total_registrations || 0,
            availableSeats: stats.available_seats || 100
          });
        }
      } catch (error) {
        console.error('Failed to fetch webinar stats:', error);
      }
    };
    
    fetchStats();
    // Refresh stats every 30 seconds
    const statsInterval = setInterval(fetchStats, 30000);
    return () => clearInterval(statsInterval);
  }, []);

  const scrollToForm = () => {
    document.getElementById('signup-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get the backend URL from environment variable
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/webinar-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Registration Successful! 🎉",
          description: result.message || "Welcome aboard! Check your email for the webinar link and calendar invite.",
        });
        
        // Redirect to transformbuddy.ai after success
        setTimeout(() => {
          window.location.href = 'https://transformbuddy.ai';
        }, 2000);
      } else {
        throw new Error(result.detail || 'Registration failed');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (iconName) => {
    const icons = { Camera, Dumbbell, Brain, TrendingUp, DollarSign, Users, Star };
    const IconComponent = icons[iconName] || Star;
    return <IconComponent className="w-8 h-8" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-accent-primary">TransformBuddy.AI</div>
          <Button onClick={scrollToForm} className="bg-accent-primary text-black hover:bg-accent-hover">
            Register Now
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 to-purple-500/5"></div>
        <div className="container mx-auto relative z-10 max-w-4xl">
          <Badge className="mb-6 bg-accent-primary/20 text-accent-primary border-accent-primary/30">
            🔥 Limited Time Free Webinar
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            {webinarData.hero.headline}
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {webinarData.hero.subheadline}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={scrollToForm} 
              size="lg" 
              className="bg-accent-primary text-black hover:bg-accent-hover text-lg px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-accent-primary/25 transition-all duration-300"
            >
              {webinarData.hero.ctaText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              100% Free • Privacy Guaranteed
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-accent-primary" />
            </div>
            <div className="text-left">
              <div className="font-semibold">AI-Powered Transformation</div>
              <div className="text-sm text-gray-400">Personalized for every Indian</div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-8 bg-red-500/10 border-y border-red-500/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-red-400" />
              <span className="text-lg font-semibold">
                ⏳ Only {webinarStats.availableSeats} seats left!
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-gray-800 rounded-lg px-4 py-2 flex gap-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-primary">{timeLeft.hours}</div>
                  <div className="text-xs">HRS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-primary">{timeLeft.minutes}</div>
                  <div className="text-xs">MIN</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-primary">{timeLeft.seconds}</div>
                  <div className="text-xs">SEC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Webinar Benefits */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent-primary/20 text-accent-primary px-4 py-2 rounded-full border border-accent-primary/30 mb-6">
              <span>🎯</span>
              <span className="font-semibold">What You'll Master in This Webinar</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">From Struggle to Success</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Stop wasting time with generic advice. Learn the AI-powered approach that's transforming Indian lives every day.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {webinarData.benefits.map((benefit, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-accent-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/10 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-primary/30 transition-colors">
                    <div className="text-accent-primary group-hover:scale-110 transition-transform">
                      {getIcon(benefit.icon)}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-accent-primary transition-colors">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="py-20 px-6 bg-gray-950/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">TransformBuddy.AI Features</h2>
          <p className="text-gray-400 text-center mb-16 text-lg">Everything you need for your fitness transformation</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webinarData.productHighlights.map((feature, index) => (
              <Card key={index} className="bg-gray-900/80 border-gray-700 hover:border-accent-primary/50 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg group-hover:text-accent-primary transition-colors">
                    {getIcon(feature.icon)}
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-950 to-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">See AI Transformation in Action</h2>
          <p className="text-gray-400 text-center mb-16 text-lg">Real Indians achieving real results with AI-powered guidance</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Animated Stats Cards */}
            <Card className="bg-gray-900/80 border-gray-700 hover:border-accent-primary/50 transition-all duration-500 hover:scale-105">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent-primary to-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <TrendingUp className="w-8 h-8 text-black" />
                </div>
                <div className="text-3xl font-bold text-accent-primary mb-2">95%</div>
                <div className="text-gray-300">Users see results in 30 days</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 border-gray-700 hover:border-accent-primary/50 transition-all duration-500 hover:scale-105 delay-100">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-accent-primary mb-2">10K+</div>
                <div className="text-gray-300">Active transformations</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 border-gray-700 hover:border-accent-primary/50 transition-all duration-500 hover:scale-105 delay-200">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-accent-primary mb-2">4.9</div>
                <div className="text-gray-300">Average user rating</div>
              </CardContent>
            </Card>
          </div>

          {/* AI Transformation Process */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto border-4 border-accent-primary/30 group-hover:border-accent-primary transition-all duration-300 group-hover:scale-110">
                  <Camera className="w-10 h-10 text-accent-primary group-hover:animate-bounce" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-primary rounded-full animate-ping"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-accent-primary transition-colors">1. Snap & Analyze</h3>
              <p className="text-gray-400">AI instantly analyzes your food photos and tracks calories with 95% accuracy</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto border-4 border-accent-primary/30 group-hover:border-accent-primary transition-all duration-300 group-hover:scale-110">
                  <Brain className="w-10 h-10 text-accent-primary group-hover:animate-bounce" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-ping delay-300"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-accent-primary transition-colors">2. AI Learns You</h3>
              <p className="text-gray-400">Machine learning adapts to your preferences, schedule, and Indian lifestyle</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto border-4 border-accent-primary/30 group-hover:border-accent-primary transition-all duration-300 group-hover:scale-110">
                  <TrendingUp className="w-10 h-10 text-accent-primary group-hover:animate-bounce" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping delay-500"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-accent-primary transition-colors">3. Transform Daily</h3>
              <p className="text-gray-400">Get personalized insights and recommendations that fit your busy Indian life</p>
            </div>
          </div>

          {/* AI Revolution Hook Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-accent-primary/20 text-accent-primary px-4 py-2 rounded-full border border-accent-primary/30 mb-6">
                <span className="animate-pulse">🔥</span>
                <span className="font-semibold">AI Revolution in Progress</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">The Future of Fitness is Here</h3>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                While others struggle with generic diets and workouts, our AI learns YOUR body, YOUR preferences, and YOUR Indian lifestyle to create the perfect transformation plan.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before AI vs After AI Comparison */}
              <Card className="bg-gray-900/50 border-gray-700 relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-red-400 mb-4">WITHOUT AI</h4>
                    <div className="space-y-3 text-gray-300">
                      <p className="flex items-center gap-2">
                        <span className="text-red-400">❌</span>
                        Generic diets that ignore Indian food
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-red-400">❌</span>
                        Guessing calorie counts manually
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-red-400">❌</span>
                        One-size-fits-all workout plans
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-red-400">❌</span>
                        No real-time adaptation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent-primary/20 to-green-500/20 border-accent-primary/50 relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-accent-primary" />
                    </div>
                    <h4 className="text-xl font-bold text-accent-primary mb-4">WITH TransformBuddy AI</h4>
                    <div className="space-y-3 text-gray-300">
                      <p className="flex items-center gap-2">
                        <span className="text-accent-primary">✅</span>
                        Personalized plans for Indian lifestyle
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-accent-primary">✅</span>
                        AI-powered photo calorie tracking
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-accent-primary">✅</span>
                        Workouts adapted to your progress
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-accent-primary">✅</span>
                        24/7 intelligent recommendations
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute top-4 right-4 bg-accent-primary text-black px-2 py-1 rounded text-xs font-bold animate-pulse">
                  NEW!
                </div>
              </Card>
            </div>

            {/* Transformation Timeline */}
            <div className="mt-12">
              <h4 className="text-2xl font-bold text-center mb-8">Your AI-Powered Transformation Journey</h4>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center mx-auto mb-3 text-black font-bold">1</div>
                  <h5 className="font-semibold mb-2 text-accent-primary">Week 1-2</h5>
                  <p className="text-gray-400 text-sm">AI learns your habits, preferences, and goals</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center mx-auto mb-3 text-black font-bold">2</div>
                  <h5 className="font-semibold mb-2 text-accent-primary">Week 3-4</h5>
                  <p className="text-gray-400 text-sm">Personalized meal and workout plans kick in</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center mx-auto mb-3 text-black font-bold">3</div>
                  <h5 className="font-semibold mb-2 text-accent-primary">Month 2</h5>
                  <p className="text-gray-400 text-sm">Visible results start showing up</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center mx-auto mb-3 text-black font-bold">4</div>
                  <h5 className="font-semibold mb-2 text-accent-primary">Month 3+</h5>
                  <p className="text-gray-400 text-sm">Complete lifestyle transformation achieved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">What Indians Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {webinarData.testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-300 mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="font-semibold">— {testimonial.name}, {testimonial.location}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Webinar is Different - Hook Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-900/20 to-accent-primary/10 border-y border-accent-primary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent-primary/30 text-accent-primary px-6 py-3 rounded-full border border-accent-primary/50 mb-6">
              <span className="animate-bounce">⚡</span>
              <span className="font-bold text-lg">EXCLUSIVE LIVE WEBINAR</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Why Everyone is Raving About This Webinar</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              This isn't another generic fitness webinar. It's a revolutionary approach that's changing how Indians transform their health.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-accent-primary">AI-Powered, Not Generic</h3>
                    <p className="text-gray-300">Learn how AI creates plans specific to YOUR body, YOUR food habits, and YOUR Indian lifestyle - not some Western template.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-accent-primary">Live Demo + Q&A</h3>
                    <p className="text-gray-300">Watch real-time AI analysis of Indian meals, get your questions answered live, and see the technology in action.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-accent-primary">Exclusive Early Access</h3>
                    <p className="text-gray-300">Be among the first 100 Indians to experience TransformBuddy.AI with special founding member benefits.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-accent-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-accent-primary/5"></div>
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Brain className="w-10 h-10 text-accent-primary" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2">See AI in Action</h4>
                    <p className="text-gray-400">Watch how AI instantly analyzes this dal-rice photo</p>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <Camera className="w-5 h-5 text-accent-primary" />
                      <span className="text-sm text-accent-primary font-semibold">AI Analysis Result:</span>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>• Calories: 450 kcal (±10% accuracy)</div>
                      <div>• Protein: 18g • Carbs: 75g • Fat: 8g</div>
                      <div>• Fiber: 12g • Iron: High</div>
                      <div className="text-accent-primary mt-2">💡 Perfect post-workout meal!</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs animate-pulse">
                  LIVE DEMO
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-gray-900/50 border border-accent-primary/30 rounded-xl p-6 max-w-4xl mx-auto">
              <h4 className="text-2xl font-bold mb-4 text-accent-primary">⏰ Limited Time Offer</h4>
              <p className="text-gray-300 text-lg mb-4">
                First 100 attendees get lifetime access to premium AI features worth ₹9,999 - absolutely free!
              </p>
              <div className="flex justify-center items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-primary">{100 - webinarStats.totalRegistrations}</div>
                  <div className="text-sm text-gray-400">Spots Remaining</div>
                </div>
                <div className="text-gray-400">•</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-primary">₹9,999</div>
                  <div className="text-sm text-gray-400">Value FREE</div>
                </div>
                <div className="text-gray-400">•</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-primary">100%</div>
                  <div className="text-sm text-gray-400">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="signup-form" className="py-20 px-6 bg-gray-950/50">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">🎟️ Register for Free Webinar</h2>
            <p className="text-gray-400 text-lg">Join thousands transforming their health with AI</p>
          </div>
          
          <Card className="bg-gray-900/80 border-gray-700">
            <CardContent className="pt-6">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {formFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="text-white">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </Label>
                    
                    {field.type === 'select' ? (
                      <Select onValueChange={(value) => handleInputChange(field.name, value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {field.options.map((option) => (
                            <SelectItem key={option} value={option} className="text-white focus:bg-gray-700">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type}
                        required={field.required}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-accent-primary text-black hover:bg-accent-hover text-lg py-6 font-bold rounded-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    "Registering..."
                  ) : (
                    <>
                      🎟️ Register for Free Webinar
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
                
                <p className="text-center text-sm text-gray-400">
                  100% free • No spam • Privacy guaranteed
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {webinarData.faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-700 rounded-lg px-6">
                <AccordionTrigger className="text-left hover:text-accent-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold text-accent-primary mb-4">TransformBuddy.AI</div>
              <p className="text-gray-400 mb-4">
                Your AI-powered fitness and wellness companion for a healthier, happier life.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="border-gray-600 hover:border-accent-primary">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-gray-600 hover:border-accent-primary">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-accent-primary cursor-pointer transition-colors">TransformBuddy.AI</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <a href="mailto:support@transformbuddy.ai" className="hover:text-accent-primary cursor-pointer transition-colors block">
                  support@transformbuddy.ai
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TransformBuddy.AI. All rights reserved. Made with ❤️ in India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;