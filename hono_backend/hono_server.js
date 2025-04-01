import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import PokeDB from "./PokemonStarterTempDB.json" with { type: "json" };


const app = new Hono();

app.get('/api/pokemon', (c) => {
  return c.json(PokeDB); // Send the imported JSON data as the response
});

console.log("http://localhost:3000/api/pokemon");

serve(app);
