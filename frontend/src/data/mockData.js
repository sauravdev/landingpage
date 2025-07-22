// Mock data for TransformBuddy.AI Landing Page

export const webinarData = {
  hero: {
    headline: "Ready to Transform Your Body & Mind with AI?",
    subheadline: "Discover how TransformBuddy.AI personalizes your fitness, habits & mental wellness journey.",
    ctaText: "🔴 Reserve My Free Spot"
  },
  
  benefits: [
    {
      icon: "Brain",
      title: "AI-Powered Personalization",
      description: "Learn how AI can personalize workouts, nutrition, and habits specifically for your lifestyle"
    },
    {
      icon: "Users",
      title: "Real Success Stories",
      description: "Discover how Indians like you transformed their health with AI-driven insights"
    },
    {
      icon: "Star",
      title: "Expert Guidance",
      description: "Get exclusive tips and strategies from our founder on building sustainable habits"
    }
  ],
  
  productHighlights: [
    {
      icon: "Camera",
      title: "📸 Calorie Tracking via Photo",
      description: "Simply snap a photo of your meal and get instant calorie and nutrition insights"
    },
    {
      icon: "Dumbbell",
      title: "🏋️ Personalized AI Workouts", 
      description: "Get custom workout plans that adapt to your progress and preferences"
    },
    {
      icon: "Brain",
      title: "🧠 Habit, Goal & Task Tracker",
      description: "Track your daily habits and goals with AI-powered recommendations"
    },
    {
      icon: "TrendingUp",
      title: "📈 AI-powered Insight Cards",
      description: "Receive personalized insights and tips to optimize your health journey"
    },
    {
      icon: "DollarSign",
      title: "💸 Much Cheaper than Personal Trainer",
      description: "Get premium fitness guidance at a fraction of the cost of a personal trainer"
    }
  ],
  
  testimonials: [
    {
      name: "Sneha",
      location: "Mumbai",
      quote: "This app just gets me! It's like having a nutritionist who understands Indian food habits.",
      rating: 5
    },
    {
      name: "Rohit", 
      location: "Delhi",
      quote: "Helped me stay accountable to my fitness goals. The AI reminders are spot on!",
      rating: 5
    },
    {
      name: "Priya",
      location: "Bangalore", 
      quote: "Feels like a WhatsApp nutritionist - so easy to use and incredibly helpful!",
      rating: 5
    }
  ],
  
  urgencyData: {
    totalSeats: 100,
    claimedSeats: 83,
    message: "Only 100 seats available. Already 83 spots claimed!"
  },
  
  faqData: [
    {
      question: "When is the TransformBuddy.AI webinar scheduled?",
      answer: "The FREE AI fitness webinar is scheduled for August 2nd, 2025, at 7:00 PM IST. Mark your calendar and register now as spots are limited to 100 participants!"
    },
    {
      question: "Is the webinar really free?",
      answer: "Yes, completely free! No hidden charges or surprise fees. This is our gift to the Indian fitness community to showcase how AI can transform your health journey."
    },
    {
      question: "What will I learn in this AI fitness webinar?",
      answer: "You'll discover how AI personalizes workouts for Indian lifestyles, tracks calories from food photos with 95% accuracy, creates custom meal plans using Indian ingredients, and provides 24/7 intelligent health recommendations."
    },
    {
      question: "Do I need any technical knowledge to attend?",
      answer: "Not at all! This webinar is designed for everyone interested in fitness and health. We'll explain AI concepts in simple terms and show practical demonstrations that anyone can understand."
    },
    {
      question: "How will I receive the webinar link?",
      answer: "After registering, you'll instantly receive a confirmation email with the webinar link. We'll also send reminder emails 24 hours and 1 hour before the August 2nd session starts."
    },
    {
      question: "Will the webinar be recorded?",
      answer: "Yes! All registered participants will receive exclusive access to the webinar recording and additional bonus materials within 24 hours after the August 2nd live session."
    },
    {
      question: "Is TransformBuddy.AI suitable for Indian food habits?",
      answer: "Absolutely! TransformBuddy.AI is specifically designed for Indian lifestyles. Our AI understands Indian cuisine, cooking methods, regional preferences, and creates plans that fit your cultural food habits."
    },
    {
      question: "What makes this different from other fitness apps?",
      answer: "Unlike generic fitness apps, TransformBuddy.AI uses advanced AI to learn YOUR specific preferences, body type, schedule, and Indian lifestyle. It's like having a personal trainer, nutritionist, and wellness coach combined - all powered by AI."
    }
  ]
};

export const formFields = [
  { name: "fullName", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "whatsapp", label: "WhatsApp Number", type: "tel", required: true },
  { name: "referralSource", label: "How did you hear about us?", type: "select", required: false, options: [
    "Social Media",
    "Friend Referral", 
    "Google Search",
    "YouTube",
    "Other"
  ]}
];