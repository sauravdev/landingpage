from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, To
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class EmailDeliveryError(Exception):
    pass

def send_email(to: str, subject: str, content: str, content_type: str = "html"):
    """
    Send email via SendGrid

    Args:
        to: Recipient email address
        subject: Email subject line
        content: Email content (HTML or plain text)
        content_type: "html" or "plain"
    """
    try:
        sender_email = os.getenv('SENDER_EMAIL', 'noreply@transformbuddy.ai')
        
        message = Mail(
            from_email=sender_email,
            to_emails=to,
            subject=subject,
            html_content=content if content_type == "html" else None,
            plain_text_content=content if content_type == "plain" else None
        )

        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)
        logger.info(f"Email sent successfully to {to}. Status: {response.status_code}")
        return response.status_code == 202
        
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {str(e)}")
        raise EmailDeliveryError(f"Failed to send email: {str(e)}")

def send_webinar_registration_notification(admin_email: str, registration_data: dict):
    """
    Send webinar registration notification to admin
    """
    subject = f"New Webinar Registration - {registration_data.get('fullName', 'Unknown')}"

    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a1a1b 0%, #2a2a2b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: #DAFF01; margin: 0; font-size: 28px;">🎉 New Webinar Registration!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h2 style="color: #1a1a1b; border-bottom: 2px solid #DAFF01; padding-bottom: 10px;">Registration Details</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 8px 0;"><strong>👤 Name:</strong> {registration_data.get('fullName', 'N/A')}</p>
                    <p style="margin: 8px 0;"><strong>📧 Email:</strong> {registration_data.get('email', 'N/A')}</p>
                    <p style="margin: 8px 0;"><strong>📱 WhatsApp:</strong> {registration_data.get('whatsapp', 'N/A')}</p>
                    <p style="margin: 8px 0;"><strong>🔍 Source:</strong> {registration_data.get('referralSource', 'Not specified')}</p>
                    <p style="margin: 8px 0;"><strong>📅 Registration Time:</strong> {registration_data.get('timestamp', 'N/A')}</p>
                </div>
                
                <div style="background: #DAFF01; color: #1a1a1b; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
                    <strong>🚀 Another step closer to our webinar goal!</strong>
                </div>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
                    <em>This notification was sent from TransformBuddy.AI webinar registration system.</em>
                </p>
            </div>
        </body>
    </html>
    """

    return send_email(admin_email, subject, html_content, "html")

def send_webinar_confirmation_email(user_email: str, user_name: str):
    """
    Send confirmation email to user who registered for webinar
    """
    subject = "🎉 Welcome to TransformBuddy.AI Free Webinar!"

    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a1a1b 0%, #2a2a2b 100%); padding: 40px 30px; text-align: center; border-radius: 15px 15px 0 0;">
                <h1 style="color: #DAFF01; margin: 0 0 10px 0; font-size: 32px;">🚀 You're In!</h1>
                <p style="color: #fff; font-size: 18px; margin: 0;">Welcome to the AI Transformation Revolution</p>
            </div>
            
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
                <p style="font-size: 18px; color: #1a1a1b; margin-bottom: 20px;">Hi {user_name}! 👋</p>
                
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                    <strong>Congratulations!</strong> You've successfully registered for our exclusive <strong>FREE webinar</strong> on transforming your body and mind with AI.
                </p>
                
                <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #DAFF01;">
                    <h3 style="color: #1a1a1b; margin-top: 0;">📅 What's Next?</h3>
                    <ul style="color: #333; line-height: 1.8;">
                        <li>✅ <strong>Calendar invite</strong> will be sent separately</li>
                        <li>✅ <strong>Webinar link</strong> will arrive 24 hours before the event</li>
                        <li>✅ <strong>WhatsApp reminders</strong> to ensure you don't miss it</li>
                        <li>✅ <strong>Exclusive resources</strong> shared during the session</li>
                    </ul>
                </div>
                
                <div style="background: linear-gradient(135deg, #DAFF01 0%, #A6BE15 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0;">
                    <p style="color: #1a1a1b; font-weight: bold; font-size: 16px; margin: 0;">
                        🎯 Join our WhatsApp community for exclusive updates and tips!
                    </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <h3 style="color: #1a1a1b; margin-bottom: 15px;">What You'll Discover:</h3>
                    <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                        <p style="margin: 10px 0;"><strong>🧠 AI Personalization:</strong> How AI adapts to your unique lifestyle</p>
                        <p style="margin: 10px 0;"><strong>📸 Smart Tracking:</strong> Photo-based calorie and nutrition analysis</p>
                        <p style="margin: 10px 0;"><strong>🏋️ Custom Workouts:</strong> AI-powered fitness plans for Indians</p>
                        <p style="margin: 10px 0;"><strong>💡 Real Success Stories:</strong> How others transformed with AI</p>
                    </div>
                </div>
                
                <div style="background: #ffe6e6; border: 1px solid #ff9999; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                    <p style="color: #cc0000; margin: 0; font-weight: bold;">
                        ⚠️ Limited to 100 participants - You've secured your spot!
                    </p>
                </div>
                
                <p style="color: #666; font-size: 14px; margin-top: 40px; text-align: center; line-height: 1.5;">
                    Questions? Reply to this email or reach out to us at <strong>support@transformbuddy.ai</strong><br>
                    <em>We're excited to see you transform your health journey with AI!</em>
                </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                <p>© 2025 TransformBuddy.AI • Made with ❤️ in India</p>
            </div>
        </body>
    </html>
    """

    return send_email(user_email, subject, html_content, "html")