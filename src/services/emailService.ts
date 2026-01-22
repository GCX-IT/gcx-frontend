/**
 * Email Service for GCX
 * Handles sending emails through the GCX notification API
 */

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface EventRegistrationData {
  event_id: number
  full_name: string
  email: string
  phone: string
  organization?: string
  position?: string
  dietary_requirements?: string
  special_needs?: string
}

export interface EventData {
  id: number
  title: string
  date: string
  time?: string
  location: string
  venue?: string
  address?: string
  type: string
  category: string
  description?: string
  attendees: number
  price?: string
}

export interface RTIApplicationData {
  request_id: string
  full_name: string
  email: string
  phone: string
  address?: string
  organization?: string
  request_type: string
  subject: string
  description: string
  preferred_format: string
}

export interface EmailResponse {
  success: boolean
  message: string
}

export interface EmailOptions {
  to: string
  subject: string
  body: string
  isHtml?: boolean
  fromEmail?: string
  fromName?: string
}

class EmailService {
  private readonly API_URL = 'https://api.gcx.com.gh/notification-api/public/api/email/'
  private readonly CONTACT_EMAIL = 'contact@gcx.com.gh'
  private readonly IT_SUPPORT_EMAIL = 'itsupport@gcx.com.gh'
  private readonly FROM_EMAIL = 'noreply@gcx.com.gh'
  private readonly FROM_NAME = 'GCX System'

  /**
   * Send email via the GCX notification API
   */
  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: options.to,
          subject: options.subject,
          body: options.body,
          isHtml: options.isHtml ?? true,
          fromEmail: options.fromEmail ?? this.FROM_EMAIL,
          fromName: options.fromName ?? this.FROM_NAME
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error sending email:', error)
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Create HTML email body for contact form submission
   */
  private createContactEmailBody(formData: ContactFormData): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
          New Contact Form Submission
        </h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">
          Ghana Commodity Exchange
        </p>
      </div>
      
      <div style="padding: 30px; background-color: white;">
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #1e293b;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email:</td>
              <td style="padding: 8px 0; color: #1e293b;">
                <a href="mailto:${formData.email}" style="color: #f59e0b; text-decoration: none;">${formData.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Subject:</td>
              <td style="padding: 8px 0; color: #1e293b;">${formData.subject}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Message</h3>
          <p style="color: #475569; margin: 0; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #ecfdf5; border-radius: 8px; border: 1px solid #d1fae5;">
          <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px;">Next Steps</h3>
          <p style="color: #047857; margin: 0; font-size: 14px;">
            Please respond to this inquiry within 24 hours. You can reply directly to this email or contact the customer at ${formData.email}.
          </p>
        </div>
      </div>
      
      <div style="background-color: #1e293b; padding: 20px; text-align: center;">
        <p style="color: #94a3b8; margin: 0; font-size: 14px;">
          © 2018 - 2025 Ghana Commodity Exchange. All Rights Reserved
        </p>
        <p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px;">
          This email was sent from the GCX website contact form.
        </p>
      </div>
    </div>
    `
  }

  /**
   * Create HTML confirmation email body for the person who submitted the form
   */
  private createConfirmationEmailBody(formData: ContactFormData): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
          Thank You for Contacting GCX
        </h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">
          Ghana Commodity Exchange
        </p>
      </div>
      
      <div style="padding: 30px; background-color: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 80px; height: 80px; background-color: #ecfdf5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 24px;">Message Received!</h2>
          <p style="color: #64748b; margin: 0; font-size: 16px;">
            We've received your message and will get back to you within 24 hours.
          </p>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Your Message Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #1e293b;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Subject:</td>
              <td style="padding: 8px 0; color: #1e293b;">${formData.subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; vertical-align: top;">Message:</td>
              <td style="padding: 8px 0; color: #1e293b; white-space: pre-wrap;">${formData.message}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #f59e0b; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">What happens next?</h3>
          <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px;">
            <li>Our team will review your message within 24 hours</li>
            <li>We'll respond directly to your email: ${formData.email}</li>
            <li>If urgent, you can call us at +233 59 416 4465</li>
          </ul>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Contact Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #475569; font-size: 14px;">Office Address</p>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.4;">
                2nd Floor - Africa Trade House<br>
                Ambassadorial Enclave Off Liberia Road<br>
                Ridge, Accra, Ghana
              </p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #475569; font-size: 14px;">Contact Details</p>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.4;">
                Phone: +233 59 416 4465<br>
                Email: contact@gcx.com.gh<br>
                Digital Address: GA-077-0681
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div style="background-color: #1e293b; padding: 20px; text-align: center;">
        <p style="color: #94a3b8; margin: 0; font-size: 14px;">
          © 2018 - 2025 Ghana Commodity Exchange. All Rights Reserved
        </p>
        <p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px;">
          This is an automated confirmation email. Please do not reply to this message.
        </p>
      </div>
    </div>
    `
  }

