// lib/webhookDataStore.ts
type WebhookData = {
  [key: string]: any;
};

let webhookData: WebhookData[] = [];

export function addWebhookData(data: WebhookData) {
  webhookData.push(data);
}

export function getWebhookData(): WebhookData[] {
  return webhookData;
}
