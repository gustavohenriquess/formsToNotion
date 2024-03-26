import { Client } from '@notionhq/client'

export const auth = async (API_KEY) => {
  const client = new Client({
    auth: API_KEY
  })

  return client
}

export const createPages = async (notion, DATABASE_ID, properties, children) => {

  const response = await notion.pages.create({
    parent: {
      database_id: DATABASE_ID,
    },
    properties,
    children,
  })

  return response
}