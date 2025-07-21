// Mock data for TransformBuddy.AI Landing Page

export const webinarData = {
  hero: {
    headline: "Ready to Transform Your Body & Mind with AI?",
    subheadline: "Discover how TransformBuddy.AI personalizes your fitness, habits & mental wellness journey.",
    ctaText: "🔴 Reserve My Free Spot",
    hostInfo: {
      name: "Saurav Agarwal",
      title: "Founder, TransformBuddy.AI"
    }
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
      question: "Is the webinar really free?",
      answer: "Yes, completely free! No hidden charges or surprise fees."
    },
    {
      question: "What if I miss the live session?",
      answer: "No worries! We'll send you the recording within 24 hours of the webinar."
    },
    {
      question: "Do I need to download the app beforehand?",
      answer: "It's encouraged but not required. We'll share the download link after registration."
    },
    {
      question: "How long will the webinar be?",
      answer: "The session will be 60 minutes including a 15-minute Q&A at the end."
    },
    {
      question: "Will I get a certificate?",
      answer: "Yes! All attendees will receive a digital certificate of participation."
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

export const mockFormSubmission = (formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock form submission:", formData);
      localStorage.setItem('webinar_registration', JSON.stringify({
        ...formData,
        registrationId: `REG-${Date.now()}`,
        timestamp: new Date().toISOString()
      }));
      resolve({
        success: true,
        message: "Registration successful! Check your email for confirmation.",
        redirectUrl: "/thank-you"
      });
    }, 1500);
  });
};