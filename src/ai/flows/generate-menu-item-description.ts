'use server';

/**
 * @fileOverview An AI agent that generates menu item descriptions.
 *
 * - generateMenuItemDescription - A function that generates a menu item description.
 * - GenerateMenuItemDescriptionInput - The input type for the generateMenuItemDescription function.
 * - GenerateMenuItemDescriptionOutput - The return type for the generateMenuItemDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMenuItemDescriptionInputSchema = z.object({
  name: z.string().describe('The name of the menu item.'),
  category: z.string().describe('The category of the menu item (e.g. appetizer, main course, dessert).'),
  ingredients: z.string().describe('A list of the ingredients in the menu item.'),
  tasteProfile: z.string().optional().describe('The taste profile of the menu item (e.g. sweet, savory, spicy).'),
  cuisine: z.string().optional().describe('The cuisine of the menu item (e.g. Italian, Mexican, Chinese).'),
});
export type GenerateMenuItemDescriptionInput = z.infer<typeof GenerateMenuItemDescriptionInputSchema>;

const GenerateMenuItemDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling and informative description of the menu item.'),
});
export type GenerateMenuItemDescriptionOutput = z.infer<typeof GenerateMenuItemDescriptionOutputSchema>;

export async function generateMenuItemDescription(
  input: GenerateMenuItemDescriptionInput
): Promise<GenerateMenuItemDescriptionOutput> {
  return generateMenuItemDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMenuItemDescriptionPrompt',
  input: {schema: GenerateMenuItemDescriptionInputSchema},
  output: {schema: GenerateMenuItemDescriptionOutputSchema},
  prompt: `You are a creative restaurant marketer who knows how to describe dishes to make them sound appetizing and tempting.

  Generate a short and enticing description for the following menu item:

  Name: {{{name}}}
  Category: {{{category}}}
  Ingredients: {{{ingredients}}}
  {{~#if tasteProfile}}
  Taste Profile: {{{tasteProfile}}}
  {{~/if}}
  {{~#if cuisine}}
  Cuisine: {{{cuisine}}}
  {{~/if}}

  Description:`,
});

const generateMenuItemDescriptionFlow = ai.defineFlow(
  {
    name: 'generateMenuItemDescriptionFlow',
    inputSchema: GenerateMenuItemDescriptionInputSchema,
    outputSchema: GenerateMenuItemDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
