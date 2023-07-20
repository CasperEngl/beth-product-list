import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { desc } from "drizzle-orm";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema, logger: true });

export async function getLatestProducts({ limit = 10 } = {}) {
  const products = await db
    .select()
    .from(schema.productsSchema)
    .orderBy(desc(schema.productsSchema.createdAt))
    .limit(limit)
    .all();

  return products.reverse();
}
