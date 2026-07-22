# Deploying "Absurd Legal Team Problems" to Netlify

## What's in the bundle
```
your-repo/
├─ index.html                    ← the game (was legal-trolley.html)
├─ monkeys-spinning-monkeys.mp3  ← background music (must sit next to index.html)
├─ netlify.toml                  ← Netlify config (functions dir + publish root)
├─ package.json                  ← declares @netlify/blobs for the vote function
└─ netlify/
   └─ functions/
      └─ vote.mjs                ← live peer-percentage tally (Netlify Blobs)
```
Keep this exact structure. `index.html` loads the mp3 by relative path, so they must be in the same folder.

## Deploy (fastest path)
1. Put these files in a Git repo (GitHub/GitLab/Bitbucket).
2. In Netlify: **Add new site → Import from Git**, pick the repo.
3. Build settings: leave the build command **empty**; publish directory **`.`** (netlify.toml already sets this). Deploy.
4. That's it. Netlify auto-installs `@netlify/blobs`, bundles the function, and serves the site.

(No-Git alternative: `npm i -g netlify-cli`, then `netlify deploy --prod` from this folder.)

## What works once live
- **Music** plays on the first click (browsers block autoplay until then). Mute via the corner icon.
- **Live peer percentages**: each answer POSTs to `/.netlify/functions/vote`, which tallies choices in Netlify Blobs and returns real numbers ("54% of legal teams are in your boat"). Before deploy / if the function is unreachable, the game shows the seed numbers labelled "sample data" and never breaks.
- **HubSpot form + Chili Piper**: the "See how Checkbox works" popup loads your real form (portal 4351004, form ad82bdab…), pre-headed with the player's result. On submit, Chili Piper's inbound-router opens its booking calendar.

## Before you share it — checklist
- [ ] **Play it through in a real browser.** The audio, the character animations, and the HubSpot/Chili Piper flow can only be judged live — none of them run in a preview.
- [x] **Percentages start at zero.** The `SEED` in `vote.mjs` is all zeros, so data is 100% real from the first play. Until a pillar has 8+ answers, players see "You're one of the first to answer this" instead of a misleading percentage; real percentages kick in automatically once there's enough volume.
- [ ] **Navattic global**: your original snippet had `pagenavattic.identify(...)`, which isn't a defined object. I read it as `window.navattic` and guarded it so it can't break the Chili Piper submit. Confirm the correct global for your Navattic setup, or drop those lines if you're not using Navattic.
- [ ] **Music attribution**: the credit at the foot of the page ("Monkeys Spinning Monkeys by Kevin MacLeod · CC BY 4.0") is *required* by the licence. Keep it visible somewhere.
- [ ] **Cold start**: the very first players will see mostly-seed percentages until real volume builds. That's expected.

## The one thing this doesn't solve
Distribution. A great diagnostic only generates leads if in-house lawyers actually play it. The shareable result + real peer percentages are built to travel on LinkedIn and in legal-ops circles, but the reach still has to be driven. Worth a plan before launch.
