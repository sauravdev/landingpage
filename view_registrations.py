#!/usr/bin/env python3
"""
Direct Database Access Script for TransformBuddy.AI Webinar Registrations
Run this script to view all registrations directly from MongoDB
"""

import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import json
from datetime import datetime

# Load environment variables
load_dotenv('/app/backend/.env')

async def view_registrations():
    try:
        # Connect to MongoDB
        mongo_url = os.environ['MONGO_URL']
        db_name = os.environ['DB_NAME']
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        print("🔍 TransformBuddy.AI Webinar Registrations")
        print("=" * 60)
        
        # Get all registrations
        registrations = await db.webinar_registrations.find().sort("timestamp", -1).to_list(1000)
        
        if not registrations:
            print("📭 No registrations found yet.")
            return
        
        print(f"📊 Total Registrations: {len(registrations)}")
        print(f"💺 Available Seats: {max(0, 100 - len(registrations))}")
        print("\n" + "="*60)
        
        # Display each registration
        for i, reg in enumerate(registrations, 1):
            print(f"\n🎟️  Registration #{i}")
            print("-" * 40)
            print(f"👤 Name: {reg.get('fullName', 'N/A')}")
            print(f"📧 Email: {reg.get('email', 'N/A')}")
            print(f"📱 WhatsApp: {reg.get('whatsapp', 'N/A')}")
            print(f"🔗 Source: {reg.get('referralSource', 'Not specified')}")
            print(f"📅 Date: {reg.get('timestamp', 'N/A')}")
            print(f"🆔 ID: {reg.get('id', 'N/A')}")
        
        # Referral source breakdown
        print(f"\n📈 Referral Source Breakdown:")
        print("-" * 40)
        
        referral_stats = {}
        for reg in registrations:
            source = reg.get('referralSource', 'Not specified')
            referral_stats[source] = referral_stats.get(source, 0) + 1
        
        for source, count in sorted(referral_stats.items(), key=lambda x: x[1], reverse=True):
            print(f"{source}: {count} registration{'s' if count > 1 else ''}")
        
        # Close connection
        client.close()
        
    except Exception as e:
        print(f"❌ Error accessing database: {str(e)}")
        print("Please ensure MongoDB is running and environment variables are set correctly.")

if __name__ == "__main__":
    asyncio.run(view_registrations())