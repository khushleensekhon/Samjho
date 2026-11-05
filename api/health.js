// Lets the frontend know whether AI explanations are available on this deployment.
export default function handler(req, res) {
  res.status(200).json({ ai: !!process.env.GEMINI_API_KEY });
}
