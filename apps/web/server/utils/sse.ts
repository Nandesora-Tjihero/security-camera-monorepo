type Client = {
  id: string;
  res: any;
  userId: string;
};

const clients: Client[] = [];

export function addClient({ res, userId }: { res: any; userId: string }) {
  const id = Date.now().toString();
  const newClient = { id, res, userId };
  clients.push(newClient);
  return id;
}

export function removeClient(id: string) {
  const index = clients.findIndex((c) => c.id === id);
  if (index !== -1) clients.splice(index, 1);
}

export function sendEvent({
  type,
  data,
}: {
  type: string;
  data: { tokens: string[]; userId: string };
}) {
  clients.forEach((client) => {
    if (client.userId === data.userId) {
      client.res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
    }
  });
}
