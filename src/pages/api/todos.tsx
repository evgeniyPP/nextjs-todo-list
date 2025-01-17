import { type NextApiRequest, type NextApiResponse } from 'next';

import { todoSchema, VoidResponse, type Todo } from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await GET(req, res);
    case 'POST':
      return await POST(req, res);
    case 'PUT':
      return await PUT(req, res);
    case 'DELETE':
      return await DELETE(req, res);
    default:
      throw new Error('Unknown method');
  }
}

async function GET(_req: NextApiRequest, res: NextApiResponse<Todo[]>) {
  const dataRes = await fetch('http://localhost:3001/todos');
  const data = todoSchema.array().parse(await dataRes.json());

  res.status(200).json(data);
}

async function POST(req: NextApiRequest, res: NextApiResponse<VoidResponse>) {
  const body = JSON.parse(req.body) as { text: string };

  await fetch(`http://localhost:3001/todos`, {
    method: 'POST',
    body: JSON.stringify({
      text: body.text,
      isCompleted: false,
    }),
  });

  res.status(200).json({ success: true });
}

async function PUT(req: NextApiRequest, res: NextApiResponse<VoidResponse>) {
  const body = JSON.parse(req.body) as Todo;

  const dbRes = await fetch(`http://localhost:3001/todos/${body.id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  const data = todoSchema.parse(await dbRes.json());

  res.status(200).json({ success: data.id === body.id });
}

async function DELETE(req: NextApiRequest, res: NextApiResponse<VoidResponse>) {
  const body = JSON.parse(req.body) as { id: string };

  await fetch(`http://localhost:3001/todos/${body.id}`, {
    method: 'DELETE',
  });

  res.status(200).json({ success: true });
}
