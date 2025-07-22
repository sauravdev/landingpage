from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime
from emails import send_webinar_registration_notification, send_webinar_confirmation_email, EmailDeliveryError


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class WebinarRegistration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    fullName: str
    email: EmailStr
    whatsapp: str
    referralSource: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class WebinarRegistrationCreate(BaseModel):
    fullName: str
    email: EmailStr
    whatsapp: str
    referralSource: Optional[str] = None

class EmailResponse(BaseModel):
    status: str
    message: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/webinar-register", response_model=EmailResponse)
async def register_for_webinar(registration: WebinarRegistrationCreate, background_tasks: BackgroundTasks):
    """
    Register user for webinar and send emails
    """
    try:
        # Create full registration object with ID and timestamp
        full_registration = WebinarRegistration(
            fullName=registration.fullName,
            email=registration.email,
            whatsapp=registration.whatsapp,
            referralSource=registration.referralSource
        )
        
        # Save to database
        await db.webinar_registrations.insert_one(full_registration.dict())
        logger.info(f"Saved webinar registration for {registration.email}")
        
        # Prepare data for email
        registration_data = {
            'fullName': full_registration.fullName,
            'email': full_registration.email,
            'whatsapp': full_registration.whatsapp,
            'referralSource': full_registration.referralSource,
            'timestamp': full_registration.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Send emails in background
        background_tasks.add_task(
            send_webinar_registration_notification, 
            "support@transformbuddy.ai",
            registration_data
        )
        
        background_tasks.add_task(
            send_webinar_confirmation_email,
            full_registration.email,
            full_registration.fullName
        )
        
        logger.info(f"Email tasks queued for {registration.email}")
        
        return EmailResponse(
            status="success",
            message="Registration successful! Check your email for confirmation and webinar details."
        )
        
    except EmailDeliveryError as e:
        logger.error(f"Email delivery error for {registration.email}: {str(e)}")
        # Still return success as registration was saved, just email failed
        return EmailResponse(
            status="success", 
            message="Registration saved! You may not receive confirmation email immediately, but you're registered."
        )
        
    except Exception as e:
        logger.error(f"Webinar registration error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Registration failed. Please try again or contact support."
        )

@api_router.get("/webinar-registrations", response_model=List[WebinarRegistration])
async def get_webinar_registrations():
    """
    Get all webinar registrations (admin endpoint)
    """
    try:
        registrations = await db.webinar_registrations.find().sort("timestamp", -1).to_list(1000)
        return [WebinarRegistration(**reg) for reg in registrations]
    except Exception as e:
        logger.error(f"Error fetching registrations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch registrations")

@api_router.get("/webinar-stats")
async def get_webinar_stats():
    """
    Get webinar registration statistics
    """
    try:
        total_registrations = await db.webinar_registrations.count_documents({})
        
        # Get registrations by referral source
        pipeline = [
            {"$group": {"_id": "$referralSource", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        referral_stats = await db.webinar_registrations.aggregate(pipeline).to_list(100)
        
        return {
            "total_registrations": total_registrations,
            "available_seats": max(0, 100 - total_registrations),
            "referral_breakdown": referral_stats
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch statistics")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()