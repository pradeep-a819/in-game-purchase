import { NextRequest, NextResponse } from 'next/server';
import { addWebhookData } from '../../../lib/webhookDataStore';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Append the webhook data to the array
    addWebhookData(data);
    console.log('Webhook data received and stored:', data);
    
    // Respond with a success message
    return NextResponse.json({ message: 'Webhook received successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}