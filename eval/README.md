# Evaluating Samjho on real documents

This is how to measure accuracy honestly, with numbers you can explain in an interview.

1. **Collect 40–60 real papers** from family and friends: electricity and phone bills, bank letters, school notices, government SMS, insurance and medical papers, and real scam messages people have received. Ask permission, and blur personal details before taking the photo.
2. **Save the photos** in `eval/docs/`. This folder is git-ignored, so the photos are never uploaded to GitHub.
3. **Label each one** in `eval/labels.csv`: what a careful person reads on the paper (category, amount, deadline, scam yes/no). Do this *before* running Samjho, so the labels are not influenced by its answers.
4. **Run the evaluation:**
   ```bash
   cp .env.example .env   # then paste your GEMINI_API_KEY into .env
   npm run eval
   ```
5. **Read the errors** in `eval/results-<date>.csv`, improve the prompt in `lib/explain.js`, and run again. Keep a note of each change and its before/after numbers. That is your iteration story.

The script reports accuracy for document type, amount, deadline and scam detection, plus how many real scams were caught and how many safe papers were wrongly flagged.
