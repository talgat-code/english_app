# english_app
Vite + React + TypeScript + Tailwind CSS

## AI setup

Create `.env.local` for local AI features:

```env
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_MODEL=gpt-5.5
VITE_CLAUDE_API_KEY=sk-ant-...
VITE_CLAUDE_MODEL=claude-3-5-sonnet-latest
```

For GitHub Pages, do not build with your API key: `VITE_*` values are embedded
into the static JavaScript bundle. Use the in-app GPT key field for personal
testing, or put a private API proxy in front of OpenAI/Claude for production.
