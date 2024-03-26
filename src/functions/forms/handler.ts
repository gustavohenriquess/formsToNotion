import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { auth, createPages } from '@libs/notion';

import schema from './schema';

const forms: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const notion = await auth(process.env.NOTION_API_KEY);
  const authToken = event.headers['Authorization'].split(' ')[1]

  if (authToken !== process.env.AUTH_TOKEN) {
    return formatJSONResponse({
      message: 'Unauthorized',
    },
      401
    );
  }

  const { name, theme, description, dueDate, ministry } = event.body
  const dateArray = dueDate.split('/')

  const props = {
    'Data de Pedido': {
      type: 'date',
      date: {
        start: new Date(),
      },
    },
    'Data de Entrega': {
      type: 'date',
      date: {
        start: new Date(Number(dateArray[2]), Number(dateArray[1]) - 1, Number(dateArray[0])).toISOString().split('T')[0],
      },
    },
    'Nome': {
      type: 'title',
      title: [
        {
          type: 'text',
          text: {
            content: theme,
          },
        },
      ],
    },
    'Ministério': {
      type: 'select',
      select: {
        name: ministry,
      },
    },
    'Solicitante': {
      type: 'rich_text',
      rich_text: [
        {
          type: 'text',
          text: {
            content: name,
          },
        },
      ],
    },
  }
  const children = [
    {
      "object": "block",
      "paragraph": {
        "rich_text": [
          {
            "text": {
              "content": description,
            },
          }
        ],
        "color": "default"
      }
    }
  ]

  // await createPages(notion, process.env.NOTION_DATABASE_ID, props, children)

  return formatJSONResponse({
    message: `OK!`,
  }, 200);
};

export const main = middyfy(forms);
