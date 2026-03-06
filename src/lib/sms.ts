export interface SmsResult {
  success: boolean
  messageId?: string
  error?: string
}

export class TwilioProvider {
  private accountSid: string
  private authToken: string
  private fromNumber: string

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || ''
    this.authToken = process.env.TWILIO_AUTH_TOKEN || ''
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || ''
  }

  isConfigured(): boolean {
    return !!(this.accountSid && this.authToken && this.fromNumber)
  }

  async sendSms(to: string, body: string): Promise<SmsResult> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: `+1${to}`,
        From: this.fromNumber,
        Body: body,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { success: false, error: error.message || 'Failed to send SMS' }
    }

    const data = await response.json()
    return { success: true, messageId: data.sid }
  }
}

export function getSmsProvider(): TwilioProvider {
  return new TwilioProvider()
}
