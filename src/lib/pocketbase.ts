import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://pb.graco.cloud');

// Disable auto-cancellation globally
pb.autoCancellation(false);