  /**
   * Create HTML email body for event registration notification to GCX team
   */
  private createEventRegistrationEmailBody(registrationData: EventRegistrationData, eventData: EventData): string {
    const eventDate = new Date(eventData.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
          New Event Registration
        </h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">
          Ghana Commodity Exchange
        </p>
      </div>
      
      <div style="padding: 30px; background-color: white;">
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">Event Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Event:</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${eventData.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Date:</td>
              <td style="padding: 8px 0; color: #1e293b;">${eventDate}${eventData.time ? ` at ${eventData.time}` : ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Location:</td>
              <td style="padding: 8px 0; color: #1e293b;">${eventData.location}${eventData.venue ? ` - ${eventData.venue}` : ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Type:</td>
              <td style="padding: 8px 0; color: #1e293b;">${eventData.type} - ${eventData.category}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">Registration Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #1e293b;">${registrationData.full_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email:</td>
              <td style="padding: 8px 0; color: #1e293b;">
                <a href="mailto:${registrationData.email}" style="color: #f59e0b; text-decoration: none;">${registrationData.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Phone:</td>
              <td style="padding: 8px 0; color: #1e293b;">
                <a href="tel:${registrationData.phone}" style="color: #f59e0b; text-decoration: none;">${registrationData.phone}</a>
              </td>
            </tr>
            ${registrationData.organization ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Organization:</td>
              <td style="padding: 8px 0; color: #1e293b;">${registrationData.organization}</td>
            </tr>
            ` : ''}
            ${registrationData.position ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Position:</td>
              <td style="padding: 8px 0; color: #1e293b;">${registrationData.position}</td>
            </tr>
            ` : ''}
            ${registrationData.dietary_requirements ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Dietary Requirements:</td>
              <td style="padding: 8px 0; color: #1e293b;">${registrationData.dietary_requirements}</td>
            </tr>
            ` : ''}
            ${registrationData.special_needs ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Special Needs:</td>
              <td style="padding: 8px 0; color: #1e293b;">${registrationData.special_needs}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #ecfdf5; border-radius: 8px; border: 1px solid #d1fae5;">
          <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px;">Next Steps</h3>
          <p style="color: #047857; margin: 0; font-size: 14px;">
            Please confirm this registration and send any additional information to the attendee. 
            You can contact them directly at ${registrationData.email} or ${registrationData.phone}.
          </p>
        </div>
      </div>
      
      <div style="background-color: #1e293b; padding: 20px; text-align: center;">
        <p style="color: #94a3b8; margin: 0; font-size: 14px;">
          © 2018 - 2025 Ghana Commodity Exchange. All Rights Reserved
        </p>
        <p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px;">
          This email was sent from the GCX website event registration system.
        </p>
      </div>
    </div>
    `
  }

  /**
   * Create HTML confirmation email body for event registration
   */
  private createEventConfirmationEmailBody(registrationData: EventRegistrationData, eventData: EventData): string {
    const eventDate = new Date(eventData.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
          Registration Confirmed!
        </h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">
          Ghana Commodity Exchange
        </p>
      </div>
      
      <div style="padding: 30px; background-color: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 80px; height: 80px; background-color: #ecfdf5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 24px;">You're registered for ${eventData.title}!</h2>
          <p style="color: #64748b; margin: 0; font-size: 16px;">
            Thank you for registering. We're excited to have you join us!
          </p>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Event Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Event:</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${eventData.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Date:</td>
              <td style="padding: 8px 0; color: #1e293b;">${eventDate}${eventData.time ? ` at ${eventData.time}` : ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Location:</td>
              <td style="padding: 8px 0; color: #1e293b;">${eventData.location}${eventData.venue ? ` - ${eventData.venue}` : ''}</td>
            </tr>
            ${eventData.address ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Address:</td>
              <td style="padding: 8px 0; color: #1e293b;">${eventData.address}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Type:</td>
              <td style="padding: 8px 0; color: #1e293b;">${eventData.type} - ${eventData.category}</td>
            </tr>
            ${eventData.price ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Price:</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: bold; color: #f59e0b;">${eventData.price}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #f59e0b; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">What to bring</h3>
          <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px;">
            <li>Valid government-issued ID</li>
            <li>Business card for networking</li>
            <li>Laptop or tablet for workshops (optional)</li>
            <li>Any specific materials mentioned in the event description</li>
          </ul>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Contact Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #475569; font-size: 14px;">Office Address</p>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.4;">
                2nd Floor - Africa Trade House<br>
                Ambassadorial Enclave Off Liberia Road<br>
                Ridge, Accra, Ghana
              </p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #475569; font-size: 14px;">Contact Details</p>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.4;">
                Phone: +233 59 416 4465<br>
                Email: contact@gcx.com.gh<br>
                Digital Address: GA-077-0681
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div style="background-color: #1e293b; padding: 20px; text-align: center;">
        <p style="color: #94a3b8; margin: 0; font-size: 14px;">
          © 2018 - 2025 Ghana Commodity Exchange. All Rights Reserved
        </p>
        <p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px;">
          This is an automated confirmation email. Please do not reply to this message.
        </p>
      </div>
    </div>
    `
  }

  /**
   * Send event registration emails to GCX team and confirmation to attendee
   */
  async sendEventRegistrationEmails(registrationData: EventRegistrationData, eventData: EventData): Promise<{
    success: boolean
    message: string
    details: {
      contactEmailSent: boolean
      itSupportEmailSent: boolean
      confirmationEmailSent: boolean
    }
  }> {
    const results = {
      contactEmailSent: false,
      itSupportEmailSent: false,
      confirmationEmailSent: false
    }

    const errors: string[] = []

    try {
      // Create email bodies
      const teamEmailBody = this.createEventRegistrationEmailBody(registrationData, eventData)
      const confirmationEmailBody = this.createEventConfirmationEmailBody(registrationData, eventData)
      const subject = `New Event Registration: ${eventData.title}`

      // Send to contact@gcx.com.gh
      try {
        await this.sendEmail({
          to: this.CONTACT_EMAIL,
          subject: subject,
          body: teamEmailBody
        })
        results.contactEmailSent = true
      } catch (error) {
        errors.push(`Failed to send to contact email: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Send to itsupport@gcx.com.gh
      try {
        await this.sendEmail({
          to: this.IT_SUPPORT_EMAIL,
          subject: subject,
          body: teamEmailBody
        })
        results.itSupportEmailSent = true
      } catch (error) {
        errors.push(`Failed to send to IT support email: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Send confirmation to attendee
      try {
        await this.sendEmail({
          to: registrationData.email,
          subject: `Registration Confirmed: ${eventData.title}`,
          body: confirmationEmailBody
        })
        results.confirmationEmailSent = true
      } catch (error) {
        errors.push(`Failed to send confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      const allEmailsSent = results.contactEmailSent && results.itSupportEmailSent && results.confirmationEmailSent
      const someEmailsSent = results.contactEmailSent || results.itSupportEmailSent || results.confirmationEmailSent

      return {
        success: allEmailsSent,
        message: allEmailsSent 
          ? 'All emails sent successfully!' 
          : someEmailsSent 
            ? `Partially successful. ${errors.join(' ')}`
            : 'Failed to send emails. ' + errors.join(' '),
        details: results
      }
    } catch (error) {
      return {
        success: false,
        message: `Error processing event registration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: results
      }
    }
  }

  /**
   * Create HTML email body for RTI application notification to GCX team
   */
  private createRTIApplicationEmailBody(applicationData: RTIApplicationData): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
          New RTI Application
        </h1>
        <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">
          Ghana Commodity Exchange - Right to Information Unit
        </p>
      </div>
      
      <div style="padding: 30px; background-color: white;">
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">Request Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Request ID:</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${applicationData.request_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Information Type:</td>
              <td style="padding: 8px 0; color: #1e293b;">${applicationData.request_type}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Subject:</td>
              <td style="padding: 8px 0; color: #1e293b;">${applicationData.subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Preferred Format:</td>
              <td style="padding: 8px 0; color: #1e293b;">${applicationData.preferred_format}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">Applicant Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #1e293b;">${applicationData.full_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email:</td>
              <td style="padding: 8px 0; color: #1e293b;">
                <a href="mailto:${applicationData.email}" style="color: #10b981; text-decoration: none;">${applicationData.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Phone:</td>
              <td style="padding: 8px 0; color: #1e293b;">
                <a href="tel:${applicationData.phone}" style="color: #10b981; text-decoration: none;">${applicationData.phone}</a>
              </td>
            </tr>
            ${applicationData.organization ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Organization:</td>
              <td style="padding: 8px 0; color: #1e293b;">${applicationData.organization}</td>
            </tr>
            ` : ''}
            ${applicationData.address ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Address:</td>
              <td style="padding: 8px 0; color: #1e293b;">${applicationData.address}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Request Description</h3>
          <p style="color: #475569; margin: 0; line-height: 1.6; white-space: pre-wrap;">${applicationData.description}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #ecfdf5; border-radius: 8px; border: 1px solid #d1fae5;">
          <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px;">Next Steps</h3>
          <p style="color: #047857; margin: 0; font-size: 14px;">
            Please review this RTI application and respond within the statutory timeframe. 
            You can contact the applicant directly at ${applicationData.email} or ${applicationData.phone}.
          </p>
        </div>
      </div>
      
      <div style="background-color: #1e293b; padding: 20px; text-align: center;">
        <p style="color: #94a3b8; margin: 0; font-size: 14px;">
          © 2018 - 2025 Ghana Commodity Exchange. All Rights Reserved
        </p>
        <p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px;">
          This email was sent from the GCX RTI application system.
        </p>
      </div>
    </div>
    `
  }

  /**
   * Create HTML confirmation email body for RTI application
   */
  private createRTIConfirmationEmailBody(applicationData: RTIApplicationData): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
          RTI Application Received
        </h1>
        <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">
          Ghana Commodity Exchange - Right to Information Unit
        </p>
      </div>
      
      <div style="padding: 30px; background-color: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 80px; height: 80px; background-color: #ecfdf5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 24px;">Your RTI Application has been received!</h2>
          <p style="color: #64748b; margin: 0; font-size: 16px;">
            Thank you for submitting your request for information. We will review and respond within the statutory timeframe.
          </p>
        </div>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Application Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Request ID:</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${applicationData.request_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Information Type:</td>
              <td style="padding: 8px 0; color: #1e293b;">${applicationData.request_type}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Subject:</td>
              <td style="padding: 8px 0; color: #1e293b;">${applicationData.subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Preferred Format:</td>
              <td style="padding: 8px 0; color: #1e293b;">${applicationData.preferred_format}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Your Request</h3>
          <p style="color: #475569; margin: 0; line-height: 1.6; white-space: pre-wrap;">${applicationData.description}</p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #f59e0b; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">What happens next?</h3>
          <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px;">
            <li>Your application will be reviewed by our RTI team</li>
            <li>We will respond within 14 days as required by law</li>
            <li>You will receive updates via email</li>
            <li>If additional information is needed, we will contact you</li>
          </ul>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Contact Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #475569; font-size: 14px;">RTI Unit</p>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.4;">
                Ghana Commodity Exchange<br>
                Right to Information Unit<br>
                Communications & Corporate Affairs
              </p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #475569; font-size: 14px;">Contact Details</p>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.4;">
                Phone: +233 59 416 4465<br>
                Email: contact@gcx.com.gh<br>
                Digital Address: GA-077-0681
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div style="background-color: #1e293b; padding: 20px; text-align: center;">
        <p style="color: #94a3b8; margin: 0; font-size: 14px;">
          © 2018 - 2025 Ghana Commodity Exchange. All Rights Reserved
        </p>
        <p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px;">
          This is an automated confirmation email. Please do not reply to this message.
        </p>
      </div>
    </div>
    `
  }

  /**
   * Send RTI application emails to GCX team and confirmation to applicant
   */
  async sendRTIApplicationEmails(applicationData: RTIApplicationData): Promise<{
    success: boolean
    message: string
    details: {
      contactEmailSent: boolean
      itSupportEmailSent: boolean
      confirmationEmailSent: boolean
    }
  }> {
    const results = {
      contactEmailSent: false,
      itSupportEmailSent: false,
      confirmationEmailSent: false
    }

    const errors: string[] = []

    try {
      // Create email bodies
      const teamEmailBody = this.createRTIApplicationEmailBody(applicationData)
      const confirmationEmailBody = this.createRTIConfirmationEmailBody(applicationData)
      const subject = `New RTI Application: ${applicationData.request_id}`

      // Send to contact@gcx.com.gh
      try {
        await this.sendEmail({
          to: this.CONTACT_EMAIL,
          subject: subject,
          body: teamEmailBody
        })
        results.contactEmailSent = true
      } catch (error) {
        errors.push(`Failed to send to contact email: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Send to itsupport@gcx.com.gh
      try {
        await this.sendEmail({
          to: this.IT_SUPPORT_EMAIL,
          subject: subject,
          body: teamEmailBody
        })
        results.itSupportEmailSent = true
      } catch (error) {
        errors.push(`Failed to send to IT support email: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Send confirmation to applicant
      try {
        await this.sendEmail({
          to: applicationData.email,
          subject: `RTI Application Confirmed: ${applicationData.request_id}`,
          body: confirmationEmailBody
        })
        results.confirmationEmailSent = true
      } catch (error) {
        errors.push(`Failed to send confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      const allEmailsSent = results.contactEmailSent && results.itSupportEmailSent && results.confirmationEmailSent
      const someEmailsSent = results.contactEmailSent || results.itSupportEmailSent || results.confirmationEmailSent

      return {
        success: allEmailsSent,
        message: allEmailsSent 
          ? 'All emails sent successfully!' 
          : someEmailsSent 
            ? `Partially successful. ${errors.join(' ')}`
            : 'Failed to send emails. ' + errors.join(' '),
        details: results
      }
    } catch (error) {
      return {
        success: false,
        message: `Error processing RTI application: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: results
      }
    }
  }

  /**
   * Send contact form emails to GCX team and confirmation to customer
   */
  async sendContactFormEmails(formData: ContactFormData): Promise<{
    success: boolean
    message: string
    details: {
      contactEmailSent: boolean
      itSupportEmailSent: boolean
      confirmationEmailSent: boolean
    }
  }> {
    const results = {
      contactEmailSent: false,
      itSupportEmailSent: false,
      confirmationEmailSent: false
    }

    const errors: string[] = []

    try {
      // Create email bodies
      const contactEmailBody = this.createContactEmailBody(formData)
      const confirmationEmailBody = this.createConfirmationEmailBody(formData)
      const subject = `New Contact Form Submission: ${formData.subject}`

      // Send to contact@gcx.com.gh
      try {
        await this.sendEmail({
          to: this.CONTACT_EMAIL,
          subject: subject,
          body: contactEmailBody
        })
        results.contactEmailSent = true
      } catch (error) {
        errors.push(`Failed to send to contact email: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Send to itsupport@gcx.com.gh
      try {
        await this.sendEmail({
          to: this.IT_SUPPORT_EMAIL,
          subject: subject,
          body: contactEmailBody
        })
        results.itSupportEmailSent = true
      } catch (error) {
        errors.push(`Failed to send to IT support email: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Send confirmation to customer
      try {
        await this.sendEmail({
          to: formData.email,
          subject: 'Thank you for contacting GCX - We\'ll be in touch soon!',
          body: confirmationEmailBody
        })
        results.confirmationEmailSent = true
      } catch (error) {
        errors.push(`Failed to send confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      const allEmailsSent = results.contactEmailSent && results.itSupportEmailSent && results.confirmationEmailSent
      const someEmailsSent = results.contactEmailSent || results.itSupportEmailSent || results.confirmationEmailSent

      return {
        success: allEmailsSent,
        message: allEmailsSent 
          ? 'All emails sent successfully!' 
          : someEmailsSent 
            ? `Partially successful. ${errors.join(' ')}`
            : 'Failed to send emails. ' + errors.join(' '),
        details: results
      }
    } catch (error) {
      return {
        success: false,
        message: `Error processing contact form: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: results
      }
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()
export default emailService
