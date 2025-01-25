import { type NextApiRequest, type NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { todos } from '@/db/schema';
import { todoSchema, type Todo, type VoidResponse } from '@/models';

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
  const data = await db.select().from(todos);
  const parsedData = todoSchema.array().parse(data);

  return res.status(200).json(parsedData);
}

async function POST(req: NextApiRequest, res: NextApiResponse<VoidResponse>) {
  const body = JSON.parse(req.body) as { text: string };

  await db.insert(todos).values({ text: body.text, isCompleted: false });

  return res.status(200).json({ success: true });
}

async function PUT(req: NextApiRequest, res: NextApiResponse<VoidResponse>) {
  const body = JSON.parse(req.body) as Todo;

  await db
    .update(todos)
    .set({ text: body.text, isCompleted: body.isCompleted })
    .where(eq(todos.id, body.id));

  return res.status(200).json({ success: true });
}

async function DELETE(req: NextApiRequest, res: NextApiResponse<VoidResponse>) {
  const body = JSON.parse(req.body) as { id: string };

  await db.delete(todos).where(eq(todos.id, body.id));

  return res.status(200).json({ success: true });
}
