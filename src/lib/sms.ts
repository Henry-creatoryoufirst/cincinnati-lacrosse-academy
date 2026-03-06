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

  private formatE164(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    if (digits.startsWith('1') && digits.length === 11) return `+${digits}`
    if (digits.length === 10) return `+1${digits}`
    return phone.startsWith('+') ? phone : `+${digits}`
  }

  async sendSms(to: string, body: string): Promise<SmsResult> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`
    const toFormatted = this.formatE164(to)
    const fromFormatted = this.formatE164(this.fromNumber)

    console.log(`[SMS] Sending to ${toFormatted} from ${fromFormatted}`)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: toFormatted,
        From: fromFormatted,
        Body: body,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMsg = errorData.message || errorData.error_message || `HTTP ${response.status}: ${response.statusText}`
      console.error(`[SMS] Failed to send to ${toFormatted}:`, errorMsg, errorData)
      return { success: false, error: errorMsg }
    }

    const data = await response.json()
    console.log(`[SMS] Sent successfully to ${toFormatted}, SID: ${data.sid}`)
    return { success: true, messageId: data.sid }
  }
}

export function getSmsProvider(): TwilioProvider {
  return new TwilioProvider()
}
