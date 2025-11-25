'use server';

import { generateMenuItemDescription } from '@/ai/flows/generate-menu-item-description';
import { z } from 'zod';

const descriptionGenSchema = z.object({
  name: z.string(),
  category: z.string(),
  ingredients: z.string(),
});

export async function generateDescriptionAction(input: {
  name: string;
  category: string;
  ingredients: string;
}) {
  const parsedInput = descriptionGenSchema.safeParse(input);

  if (!parsedInput.success) {
    return { error: 'Invalid input.' };
  }

  if (!parsedInput.data.name || !parsedInput.data.ingredients) {
     return { error: 'Please provide a name and some ingredients to generate a description.' };
  }

  try {
    const result = await generateMenuItemDescription(parsedInput.data);
    return { description: result.description };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate description. Please try again.' };
  }
}
