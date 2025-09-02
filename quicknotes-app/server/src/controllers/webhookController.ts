// server/src/controllers/webhookController.ts
import { Request, Response } from 'express';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/clerk-sdk-node';
import User from '../models/userModel';

export const handleClerkWebhook = async (req: Request, res: Response) => {
  console.log('--- WEBHOOK RECEIVED ---'); // Log that the endpoint was hit
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CRITICAL: CLERK_WEBHOOK_SECRET is not set!');
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Svix headers missing');
    return res.status(400).send('Error occured -- no svix headers');
  }
  console.log('Svix headers are present.');

  const payload = req.body;
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
    console.log('Webhook signature verified successfully.');
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).send('Error occured');
  }
  
  const eventType = evt.type;
  console.log(`✅ Webhook event type: ${eventType}`);

  if (eventType === 'user.created') {
    try {
      const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
      console.log('Attempting to create user with data:', JSON.stringify(evt.data, null, 2));

      const newUser = new User({
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username,
        photo: image_url,
        firstName: first_name,
        lastName: last_name,
      });

      // Add a specific catch block for the save operation
      await newUser.save();
      console.log(`✅ SUCCESS: New user created in DB: ${newUser.email}`);

    } catch (error) {
      console.error('MONGO SAVE ERROR:', error);
      return res.status(500).send('Error creating user');
    }
  }

  res.status(200).send('Webhook processed');
};